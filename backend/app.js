const dotenv = require("dotenv");
dotenv.config();
const morgan = require("morgan");

const express = require("express");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("./models/user");
const sequelize = require("./config/db");

const app = express();

const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());
app.use(morgan("short"));
app.use(cookieParser());

// JWT Secret Key
const JWT_SECRET = process.env.JWT_SECRET;

// Sync models with the database
sequelize.sync();

const checkAuthToken = (req, res, next) => {
  console.log(req.cookies);

  const token = req.cookies.authToken;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  // Verify the JWT token
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(500).json({ message: "Failed to authenticate token" });
    }

    // Attach the decoded user information to the request object
    req.user = decoded;
    next();
  });
};

// User registration route
app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User with this email already exists." });
    }

    // Hash the password using bcrypt
    const hashedPassword = bcrypt.hashSync(password, 8);

    // Create a new user in the database
    const newUser = await User.create({
      email,
      password: hashedPassword,
    });

    const authToken = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Set the cookie with the authentication token
    res.cookie("authToken", authToken, { httpOnly: true, secure: true });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
});

// User login route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate password
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    // Set the cookie with the authentication token
    res.cookie("authToken", token, { httpOnly: true, secure: true });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
});

// Protected route
app.get("/protected", checkAuthToken, (req, res) => {
  // If token is valid, return the protected data
  res
    .status(200)
    .json({ message: "Access granted to protected data", user: req.user });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
