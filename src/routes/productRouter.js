import express from "express";
import * as productControllers from "../controllers/productController.js";
import upload from "../middlewares/upload.js";

const productRouter = express.Router();

productRouter.get("/", productControllers.getAllProduct);
productRouter.get("/:id", productControllers.getProductByID);
productRouter.post("/", upload.single("image"),productControllers.insertProduct);
productRouter.delete("/:id", productControllers.deleteProduct);
productRouter.patch("/:id", upload.single("image"),productControllers.updateProduct);

export default productRouter;