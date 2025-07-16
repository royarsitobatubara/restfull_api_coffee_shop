import * as userModels from "../models/userModel.js";
import { sendSuccess, sendError } from "../utils/response.js";

export async function getAllUser(req, res){
    try {
        const user = await userModels.getAllUser();
        if(!user){
            return sendError({res, message: "Not user data", status: 404});
        }
        return sendSuccess({res, message:"Data ditemukan", data: user});
    } catch (error) {
        
    }
}