import mongoose from "mongoose";

const dbConnection = async() => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI,{dbName:"Blogs"})
        // console.log(connection);
        console.log("Database connected successfully!");
    } catch (error) {
        console.log(`Error from DB connection ${error}`);
    }
}

export default dbConnection    