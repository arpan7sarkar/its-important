import "dotenv/config"
import express from 'express';
import mongoose from 'mongoose';

const app= express();
app.use(express.json());
const connectDB =async ()=>{
    try {
        await mongoose.connect(`${process.env.MONGO_URI}`);
        console.log("Db connected");
    } catch (error) {
        console.log("Error connecting DB",error);
    }
    
}






app.listen(3000,()=>{
    connectDB();
    console.log("Server started on port 3000");
})