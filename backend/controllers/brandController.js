import Brand from "../models/Brand.js";
import deleteImage from "../utils/deleteImage.js";

// GET all brands
export const getBrands = async (req, res) => {
  try {
    const brands = await Brand.find({});
    res.status(200).json(brands);
  } catch {
    res.status(500).json({ message: "❌ حدث خطأ أثناء جلب العلامات" });
  }
};

// GET brand by ID
export const getBrandById = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ message: "❌ لم يتم العثور على العلامة" });
    }
    res.status(200).json(brand);
  } catch {
    res.status(400).json({ message: "❌ معرف غير صالح" });
  }
};

// CREATE a brand
export const createBrand = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !req.file) {
      return res.status(400).json({ message: "❌ الاسم والشعار مطلوبان" });
    }

    const exists = await Brand.findOne({ name });
    if (exists) {
      return res.status(400).json({ message: "❌ العلامة موجودة مسبقاً" });
    }

    const brand = await Brand.create({
      name,
      logo: {
        url: req.file.path,
        public_id: req.file.filename,
      },
    });

    res.status(201).json(brand);
  } catch {
    res.status(500).json({ message: "❌ فشل إنشاء العلامة" });
  }
};

// UPDATE a brand
export const updateBrand = async (req, res) => {
  try {
    const { name } = req.body;
    const brand = await Brand.findById(req.params.id);

    if (!brand) {
      return res.status(404).json({ message: "❌ العلامة غير موجودة" });
    }

    brand.name = name || brand.name;

    if (req.file) {
      await deleteImage(brand.logo?.public_id);
      brand.logo = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }

    await brand.save();
    res.status(200).json(brand);
  } catch {
    res.status(500).json({ message: "❌ فشل تحديث العلامة" });
  }
};

// DELETE a brand
export const deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ message: "❌ العلامة غير موجودة" });
    }

    await deleteImage(brand.logo?.public_id);
    await brand.deleteOne();

    res.status(200).json({ message: "✅ تم حذف العلامة بنجاح" });
  } catch {
    res.status(500).json({ message: "❌ خطأ أثناء حذف العلامة" });
  }
};
