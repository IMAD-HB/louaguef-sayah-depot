import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "اسم المنتج مطلوب"],
      trim: true,
    },
    description: {
      type: new mongoose.Schema(
        {
          line1: { type: String, default: "" },
          line2: { type: String, default: "" },
          line3: { type: String, default: "" },
          line4: { type: String, default: "" },
          line5: { type: String, default: "" },
        },
        { _id: false }
      ),
      default: {},
    },
    image: {
      url: {
        type: String,
        required: [true, "صورة المنتج مطلوبة"],
      },
      public_id: {
        type: String,
        required: [true, "الرقم التعريفي للصورة مطلوب"],
      },
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    prices: {
      retail: { type: Number, required: true },
      wholesale: { type: Number, required: true },
      superwholesale: { type: Number, required: true },
    },
    stock: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
