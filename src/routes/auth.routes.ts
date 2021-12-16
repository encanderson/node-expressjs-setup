import express from "express";

import { AuthController } from "../api/controllers";

import { loginMiddleware } from "../api/middlewares";

export const router = express.Router();

router.post("/login", loginMiddleware, AuthController.signIn);
router.post("/recovey-password", AuthController.recoveryPassword);
