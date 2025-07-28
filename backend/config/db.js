import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ تم الاتصال بقاعدة البيانات");
  } catch (error) {
    console.error("❌ خطأ في الاتصال:", error.message);
    process.exit(1);
  }
};

export default connectDB;
