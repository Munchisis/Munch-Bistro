import mongoose from "mongoose";
import "dotenv/config";


const dbUri = process.env.MONGODB_URI;

export const connectDB = async () => {

    try {
         await mongoose.connect(dbUri).then(() => console.log("DB Connected"));
    } catch (error) {
        console.error("DB Connection Error:", error);
    }
   
}