import Settlement from "../models/Settlement.js";

// ✅ GET settlements (optionally by date)
export const getSettlements = async (req, res) => {
  try {
    const { date } = req.query;

    // If no date is provided, return an empty array
    if (!date) {
      return res.json([]);
    }

    const start = new Date(date);
    const end = new Date(date);
    end.setDate(end.getDate() + 1);

    const settlements = await Settlement.find({
      date: { $gte: start, $lt: end },
    }).sort({ date: -1 });

    res.json(settlements);
  } catch (err) {
    res.status(500).json({ error: "فشل في جلب التسويات" });
  }
};

// ✅ GET today's settlements only
export const getTodaySettlements = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const settlements = await Settlement.find({
      date: { $gte: startOfDay, $lte: endOfDay },
    }).sort({ date: -1 });

    res.json(settlements);
  } catch (err) {
    res.status(500).json({ error: "فشل في جلب تسويات اليوم" });
  }
};

// ✅ ADD a new settlement
export const addSettlement = async (req, res) => {
  const { customerId, name, username, amount } = req.body;

  if (!customerId || !name || !username || !amount) {
    return res.status(400).json({ error: "بعض الحقول مفقودة" });
  }

  try {
    const newSettlement = new Settlement({
      customerId,
      name,
      username,
      amount,
    });

    await newSettlement.save();
    res.status(201).json(newSettlement);
  } catch (err) {
    res.status(500).json({ error: "فشل في إضافة التسوية" });
  }
};

// ✅ DELETE all settlements
export const deleteAllSettlements = async (req, res) => {
  try {
    await Settlement.deleteMany({});
    res.json({ message: "تم حذف جميع التسويات" });
  } catch (err) {
    res.status(500).json({ error: "فشل في حذف التسويات" });
  }
};
