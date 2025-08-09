import React, { useEffect, useState, useRef } from "react";
import axios from "../../services/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { generateReceiptPDF } from "../../utils/generateReceipt";

const statusLabels = {
  pending: "قيد الانتظار",
  confirmed: "تم التأكيد",
};

const statusOptions = Object.keys(statusLabels);

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchThrottleRef = useRef(null);

  const throttledFetchOrders = () => {
    if (fetchThrottleRef.current) return;

    fetchThrottleRef.current = setTimeout(async () => {
      fetchThrottleRef.current = null;
      try {
        const { data } = await axios.get("/orders");
        setOrders(data);
        setFiltered(data);
      } catch (err) {
        toast.error("فشل في تحميل الطلبات");
      } finally {
        setLoading(false);
      }
    }, 300);
  };

  useEffect(() => {
    throttledFetchOrders();
  }, []);

  useEffect(() => {
    let result = [...orders];

    if (searchQuery) {
      result = result.filter((order) =>
        order.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter) {
      result = result.filter((order) => order.status === statusFilter);
    }

    result.sort((a, b) => {
      const statusOrder = { pending: 0, confirmed: 1 };
      if (statusOrder[a.status] !== statusOrder[b.status]) {
        return statusOrder[a.status] - statusOrder[b.status];
      }
      return new Date(a.createdAt) - new Date(b.createdAt);
    });

    setFiltered(result);
  }, [searchQuery, statusFilter, orders]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`/orders/${orderId}/status`, { status: newStatus });
      toast.success("تم تحديث الحالة");
      throttledFetchOrders();
    } catch {
      toast.error("فشل تحديث الحالة");
    }
  };

  const handleDownloadReceipt = async (order) => {
    try {
      const { data: fullOrder } = await axios.get(`/orders/${order._id}`);
      const { data: customer } = await axios.get(
        `/customers/${order.userId._id}`
      );

      generateReceiptPDF({
        order: fullOrder,
        customer,
      });
    } catch (err) {
      toast.error("فشل تحميل معلومات الوصل");
    }
  };

  const navigate = useNavigate();

  const handleUpdate = (orderId) => {
    navigate(`/admin/orders/${orderId}/edit`);
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا الطلب؟")) return;
    try {
      await axios.delete(`/orders/${orderId}`);
      toast.success("تم حذف الطلب");
      setOrders((prev) => prev.filter((order) => order._id !== orderId));
    } catch {
      toast.error("فشل حذف الطلب");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h2 className="text-3xl font-extrabold text-cyan-700 mb-6">إدارة الطلبات</h2>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="🔍 ابحث باسم العميل"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border shadow-sm rounded-lg p-3 w-full md:w-1/2
                     focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:border-cyan-500"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border shadow-sm rounded-lg p-3 w-full md:w-1/3
                     focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:border-cyan-500"
        >
          <option value="">كل الحالات</option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {statusLabels[status]}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white shadow-lg rounded-xl p-6 overflow-x-auto">
        {loading ? (
          <div className="flex justify-center items-center py-14">
            <div className="w-12 h-12 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-gray-500 text-center py-12 text-lg">لا توجد طلبات مطابقة.</p>
        ) : (
          <>
            {/* Table for medium and up */}
            <table className="w-full text-sm text-right border-collapse hidden sm:table">
              <thead className="bg-cyan-100 text-cyan-700 font-semibold">
                <tr>
                  <th className="p-4 border border-cyan-300">#</th>
                  <th className="p-4 border border-cyan-300">العميل</th>
                  <th className="p-4 border border-cyan-300">الإجمالي</th>
                  <th className="p-4 border border-cyan-300">الحالة</th>
                  <th className="p-4 border border-cyan-300">التاريخ</th>
                  <th className="p-4 border border-cyan-300">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order, i) => (
                  <tr
                    key={order._id}
                    className="border-b border-cyan-200 hover:bg-cyan-50 transition"
                  >
                    <td className="p-4 border border-cyan-200">{i + 1}</td>
                    <td className="p-4 border border-cyan-200">{order.userId?.name || "—"}</td>
                    <td className="p-4 border border-cyan-200">{order.totalPrice} دج</td>
                    <td className="p-4 border border-cyan-200">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                        className="border rounded-lg p-2 w-full
                                   focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:border-cyan-500"
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {statusLabels[status]}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4 border border-cyan-200">
                      {format(new Date(order.createdAt), "yyyy/MM/dd")}
                    </td>
                    <td className="p-4 border border-cyan-200 text-center space-y-2 flex flex-col items-center justify-center">
                      <button
                        onClick={() => handleDownloadReceipt(order)}
                        className="text-cyan-700 hover:underline"
                      >
                        تحميل الوصل
                      </button>
                      {order.status !== "confirmed" && (
                        <button
                          onClick={() => handleUpdate(order._id)}
                          className="text-green-600 hover:underline"
                        >
                          تحديث
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(order._id)}
                        className="text-red-600 hover:underline"
                      >
                        حذف
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Cards for small screens */}
            <div className="sm:hidden space-y-6">
              {filtered.map((order, i) => (
                <div
                  key={order._id}
                  className="border border-cyan-200 rounded-xl p-5 shadow hover:bg-cyan-50 transition"
                >
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-semibold">الطلب #: </span>
                      {i + 1}
                    </div>
                    <div>
                      <span className="font-semibold">العميل: </span>
                      {order.userId?.name || "—"}
                    </div>
                    <div>
                      <span className="font-semibold">الإجمالي: </span>
                      {order.totalPrice} دج
                    </div>
                    <div>
                      <span className="font-semibold">الحالة: </span>
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                        className="border rounded-lg p-2 w-full mt-1
                                   focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:border-cyan-500"
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {statusLabels[status]}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <span className="font-semibold">التاريخ: </span>
                      {format(new Date(order.createdAt), "yyyy/MM/dd")}
                    </div>
                    <div className="flex gap-6 mt-4">
                      <button
                        onClick={() => handleDownloadReceipt(order)}
                        className="text-cyan-700 hover:underline"
                      >
                        تحميل الوصل
                      </button>
                      {order.status !== "confirmed" && (
                        <button
                          onClick={() => handleUpdate(order._id)}
                          className="text-green-600 hover:underline"
                        >
                          تحديث
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(order._id)}
                        className="text-red-600 hover:underline"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderList;
