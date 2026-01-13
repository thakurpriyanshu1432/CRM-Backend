import { Router } from "express";
import { asyncHandler } from "../Utils/asyncHandler.js";
import { authCheck } from "../Middleware/authCheckMiddleware.js";
import { authorizedRoles } from "../Middleware/authorizedRoles.js";

import {
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,

  getAllStudents,
  getStudentById,
  updateStudent,

  getAllResumes,
  getAllPlacements,
  getAllAlumni,

  getAllEmployees,
  getEmployeeById,

  getDashboardData,
  deleteStudent
} from "../Controllers/data.controller.js";

const dataRouter = Router();

dataRouter.get(
  "/students",
  authCheck,
  authorizedRoles("admin", "counsellor"),
  asyncHandler(getAllStudents)
);

dataRouter.get(
  "/students/:id",
  authCheck,
  authorizedRoles("admin", "counsellor"),
  asyncHandler(getStudentById)
);

dataRouter.put(
  "/students/:id",
  authCheck,
  authorizedRoles("admin", "counsellor"),
  asyncHandler(updateStudent)
);

dataRouter.delete(
  "/students/:id",
  authCheck,
  authorizedRoles("admin", "counsellor"),
  asyncHandler(deleteStudent)
);

dataRouter.get(
  "/courses",
  authCheck,
  authorizedRoles("admin", "counsellor"),
  asyncHandler(getAllCourses)
);

dataRouter.get(
  "/courses/:id",
  authCheck,
  authorizedRoles("admin", "counsellor"),
  asyncHandler(getCourseById)
);

dataRouter.put(
  "/courses/:id",
  authCheck,
  authorizedRoles("admin"),
  asyncHandler(updateCourse)
);

dataRouter.delete(
  "/courses/:id",
  authCheck,
  authorizedRoles("admin"),
  asyncHandler(deleteCourse)
);

dataRouter.get(
  "/employees",
  authCheck,
  authorizedRoles("admin", "hr"),
  asyncHandler(getAllEmployees)
);

dataRouter.get(
  "/employees/:id",
  authCheck,
  authorizedRoles("admin", "hr"),
  asyncHandler(getEmployeeById)
);

dataRouter.get(
  "/resumes",
  authCheck,
  authorizedRoles("admin", "hr", "counsellor"),
  asyncHandler(getAllResumes)
);

dataRouter.get(
  "/placements",
  authCheck,
  authorizedRoles("admin", "hr"),
  asyncHandler(getAllPlacements)
);

dataRouter.get(
  "/alumni",
  authCheck,
  authorizedRoles("admin", "counsellor"),
  asyncHandler(getAllAlumni)
);

dataRouter.get(
  "/dashboard",
  authCheck,
  authorizedRoles("admin", "hr", "counsellor"),
  asyncHandler(getDashboardData)
);

export default dataRouter;