import React, { useEffect, useState } from "react";
import axios from "../../services/axios";
import { format } from "date-fns";
import { generateReceiptPDF } from "../../utils/generateReceipt";
import { toast } from "react-toastify";

const statusLabels = {
  pending: "قيد الانتظار",
  confirmed: "تم التأكيد",
  delivered: "تم التوصيل",
  paid: "تم الدفع",
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
        toast.error("❌ فشل تحميل الطلبات");
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
    <div className="p-4">
      <h2 className="text-2xl font-bold text-orange-600 mb-4">طلباتي</h2>

      <div className="bg-white shadow rounded-lg p-4 overflow-x-auto">
        {loading ? (
          <p className="text-gray-500">جاري تحميل الطلبات...</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-500">لا توجد طلبات لعرضها.</p>
        ) : (
          <table className="w-full text-sm text-right border">
            <thead className="bg-gray-100 text-gray-700 font-semibold">
              <tr>
                <th className="p-2 border">#</th>
                <th className="p-2 border">التاريخ</th>
                <th className="p-2 border">الإجمالي</th>
                <th className="p-2 border">الحالة</th>
                <th className="p-2 border">العمليات</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, i) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="p-2 border">{i + 1}</td>
                  <td className="p-2 border">
                    {format(new Date(order.createdAt), "yyyy/MM/dd")}
                  </td>
                  <td className="p-2 border">{order.totalPrice} دج</td>
                  <td className="p-2 border">
                    {statusLabels[order.status] || "—"}
                  </td>
                  <td className="p-2 border text-center">
                    <button
                      onClick={() => handleDownload(order)}
                      className="text-blue-600 hover:underline"
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
