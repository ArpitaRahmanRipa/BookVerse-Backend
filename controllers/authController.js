const jwt = require("jsonwebtoken");
const User = require("../models/User");

const createToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

const register = async (req, res) => {
  try {
    const {
      name,
      email,
      username,
      password,
      studentId = "",
    } = req.body;

    if (!name || !email || !username || !password) {
      return res.status(400).json({
        message:
          "name, email, username, and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email or username already exists",
      });
    }

    const user = await User.create({
      name,
      email,
      username,
      password,
      studentId,
      role: "Reader",
    });

    const token = createToken(user);

    res.status(201).json({
      message: "Registration successful",
      token,
      user: user.toPublicJSON(),
    });
  } catch (error) {
    res.status(500).json({
      message: "Registration failed",
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password) {
      return res.status(400).json({
        message: "emailOrUsername and password are required",
      });
    }

    const user = await User.findOne({
      $or: [
        { email: emailOrUsername.toLowerCase() },
        { username: emailOrUsername },
      ],
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "Invalid email/username or password",
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email/username or password",
      });
    }

    const token = createToken(user);

    res.status(200).json({
      message: "Login successful",
      token,
      user: user.toPublicJSON(),
    });
  } catch (error) {
    res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
};

const getMe = async (req, res) => {
  res.status(200).json({
    message: "Authenticated user fetched successfully",
    user: req.user.toPublicJSON(),
  });
};

module.exports = {
  register,
  login,
  getMe,
};
