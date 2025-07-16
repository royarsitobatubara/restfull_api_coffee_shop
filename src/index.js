import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/authRouter.js";
import userRouter from "./routes/userRouter.js";
dotenv.config()

const app = express();
app.use(express.json());
app.use(cors({
    origin: '*',
    methods: ["POST", "GET"]    
}));

app.get('/api/test', (req, res)=>{
    res.status(200).json({ message: "API CONNECTED" });
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, function(){
    console.log(`Server running on port ${PORT}`);
});