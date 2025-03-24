// import crypto from "crypto";
// import User from "../models/User.js";
// import { errorHandler } from "./../utils/error.js";
// import asyncHandler from "express-async-handler";
// import bcrypt from "bcryptjs";
// import { sendMail } from "../utils/mail.js";
// import { validRoles } from "../models/User.js";

// export const getUserById = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const user = await User.findById(id);
//     if (!user) {
//       return next(errorHandler(404, "User not found"));
//     }

//     const { password, ...rest } = user._doc;
//     res.status(200).json(rest);
//   } catch (error) {
//     next(error);
//   }
// };

// export const getTotalUsers = async (req, res, next) => {
//   try {
//     const totalUsers = await User.countDocuments();
//     res.status(200).json({ totalUsers });
//   } catch (error) {
//     next(error);
//   }
// };

// export const updateUser = async (req, res, next) => {
//   if (req.user.id !== req.params.userId) {
//     return res
//       .status(401)
//       .json({ message: "You are not authorized to update this user" });
//   }

//   try {
//     if (req.body.password) {
//       if (req.body.password.length < 6) {
//         return res
//           .status(400)
//           .json({ message: "Password must be at least 6 characters long" });
//       }
//       req.body.password = bcrypt.hashSync(req.body.password, 10);
//     }

//     if (req.body.username) {
//       if (req.body.username.includes(" ")) {
//         return res
//           .status(400)
//           .json({ message: "Username must not contain spaces" });
//       }
//       if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
//         return res.status(400).json({
//           message: "Username must only contain alphanumeric characters",
//         });
//       }
//     }

//     const { role, profession, experience, city, age, ...updatedFields } =
//       req.body;

//     const updatedUser = await User.findByIdAndUpdate(
//       req.params.userId,
//       { $set: updatedFields },
//       { new: true }
//     );

//     if (!updatedUser) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const { password, ...rest } = updatedUser.toObject();
//     res.status(200).json(rest);
//   } catch (error) {
//     console.error(error);
//     next(error);
//   }
// };

// export const signOut = (req, res, next) => {
//   try {
//     res
//       .clearCookie("access_token")
//       .status(200)
//       .json("User has been signed out");
//   } catch (error) {
//     next(error);
//   }
// };

// export const updateUserRole = async (req, res) => {
//   const { userId, newRole } = req.body;
//   console.log("Request Body:", req.body);

//   try {
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     if (!validRoles.includes(newRole)) {
//       return res.status(400).json({ message: "Invalid role" });
//     }

//     user.role = newRole;
//     await user.save();

//     return res.status(200).json({ message: "User role updated successfully" });
//   } catch (error) {
//     console.error("Error updating user role:", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };

// export const forgotPassword = asyncHandler(async (req, res) => {
//   const { email } = req.body;
//   const user = await User.findOne({ email });
//   if (user) {
//     const resetToken = crypto.randomBytes(25).toString("hex");
//     user.resetPasswordToken = resetToken;
//     user.resetPasswordExpire = Date.now() + 3600000;
//     await user.save();

//     const url = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;
//     const text = `Click on this link to reset your password: ${url}. If you did not request this, please ignore.`;

//     // await sendMail(user.email, "Reset Password", text);
//     try {
//       await sendMail(user.email, "Reset Password", text);
//     } catch (error) {
//       console.error("Error sending email:", error);
//       return res.status(500).json({ message: "Failed to send email" });
//     }

//     res.status(200).json({
//       message: `Reset password link has been sent to ${user.email}`,
//     });
//   } else {
//     res.status(401);
//     throw new Error("Invalid Credentials");
//   }
// });

// export const resetPassword = asyncHandler(async (req, res) => {
//   const { token } = req.params;
//   const { password } = req.body;

//   const user = await User.findOne({
//     resetPasswordToken: token,
//     resetPasswordExpire: { $gt: Date.now() },
//   });

//   if (!user) {
//     res.status(400);
//     throw new Error("Invalid or expired token");
//   }

//   user.password = await bcrypt.hash(password, 10);
//   user.resetPasswordToken = undefined;
//   user.resetPasswordExpire = undefined;
//   await user.save();

//   res.status(200).json({
//     message: "Password has been reset successfully",
//   });
// });

import crypto from "crypto";
import User from "../models/User.js";
import { errorHandler } from "./../utils/error.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import { sendMail } from "../utils/mail.js";
import { validRoles } from "../models/User.js";

// ✅ Fetch user by ID
export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    const { password, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

// ✅ Get total user count
export const getTotalUsers = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    res.status(200).json({ totalUsers });
  } catch (error) {
    next(error);
  }
};

// ✅ Update user details (including points for volunteers)
export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return res
      .status(401)
      .json({ message: "You are not authorized to update this user" });
  }

  try {
    if (req.body.password) {
      if (req.body.password.length < 6) {
        return res
          .status(400)
          .json({ message: "Password must be at least 6 characters long" });
      }
      req.body.password = bcrypt.hashSync(req.body.password, 10);
    }

    if (req.body.username) {
      if (req.body.username.includes(" ")) {
        return res
          .status(400)
          .json({ message: "Username must not contain spaces" });
      }
      if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
        return res.status(400).json({
          message: "Username must only contain alphanumeric characters",
        });
      }
    }

    const { role, profession, experience, city, age, points, ...updatedFields } = req.body;

    // ✅ Ensure points are only updated for volunteers
    if (points !== undefined) {
      const user = await User.findById(req.params.userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      if (user.role !== "volunteer") {
        return res.status(403).json({ message: "Only volunteers can earn points" });
      }

      updatedFields.points = points; // Update the points
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { $set: updatedFields },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const { password, ...rest } = updatedUser.toObject();
    res.status(200).json(rest);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// ✅ Update user role
export const updateUserRole = async (req, res) => {
  const { userId, newRole } = req.body;
  console.log("Request Body:", req.body);

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!validRoles.includes(newRole)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    user.role = newRole;
    await user.save();

    return res.status(200).json({ message: "User role updated successfully" });
  } catch (error) {
    console.error("Error updating user role:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Sign out user
export const signOut = (req, res, next) => {
  try {
    res
      .clearCookie("access_token")
      .status(200)
      .json("User has been signed out");
  } catch (error) {
    next(error);
  }
};

// ✅ Forgot Password (Send Reset Email)
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    const resetToken = crypto.randomBytes(25).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 3600000;
    await user.save();

    const url = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;
    const text = `Click on this link to reset your password: ${url}. If you did not request this, please ignore.`;

    try {
      await sendMail(user.email, "Reset Password", text);
    } catch (error) {
      console.error("Error sending email:", error);
      return res.status(500).json({ message: "Failed to send email" });
    }

    res.status(200).json({
      message: `Reset password link has been sent to ${user.email}`,
    });
  } else {
    res.status(401);
    throw new Error("Invalid Credentials");
  }
});

// ✅ Reset Password
export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error("Invalid or expired token");
  }

  user.password = await bcrypt.hash(password, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.status(200).json({
    message: "Password has been reset successfully",
  });
});
