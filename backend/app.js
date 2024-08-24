const dotenv = require("dotenv");
dotenv.config();
const morgan = require("morgan");
const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User, Profile } = require("./models"); // Correctly import User model
const db = require("./models");

const app = express();

const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());
app.use(morgan("short"));
app.use(cookieParser());

const whitelist = process.env.CORS_WHITELIST.split(",");

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman)
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
db.sequelize.sync();

// JWT Secret Key
const JWT_SECRET = process.env.JWT_SECRET;

const isProduction = process.env.NODE_ENV === "production";

// Dictionary for translations
const translations = {
  en: {
    noToken: "No token provided",
    failedAuth: "Failed to authenticate token",
    emailPasswordRequired: "Email and password are required.",
    userExists: "User with this email already exists.",
    userRegistered: "User registered successfully",
    errorRegistering: "Error registering user",
    userNotFound: "User not found",
    invalidPassword: "Invalid password",
    loginSuccessful: "Login successful",
    errorLoggingIn: "Error logging in",
    accessGranted: "Access granted to protected data",
    logoutSuccess: "Logout successful",
    ProfileNotFound: "Profile not found",
  },
  fr: {
    noToken: "Aucun jeton fourni",
    failedAuth: "Échec de l'authentification du jeton",
    emailPasswordRequired: "Email et mot de passe sont requis.",
    userExists: "Un utilisateur avec cet email existe déjà.",
    userRegistered: "Utilisateur enregistré avec succès",
    errorRegistering: "Erreur lors de l'enregistrement de l'utilisateur",
    userNotFound: "Utilisateur non trouvé",
    invalidPassword: "Mot de passe invalide",
    loginSuccessful: "Connexion réussie",
    errorLoggingIn: "Erreur lors de la connexion",
    accessGranted: "Accès accordé aux données protégées",
    logoutSuccess: "Déconnexion réussie",
    ProfileNotFound: "Profil non trouvé",
  },
};

const setLanguage = (req, res, next) => {
  const acceptLanguage = req.headers["accept-language"];
  if (acceptLanguage) {
    const lang = acceptLanguage.split(",")[0].split("-")[0];
    req.lang = lang === "fr" ? "fr" : "en";
  } else {
    req.lang = "en";
  }
  next();
};

app.use(setLanguage);

const checkAuthToken = (req, res, next) => {
  const token = req.cookies.authToken;

  if (!token) {
    return res.status(401).json({ message: translations[req.lang].noToken });
  }

  // Verify the JWT token
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res
        .status(500)
        .json({ message: translations[req.lang].failedAuth });
    }

    // Attach the decoded user information to the request object
    req.user = decoded;
    next();
  });
};

app.get("/auth/whoami", checkAuthToken, async (req, res) => {
  const user = await getProfile(req.user.id);

  res.status(200).json({ user });
});

app.get("/user/profil", checkAuthToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const profile = await getProfile(userId);
    if (!profile) {
      return res
        .status(404)
        .json({ message: translations[req.lang].ProfileNotFound });
    }
    res.status(200).json({ profile });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching profile", error: error.message });
  }
});

// Function to update achievements
async function updateAchievements(profile, achievementId) {
  try {
    if (!profile) {
      throw new Error("Profile is not defined");
    }

    if (!profile.achievements) {
      profile.achievements = [];
    }

    const achievements = profile.achievements;

    console.log("Achievements before update:", achievements);

    if (
      achievements.indexOf(parseInt(achievementId)) === -1 &&
      achievementId <= 151 &&
      achievementId >= 1
    ) {
      achievements.push(parseInt(achievementId));
      await profile.update({ achievements });
      await profile.changed("achievements", true); // force update because it's a JSON complex type
      await profile.save();
      return profile;
    } else {
      throw new Error("Achievement already unlocked or invalid ID");
    }
  } catch (error) {
    throw new Error("Error updating achievements: " + error.message);
  }
}
app.put(
  "/user/profil/achievement/success/:id",
  checkAuthToken,
  async (req, res) => {
    try {
      const userId = req.user.id;
      const achievementId = req.params.id;

      const profile = await getProfile(userId);
      if (!profile) {
        return res
          .status(404)
          .json({ message: translations[req.lang].ProfileNotFound });
      }

      const updatedProfile = await updateAchievements(profile, achievementId);
      console.log("Achievements after update:", updatedProfile.achievements);

      res.status(200).json({ message: "Achievement unlocked" });
    } catch (error) {
      console.error("Error:", error);
      res
        .status(500)
        .json({ message: "Error unlocking achievement", error: error.message });
    }
  }
);

// User registration route
app.post("/auth/signup", async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: translations[req.lang].emailPasswordRequired });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: translations[req.lang].userExists });
    }

    // Hash the password using bcrypt
    const hashedPassword = bcrypt.hashSync(password, 8);

    // Create a new user in the database
    const newUser = await User.create({
      email,
      password: hashedPassword,
    });

    try {
      await Profile.create({
        bio: "Hello, I am new here!",
        userId: newUser.id,
        achievements: Array(151).fill(false),
      });
    } catch (error) {
      throw new Error("Error creating profile");
    }

    const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: isProduction, // Secure is only needed in production (when HTTPS is used)
      sameSite: isProduction ? "None" : "Lax", // Use None for production, Lax for local development
      path: "/",
    });

    res.status(201).json({ message: translations[req.lang].userRegistered });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: translations[req.lang].errorRegistering,
      error: error.message,
    });
  }
});

// User login route
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: translations[req.lang].emailPasswordRequired });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res
        .status(404)
        .json({ message: translations[req.lang].userNotFound });
    }

    // Validate password
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
      return res
        .status(401)
        .json({ message: translations[req.lang].invalidPassword });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: isProduction, // Secure is only needed in production (when HTTPS is used)
      sameSite: isProduction ? "None" : "Lax", // Use None for production, Lax for local development
      path: "/",
    });

    res
      .status(200)
      .json({ message: translations[req.lang].loginSuccessful, token });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: translations[req.lang].errorLoggingIn,
      error: error.message,
    });
  }
});

// Protected route
app.get("/protected", checkAuthToken, (req, res) => {
  // If token is valid, return the protected data
  res
    .status(200)
    .json({ message: translations[req.lang].accessGranted, user: req.user });
});

app.get("/auth/logout", (req, res) => {
  res.clearCookie("authToken");
  res.status(200).json({ message: translations[req.lang].logoutSuccess });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Function to get the profile
async function getProfile(userId) {
  try {
    return await Profile.findOne({ where: { userId } });
  } catch (error) {
    throw new Error("Error fetching profile");
  }
}
