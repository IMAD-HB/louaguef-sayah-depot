import Product from "../models/Product.js";
import Brand from "../models/Brand.js";
import deleteImage from "../utils/deleteImage.js";

// GET all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({}).populate("brand", "name");
    res.status(200).json(products);
  } catch {
    res.status(500).json({ message: "❌ فشل جلب المنتجات" });
  }
};

// GET single product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("brand", "name");
    if (!product) {
      return res.status(404).json({ message: "❌ المنتج غير موجود" });
    }
    res.status(200).json(product);
  } catch {
    res.status(400).json({ message: "❌ معرف غير صالح" });
  }
};

// CREATE new product
export const createProduct = async (req, res) => {
  try {
    const { name, description, brand, prices, stock } = req.body;

    if (!name || !brand || !req.file || !prices) {
      return res.status(400).json({ message: "❌ البيانات غير مكتملة" });
    }

    const brandExists = await Brand.findById(brand);
    if (!brandExists) {
      return res.status(404).json({ message: "❌ العلامة غير موجودة" });
    }

    const product = await Product.create({
      name,
      description: {
        line1: description?.line1 || "",
        line2: description?.line2 || "",
        line3: description?.line3 || "",
        line4: description?.line4 || "",
        line5: description?.line5 || "",
      },
      brand,
      prices,
      stock,
      image: {
        url: req.file.path,
        public_id: req.file.filename,
      },
    });

    res.status(201).json(product);
  } catch {
    res.status(500).json({ message: "❌ فشل إنشاء المنتج" });
  }
};

// UPDATE product
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "❌ المنتج غير موجود" });
    }

    const { name, description, brand, prices, stock } = req.body;

    if (brand) {
      const brandExists = await Brand.findById(brand);
      if (!brandExists) {
        return res.status(404).json({ message: "❌ العلامة غير موجودة" });
      }
    }

    product.name = name || product.name;

    if (description) {
      product.description = {
        line1: description.line1 || product.description.line1 || "",
        line2: description.line2 || product.description.line2 || "",
        line3: description.line3 || product.description.line3 || "",
        line4: description.line4 || product.description.line4 || "",
        line5: description.line5 || product.description.line5 || "",
      };
    }

    product.brand = brand || product.brand;
    product.prices = prices || product.prices;
    product.stock = stock ?? product.stock;

    if (req.file) {
      await deleteImage(product.image?.public_id);
      product.image = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }

    await product.save();
    res.status(200).json(product);
  } catch {
    res.status(500).json({ message: "❌ فشل تحديث المنتج" });
  }
};

// DELETE product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "❌ المنتج غير موجود" });
    }

    await deleteImage(product.image?.public_id);
    await product.deleteOne();

    res.status(200).json({ message: "✅ تم حذف المنتج بنجاح" });
  } catch {
    res.status(500).json({ message: "❌ فشل حذف المنتج" });
  }
};
