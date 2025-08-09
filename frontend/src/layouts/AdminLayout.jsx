import React from "react";
import { Outlet, Link } from "react-router-dom";
import { logout } from "../utils/auth";

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Header */}
      <header className="bg-cyan-700 text-white p-4 flex justify-between items-center shadow-md">
        <h1 className="font-bold text-xl">لوحة المشرف</h1>
        <button
          onClick={logout}
          className="bg-white text-cyan-700 px-3 py-1 rounded-lg font-bold shadow hover:bg-gray-100 transition"
        >
          تسجيل الخروج
        </button>
      </header>

      {/* Navigation */}
      <nav className="bg-cyan-50 p-3 flex flex-wrap gap-2 justify-center px-4 shadow-sm">
        {[
          { to: "/admin/", label: "الصفحة الرئيسية" },
          { to: "/admin/brands", label: "العلامات" },
          { to: "/admin/products", label: "المنتجات" },
          { to: "/admin/customers", label: "العملاء" },
          { to: "/admin/admins", label: "المدراء" },
          { to: "/admin/orders", label: "الطلبات" },
          { to: "/admin/debt", label: "الديون" },
        ].map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="text-cyan-700 font-semibold px-3 py-1 rounded-md hover:bg-cyan-100 transition"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Main Content */}
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
