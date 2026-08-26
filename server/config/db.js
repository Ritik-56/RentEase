import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("Database Connected Sucessfully");
        
        
    } catch (error) {
        console.log("Database connection failed: ",error.message);
    }
};

export default connectDB;
