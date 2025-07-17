import express from "express";
import * as userControll from "../controllers/userController.js";
import upload from "../middlewares/upload.js";

const userRouter = express.Router();

userRouter.get('/', userControll.getAllUser);
userRouter.get('/:id', userControll.getUserByID);
userRouter.delete('/:id', userControll.deleteUser);
userRouter.post('/', upload.single("photo"), userControll.insertUser);
userRouter.patch('/:id', userControll.updateUser);
userRouter.put('/:id/photo', upload.single("photo"),userControll.updatePhotoUser);
userRouter.delete("/:id/photo",userControll.deletePhotoUser);

export default userRouter;