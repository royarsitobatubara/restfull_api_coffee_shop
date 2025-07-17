import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/authRouter.js";
import userRouter from "./routes/userRouter.js";
import productRouter from "./routes/productRouter.js";
dotenv.config()

const app = express();
app.use(express.json({ limit: '2mb' }));
app.use('/uploads', express.static('uploads'));
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    methods: ["POST", "GET"]    
}));
app.use(express.urlencoded({ extended: true }))

app.get('/api/test', (req, res)=>{
    res.status(200).json({ message: "API CONNECTED" });
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, function(){
    console.log(`Server running on port ${PORT}`);
});