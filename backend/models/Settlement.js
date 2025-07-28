import mongoose from "mongoose";

const settlementSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  name: { type: String, required: true },
  username: { type: String, required: true },
  amount: { type: Number, required: true },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Settlement = mongoose.model("Settlement", settlementSchema);
export default Settlement;
