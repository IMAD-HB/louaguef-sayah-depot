import React, { useEffect, useState, useRef } from "react";
import axios from "../../services/axios";
import { toast } from "react-toastify";

const AdminDebtPage = () => {
  const [customers, setCustomers] = useState([]);
  const [amounts, setAmounts] = useState({});
  const fetchTimeout = useRef(null);

  const throttledFetchCustomers = () => {
    if (fetchTimeout.current) return;

    fetchTimeout.current = setTimeout(async () => {
      fetchTimeout.current = null;

      try {
        const { data } = await axios.get("/customers");
        const filtered = data.filter((cust) => cust.totalDebt > 0);
        setCustomers(filtered);
      } catch {
        toast.error("❌ فشل تحميل العملاء");
      }
    }, 300);
  };

  useEffect(() => {
    throttledFetchCustomers();
  }, []);

  const handleSettle = async (id, currentDebt) => {
    const amount = parseFloat(amounts[id]);
    if (!amount || amount <= 0) {
      return toast.error("❌ أدخل مبلغًا صالحًا");
    }
    if (amount > currentDebt) {
      return toast.error("❌ المبلغ أكبر من الدين الحالي");
    }

    try {
      await axios.put(`/customers/${id}/settledebt`, { amount });
      toast.success("✅ تم تسوية جزء من الدين");
      setAmounts({ ...amounts, [id]: "" });
      throttledFetchCustomers();
    } catch {
      toast.error("❌ فشل التسوية");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-orange-600 mb-4">ديون العملاء</h2>

      <div className="bg-white rounded shadow p-4">
        {/* Table view for medium and larger screens */}
        <table className="w-full text-right hidden sm:table">
          <thead>
            <tr className="border-b font-semibold text-gray-700">
              <th className="py-2">الاسم</th>
              <th>اسم المستخدم</th>
              <th>الفئة</th>
              <th>الدين الحالي</th>
              <th>المبلغ المراد تسويته</th>
              <th>تسوية</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  لا يوجد عملاء لديهم ديون.
                </td>
              </tr>
            ) : (
              customers.map((cust) => (
                <tr key={cust._id} className="border-b">
                  <td className="py-2">{cust.name}</td>
                  <td>{cust.username}</td>
                  <td>{cust.tier}</td>
                  <td>{cust.totalDebt.toFixed(2)} د.ج</td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={amounts[cust._id] || ""}
                      onChange={(e) =>
                        setAmounts({ ...amounts, [cust._id]: e.target.value })
                      }
                      className="border p-1 rounded w-24 text-left"
                    />
                  </td>
                  <td>
                    <button
                      onClick={() => handleSettle(cust._id, cust.totalDebt)}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      تسوية
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Card view for small screens */}
        <div className="space-y-4 sm:hidden">
          {customers.length === 0 ? (
            <p className="text-center text-gray-500">
              لا يوجد عملاء لديهم ديون.
            </p>
          ) : (
            customers.map((cust) => (
              <div
                key={cust._id}
                className="border rounded p-4 shadow-sm space-y-2 text-sm"
              >
                <div>
                  <span className="font-semibold">الاسم: </span>
                  {cust.name}
                </div>
                <div>
                  <span className="font-semibold">اسم المستخدم: </span>
                  {cust.username}
                </div>
                <div>
                  <span className="font-semibold">الفئة: </span>
                  {cust.tier}
                </div>
                <div>
                  <span className="font-semibold">الدين الحالي: </span>
                  {cust.totalDebt.toFixed(2)} د.ج
                </div>
                <div>
                  <span className="font-semibold">المبلغ المراد تسويته:</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={amounts[cust._id] || ""}
                    onChange={(e) =>
                      setAmounts({ ...amounts, [cust._id]: e.target.value })
                    }
                    className="border p-1 rounded w-full mt-1"
                  />
                </div>
                <button
                  onClick={() => handleSettle(cust._id, cust.totalDebt)}
                  className="bg-green-600 text-white w-full py-1 rounded hover:bg-green-700 mt-2"
                >
                  تسوية
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDebtPage;
