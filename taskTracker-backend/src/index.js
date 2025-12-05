import connectDB from "./config/db.js";
import app from "./app.js";
import dotenv from "dotenv";

dotenv.config({ path: './.env' });

connectDB()
.then(()=>{
    app.on('error', (error)=>{
        console.log('server error:', error);
        throw error;
    })

    app.listen(process.env.PORT || 4000, ()=>{
        console.log(`Server running on port ${process.env.PORT || 4000}`);
    })
})
.catch((error)=> console.error('DB connection failed -index.js: ', error));