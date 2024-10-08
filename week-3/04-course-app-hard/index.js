import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import mongoose, { isValidObjectId } from "mongoose";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors())

await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);

// Schemas
const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
});

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  thumbnail: { type: String, required: true }, // URL
  price: { type: Number, required: true, default: 0 },
  isPublished: { type: Boolean, default: false },
});

const Admin = mongoose.model("Admin", AdminSchema);
const User = mongoose.model("User", UserSchema);
const Course = mongoose.model("Course", CourseSchema);


const generateToken = (payload, expiresIn = "1h") =>
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });

const generateUserToken = (user) => {
  const { username, purchasedCourses } = user;
  return generateToken({ username, purchasedCourses });
};

const verifyToken = async (req, res, next, model) => {
  const token = req.headers.authorization.trim().replace("Bearer ", "");
  if (!token) return res.status(403).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await model.findOne({ username: decoded.username });
    if (!user) return res.status(403).json({ message: "Invalid request" });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

const verifyTokenAdmin = (req, res, next) => verifyToken(req, res, next, Admin);
const verifyTokenUser = (req, res, next) => verifyToken(req, res, next, User);

// Admin routes
app.post("/admin/signup", async (req, res) => {
  const { username, password } = req.headers;
  if (!username || !password || username === password || password.length < 6) {
    return res.status(400).json({ message: "Invalid username or password" });
  }
  const existingAdmin = await Admin.findOne({ username });
  if (existingAdmin) return res.status(400).json({ message: "Username already exists" });
  const hashedPassword = await bcrypt.hash(password, 10);
  const admin = await Admin.create({ username, password: hashedPassword });
  const token = generateToken({ username });
  return res.status(200).json({ message: "Admin created successfully", token });
});

app.post("/admin/login", async (req, res) => {
  const { username, password } = req.headers;
  if (!username || !password) return res.status(400).json({ message: "Invalid credentials" });
  const admin = await Admin.findOne({ username });
  if (!admin) return res.status(404).json({ message: "Admin not found" });
  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) return res.status(403).json({ message: "Incorrect password" });
  const token = generateToken({ username });
  return res.status(200).json({ message: "Logged in successfully", token });
});

app.post("/admin/courses", verifyTokenAdmin, async (req, res) => {
  const { title, description, price = 100, thumbnail = "no-thumbnail", isPublished = true } = req.body;
  if (!title || !thumbnail) {
    return res.status(400).json({ message: "Title and thumbnail are required" });
  }
  try {
    const course = await Course.create({ title, description, price, thumbnail, isPublished });
    return res.status(200).json({ message: "Course created successfully", courseId: course._id });
  } catch (err) {
    return res.status(503).json({ message: "Error while creating course" });
  }
});

app.put("/admin/courses/:courseId", verifyTokenAdmin, async (req, res) => {
  const { title, description, price, thumbnail, isPublished } = req.body;
  const { courseId } = req.params;
  if (!isValidObjectId(courseId)) return res.status(404).json({ message: "Invalid Course ID" });
  try {
    const updatedCourse = await Course.findByIdAndUpdate(
        courseId,
        {
          title,
          description,
          price,
          thumbnail,
          isPublished,
        },
        { new: true }
    );
    if (!updatedCourse) return res.status(404).json({ message: "Course not found" });
    return res.status(200).json({ message: "Course updated successfully", updatedCourse });
  } catch (err) {
    return res.status(503).json({ message: "Error while updating course" });
  }
});

app.get("/admin/courses", verifyTokenAdmin, async (req, res) => {
  try {
    const courses = await Course.find({});
    return res.status(200).json({ courses });
  } catch (err) {
    return res.status(503).json({ message: "Error retrieving courses" });
  }
});

// User routes
app.post("/users/signup", async (req, res) => {
  const { username, password } = req.headers;
  if (!username || !password || username === password || password.length < 6) {
    return res.status(400).json({ message: "Invalid username or password" });
  }
  const existingUser = await User.findOne({ username });
  if (existingUser) return res.status(400).json({ message: "Username already exists" });
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ username, password: hashedPassword, purchasedCourses: [] });
  const token = generateUserToken(user);
  return res.status(200).json({ message: "User created successfully", token });
});

app.post("/users/login", async (req, res) => {
  const { username, password } = req.headers;
  if (!username || !password) return res.status(400).json({ message: "Invalid credentials" });
  const user = await User.findOne({ username });
  if (!user) return res.status(404).json({ message: "User not found" });
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(403).json({ message: "Incorrect password" });
  const token = generateUserToken(user);
  return res.status(200).json({ message: "Logged in successfully", token });
});

app.get("/users/courses", verifyTokenUser, async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true });
    return res.status(200).json({ courses });
  } catch (err) {
    return res.status(503).json({ message: "Error retrieving courses" });
  }
});

app.post("/users/courses/:courseId", verifyTokenUser, async (req, res) => {
  const { courseId } = req.params;
  if (!isValidObjectId(courseId)) return res.status(404).json({ message: "Invalid Course ID" });
  try {
    const course = await Course.findOne({ _id: courseId, isPublished: true });
    if (!course) return res.status(404).json({ message: "Course not found" });
    const user = await User.findById(req.user._id);
    if (user.purchasedCourses.includes(courseId)) {
      return res.status(200).json({ message: "Course already purchased" });
    }
    user.purchasedCourses.push(courseId);
    await user.save();
    return res.status(200).json({ message: "Course purchased successfully" });
  } catch (err) {
    return res.status(503).json({ message: "Error purchasing course" });
  }
});

app.get("/users/purchasedCourses", verifyTokenUser, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("purchasedCourses");
    return res.status(200).json({ purchasedCourses: user.purchasedCourses });
  } catch (err) {
    return res.status(503).json({ message: "Error retrieving purchased courses" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
