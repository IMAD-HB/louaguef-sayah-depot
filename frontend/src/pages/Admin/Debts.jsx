import React, { useEffect, useState, useRef } from "react";
import axios from "../../services/axios";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "../../utils/amiri";

const AdminDebtPage = () => {
  const [customers, setCustomers] = useState([]);
  const [amounts, setAmounts] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const fetchTimeout = useRef(null);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    if (fetchTimeout.current) return;

    fetchTimeout.current = setTimeout(async () => {
      fetchTimeout.current = null;
      setLoading(true);
      try {
        const { data } = await axios.get("/customers");
        const filtered = data.filter((cust) => cust.totalDebt > 0);
        setCustomers(filtered);
      } catch {
        toast.error("فشل تحميل العملاء");
      } finally {
        setLoading(false);
      }
    }, 300);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const filteredCustomers = customers.filter((cust) => {
    const q = debouncedSearch.toLowerCase();
    return (
      cust.name.toLowerCase().includes(q) ||
      cust.username.toLowerCase().includes(q)
    );
  });

  const handleSettle = async (customer) => {
    const amount = parseFloat(amounts[customer._id]);
    if (!amount || amount <= 0) {
      return toast.error("أدخل مبلغًا صالحًا");
    }
    if (amount > customer.totalDebt) {
      return toast.error("المبلغ أكبر من الدين الحالي");
    }

    try {
      await axios.put(`/customers/${customer._id}/settledebt`, { amount });
      await axios.post("/settlements", {
        customerId: customer._id,
        name: customer.name,
        username: customer.username,
        amount,
      });
      toast.success("تم تسوية جزء من الدين");
      setAmounts((prev) => ({ ...prev, [customer._id]: "" }));
      fetchCustomers();
    } catch {
      toast.error("فشل التسوية");
    }
  };

  const handleDownloadTodaySettlements = async () => {
    try {
      const { data } = await axios.get("/settlements/today");

      if (data.length === 0) {
        toast.info("لا توجد تسويات لليوم");
        return;
      }

      const doc = new jsPDF();
      doc.setFont("Amiri-Regular", "normal");
      doc.setFontSize(16);
      doc.text("تسويات اليوم", 105, 15, { align: "center" });

      const tableData = data.map((s, i) => [
        i + 1,
        s.name,
        s.username,
        s.amount.toFixed(2) + " د.ج",
        new Date(s.date).toLocaleTimeString("ar-DZ"),
      ]);

      autoTable(doc, {
        startY: 25,
        head: [["#", "الاسم", "اسم المستخدم", "المبلغ", "الوقت"]],
        body: tableData,
        styles: {
          font: "Amiri-Regular",
          fontSize: 12,
          halign: "right",
        },
        headStyles: {
          fillColor: [0, 184, 184],
          font: "Amiri-Regular",
          fontStyle: "normal",
        },
        margin: { horizontal: 10 },
      });

      const total = data.reduce((sum, s) => sum + s.amount, 0);
      doc.text(
        `المجموع: ${total.toFixed(2)} د.ج`,
        105,
        doc.lastAutoTable.finalY + 10,
        { align: "center" }
      );

      const today = new Date().toISOString().split("T")[0];
      doc.save(`settlements_${today}.pdf`);
    } catch {
      toast.error("فشل تحميل التسويات");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-cyan-700 mb-6">ديون العملاء</h1>

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="ابحث بالاسم أو اسم المستخدم..."
        className="w-full p-2 mb-6 border rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
      />

      <div className="flex justify-end mb-6">
        <button
          onClick={handleDownloadTodaySettlements}
          className="bg-cyan-700 hover:bg-cyan-800 text-white px-6 py-2 rounded shadow transition"
        >
          تحميل تسويات اليوم
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <table className="w-full text-right hidden sm:table border-collapse">
            <thead>
              <tr className="bg-cyan-50 border-b font-semibold text-cyan-700">
                <th className="py-3 px-4">الاسم</th>
                <th className="px-4">اسم المستخدم</th>
                <th className="px-4">الفئة</th>
                <th className="px-4">الدين الحالي</th>
                <th className="px-4">المبلغ المراد تسويته</th>
                <th className="px-4">تسوية</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-500">
                    لا يوجد عملاء لديهم ديون.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => (
                  <tr
                    key={cust._id}
                    className="border-b hover:bg-cyan-50 transition"
                  >
                    <td className="py-3 px-4">{cust.name}</td>
                    <td className="px-4">{cust.username}</td>
                    <td className="px-4">
                      {{
                        retail: "تجزئة",
                        wholesale: "جملة",
                        superwholesale: "جملة كبرى",
                      }[cust.tier] || "غير معروف"}
                    </td>
                    <td className="px-4">{cust.totalDebt.toFixed(2)} د.ج</td>
                    <td className="px-4">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={amounts[cust._id] || ""}
                        onChange={(e) =>
                          setAmounts((prev) => ({
                            ...prev,
                            [cust._id]: e.target.value,
                          }))
                        }
                        className="w-24 border rounded p-1 text-left"
                      />
                    </td>
                    <td className="px-4">
                      <button
                        onClick={() => handleSettle(cust)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded shadow transition"
                      >
                        تسوية
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Mobile View */}
          <div className="sm:hidden space-y-6">
            {filteredCustomers.length === 0 ? (
              <p className="text-center text-gray-500">لا يوجد عملاء لديهم ديون.</p>
            ) : (
              filteredCustomers.map((cust) => (
                <div
                  key={cust._id}
                  className="bg-cyan-50 p-4 rounded-lg border border-cyan-200 shadow-sm space-y-3 text-sm"
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
                    {{
                      retail: "تجزئة",
                      wholesale: "جملة",
                      superwholesale: "جملة كبرى",
                    }[cust.tier] || "غير معروف"}
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
                        setAmounts((prev) => ({ ...prev, [cust._id]: e.target.value }))
                      }
                      className="mt-1 w-full p-2 border rounded"
                    />
                  </div>
                  <button
                    onClick={() => handleSettle(cust)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded shadow transition"
                  >
                    تسوية
                  </button>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDebtPage;
