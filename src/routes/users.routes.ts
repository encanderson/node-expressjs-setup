import express from "express";

import { UsersController } from "../api/controllers";
import { AuthMiddleware } from "@src/api/middlewares";

export const router = express.Router();

router.post("/users", UsersController.create);
router.get("/users", AuthMiddleware.authenticate, UsersController.getAll);
