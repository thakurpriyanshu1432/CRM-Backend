import { Router } from "express";
import {
  createUserController,
  createCourse,
  createPlacement,
  createAlumni,
  createResumeController,
  createStudentController,
} from "../Controllers/admin.controller.js";
import { asyncHandler } from "../Utils/asyncHandler.js";
import { authCheck } from "../Middleware/authCheckMiddleware.js";
import { authorizedRoles } from "../Middleware/authorizedRoles.js";
import upload from "../Utils/upload.js";

const adminRouter = Router();

adminRouter.post(
  "/createUser",
  authCheck,
  authorizedRoles("admin"),
  upload.single("profileImage"),
  asyncHandler(createUserController)
);

adminRouter.post(
  "/createCourse",
  authCheck,
  authorizedRoles("admin"),
  upload.single("courseImg"),
  asyncHandler(createCourse)
);

adminRouter.post(
  "/create-students",
  authCheck,
  authorizedRoles("admin", "counsellor"),
  upload.single("profileImage"),
  asyncHandler(createStudentController)
);

adminRouter.post(
  "/createResumes",
  authCheck,
  authorizedRoles("admin", "hr", "counsellor"),
  upload.single("resumeFile"),
  asyncHandler(createResumeController)
);

adminRouter.post(
  "/createPlacement",
  authCheck,
  authorizedRoles("admin", "hr"),
  asyncHandler(createPlacement)
);

adminRouter.post(
  "/createAlumni",
  authCheck,
  authorizedRoles("admin", "counsellor"),
  upload.single("profileImage"),
  asyncHandler(createAlumni)
);

export default adminRouter;