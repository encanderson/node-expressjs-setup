import express from "express";

import { signIn, recoveryPassword } from "../api/controllers";

import { loginMiddleware } from "../api/middlewares";

export const router = express.Router();

router.post("/login", loginMiddleware, signIn);
router.post("/recovey-password", recoveryPassword);
