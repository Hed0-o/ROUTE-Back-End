import { Router } from "express";
import asyncHandler from "../../common/middlewares/asyncHandler.js";
import * as UserService from "./user.service.js";
import authenticate from "../../common/middlewares/auth.middleware.js";

const router = Router();

router.post("/signup", asyncHandler(UserService.signUpUser));
router.post("/login", asyncHandler(UserService.logInUser));
router.patch("/update", authenticate, asyncHandler(UserService.updateUser));
router.delete("/delete", authenticate, asyncHandler(UserService.deleteUser));
router.get("/profile", authenticate, asyncHandler(UserService.getUserProfile));

export default router;
