import Order from "../models/Order.js";
import Customer from "../models/Customer.js";
import Product from "../models/Product.js";

// GET all orders (with optional filter by userId)
export const getOrders = async (req, res) => {
  try {
    const filter = {};

    // If userId is passed in query, filter by it
    if (req.query.userId) {
      filter.userId = req.query.userId;
    }

    const orders = await Order.find(filter)
      .populate("userId", "name tier")
      .populate("products.productId", "name");

    res.status(200).json(orders);
  } catch {
    res.status(500).json({ message: "❌ فشل جلب الطلبات" });
  }
};

// GET order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("userId", "name tier")
      .populate("products.productId", "name");

    if (!order) {
      return res.status(404).json({ message: "❌ الطلب غير موجود" });
    }

    res.status(200).json(order);
  } catch {
    res.status(400).json({ message: "❌ معرف غير صالح" });
  }
};

// Create an order
export const createOrder = async (req, res) => {
  try {
    const { userId, products, paidAmount = 0 } = req.body;

    if (!userId || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "❌ البيانات غير مكتملة" });
    }

    const customer = await Customer.findById(userId);
    if (!customer) {
      return res.status(404).json({ message: "❌ العميل غير موجود" });
    }

    // Validate product existence
    let totalPrice = 0;
    for (const item of products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res
          .status(404)
          .json({ message: `❌ المنتج غير موجود: ${item.productId}` });
      }
      totalPrice += item.unitPrice * item.quantity;
    }

    const paid = Math.max(0, Number(paidAmount));
    const extra = paid - totalPrice;

    const order = await Order.create({
      userId,
      products,
      totalPrice,
      paidAmount: paid,
    });

    // Adjust customer's debt
    if (extra > 0) {
      customer.totalDebt = Math.max(0, customer.totalDebt - extra);
    } else {
      customer.totalDebt += totalPrice - paid;
    }
    await customer.save();

    // Update stock
    for (const item of products) {
      const product = await Product.findById(item.productId);
      if (product) {
        product.stock = Math.max(0, product.stock - item.quantity);
        await product.save();
      }
    }

    res.status(201).json(order);
  } catch {
    res.status(500).json({ message: "❌ فشل إنشاء الطلب" });
  }
};

// Update an order
export const updateOrder = async (req, res) => {
  try {
    const { userId, products, paidAmount = 0 } = req.body;

    if (!userId || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "❌ البيانات غير مكتملة" });
    }

    // Fetch existing order
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "❌ الطلب غير موجود" });
    }

    // Fetch associated customer
    const customer = await Customer.findById(userId);
    if (!customer) {
      return res.status(404).json({ message: "❌ العميل غير موجود" });
    }

    // Step 1: Reverse the original order effects

    // 1a. Restore stock
    for (const item of order.products) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: item.quantity },
      });
    }

    // 1b. Restore customer's debt
    const oldPaid = order.paidAmount || 0;
    customer.totalDebt = customer.totalDebt - order.totalPrice + oldPaid;

    // Step 2: Validate and process new products

    let newTotalPrice = 0;
    for (const item of products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `❌ المنتج غير موجود: ${item.productId}` });
      }
      newTotalPrice += item.unitPrice * item.quantity;
    }

    const paid = Math.max(0, Number(paidAmount));
    const extra = paid - newTotalPrice;

    // Step 3: Update order
    order.userId = userId;
    order.products = products;
    order.totalPrice = newTotalPrice;
    order.paidAmount = paid;

    await order.save();

    // Step 4: Apply updated stock
    for (const item of products) {
      const product = await Product.findById(item.productId);
      if (product) {
        product.stock = Math.max(0, product.stock - item.quantity);
        await product.save();
      }
    }

    // Step 5: Adjust customer debt again
    if (extra > 0) {
      customer.totalDebt = Math.max(0, customer.totalDebt - extra);
    } else {
      customer.totalDebt += newTotalPrice - paid;
    }

    await customer.save();

    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "❌ فشل تحديث الطلب" });
  }
};

// Update status
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !["pending", "confirmed"].includes(status)) {
      return res.status(400).json({ message: "❌ الحالة غير صالحة" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "❌ الطلب غير موجود" });
    }

    order.status = status;
    await order.save();

    res.status(200).json(order);
  } catch {
    res.status(500).json({ message: "❌ فشل تحديث الحالة" });
  }
};

// DELETE order
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "❌ الطلب غير موجود" });
    }

    const customer = await Customer.findById(order.userId);
    if (!customer) {
      return res.status(404).json({ message: "❌ العميل غير موجود" });
    }

    for (const item of order.products) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: item.quantity },
      });
    }

    const paid = order.paidAmount || 0;
    customer.totalDebt = customer.totalDebt - order.totalPrice + paid;
    await customer.save();

    await order.deleteOne();

    res.status(200).json({ message: "✅ تم حذف الطلب بنجاح" });
  } catch {
    res.status(500).json({ message: "❌ فشل حذف الطلب" });
  }
};
