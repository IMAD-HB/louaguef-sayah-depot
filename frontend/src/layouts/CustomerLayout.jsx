import React from "react";
import { Outlet, Link } from "react-router-dom";
import { logout } from "../utils/auth";
import { useCart } from "../context/CartContext";

const CustomerLayout = () => {
  const { cartItems } = useCart();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="bg-cyan-700 text-white p-4 flex justify-between items-center shadow-md">
        <h1 className="font-bold text-xl">لوحة العميل</h1>
        <button
          onClick={logout}
          className="bg-white text-cyan-700 px-3 py-1 rounded-lg font-bold shadow hover:bg-gray-100 transition"
        >
          تسجيل الخروج
        </button>
      </header>

      {/* Navigation */}
      <nav className="bg-cyan-50 p-3 flex flex-wrap gap-2 justify-center px-4 shadow-sm">
        <Link
          to="/customer/"
          className="text-cyan-700 font-semibold px-3 py-1 rounded-md hover:bg-cyan-100 transition"
        >
          الصفحة الرئيسية
        </Link>
        <Link
          to="/customer/brands"
          className="text-cyan-700 font-semibold px-3 py-1 rounded-md hover:bg-cyan-100 transition"
        >
          المنتجات
        </Link>
        <Link
          to="/customer/orders"
          className="text-cyan-700 font-semibold px-3 py-1 rounded-md hover:bg-cyan-100 transition"
        >
          الطلبات
        </Link>
        <Link
          to="/customer/profile"
          className="text-cyan-700 font-semibold px-3 py-1 rounded-md hover:bg-cyan-100 transition"
        >
          حسابي
        </Link>

        {cartItems.length > 0 && (
          <Link
            to="/customer/cart"
            className="bg-cyan-600 text-white px-3 py-1 rounded-md font-bold shadow hover:bg-cyan-700 transform transition hover:scale-105 animate-pulse"
          >
            🛒 السلة ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})
          </Link>
        )}
      </nav>

      {/* Main Content */}
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default CustomerLayout;
