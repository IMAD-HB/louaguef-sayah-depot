import React, { useEffect, useState } from "react";
import axios from "../../services/axios";
import { toast, ToastContainer } from "react-toastify";

const CustomerProfile = () => {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const customerInfo = JSON.parse(localStorage.getItem("customerInfo"));
    const customerId = customerInfo?._id;

    if (!customerId) {
      toast.error("لم يتم العثور على معرف العميل في التخزين المحلي.");
      setLoading(false);
      return;
    }

    const timeoutId = setTimeout(() => {
      const fetchCustomer = async () => {
        try {
          setLoading(true);

          const response = await axios.get(`/customers/${customerId}`);
          setCustomer(response.data);
        } catch (err) {
          toast.error("فشل تحميل معلومات العميل.");
        } finally {
          setLoading(false);
        }
      };

      fetchCustomer();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, []);

  if (loading) {
    return <p className="text-center mt-10">جاري تحميل معلومات العميل...</p>;
  }

  if (!customer) {
    return <p className="text-center text-red-500 mt-10">لا توجد بيانات للعميل.</p>;
  }

  const tierLabel = {
    retail: "تجزئة",
    wholesale: "جملة",
    superwholesale: "جملة كبرى",
  }[customer.tier] || "غير معروف";

  return (
    <>
      <ToastContainer position="top-center" />
      <div className="p-6 max-w-md mx-auto">
        <h2 className="text-3xl font-bold text-cyan-700 mb-6 text-center">حسابي</h2>

        <div className="bg-white shadow-lg rounded-lg p-6 space-y-6">
          <div>
            <p className="text-cyan-600 font-semibold">الاسم الكامل:</p>
            <p className="text-lg text-cyan-800">{customer.name}</p>
          </div>

          <div>
            <p className="text-cyan-600 font-semibold">الفئة:</p>
            <p className="text-lg text-cyan-800">{tierLabel}</p>
          </div>

          <div>
            <p className="text-cyan-600 font-semibold">رقم الهاتف:</p>
            <p className="text-lg text-cyan-800">{customer.phoneNumber || "—"}</p>
          </div>

          <div>
            <p className="text-cyan-600 font-semibold">الرصيد الحالي (الدين):</p>
            <p className="text-lg text-red-600 font-bold">
              {customer.totalDebt?.toFixed(2) || "0.00"} د.ج
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerProfile;
