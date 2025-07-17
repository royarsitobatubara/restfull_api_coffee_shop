import * as authModels from "../models/authModels.js";
import { sendSuccess, sendError } from "../utils/response.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function login(req, res) {
    try {
        if(!req.body){
            return sendError({ res, message: "Email dan password di perlukan", status: 404 });
        }
        const user = await authModels.login(req.body);
        if (!user) {
            return sendError({ res, message: "Email tidak ditemukan", status: 401 });
        }
        const passwordMatch = await bcrypt.compare(req.body.password, user.password);

        if (!passwordMatch) {
            return sendError({ res, message: "Password salah", status: 401 });
        }
        delete user.password;

        const token = jwt.sign(
            { iduser: user.iduser, email: user.email, role: user.role, photo: user.photo },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        sendSuccess({
            res,
            message: "Login berhasil",
            data: {
                user,
                token
            }
        });

    } catch (error) {
        sendError({
            res,
            message: "Terjadi kesalahan saat login",
            errors: error.message,
            status: 500
        });
    }
}

export async function registrasi(req, res) {
    try {
        const result = await authModels.registrasi(req.body);

        if (result === false) {
            return sendError({
                res,
                message: "Email atau nomor HP sudah terdaftar",
                status: 409
            });
        }

        sendSuccess({
            res,
            message: "Registrasi berhasil",
            data: result,
            status: 201
        });

    } catch (error) {
        sendError({
            res,
            message: "Terjadi kesalahan saat registrasi",
            errors: error.message,
            status: 500
        });
    }
}