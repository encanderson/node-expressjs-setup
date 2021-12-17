import express from "express";

import { UsersController } from "../api/controllers";
import { authenticationMiddleware } from "@src/api/middlewares";

export const router = express.Router();

router.post("/users/create", UsersController.create);
router.get("/users", authenticationMiddleware, UsersController.getAll);
