import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: function () {
        return this.role !== "teacher";
      },
    },

    role: {
      type: String,
      required: true,
      enum: ["admin", "hr", "counsellor", "teacher"],
    },

    designation: {
      type: String,
      trim: true,
    },

    department: {
      type: String,
      trim: true,
    },

    experience: {
      type: Number,
      min: 0,
      default: 0,
    },

    profileImage: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      enum: ["Active", "Inactive", "Suspended"],
      default: "Active",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    otp: {
      type: String,
      default: null,
      select: false,
    },

    lastLogin: {
      type: Date,
    },
    studentsCreated: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Employee", employeeSchema);