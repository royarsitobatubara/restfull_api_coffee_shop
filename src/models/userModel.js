import pool from "../config/db.js";

export const getAllUser = async () => {
    const sql = "SELECT iduser, username, email, phone, role, photo, createdAt FROM users";
    const [rows] = await pool.query(sql);
    return rows;
};

export const getUserByID = async (id) => {
    const sql = "SELECT iduser, username, email, phone, role, photo, createdAt FROM users WHERE iduser = ?";
    const [rows] = await pool.query(sql, [id]);
    if (rows.length === 0) {
        return null; 
    }
    return rows[0]; 
};