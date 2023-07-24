import mongoose from "mongoose";

const mongoDBConnect = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI);
    console.log("mongodb connected");
  } catch (error) {
    console.log(error.message);
  }
};

export default mongoDBConnect;
