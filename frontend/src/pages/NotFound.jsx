import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-orange-50 text-center">
      <h1 className="text-6xl font-bold text-orange-600 mb-4">404</h1>
      <p className="text-xl text-gray-700 mb-6">الصفحة غير موجودة</p>
      <Link
        to="/"
        className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded shadow"
      >
        العودة إلى الرئيسية
      </Link>
    </div>
  );
};

export default NotFound;
