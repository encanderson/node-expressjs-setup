import express from "express";

import { createUser } from "../api/controllers";

export const router = express.Router();

router.post("/users", createUser);
