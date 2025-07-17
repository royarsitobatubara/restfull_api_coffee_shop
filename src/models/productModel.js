import pool from "../config/db.js";
import generateUUID from "../utils/uuid.js";
import fs from "fs";
import path from "path";

export const getAllProduct = async() => {
    const sql = "SELECT idproduct, name, price, stock, category, image FROM products";
    const [rows] = await pool.query(sql);
    return rows;
};

export const getProductByID = async({id}) => {
    const sql = "SELECT * FROM products WHERE idproduct=?";
    const [rows] = await pool.query(sql, [id]);
    if (rows.length === 0){
        return null;
    }
    return rows[0];
};

export const insertProduct = async({data, file}) => {
    const id = generateUUID();
    const sqlCheck = "SELECT idproduct FROM products WHERE name=?";
    const [rowsCheck] = await pool.query(sqlCheck, [data.name]);
    if (rowsCheck.length > 0){
        return false;
    }
    const sqlInsert = "INSERT INTO products (idproduct, name, description, price, stock, category, image) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const [rows] = await pool.query(sqlInsert, [
        id,
        data.name,
        data.description,
        data.price,
        data.stock,
        data.category,
        file ? file.filename :  null
    ]);
    return { idproduct: id, inserted: rows.affectedRows > 0 };
};

export const deleteProduct = async ({ id }) => {
    const [rows] = await pool.query("SELECT image FROM products WHERE idproduct = ?", [id]);
    if (rows.length === 0) {
        return { success: false, reason: "Product tidak ditemukan" };
    }
    const image = rows[0].image;
    if (image) {
        const filepath = path.join("uploads", image);
        try {
            if (fs.existsSync(filepath)) {
                fs.unlinkSync(filepath);
                console.log(`Gambar dihapus: ${filepath}`);
            }
        } catch (error) {
            console.log(`Gagal hapus image: ${error.message}`);
        }
    }
    const [result] = await pool.query("DELETE FROM products WHERE idproduct = ?", [id]);
    return {
        idproduct: id,
        success: result.affectedRows > 0
    };
};

export const updateProduct = async ({ id, data, file }) => {
    const fields = [];
    const values = [];
    if (data.name) {
        fields.push("name = ?");
        values.push(data.name);
    }
    if (data.price) {
        fields.push("price = ?");
        values.push(data.price);
    }
    if (data.description) {
        fields.push("description = ?");
        values.push(data.description);
    }
    if (data.stock) {
        fields.push("stock = ?");
        values.push(data.stock);
    }
    if (data.category) {
        fields.push("category = ?");
        values.push(data.category);
    }
    if (file) {
        const [rows] = await pool.query(
            "SELECT image FROM products WHERE idproduct = ?",
            [id]
        );
        if (rows.length > 0 && rows[0].image) {
            const oldImage = rows[0].image;
            const oldPath = path.join("uploads", oldImage);
            try {
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                    console.log(`Gambar lama dihapus: ${oldPath}`);
                }
            } catch (error) {
                console.error(`Gagal hapus gambar lama: ${error.message}`);
            }
        }
        fields.push("image = ?");
        values.push(file.filename);
    }
    if (fields.length === 0) {
        return { success: false, reason: "Tidak ada data yang diupdate" };
    }
    const sql = `
        UPDATE products
        SET ${fields.join(", ")}
        WHERE idproduct = ?
    `;
    values.push(id);
    const [result] = await pool.query(sql, values);
    return {
        success: result.affectedRows > 0,
        updated: result.affectedRows > 0,
        idproduct: id
    };
};
