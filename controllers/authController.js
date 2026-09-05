const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const createToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error(
      "JWT_SECRET is not configured in .env"
    );
  }

  return jwt.sign(
    {
      mongoId: user._id.toString(),
      userId: user.userId,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

const buildUserResponse = (user) => {
  return {
    _id: user._id,
    userId: user.userId,
    name: user.name,
    email: user.email,
    username: user.username,
    role: user.role,
    bio: user.bio,
    favoriteGenres: user.favoriteGenres,
    readingGoal: user.readingGoal,
    privacy: user.privacy,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

const register = async (req, res) => {
  try {
    const {
      name,
      email,
      username,
      password,
      bio = "",
      favoriteGenres = [],
      readingGoal = 0,
      privacy = "Public",
    } = req.body;

    if (!name || !email || !username || !password) {
      return res.status(400).json({
        message:
          "Name, email, username, and password are required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters long.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedUsername = username.trim().toLowerCase();

    const existingUser = await User.findOne({
      $or: [
        { email: normalizedEmail },
        { username: normalizedUsername },
      ],
    });

    if (existingUser) {
      if (existingUser.email === normalizedEmail) {
        return res.status(409).json({
          message:
            "An account with this email already exists.",
        });
      }

      return res.status(409).json({
        message: "This username is already taken.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      username: normalizedUsername,
      passwordHash,
      role: "Reader",
      bio: typeof bio === "string" ? bio.trim() : "",
      favoriteGenres: Array.isArray(favoriteGenres)
        ? favoriteGenres
            .map((genre) => String(genre).trim())
            .filter(Boolean)
        : [],
      readingGoal:
        Number(readingGoal) >= 0 ? Number(readingGoal) : 0,
      privacy: privacy === "Private" ? "Private" : "Public",
    });

    const token = createToken(user);

    return res.status(201).json({
      message: "BookVerse account created successfully.",
      token,
      user: buildUserResponse(user),
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Email or username already exists.",
      });
    }

    return res.status(500).json({
      message: "Failed to create BookVerse account.",
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        message: "Email/username and password are required.",
      });
    }

    const normalizedIdentifier = identifier.trim().toLowerCase();

    const user = await User.findOne({
      $or: [
        { email: normalizedIdentifier },
        { username: normalizedIdentifier },
      ],
    }).select("+passwordHash");

    if (!user) {
      return res.status(401).json({
        message: "Invalid email/username or password.",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        message: "This BookVerse account is inactive.",
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid email/username or password.",
      });
    }

    const token = createToken(user);

    return res.status(200).json({
      message: "Login successful.",
      token,
      user: buildUserResponse(user),
    });
  } catch (error) {
    return res.status(500).json({
      message: "Login failed.",
      error: error.message,
    });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    return res.status(200).json({
      message: "Current user fetched successfully.",
      user: buildUserResponse(req.user),
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch current user.",
      error: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
};
