import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

const generateToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// When creating token for users, include purchasedCourses
const generateUserToken = (user) => {
  const { username, purchasedCourses } = user;
  return generateToken({ username, purchasedCourses });
};

// Middlewares
const verifyToken = (req, res, next) => {
  let token = req.headers.authorization.replace("Bearer ", "");
  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user in the USERS array
    const user = USERS.find((u) => u.username === decoded.username);
    if (user) {
      // Make sure to restore the full user object, including purchasedCourses
      req.user = user;
    } else {
      // If it's an admin, we just pass the decoded data
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
  const existingAdmin = ADMINS.find((a) => a.username === username);
  if (existingAdmin) {
    return res.status(400).json({ message: "Username already exists" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  ADMINS.push({ username, password: hashedPassword });
  const token = generateToken({ username });
  return res.status(200).json({ message: "Admin created successfully", token });
});

app.post("/admin/login", async (req, res) => {
  const { username, password } = req.headers;
  if (!username || !password) {
    return res.status(400).json({ message: "Username or password is invalid" });
  }
  const admin = ADMINS.find((a) => a.username === username);
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
  const courseID = Math.round(Math.random() * 1000000);
  COURSES.push({ courseID, title, description, price, thumbnail, publish });
  return res.status(200).json({ message: "Course created successfully", courseId: courseID });
});

app.put("/admin/courses/:courseId", verifyToken, (req, res) => {
  const { title, description, price = 100, thumbnail, publish } = req.body;
  const courseID = parseInt(req.params.courseId);
  const course = COURSES.find((c) => c.courseID === courseID);
  if (!course) {
    return res.status(403).json({ message: "Course does not exist" });
  }

  const courseIndex = COURSES.findIndex((c) => c.courseID === courseID);
  COURSES[courseIndex] = {
    courseID: course.courseID, // Ensure courseID is retained
    title: title || course.title,
    description: description || course.description,
    price: price || course.price,
    thumbnail: thumbnail || course.thumbnail,
    publish: publish !== undefined ? publish : course.publish,
  };
  return res.status(200).json({ message: "Course updated successfully" });
});

app.get("/admin/courses", verifyToken, (req, res) => {
  return res.status(200).json({ courses: COURSES });
});

// User routes
app.post("/users/signup", async (req, res) => {
  const { username, password } = req.headers;
  if (!username || !password || username === password || password.length < 6) {
    return res.status(400).json({ message: "Username or password is invalid" });
  }
  const existingUser = USERS.find((u) => u.username === username);
  if (existingUser) {
    return res.status(400).json({ message: "Username already exists" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  USERS.push({ username, password: hashedPassword, purchasedCourses: [] });
  const token = generateUserToken({ username, purchasedCourses: [] });
  return res.status(200).json({ message: "User created successfully", token });
});

app.post("/users/login", async (req, res) => {
  const { username, password } = req.headers;
  if (!username || !password) {
    return res.status(400).json({ message: "Username or password is invalid" });
  }
  const user = USERS.find((u) => u.username === username);
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
  const publishedCourses = COURSES.filter((course) => course.publish);
  return res.status(200).json({ courses: publishedCourses });
});

app.post("/users/courses/:courseId", verifyToken, (req, res) => {
  const courseID = parseInt(req.params.courseId);
  const course = COURSES.find((c) => c.courseID === courseID && c.publish);
  if (!course) {
    return res.status(404).json({ message: "Course not found or not available for purchase" });
  }

  const user = USERS.find((u) => u.username === req.user.username);
  const alreadyPurchased = user.purchasedCourses.includes(courseID);
  if (alreadyPurchased) {
    return res.status(400).json({ message: "Course already purchased" });
  }

  user.purchasedCourses.push(courseID);
  return res.status(200).json({ message: "Course purchased successfully" });
});

app.get("/users/purchasedCourses", verifyToken, (req, res) => {
  const purchasedCourses = COURSES.filter((course) => req.user.purchasedCourses.includes(course.courseID));
  return res.status(200).json({ purchasedCourses });
});

app.use((req, res) => {
  res.status(404).json({ message: "Not Found" });
})

// Server listening
app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
