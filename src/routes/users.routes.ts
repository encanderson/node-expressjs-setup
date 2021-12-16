import express from "express";

import { UsersController } from "../api/controllers";

export const router = express.Router();

router.post("/users", UsersController.create);
