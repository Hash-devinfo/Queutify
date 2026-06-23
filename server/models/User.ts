import mongoose from "mongoose";
import { timeStamp } from "node:console";

const userSchema = new mongoose.Schema({
    email:{type:String, requred:true, unique:true},
    password: {type:String, required:true},
    name: {type:String, required:true},
    zernioProfileID:{type:String}

},{timestamps: true})

export const User= mongoose.model("User", userSchema)