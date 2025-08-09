import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-center text-white px-4">
      <h1 className="text-6xl font-bold text-cyan-400 mb-4">404</h1>
      <p className="text-xl text-gray-300 mb-6">الصفحة غير موجودة</p>
      <Link
        to="/"
        className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-transform transform hover:scale-[1.02]"
      >
        العودة إلى الرئيسية
      </Link>
    </div>
  );
};

export default NotFound;
