import Customer from "../models/Customer.js";
import generateToken from "../utils/generateToken.js";

// Register
export const registerCustomer = async (req, res) => {
  try {
    const { name, username, phoneNumber, tier, password } = req.body;

    if (!name || !username || !password || password.length < 8) {
      return res.status(400).json({
        message: "❌ تحقق من المدخلات. كلمة المرور قصيرة",
      });
    }

    const exists = await Customer.findOne({ username });
    if (exists) {
      return res.status(400).json({ message: "❌ اسم المستخدم مستخدم" });
    }

    const customer = await Customer.create({
      name,
      username,
      phoneNumber,
      tier,
      password,
    });

    res.status(201).json({
      _id: customer._id,
      name: customer.name,
      username: customer.username,
      tier: customer.tier,
      totalDebt: customer.totalDebt,
      token: generateToken(customer._id),
    });
  } catch {
    res.status(500).json({ message: "❌ فشل التسجيل" });
  }
};

// Login
export const loginCustomer = async (req, res) => {
  try {
    const { username, password } = req.body;
    const customer = await Customer.findOne({ username });

    if (!customer || !(await customer.matchPassword(password))) {
      return res.status(401).json({ message: "❌ بيانات الدخول غير صحيحة" });
    }

    res.json({
      _id: customer._id,
      name: customer.name,
      username: customer.username,
      tier: customer.tier,
      totalDebt: customer.totalDebt,
      phoneNumber: customer.phoneNumber,
      token: generateToken(customer._id),
    });
  } catch {
    res.status(500).json({ message: "❌ فشل تسجيل الدخول" });
  }
};

// Get all customers
export const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().select("-password");
    res.status(200).json(customers);
  } catch {
    res.status(500).json({ message: "❌ فشل جلب العملاء" });
  }
};

// Get customer by ID
export const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id).select("-password");
    if (!customer) {
      return res.status(404).json({ message: "❌ العميل غير موجود" });
    }
    res.status(200).json(customer);
  } catch {
    res.status(400).json({ message: "❌ معرف غير صالح" });
  }
};

// Update customer
export const updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "❌ العميل غير موجود" });
    }

    const { name, username, phoneNumber, tier, password } = req.body;

    if (username && username !== customer.username) {
      const exists = await Customer.findOne({ username });
      if (exists) {
        return res.status(400).json({ message: "❌ اسم المستخدم مستخدم" });
      }
      customer.username = username;
    }

    customer.name = name || customer.name;
    customer.phoneNumber = phoneNumber || customer.phoneNumber;
    customer.tier = tier || customer.tier;

    if (password) {
      if (password.length < 8) {
        return res
          .status(400)
          .json({ message: "❌ كلمة المرور يجب أن تكون 8 أحرف أو أكثر" });
      }
      customer.password = password;
    }

    await customer.save();
    res.status(200).json({ message: "✅ تم تحديث العميل" });
  } catch {
    res.status(500).json({ message: "❌ فشل التحديث" });
  }
};

// Delete customer
export const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "❌ العميل غير موجود" });
    }

    await customer.deleteOne();
    res.status(200).json({ message: "✅ تم حذف العميل" });
  } catch {
    res.status(500).json({ message: "❌ فشل الحذف" });
  }
};

// Settle debt
export const settleDebt = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "❌ العميل غير موجود" });
    }

    const { amount } = req.body;

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: "❌ مبلغ غير صالح" });
    }

    customer.totalDebt -= amount;
    if (customer.totalDebt < 0) customer.totalDebt = 0;

    await customer.save();
    res.status(200).json({
      message: "✅ تم تسوية جزء من الدين",
      totalDebt: customer.totalDebt,
    });
  } catch {
    res.status(500).json({ message: "❌ فشل تسوية الدين" });
  }
};
