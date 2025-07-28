import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "اسم العلامة التجارية مطلوب"],
      unique: true,
      trim: true,
    },
    logo: {
      url: {
        type: String,
        required: [true, "رابط الشعار مطلوب"],
      },
      public_id: {
        type: String,
        required: [true, "معرف الشعار مطلوب"],
      },
    },
  },
  { timestamps: true }
);

const Brand = mongoose.model("Brand", brandSchema);
export default Brand;
