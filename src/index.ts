import "dotenv/config"
import express from 'express';
import mongoose from 'mongoose';
import userRouter from "./routes/user.route.js";
import contentRouter from "./routes/content.routes.js";

const app= express();
app.use(express.json());
const connectDB =async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log("Db connected");
    } catch (error) {
        console.log("Error connecting DB",error);
    }
    
}


app.use("/api/v1/user",userRouter)
app.use("/api/v1/content",contentRouter)


app.listen(3000,()=>{
    connectDB();
    console.log("Server started on port 3000");
})