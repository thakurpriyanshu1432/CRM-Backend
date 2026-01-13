import { Router } from "express";
import { authLogin, authOtp, refreshAccessToken, getUserData, authLogout } 
from "../Controllers/auth.controller.js";

import { asyncHandler } from "../Utils/asyncHandler.js";
import { authorizedRoles } from "../Middleware/authorizedRoles.js";
import { authCheck } from "../Middleware/authCheckMiddleware.js";

const authRouter = Router();

authRouter.post("/login", asyncHandler(authLogin));
authRouter.post("/verify-otp", asyncHandler(authOtp));
authRouter.post("/refresh", asyncHandler(refreshAccessToken));
authRouter.post("/logout", asyncHandler(authLogout));

authRouter.get(
  "/user/:userId",
  authCheck,
  authorizedRoles("admin", "counsellor", "hr"),
  asyncHandler(getUserData)
);

export default authRouter;