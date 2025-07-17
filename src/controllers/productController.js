import * as productModels from "../models/productModel.js";
import { sendError, sendSuccess } from "../utils/response.js";

export async function getAllProduct(req, res) {
    try {
        const product = await productModels.getAllProduct();
        return sendSuccess({
            res,
            message: "Produk berhasil di temukan",
            data: product
        });
    } catch (error) {
        return sendError({
            res,
            message: "Terjadi kesalahan saat mengambil product",
            errors: error.message,
            status: 500
        });
    }
}

export async function getProductByID(req, res) {
    try {
        const product = await productModels.getProductByID({id: req.params.id});
        if (!product){
            return sendError({
                res,
                message: "Product tidak ditemukan",
                errors: null,
                status: 404
            })
        }
        return sendSuccess({
            res,
            message: "Product ditemukan",
            data: product
        })
    } catch (error) {
        return sendError({
            res,
            message: "Terjadi kesalahan saat mengambil product",
            errors: error.message,
            status: 500
        });
    }
}

export async function insertProduct(req, res) {
    try {
        const product = await productModels.insertProduct({data: req.body, file: req.file});
        if (!product) {
            return sendError({
                res,
                message: "Produk sudah tersedia",
                errors: null,
                status: 409
            });
        }
        return sendSuccess({
            res,
            message: "Produk berhasil ditambahkan",
            data: product,
            status: 201
        });
    } catch (error) {
        return sendError({
            res,
            message: "Terjadi kesalahan saat menambah produk",
            errors: error.message,
            status: 500
        });
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const result = await productModels.deleteProduct({ id: req.params.id });
        if (!result.success) {
            return res.status(404).json({
                success: false,
                message: result.reason || "Produk tidak ditemukan"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Produk berhasil dihapus",
            data: { idproduct: result.idproduct }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat menghapus produk",
            error: error.message
        });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await productModels.updateProduct({
            id,
            data: req.body,
            file: req.file
        });
        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: result.reason || "Tidak ada data yang diupdate"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Produk berhasil diupdate",
            data: { idproduct: result.idproduct }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat update produk",
            error: error.message
        });
    }
};
