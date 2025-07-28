import Admin from "../models/Admin.js";
import generateToken from "../utils/generateToken.js";

// Register
export const registerAdmin = async (req, res) => {
  try {
    const { name, username, password } = req.body;

    if (!name || !username || !password || password.length < 8) {
      return res.status(400).json({
        message: "❌ تحقق من المدخلات. كلمة المرور يجب أن تكون على الأقل 8 أحرف",
      });
    }

    const exists = await Admin.findOne({ username });
    if (exists) {
      return res.status(400).json({ message: "❌ اسم المستخدم مستخدم مسبقاً" });
    }

    const admin = await Admin.create({ name, username, password });

    if (admin) {
      res.status(201).json({
        _id: admin._id,
        name: admin.name,
        username: admin.username,
        token: generateToken(admin._id),
      });
    } else {
      res.status(400).json({ message: "❌ فشل التسجيل" });
    }
  } catch {
    res.status(500).json({ message: "❌ حدث خطأ أثناء التسجيل" });
  }
};

// Login
export const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });

    if (!admin || !(await admin.matchPassword(password))) {
      return res.status(401).json({ message: "❌ بيانات الدخول غير صحيحة" });
    }

    res.status(200).json({
      _id: admin._id,
      name: admin.name,
      username: admin.username,
      token: generateToken(admin._id),
    });
  } catch {
    res.status(500).json({ message: "❌ فشل تسجيل الدخول" });
  }
};

// Get all admins
export const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select("-password");
    res.status(200).json(admins);
  } catch {
    res.status(500).json({ message: "❌ فشل جلب المسؤولين" });
  }
};

// Get admin by ID
export const getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).select("-password");
    if (!admin) {
      return res.status(404).json({ message: "❌ المسؤول غير موجود" });
    }
    res.status(200).json(admin);
  } catch {
    res.status(400).json({ message: "❌ معرف غير صالح" });
  }
};

// Update admin
export const updateAdmin = async (req, res) => {
  try {
    const { name, username } = req.body;
    const admin = await Admin.findById(req.params.id);

    if (!admin) {
      return res.status(404).json({ message: "❌ المسؤول غير موجود" });
    }

    if (username && username !== admin.username) {
      const existing = await Admin.findOne({ username });
      if (existing) {
        return res
          .status(400)
          .json({ message: "❌ اسم المستخدم مستخدم مسبقاً" });
      }
      admin.username = username;
    }

    if (name) admin.name = name;

    const updatedAdmin = await admin.save();

    res.status(200).json({
      _id: updatedAdmin._id,
      name: updatedAdmin.name,
      username: updatedAdmin.username,
    });
  } catch {
    res.status(500).json({ message: "❌ فشل التعديل" });
  }
};

// Delete admin
export const deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: "❌ المسؤول غير موجود" });
    }

    await admin.deleteOne();
    res.status(200).json({ message: "✅ تم حذف المسؤول بنجاح" });
  } catch {
    res.status(500).json({ message: "❌ فشل الحذف" });
  }
};
