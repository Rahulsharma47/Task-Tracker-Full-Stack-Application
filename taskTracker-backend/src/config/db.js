import mongoose  from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () =>{
    try {
        const connectionInstance  = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
        console.log(`DB connected succesfully: ${connectionInstance}`);
    } catch (error) {
        console.error(`connection failed -db.js:`, error);
        process.exit(1);
    }
}

export default connectDB;