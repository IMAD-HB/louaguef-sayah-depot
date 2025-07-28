import React from "react";
import { Outlet, Link } from "react-router-dom";
import { logout } from "../utils/auth";
import { useCart } from "../context/CartContext";

const CustomerLayout = () => {
  const { cartItems } = useCart();

  return (
    <div className="min-h-screen bg-orange-50">
      <header className="bg-orange-500 text-white p-4 flex justify-between items-center">
        <h1 className="font-bold text-xl">لوحة العميل</h1>
        <button
          onClick={logout}
          className="bg-white text-orange-600 px-3 py-1 rounded font-bold"
        >
          تسجيل الخروج
        </button>
      </header>

      <nav className="bg-orange-100 p-3 flex gap-4 justify-center">
        <Link
          to="/customer/"
          className="text-orange-600 font-bold px-2 py-1 rounded hover:bg-orange-200 transition"
        >
          الصفحة الرئيسية
        </Link>
        <Link
          to="/customer/brands"
          className="text-orange-600 font-bold px-2 py-1 rounded hover:bg-orange-200 transition"
        >
          المنتجات
        </Link>
        <Link
          to="/customer/orders"
          className="text-orange-600 font-bold px-2 py-1 rounded hover:bg-orange-200 transition"
        >
          الطلبات
        </Link>
        <Link
          to="/customer/profile"
          className="text-orange-600 font-bold px-2 py-1 rounded hover:bg-orange-200 transition"
        >
          حسابي
        </Link>
        {cartItems.length > 0 && (
          <Link
            to="/customer/cart"
            className="text-white bg-orange-500 border border-orange-600 px-3 py-1 rounded font-bold"
          >
            السلة ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})
          </Link>
        )}
      </nav>

      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default CustomerLayout;
