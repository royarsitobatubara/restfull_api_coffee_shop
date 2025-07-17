import pool from "../config/db.js";
import generateUUID from "../utils/uuid.js";
import fs from "fs";
import path from "path";
import bcrypt from "bcrypt"

export const getAllUser = async () => {
    const sql = "SELECT iduser, username, email, password, phone, role, photo, createdAt FROM users";
    const [rows] = await pool.query(sql);
    return rows;
};

export const getUserByID = async ({ id }) => {
    const sql = "SELECT iduser, username, email, phone, role, photo, createdAt FROM users WHERE iduser = ?";
    const [rows] = await pool.query(sql, [id]);
    return rows.length === 0 ? null : rows[0];
};

export const deleteUser = async ({ id }) => {
    const [rows] = await pool.query(
        "SELECT photo FROM users WHERE iduser = ?",
        [id]
    );
    if (rows.length === 0) {
        return { success: false, reason: "User tidak ditemukan" };
    }
    const photo = rows[0].photo;
    if (photo) {
        const filePath = path.join("uploads", photo);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
    const sql = "DELETE FROM users WHERE iduser = ?";
    const [result] = await pool.query(sql, [id]);
    return { success: result.affectedRows > 0 };
};

export const insertUser = async ({ data, file }) => {
    const id = generateUUID();
    const checkSql = "SELECT iduser FROM users WHERE email = ? OR phone = ?";
    const [rowsCheck] = await pool.query(checkSql, [data.email, data.phone]);

    if (rowsCheck.length > 0) {
        return false;
    }
    const insertSql = `
        INSERT INTO users (iduser, username, email, password, role, photo)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.query(insertSql, [
        id,
        data.username,
        data.email,
        data.password,
        data.role,
        file?.filename || null
    ]);

    return { iduser: id, inserted: result.affectedRows > 0 };
};

export const updateUser = async ({ id, data }) => {
    const fields = [];
    const values = [];
    if (data.username) {
        fields.push("username = ?");
        values.push(data.username);
    }
    if (data.email) {
        fields.push("email = ?");
        values.push(data.email);
    }
    if (data.phone) {
        fields.push("phone = ?");
        values.push(data.phone);
    }
    if(data.password){
        fields.push("password = ?");
        const passwordHash = await bcrypt.hash(data.password, 10);
        values.push(passwordHash);
    }
    if (data.role) {
        fields.push("role = ?");
        values.push(data.role);
    }
    if (fields.length === 0) {
        return false; 
    }
    const sql = `
        UPDATE users
        SET ${fields.join(", ")}
        WHERE iduser = ?
    `;
    values.push(id);
    const [result] = await pool.query(sql, values);
    return result.affectedRows > 0;
};

export const updatePhotoUser = async ({ id, file }) => {
    const [rows] = await pool.query("SELECT photo FROM users WHERE iduser = ?", [id]);

    if (rows.length === 0) {
        return { success: false, reason: "User tidak ditemukan" };
    }

    const oldPhoto = rows[0].photo;

    if (oldPhoto) {
        const filePath = path.join("uploads", oldPhoto);

        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                console.log(`Foto lama dihapus: ${filePath}`);
            }
        } catch (err) {
            console.error(`Gagal hapus foto lama (${filePath}): ${err.message}`);
        }
    }

    const sql = "UPDATE users SET photo = ? WHERE iduser = ?";
    const [result] = await pool.query(sql, [file.filename, id]);

    return {
        success: result.affectedRows > 0,
        filename: file.filename
    };
};


export const deletePhotoUser = async (id) => {
    const [rows] = await pool.query(
        "SELECT photo FROM users WHERE iduser = ?",
        [id]
    );
    if (rows.length === 0) {
        return { success: false, reason: "User tidak ditemukan" };
    }
    const photo = rows[0].photo;
    if (photo) {
        const filePath = path.join("uploads", photo);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath); 
        }
    }
    const [result] = await pool.query(
        "UPDATE users SET photo = NULL WHERE iduser = ?",
        [id]
    );
    return { success: result.affectedRows > 0 };
};
