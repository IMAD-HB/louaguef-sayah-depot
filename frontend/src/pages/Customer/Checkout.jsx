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

  // Redirect if cart is empty
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
      toast.success("تم إنشاء الطلب وتحميل الوصل!");
      navigate("/customer/brands");
    } catch (err) {
      toast.error("فشل تأكيد الطلب");
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
    <div className="max-w-3xl mx-auto bg-cyan-50 p-6 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-cyan-700 mb-8 text-center">
        تأكيد الطلب
      </h2>

      <section className="mb-8">
        <h3 className="text-xl font-semibold text-cyan-800 mb-3">
          معلومات العميل:
        </h3>
        <p className="text-cyan-700">الاسم: {customer.name}</p>
        <p className="text-cyan-700">
          الفئة:{" "}
          {{
            retail: "تجزئة",
            wholesale: "جملة",
            superwholesale: "جملة كبرى",
          }[customer.tier] || "غير معروف"}
        </p>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-semibold text-cyan-800 mb-3">المنتجات:</h3>
        <ul className="space-y-4">
          {cartItems.map((item) => (
            <li
              key={item.id}
              className="flex justify-between border-b border-cyan-200 pb-3"
            >
              <div>
                <p className="text-cyan-900 font-medium">{item.name}</p>
                <p className="text-sm text-cyan-600">
                  {item.quantity} × {item.price} د.ج
                </p>
              </div>
              <p className="font-bold text-cyan-700">
                {item.quantity * item.price} د.ج
              </p>
            </li>
          ))}
        </ul>
      </section>

      <div className="text-right text-xl font-bold text-cyan-900 mb-8">
        الإجمالي: <span className="text-cyan-700">{total} د.ج</span>
      </div>

      <div className="text-center">
        <button
          onClick={handleConfirmOrder}
          className="bg-cyan-700 hover:bg-cyan-800 text-white px-8 py-3 rounded-md font-bold shadow-md transition transform hover:scale-105"
        >
          تأكيد الطلب
        </button>
      </div>
    </div>
  );
};

export default Checkout;
