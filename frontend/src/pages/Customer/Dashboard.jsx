import React from "react";
import { useNavigate } from "react-router-dom";

const CustomerDashboard = () => {
  const navigate = useNavigate();

  // الحصول على بيانات المستخدم من localStorage
  const customer = JSON.parse(localStorage.getItem("customerInfo"));

  const handleStartShopping = () => {
    navigate("/customer/brands");
  };

  return (
    <div className="max-w-xl mx-auto bg-cyan-50 p-8 rounded-lg shadow-md text-center">
      <h1 className="text-4xl font-bold text-cyan-700 mb-5">
        مرحباً، {customer?.name || "عميل"} 👋
      </h1>
      <p className="text-cyan-800 mb-8 text-lg">
        نحن سعداء بعودتك، يمكنك بدء التسوق الآن.
      </p>

      <button
        onClick={handleStartShopping}
        className="bg-cyan-700 text-white px-8 py-3 rounded-md font-semibold shadow-md hover:bg-cyan-800 transition transform hover:scale-105"
      >
        ابدأ الطلب الآن
      </button>
    </div>
  );
};

export default CustomerDashboard;
