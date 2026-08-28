import { Router } from "express";
import asyncHandler from "../../common/middlewares/asyncHandler.js";
import * as UserService from "./user.service.js";
import * as userValidation from "../../modules/user/user.validation.js";
import validate from "../../common/middlewares/validation.js";
import authentication from "../../common/middlewares/authentication.js";
import { multerLocal } from "../../common/middlewares/multer.middleware.js";

const router = Router();

router.post(
  "/signup",
  multerLocal().single("img"),
  validate(userValidation.signUpSchema),
  validate(userValidation.imageSchema),
  asyncHandler(UserService.signUpUser),
);
router.post(
  "/login",
  validate(userValidation.logInSchema),
  asyncHandler(UserService.logInUser),
);

router.post("/auth/google", asyncHandler(UserService.googleAuth));

router.patch(
  "/update",
  authentication,
  validate(userValidation.updateUserSchema),
  asyncHandler(UserService.updateUser),
);
router.delete("/delete", authentication, asyncHandler(UserService.deleteUser));
router.get(
  "/profile",
  authentication,
  asyncHandler(UserService.getUserProfile),
);

export default router;
