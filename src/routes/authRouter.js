import express from "express";
import * as authControllers from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post("/login", authControllers.login);
authRouter.post("/register", authControllers.registrasi);

export default authRouter;
