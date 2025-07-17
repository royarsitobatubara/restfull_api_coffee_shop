import express from "express";
import * as userControll from "../controllers/userController.js";
import upload from "../middlewares/upload.js";
import authenticateToken from "../middlewares/authenticateToken .js";

const userRouter = express.Router();

userRouter.get('/', authenticateToken, userControll.getAllUser);
userRouter.get('/:id', authenticateToken, userControll.getUserByID);
userRouter.delete('/:id', authenticateToken, userControll.deleteUser);
userRouter.post('/', authenticateToken, upload.single("photo"), userControll.insertUser);
userRouter.patch('/:id', authenticateToken, userControll.updateUser);
userRouter.put('/:id/photo', authenticateToken, upload.single("photo"),userControll.updatePhotoUser);
userRouter.delete("/:id/photo", authenticateToken, userControll.deletePhotoUser);

export default userRouter;