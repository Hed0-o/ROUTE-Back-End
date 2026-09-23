import Router from "express";
import validate from "../../common/middlewares/validation.js";
import * as userService from "./user.service.js";
import * as userValidation from "./user.validation.js";
import authenticate from "../../common/middlewares/authentication.js";
import authorize from "../../common/middlewares/authorization.js";
import { multerLocal } from "../../common/middlewares/multer.middleware.js";

const router = Router();

router.post(
  "/signup",
  multerLocal().single("file"),
  validate(userValidation.signUpSchema),
  userService.signUp,
);

router.post("/login", validate(userValidation.logInSchema), userService.logIn);

router.post(
  "/resend-otp",
  validate(userValidation.resendOtpSchema),
  userService.resendVerificationOtp,
);

router.post("/logout", authenticate, userService.logOut);

router.post(
  "/verifyEmail",
  validate(userValidation.verifyEmailSchema),
  userService.verifyEmail,
);

router.patch(
  "/update",
  authenticate,
  authorize("client"),
  validate(userValidation.editClientUserSchema),
  userService.editUser,
);

router.delete(
  "/delete/:userId",
  authenticate,
  authorize("admin"),
  validate(userValidation.deleteUserSchema),
  userService.removeUser,
);

router.post(
  "/refresh",
  validate(userValidation.refreshTokenSchema),
  userService.refreshAccessToken,
);
export default router;
