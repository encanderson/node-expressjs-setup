import express from "express";

import { AuthController } from "../api/controllers";

import { loginMiddleware } from "../api/middlewares";

export const router = express.Router();

router.post("/login", loginMiddleware, AuthController.signIn);
router.post("/recovery-password", AuthController.recoveryPassword);
router.post("/check-user", AuthController.checkUser);
router.put("/recovery-password", AuthController.changePassword);
