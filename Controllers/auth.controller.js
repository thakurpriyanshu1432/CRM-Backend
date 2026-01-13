import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Employee from "../Models/employeeSchema.js";
import  otpTemplate  from "../Template/otpTemplate.js";
import { sendEmail } from "../Services/emailService.js";
import { customError } from "../Utils/customError.js";
import { success } from "../Utils/success.js";
import { generateAccessToken, generateRefreshToken } from "../Utils/tokens.js";

export const authLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new customError("Email and password are required", 400);
  }

  const user = await Employee.findOne({ email });
  if (!user) {
    throw new customError("User not found", 404);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new customError("Invalid credentials", 400);
  }

  //already verified → direct login
  if (user.isVerified) {
    const accessToken = generateAccessToken({
      userId: user._id,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user._id,
      role: user.role,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.otp;

    return success(res, 200, "Login successful", {
      token: accessToken,
      user: userObj,
      isVerified: true,
    });
  }

  //send OTP
  const otp = Math.floor(10000 + Math.random() * 90000);
  const emailHtml = otpTemplate.replace("{OTP}", otp.toString());
  console.log(emailHtml);
  await sendEmail(user.email, "OTP Verification", emailHtml);

  user.otp = otp;
  user.isVerified = false;
  await user.save();

  return success(res, 200, "OTP sent successfully", {
    email: user.email,
    isVerified: false,
  });
};

export const authOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    throw new customError("Email and OTP are required", 400);
  }

  const user = await Employee.findOne({ email });
  if (!user) {
    throw new customError("User not found", 404);
  }

  user.otp = null;
  user.isVerified = true;
  await user.save();

  const accessToken = generateAccessToken({
    userId: user._id,
    role: user.role,
  });

  const refreshToken = generateRefreshToken({
    userId: user._id,
    role: user.role,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.otp;

  return success(res, 200, "OTP verified successfully", {
    token: accessToken,
    user: userObj,
    isVerified: true,
  });
};

export const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.cookies || {};

  if (!refreshToken) {
    throw new customError("Refresh token not found", 401);
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET_KEY
    );

    const newAccessToken = generateAccessToken({
      userId: decoded.userId,
      role: decoded.role,
    });

    return success(res, 200, "Access token refreshed", {
      token: newAccessToken,
    });
  } catch (err) {
    res.clearCookie("refreshToken");
    throw new customError("Session expired, please login again", 401);
  }
};

export const getUserData = async (req, res) => {
  const userId = req.user.userId;

  const user = await Employee.findById(userId);
  if (!user) {
    throw new customError("User not found", 404);
  }

  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.otp;

  return success(res, 200, "User data fetched", userObj);
};

export const authLogout = async (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  return success(res, 200, "Logout successful");
};

