import pool from "../config/db.js";
import generateUUID from "../utils/uuid.js";
import bcrypt from "bcrypt";

export const login = async (data) => {
    const sql = 'SELECT * FROM users WHERE email = ?';
    const [rows] = await pool.query(sql, [data.email]);
    return rows[0];  // Password validasi di controller
};

export const registrasi = async (data) => {
    const id = generateUUID();
    const checkSql = 'SELECT iduser FROM users WHERE email = ? OR phone = ?';
    const [existing] = await pool.query(checkSql, [data.email, data.phone]);
    if (existing.length > 0) {
        return false; 
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const insertSql = 'INSERT INTO users (iduser, username, email, password, phone) VALUES (?, ?, ?, ?, ?)';
    const [result] = await pool.query(insertSql, [id, data.username, data.email, hashedPassword, data.phone]);
    return { iduser: id, inserted: result.affectedRows };
};
