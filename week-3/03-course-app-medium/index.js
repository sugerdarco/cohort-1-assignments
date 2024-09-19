import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import {fileURLToPath} from "url";

dotenv.config();

const app = express();
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const adminsFilePath = path.join(__dirname, "admins.json");
const usersFilePath = path.join(__dirname, "users.json");
const coursesFilePath = path.join(__dirname, "courses.json");

const readJsonFile = (filePath) => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]));
  }
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
};

const writeJsonFile = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

const generateToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "1h" });
};

const generateUserToken = (user) => {
  const { username, purchasedCourses } = user;
  return generateToken({ username, purchasedCourses });
};

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const users = readJsonFile(usersFilePath);
    const user = users.find((u) => u.username === decoded.username);
    if (user) {
      req.user = user;
    } else {
      req.user = decoded;
    }
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
  next();
};

// Admin routes
app.post("/admin/signup", async (req, res) => {
  const { username, password } = req.headers;
  if (!username || !password || username === password || password.length < 6) {
    return res.status(400).json({ message: "Username or password is invalid" });
  }
  const admins = readJsonFile(adminsFilePath);
  const existingAdmin = admins.find((a) => a.username === username);
  if (existingAdmin) {
    return res.status(400).json({ message: "Username already exists" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  admins.push({ username, password: hashedPassword });
  writeJsonFile(adminsFilePath, admins);
  const token = generateToken({ username });
  return res.status(200).json({ message: "Admin created successfully", token });
});

app.post("/admin/login", async (req, res) => {
  const { username, password } = req.headers;
  if (!username || !password) {
    return res.status(400).json({ message: "Username or password is invalid" });
  }
  const admins = readJsonFile(adminsFilePath);
  const admin = admins.find((a) => a.username === username);
  if (!admin) {
    return res.status(404).json({ message: "Admin not found" });
  }
  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    return res.status(403).json({ message: "Password is incorrect" });
  }
  const token = generateToken({ username });
  return res.status(200).json({ message: "Logged in successfully", token });
});

app.post("/admin/courses", verifyToken, (req, res) => {
  const { title, description, price = 100, thumbnail, publish = false } = req.body;
  if (!title || !description || !thumbnail) {
    return res.status(400).json({ message: "Title, description, and thumbnail are required" });
  }
  const courses = readJsonFile(coursesFilePath);
  const courseID = Math.round(Math.random() * 1000000);
  courses.push({ courseID, title, description, price, thumbnail, publish });
  writeJsonFile(coursesFilePath, courses);
  return res.status(200).json({ message: "Course created successfully", courseId: courseID });
});

app.put("/admin/courses/:courseId", verifyToken, (req, res) => {
  const { title, description, price = 100, thumbnail, publish } = req.body;
  const courseID = parseInt(req.params.courseId);
  const courses = readJsonFile(coursesFilePath);
  const courseIndex = courses.findIndex((c) => c.courseID === courseID);
  if (courseIndex === -1) {
    return res.status(403).json({ message: "Course does not exist" });
  }
  courses[courseIndex] = {
    courseID,
    title: title || courses[courseIndex].title,
    description: description || courses[courseIndex].description,
    price: price || courses[courseIndex].price,
    thumbnail: thumbnail || courses[courseIndex].thumbnail,
    publish: publish !== undefined ? publish : courses[courseIndex].publish,
  };
  writeJsonFile(coursesFilePath, courses);
  return res.status(200).json({ message: "Course updated successfully" });
});

app.get("/admin/courses", verifyToken, (req, res) => {
  const courses = readJsonFile(coursesFilePath);
  return res.status(200).json({ courses });
});

// User routes
app.post("/users/signup", async (req, res) => {
  const { username, password } = req.headers;
  if (!username || !password || username === password || password.length < 6) {
    return res.status(400).json({ message: "Username or password is invalid" });
  }
  const users = readJsonFile(usersFilePath);
  const existingUser = users.find((u) => u.username === username);
  if (existingUser) {
    return res.status(400).json({ message: "Username already exists" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword, purchasedCourses: [] });
  writeJsonFile(usersFilePath, users);
  const token = generateUserToken({ username, purchasedCourses: [] });
  return res.status(200).json({ message: "User created successfully", token });
});

app.post("/users/login", async (req, res) => {
  const { username, password } = req.headers;
  if (!username || !password) {
    return res.status(400).json({ message: "Username or password is invalid" });
  }
  const users = readJsonFile(usersFilePath);
  const user = users.find((u) => u.username === username);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(403).json({ message: "Password is incorrect" });
  }
  const token = generateUserToken(user);
  return res.status(200).json({ message: "Logged in successfully", token });
});

app.get("/users/courses", verifyToken, (req, res) => {
  const courses = readJsonFile(coursesFilePath);
  const publishedCourses = courses.filter((course) => course.publish);
  return res.status(200).json({ courses: publishedCourses });
});

app.post("/users/courses/:courseId", verifyToken, (req, res) => {
  const courseID = parseInt(req.params.courseId);
  const courses = readJsonFile(coursesFilePath);
  const course = courses.find((c) => c.courseID === courseID && c.publish);
  if (!course) {
    return res.status(404).json({ message: "Course not found or not available for purchase" });
  }

  const users = readJsonFile(usersFilePath);
  const user = users.find((u) => u.username === req.user.username);
  const alreadyPurchased = user.purchasedCourses.includes(courseID);
  if (alreadyPurchased) {
    return res.status(400).json({ message: "Course already purchased" });
  }

  user.purchasedCourses.push(courseID);
  writeJsonFile(usersFilePath, users);
  return res.status(200).json({ message: "Course purchased successfully" });
});

app.get("/users/purchasedCourses", verifyToken, (req, res) => {
  const courses = readJsonFile(coursesFilePath);
  const purchasedCourses = courses.filter((course) => req.user.purchasedCourses.includes(course.courseID));
  return res.status(200).json({ purchasedCourses });
});

// Server listening
app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
