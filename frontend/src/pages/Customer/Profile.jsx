import React from "react";

const CustomerProfile = () => {
  const customer = JSON.parse(localStorage.getItem("customerInfo"));

  if (!customer) {
    return (
      <p className="text-center text-red-500 mt-10">
        لم يتم العثور على معلومات العميل.
      </p>
    );
  }

  const tierLabel = {
    retail: "تجزئة",
    wholesale: "جملة",
    superwholesale: "جملة كبرى",
  }[customer.tier] || "غير معروف";

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-orange-600 mb-4">حسابي</h2>

      <div className="bg-white shadow rounded-lg p-6 space-y-4">
        <div>
          <p className="text-gray-600 font-semibold">الاسم الكامل:</p>
          <p className="text-lg text-gray-800">{customer.name}</p>
        </div>

        <div>
          <p className="text-gray-600 font-semibold">الفئة:</p>
          <p className="text-lg text-gray-800">{tierLabel}</p>
        </div>

        <div>
          <p className="text-gray-600 font-semibold">رقم الهاتف:</p>
          <p className="text-lg text-gray-800">{customer.phoneNumber || "—"}</p>
        </div>

        <div>
          <p className="text-gray-600 font-semibold">الرصيد الحالي (الدين):</p>
          <p className="text-lg text-red-600 font-bold">
            {customer.totalDebt?.toFixed(2) || "0.00"} د.ج
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;
