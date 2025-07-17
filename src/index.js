import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/authRouter.js";
import userRouter from "./routes/userRouter.js";
import productRouter from "./routes/productRouter.js";
import os from "os";
import cluster from "cluster";
import compression from "compression";

dotenv.config();

const totalCPUs = os.cpus().length;


if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} running`);
    for (let i = 0; i < totalCPUs; i++) {
        cluster.fork();
    }

    cluster.on("exit", (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died. Forking a new one...`);
        cluster.fork();
    });

} else {
    const app = express();
    if (process.env.NODE_ENV === 'production') {
        app.use(compression());
        console.log('Server running on mode production');
    } else {
        console.log('Server running on mode development');
    }
    app.use(express.json({ limit: '2mb' }));
    app.use('/uploads', express.static('uploads'));
    app.use(cors({
        origin: process.env.CORS_ORIGIN,
        methods: ["POST", "GET"]
    }));
    app.use(express.urlencoded({ extended: true }));

    app.get('/api/test', (req, res) => {
        res.status(200).json({ 
            message: "API CONNECTED", 
            handledBy: `Worker ${process.pid}` 
        });
    });

    app.use("/api/auth", authRouter);
    app.use("/api/user", userRouter);
    app.use("/api/product", productRouter);

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Worker ${process.pid} running server on port ${PORT}`);
    });
}