import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "./models/Admin.js";
// import Customer from "./models/Customer.js";

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ تم الاتصال بقاعدة البيانات");

    // حذف البيانات القديمة
    await Admin.deleteMany();
    // await Customer.deleteMany();

    // إنشاء مدير
    const admin = new Admin({
      username: "مدير تجريبي",
      name: "مدير تجريبي",
      password: "12345678",
    });

    // إنشاء عميل
    // const customer = new Customer({
    //   username: "",
    //   name: "",
    //   password: "",
    //   phoneNumber: "",
    //   tier: "",
    // });

    await admin.save();
    // await customer.save();

    // console.log("✅ تم إدخال المدير والعميل بنجاح");
    console.log("✅ تم إدخال المدير بنجاح");
    process.exit();
  } catch (error) {
    console.error("❌ فشل في إدخال البيانات:", error.message);
    process.exit(1);
  }
};

seedDatabase();
