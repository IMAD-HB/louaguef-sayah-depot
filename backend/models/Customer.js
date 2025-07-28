import mongoose from "mongoose";
import bcrypt from "bcrypt";

const customerSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    name: { type: String, required: true },
    phoneNumber: {
      type: String,
      validate: {
        validator: function (v) {
          return /^0[765]\d{8}$/.test(v);
        },
        message: "رقم الهاتف يجب أن يبدأ بـ 07 أو 06 أو 05 ويحتوي على 10 أرقام",
      },
    },

    tier: {
      type: String,
      enum: ["retail", "wholesale", "superwholesale"],
      default: "retail",
    },
    totalDebt: {
      type: Number,
      default: 0,
    },
    password: {
      type: String,
      required: true,
      minlength: [8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"],
    },
  },
  { timestamps: true }
);

// Hash password
customerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password
customerSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Customer = mongoose.model("Customer", customerSchema);
export default Customer;
