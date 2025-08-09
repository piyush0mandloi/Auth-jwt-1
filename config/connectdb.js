import mongoose from "mongoose";

const connectDB = async (DATABASE_URL) => {
    try{
        const DB_OPTIONS = {
            dbName: "auth-jwt-1",
    }
    await mongoose.connect(DATABASE_URL, DB_OPTIONS);
    console.log("Database connected successfully...");
    }catch (error) {
        console.log("Database connection failed:", error.message);
        
    }
}


export default connectDB;