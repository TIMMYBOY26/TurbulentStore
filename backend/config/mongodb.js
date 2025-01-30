import mongoose from "mongoose";

const connectDB = async () => {


    // Listen for connection events
    mongoose.connection.on('connected', () => {
        console.log("DB connected");
    });

    // Connect to MongoDB without deprecated options
    await mongoose.connect(`${process.env.MONGODB_URL}/turbulentstore`);


};

export default connectDB;

