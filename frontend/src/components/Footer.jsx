import React from "react";
import logo from "../assets/logo.png";

const Footer = () => {
  return (
    <footer className="w-full bg-gray-50 dark:bg-gray-900 text-center py-8 text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-sm md:text-base">
          &copy; {new Date().getFullYear()}{" "}
          <img
            src={logo}
            alt="Logo"
            className="w-20 h-auto inline-block align-middle"
          />{" "}
          . جميع الحقوق محفوظة.
        </p>
        <div className="mt-4 flex justify-center gap-6">
          <a
            href="#"
            className="text-gray-500 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors duration-200"
          >
            شروط الخدمة
          </a>
          <a
            href="#"
            className="text-gray-500 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors duration-200"
          >
            سياسة الخصوصية
          </a>
          <a
            href="#contact"
            className="text-gray-500 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors duration-200"
          >
            اتصل بنا
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
