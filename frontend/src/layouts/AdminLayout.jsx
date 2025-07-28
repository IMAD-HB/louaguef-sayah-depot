// src/layouts/AdminLayout.jsx
import React from "react";
import { Outlet, Link } from "react-router-dom";
import { logout } from "../utils/auth";

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-orange-50">
      <header className="bg-orange-600 text-white p-4 flex justify-between items-center">
        <h1 className="font-bold text-xl">لوحة المشرف</h1>
        <button
          onClick={logout}
          className="bg-white text-orange-600 px-3 py-1 rounded font-bold"
        >
          تسجيل الخروج
        </button>
      </header>

      <nav className="bg-orange-100 p-3 flex gap-4 justify-center">
        <Link to="/admin/" className="text-orange-600 font-bold">
          الصفحة الرئيسية
        </Link>
        <Link to="/admin/brands" className="text-orange-600 font-bold">
          العلامات
        </Link>
        <Link to="/admin/products" className="text-orange-600 font-bold">
          المنتجات
        </Link>
        <Link to="/admin/orders" className="text-orange-600 font-bold">
          الطلبات
        </Link>
        <Link to="/admin/customers" className="text-orange-600 font-bold">
          العملاء
        </Link>
        <Link to="/admin/admins" className="text-orange-600 font-bold">
          المدراء
        </Link>
        <Link to="/admin/debt" className="text-orange-600 font-bold">
          الديون
        </Link>
      </nav>

      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
