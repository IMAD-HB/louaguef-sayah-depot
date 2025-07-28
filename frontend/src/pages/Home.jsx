import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-orange-50 text-center">
      <h1 className="text-4xl font-bold text-orange-600 mb-6">مرحبا بك في مجمع لواقف سايح</h1>
      <p className="mb-8 text-gray-700">يرجى تسجيل الدخول للوصول إلى النظام</p>
      <Link
        to="/login"
        className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded shadow"
      >
        تسجيل الدخول
      </Link>
    </div>
  );
};

export default Home;