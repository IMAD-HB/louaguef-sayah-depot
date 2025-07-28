import React, { useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import axios from "../../services/axios";
import { toast } from "react-toastify";
import { generateReceiptPDF } from "../../utils/generateReceipt";

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();

  const customer = JSON.parse(localStorage.getItem("customerInfo"));

  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // 🚨 Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/customer");
    }
  }, [cartItems, navigate]);

  const handleConfirmOrder = async () => {
    if (!customer || cartItems.length === 0) return;

    try {
      const orderPayload = {
        userId: customer._id,
        products: cartItems.map((item) => ({
          productId: {
            _id: item.id,
            name: item.name,
          },
          quantity: item.quantity,
          unitPrice: item.price,
        })),
        totalPrice: total,
      };

      const { data: newOrder } = await axios.post("/orders", orderPayload);

      const { data: fullCustomer } = await axios.get(
        `/customers/${customer._id}`
      );

      generateReceiptPDF({
        order: {
          ...newOrder,
          products: orderPayload.products,
        },
        customer: fullCustomer,
      });

      clearCart();
      toast.success("✅ تم إنشاء الطلب وتحميل الوصل!");
      navigate("/customer/brands");
    } catch (err) {
      toast.error("❌ فشل تأكيد الطلب");
    }
  };

  if (!customer) {
    return (
      <p className="text-center text-red-500 mt-10">
        لم يتم العثور على معلومات العميل.
      </p>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold text-orange-700 mb-6 text-center">
        تأكيد الطلب
      </h2>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          معلومات العميل:
        </h3>
        <p className="text-gray-600">الاسم: {customer.name}</p>
        <p className="text-gray-600">
          الفئة:{" "}
          {{
            retail: "تجزئة",
            wholesale: "جملة",
            superwholesale: "جملة كبرى",
          }[customer.tier] || "غير معروف"}
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">المنتجات:</h3>
        <ul className="space-y-3">
          {cartItems.map((item) => (
            <li key={item.id} className="flex justify-between border-b pb-2">
              <div>
                <p className="text-gray-700 font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">
                  {item.quantity} × {item.price} د.ج
                </p>
              </div>
              <p className="font-bold text-orange-700">
                {item.quantity * item.price} د.ج
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div className="text-right text-lg font-bold text-gray-800 mb-6">
        الإجمالي: <span className="text-orange-700">{total} د.ج</span>
      </div>

      <div className="text-center">
        <button
          onClick={handleConfirmOrder}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-bold"
        >
          تأكيد الطلب
        </button>
      </div>
    </div>
  );
};

export default Checkout;
