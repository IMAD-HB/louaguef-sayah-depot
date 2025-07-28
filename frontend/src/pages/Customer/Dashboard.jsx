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
    <div className="text-center p-6">
      <h1 className="text-3xl font-bold text-orange-600 mb-4">
        مرحباً، {customer?.name || "عميل"} 👋
      </h1>
      <p className="text-gray-600 mb-6">نحن سعداء بعودتك، يمكنك بدء التسوق الآن.</p>

      <button
        onClick={handleStartShopping}
        className="bg-orange-600 text-white px-6 py-2 rounded shadow hover:bg-orange-700 transition"
      >
        ابدأ الطلب الآن
      </button>
    </div>
  );
};

export default CustomerDashboard;
