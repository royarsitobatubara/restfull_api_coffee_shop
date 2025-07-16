import express from "express";
import * as userControll from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get('/', userControll.getAllUser);

export default userRouter;