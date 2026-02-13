import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.js";
const PORT = process.env.PORT || 5000;

connectDB()
    .then(()=>{ //after connection port indication or error
        app.listen(PORT, ()=>{
            console.log(`Server Is Running At: ${PORT}`);
        });
    })
    .catch((err) =>{
        console.log(`Failed To Connect To MongoDB: ${err.message}`);
        process.exit(1);
    });