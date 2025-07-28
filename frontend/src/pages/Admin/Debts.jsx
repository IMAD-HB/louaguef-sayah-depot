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

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  const filteredCustomers = customers.filter((cust) => {
    const search = debouncedSearch.toLowerCase();
    return (
      cust.name.toLowerCase().includes(search) ||
      cust.username.toLowerCase().includes(search)
    );
  });

  const handleSettle = async (cust) => {
    const amount = parseFloat(amounts[cust._id]);
    if (!amount || amount <= 0) {
      return toast.error("❌ أدخل مبلغًا صالحًا");
    }
    if (amount > cust.totalDebt) {
      return toast.error("❌ المبلغ أكبر من الدين الحالي");
    }

    try {
      await axios.put(`/customers/${cust._id}/settledebt`, { amount });
      await axios.post("/settlements", {
        customerId: cust._id,
        name: cust.name,
        username: cust.username,
        amount,
      });
      toast.success("✅ تم تسوية جزء من الدين");
      setAmounts({ ...amounts, [cust._id]: "" });
      throttledFetchCustomers();
    } catch {
      toast.error("❌ فشل التسوية");
    }
  };

  const handleDownloadTodaySettlements = async () => {
    try {
      const { data } = await axios.get("/settlements/today");

      if (!data.length) {
        toast.info("ℹ️ لا توجد تسويات لليوم");
        return;
      }

      const doc = new jsPDF();
      doc.setFont("Amiri-Regular", "normal");
      doc.setFontSize(16);

      // Header
      doc.text("تسويات اليوم", 105, 15, {
        align: "center",
      });

      // Prepare table
      const tableData = data.map((s, index) => [
        index + 1,
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
          fillColor: [255, 102, 0],
          font: "Amiri-Regular",
          fontStyle: "normal",
        },
        margin: { horizontal: 10 },
      });

      // Total footer
      const total = data.reduce((sum, s) => sum + s.amount, 0);
      doc.text(
        `المجموع: ${total.toFixed(2)} د.ج`,
        105,
        doc.lastAutoTable.finalY + 10,
        { align: "center" }
      );

      // Save with today's date
      const today = new Date().toISOString().split("T")[0];
      doc.save(`settlements_${today}.pdf`);
    } catch (err) {
      toast.error("❌ فشل تحميل التسويات");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-orange-600 mb-4">ديون العملاء</h2>

      {/* 🔍 Search Input */}
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="ابحث بالاسم أو اسم المستخدم..."
        className="border p-2 rounded w-full mb-4"
      />

      {/* 📥 Download Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handleDownloadTodaySettlements}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          تحميل تسويات اليوم
        </button>
      </div>

      <div className="bg-white rounded shadow p-4">
        {/* Table view */}
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
            {filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  لا يوجد عملاء لديهم ديون.
                </td>
              </tr>
            ) : (
              filteredCustomers.map((cust) => (
                <tr key={cust._id} className="border-b">
                  <td className="py-2">{cust.name}</td>
                  <td>{cust.username}</td>
                  <td>
                    {{
                      retail: "تجزئة",
                      wholesale: "جملة",
                      superwholesale: "جملة كبرى",
                    }[cust.tier] || "غير معروف"}
                  </td>
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
                      onClick={() => handleSettle(cust)}
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

        {/* Card view */}
        <div className="space-y-4 sm:hidden">
          {filteredCustomers.length === 0 ? (
            <p className="text-center text-gray-500">
              لا يوجد عملاء لديهم ديون.
            </p>
          ) : (
            filteredCustomers.map((cust) => (
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
                      setAmounts({ ...amounts, [cust._id]: e.target.value })
                    }
                    className="border p-1 rounded w-full mt-1"
                  />
                </div>
                <button
                  onClick={() => handleSettle(cust)}
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
