import * as userModels from "../models/userModel.js";
import { sendSuccess, sendError } from "../utils/response.js";

export async function getAllUser(req, res) {
    try {
        const users = await userModels.getAllUser();
        return sendSuccess({
            res,
            message: "Data user ditemukan",
            data: users
        });
    } catch (error) {
        sendError({
            res,
            message: "Terjadi kesalahan saat mengambil data user",
            errors: error.message,
            status: 500
        });
    }
}

export async function getUserByID(req, res) {
    try {
        const user = await userModels.getUserByID({ id: req.params.id });

        if (!user) {
            return sendError({
                res,
                message: "User tidak ditemukan",
                status: 404
            });
        }

        return sendSuccess({
            res,
            message: "Data user ditemukan",
            data: user
        });

    } catch (error) {
        sendError({
            res,
            message: "Terjadi kesalahan saat mengambil data user",
            errors: error.message,
            status: 500
        });
    }
}

export async function deleteUser(req, res) {
    try {
        const success = await userModels.deleteUser({ id: req.params.id });
        if (!success) {
            return sendError({
                res,
                message: "User tidak ditemukan",
                status: 404
            });
        }
        return sendSuccess({
            res,
            message: "User berhasil dihapus",
            data: { iduser: req.params.id }
        });
    } catch (error) {
        sendError({
            res,
            message: "Terjadi kesalahan saat menghapus user",
            errors: error.message,
            status: 500
        });
    }
}

export async function insertUser(req, res) {
    try {
        const result = await userModels.insertUser({
            data: req.body,
            file: req.file 
        });
        if (result === false) {
            return sendError({
                res,
                message: "Email atau nomor HP sudah terdaftar",
                status: 409
            });
        }
        return sendSuccess({
            res,
            message: "User berhasil ditambahkan",
            data: result,
            status: 201
        });
    } catch (error) {
        sendError({
            res,
            message: "Terjadi kesalahan saat menambahkan user",
            errors: error.message,
            status: 500
        });
    }
}

export async function updateUser(req, res) {
    try {
        const success = await userModels.updateUser({
            id: req.params.id,
            data: req.body
        });
        if (!success) {
            return sendError({
                res,
                message: "User tidak ditemukan atau tidak ada data dikirim",
                status: 404
            });
        }
        return sendSuccess({
            res,
            message: "User berhasil diperbarui",
            data: { iduser: req.params.id }
        });
    } catch (error) {
        sendError({
            res,
            message: "Terjadi kesalahan saat update user",
            errors: error.message,
            status: 500
        });
    }
}

export async function updatePhotoUser(req, res) {
    try {
        if (!req.file) {
            return sendError({
                res,
                message: "Foto tidak ditemukan dalam request",
                status: 400
            });
        }

        const result = await userModels.updatePhotoUser({
            id: req.params.id,
            file: req.file
        });

        if (!result.success) {
            return sendError({
                res,
                message: result.reason || "Gagal update foto",
                status: 404
            });
        }

        return sendSuccess({
            res,
            message: "Foto profil berhasil diperbarui",
            data: { photo: result.filename }
        });

    } catch (error) {
        sendError({
            res,
            message: "Terjadi kesalahan saat update foto",
            errors: error.message,
            status: 500
        });
    }
}


export async function deletePhotoUser(req, res) {
    try {
        const result = await userModels.deletePhotoUser(req.params.id);
        if (!result.success) {
            return sendError({
                res,
                message: result.reason || "Foto tidak ditemukan atau sudah dihapus",
                status: 404
            });
        }
        return sendSuccess({
            res,
            message: "Foto berhasil dihapus",
            data: { iduser: req.params.id }
        });
    } catch (error) {
        sendError({
            res,
            message: "Terjadi kesalahan saat menghapus foto",
            errors: error.message,
            status: 500
        });
    }
}

