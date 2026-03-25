import mongoose, { mongo } from "mongoose";

// Define the User schema
const unserSchema = new mongoose.Schema({
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim:true,  unique: true, lowercase: true },
    imageUrl: { type: String, trim: true, required: true },
}, { timestamps: true });

export const User = mongoose.model("User", unserSchema);