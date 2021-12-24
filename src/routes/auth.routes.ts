import express from "express";

import { AuthController } from "../api/controllers";

import { AuthMiddleware } from "../api/middlewares";

export const router = express.Router();

router.post("/login", AuthMiddleware.signIn, AuthController.signIn);
router.post(
  "/refresh-token",
  AuthMiddleware.refreshToken,
  AuthController.signIn
);
router.post("/confirm-user", AuthController.confirmUser);
router.post("/recovery-password", AuthController.recoveryPassword);
router.post("/check-user", AuthController.checkUser);
router.put("/recovery-password/:token", AuthController.changePassword);
router.post("/logout", AuthMiddleware.authenticate, AuthController.logout);
