import mongoose from "mongoose";


// function that connects to mongoDB 
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
    });
    console.log(`MongoDB Connected`);
    
    // connection fail
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
