import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://Bistro_db:7zW0v5rcPxyMbXnH@cluster0.lkkzndu.mongodb.net/MUNCH-BISTRO').then(()=> console.log("DB Connected"));
}