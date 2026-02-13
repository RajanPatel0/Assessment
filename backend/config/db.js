import mongoose from "mongoose";

const connectDb = async() => {  //this will show up connection msg or error
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected Successfully");
    } catch(error) {
        console.log("Mongo DataBase Connection Failed", error);
        process.exit(1);
    }
};

export default connectDb;