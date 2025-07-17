import express from "express";
import * as productControllers from "../controllers/productController.js";
import upload from "../middlewares/upload.js";
import authenticateToken from "../middlewares/authenticateToken .js";

const productRouter = express.Router();

productRouter.get("/", productControllers.getAllProduct);
productRouter.get("/:id", productControllers.getProductByID);
productRouter.post("/", authenticateToken, upload.single("image"),productControllers.insertProduct);
productRouter.delete("/:id", authenticateToken, productControllers.deleteProduct);
productRouter.patch("/:id", authenticateToken, upload.single("image"),productControllers.updateProduct);

export default productRouter;