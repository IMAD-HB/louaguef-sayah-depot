import React, { useEffect, useState, useRef } from "react";
import axios from "../../services/axios";
import { toast } from "react-toastify";
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
        toast.error("❌ فشل في تحميل الطلبات");
      } finally {
        setLoading(false);
      }
    }, 300);
  };

  useEffect(() => {
    throttledFetchOrders();
  }, []);

  useEffect(() => {
    let result = orders;

    if (searchQuery) {
      result = result.filter((order) =>
        order.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter) {
      result = result.filter((order) => order.status === statusFilter);
    }

    setFiltered(result);
  }, [searchQuery, statusFilter, orders]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`/orders/${orderId}`, { status: newStatus });
      toast.success("✅ تم تحديث الحالة");
      throttledFetchOrders();
    } catch {
      toast.error("❌ فشل تحديث الحالة");
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
      toast.error("❌ فشل تحميل معلومات الوصل");
    }
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا الطلب؟")) return;
    try {
      await axios.delete(`/orders/${orderId}`);
      toast.success("✅ تم حذف الطلب");
      setOrders((prev) => prev.filter((order) => order._id !== orderId));
    } catch {
      toast.error("❌ فشل حذف الطلب");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-orange-600 mb-6">إدارة الطلبات</h2>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="🔍 ابحث باسم العميل"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded w-full md:w-1/2"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border p-2 rounded w-full md:w-1/3"
        >
          <option value="">كل الحالات</option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {statusLabels[status]}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white shadow rounded-lg p-4 overflow-x-auto">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-gray-500">لا توجد طلبات مطابقة.</p>
        ) : (
          <>
            {/* Table for medium and up */}
            <table className="w-full text-sm text-right border hidden sm:table">
              <thead className="bg-gray-100 text-gray-700 font-semibold">
                <tr>
                  <th className="p-2 border">#</th>
                  <th className="p-2 border">العميل</th>
                  <th className="p-2 border">الإجمالي</th>
                  <th className="p-2 border">الحالة</th>
                  <th className="p-2 border">التاريخ</th>
                  <th className="p-2 border">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order, i) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="p-2 border">{i + 1}</td>
                    <td className="p-2 border">{order.userId?.name || "—"}</td>
                    <td className="p-2 border">{order.totalPrice} دج</td>
                    <td className="p-2 border">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                        className="border p-1 rounded"
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {statusLabels[status]}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-2 border">
                      {format(new Date(order.createdAt), "yyyy/MM/dd")}
                    </td>
                    <td className="p-2 border text-center flex flex-col gap-1">
                      <button
                        onClick={() => handleDownloadReceipt(order)}
                        className="text-blue-600 hover:underline"
                      >
                        تحميل الوصل
                      </button>
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
            <div className="sm:hidden space-y-4">
              {filtered.map((order, i) => (
                <div
                  key={order._id}
                  className="border rounded p-4 shadow text-sm space-y-2"
                >
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
                      className="border p-1 rounded mt-1 w-full"
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
                  <div className="flex gap-4 mt-2">
                    <button
                      onClick={() => handleDownloadReceipt(order)}
                      className="text-blue-600 hover:underline"
                    >
                      تحميل الوصل
                    </button>
                    <button
                      onClick={() => handleDelete(order._id)}
                      className="text-red-600 hover:underline"
                    >
                      حذف
                    </button>
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
