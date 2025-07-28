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
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold text-orange-700 mb-6 text-center">
        🛒 محتوى السلة
      </h2>

      {cartItems.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between border-b py-4"
        >
          <div className="flex items-center gap-4">
            <img
              src={item.image}
              alt={item.name}
              className="w-16 h-16 object-contain rounded"
            />
            <div>
              <h3 className="text-lg font-semibold text-orange-700">
                {item.name}
              </h3>
              <p className="text-sm text-gray-600">{item.price} د.ج للوحدة</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="px-2 text-lg font-bold text-orange-600"
              disabled={item.quantity <= 1}
            >
              −
            </button>
            <span className="w-8 text-center">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="px-2 text-lg font-bold text-orange-600"
              disabled={item.quantity >= item.stock}
            >
              +
            </button>
            <button
              onClick={() => removeFromCart(item.id)}
              className="text-red-500 ml-4 text-sm"
            >
              إزالة
            </button>
          </div>
        </div>
      ))}

      <div className="mt-6 text-right text-lg font-bold text-gray-800">
        الإجمالي: <span className="text-orange-700">{total} د.ج</span>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <button
          onClick={clearCart}
          className="bg-red-100 hover:bg-red-200 text-red-600 px-4 py-2 rounded font-bold"
        >
          🗑️ إفراغ السلة
        </button>

        <Link
          to="/customer/checkout"
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded font-bold"
        >
          تأكيد الطلب
        </Link>
      </div>
    </div>
  );
};

export default Cart;
