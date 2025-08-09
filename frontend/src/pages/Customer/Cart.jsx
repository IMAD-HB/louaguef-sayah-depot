import React, { useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { Link, useNavigate } from "react-router-dom";

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();

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

  return (
    <div className="max-w-3xl mx-auto bg-cyan-50 p-6 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-cyan-700 mb-8 text-center">
        🛒 محتوى السلة
      </h2>

      {cartItems.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between border-b border-cyan-200 py-5"
        >
          <div className="flex items-center gap-5">
            <img
              src={item.image}
              alt={item.name}
              className="w-16 h-16 object-contain rounded-md shadow-sm"
            />
            <div>
              <h3 className="text-xl font-semibold text-cyan-800">{item.name}</h3>
              <p className="text-sm text-cyan-600">{item.price} د.ج للوحدة</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="px-3 text-lg font-bold text-cyan-700 hover:text-cyan-900 transition disabled:opacity-50"
              disabled={item.quantity <= 1}
              aria-label="إنقاص الكمية"
            >
              −
            </button>
            <span className="w-8 text-center text-cyan-800 font-semibold">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="px-3 text-lg font-bold text-cyan-700 hover:text-cyan-900 transition disabled:opacity-50"
              disabled={item.quantity >= item.stock}
              aria-label="زيادة الكمية"
            >
              +
            </button>
            <button
              onClick={() => removeFromCart(item.id)}
              className="text-red-600 hover:text-red-700 ml-6 text-sm font-semibold transition"
              aria-label="إزالة المنتج"
            >
              إزالة
            </button>
          </div>
        </div>
      ))}

      <div className="mt-8 text-right text-xl font-bold text-cyan-900">
        الإجمالي: <span className="text-cyan-700">{total} د.ج</span>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-5">
        <button
          onClick={clearCart}
          className="bg-red-100 hover:bg-red-200 text-red-700 px-5 py-2 rounded-md font-bold shadow-sm transition"
        >
          🗑️ إفراغ السلة
        </button>

        <Link
          to="/customer/checkout"
          className="bg-cyan-700 hover:bg-cyan-800 text-white px-8 py-3 rounded-md font-bold shadow-md transition"
        >
          تأكيد الطلب
        </Link>
      </div>
    </div>
  );
};

export default Cart;
