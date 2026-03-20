import mongoose from "mongoose";

const connectToDatabase = async () => 
{
    try
    {
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URI!);
        console.log("MongoDB connected successfully:", connectionInstance.connection.host);
    }
    catch(error)
    {
        console.log("MongoDB connection error:", error);
        process.exit(1); // Exit the process with an error code
    }

}

export default connectToDatabase;