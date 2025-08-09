import React, { useEffect, useState } from "react";
import axios from "../../services/axios";
import { format } from "date-fns";
import { generateReceiptPDF } from "../../utils/generateReceipt";
import { toast } from "react-toastify";

const statusLabels = {
  pending: "قيد الانتظار",
  confirmed: "تم التأكيد",
};

const CustomerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const customer = JSON.parse(localStorage.getItem("customerInfo"));

  useEffect(() => {
    const fetchOrders = async () => {
      if (!customer) return;

      try {
        const { data } = await axios.get(`/orders?userId=${customer._id}`);
        setOrders(data);
      } catch {
        toast.error("فشل تحميل الطلبات");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [customer]);

  const handleDownload = (order) => {
    generateReceiptPDF({
      order: {
        ...order,
        products: order.products,
      },
      customer,
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-cyan-700 mb-6 text-center">طلباتي</h2>

      <div className="bg-white shadow-lg rounded-lg p-6 overflow-x-auto">
        {loading ? (
          <p className="text-cyan-500 text-center">جاري تحميل الطلبات...</p>
        ) : orders.length === 0 ? (
          <p className="text-cyan-500 text-center">لا توجد طلبات لعرضها.</p>
        ) : (
          <table className="w-full text-right text-sm border border-cyan-200 rounded-md">
            <thead className="bg-cyan-100 text-cyan-800 font-semibold">
              <tr>
                <th className="p-3 border border-cyan-200">#</th>
                <th className="p-3 border border-cyan-200">التاريخ</th>
                <th className="p-3 border border-cyan-200">الإجمالي</th>
                <th className="p-3 border border-cyan-200">الحالة</th>
                <th className="p-3 border border-cyan-200">العمليات</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, i) => (
                <tr key={order._id} className="hover:bg-cyan-50 transition-colors">
                  <td className="p-3 border border-cyan-200">{i + 1}</td>
                  <td className="p-3 border border-cyan-200">
                    {format(new Date(order.createdAt), "yyyy/MM/dd")}
                  </td>
                  <td className="p-3 border border-cyan-200">{order.totalPrice} د.ج</td>
                  <td className="p-3 border border-cyan-200">
                    {statusLabels[order.status] || "—"}
                  </td>
                  <td className="p-3 border border-cyan-200 text-center">
                    <button
                      onClick={() => handleDownload(order)}
                      className="text-cyan-700 hover:text-cyan-900 hover:underline font-semibold transition"
                    >
                      تحميل الوصل
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CustomerOrders;
