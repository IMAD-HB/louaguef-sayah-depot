import React, { useEffect, useState } from "react";
import axios from "../../services/axios";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

const defaultCustomer = {
  name: "",
  username: "",
  phoneNumber: "",
  tier: "retail",
  password: "",
  totalDebt: "",
};

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(defaultCustomer);
  const [editingId, setEditingId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/customers");
      setCustomers(data);
    } catch {
      toast.error("فشل تحميل العملاء");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchCustomers();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await axios.put(`/customers/${editingId}`, form);
        toast.success("تم تحديث العميل");
      } else {
        await axios.post("/customers/register", form);
        toast.success("تم إضافة العميل");
      }

      setForm(defaultCustomer);
      setEditingId(null);
      fetchCustomers();
    } catch (err) {
      toast.error(err.response?.data?.message || "فشل العملية");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من الحذف؟")) return;
    try {
      await axios.delete(`/customers/${id}`);
      toast.success("تم الحذف");
      fetchCustomers();
    } catch {
      toast.error("فشل الحذف");
    }
  };

  const handleEdit = (customer) => {
    setForm({
      name: customer.name,
      username: customer.username,
      phoneNumber: customer.phoneNumber || "",
      tier: customer.tier,
      password: "",
      totalDebt: customer.totalDebt || 0,
    });
    setEditingId(customer._id);
  };

  const [filtered, setFiltered] = useState(customers);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const lower = search.toLowerCase();
      setFiltered(
        customers.filter(
          (c) =>
            c.name.toLowerCase().includes(lower) ||
            c.username.toLowerCase().includes(lower)
        )
      );
    }, 300);

    return () => clearTimeout(timeout);
  }, [search, customers]);

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h2 className="text-3xl font-extrabold text-cyan-700 mb-6">
        إدارة العملاء
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-lg mb-8 space-y-5"
      >
        <h3 className="text-xl font-semibold text-gray-800">
          {editingId ? "تعديل عميل" : "إضافة عميل"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="الاسم"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="border focus:border-cyan-500 focus:ring focus:ring-cyan-200 p-3 rounded-lg shadow-sm"
          />
          <input
            type="text"
            placeholder="اسم المستخدم"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
            className="border focus:border-cyan-500 focus:ring focus:ring-cyan-200 p-3 rounded-lg shadow-sm"
          />
          <input
            type="text"
            placeholder="رقم الهاتف"
            value={form.phoneNumber}
            onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
            className="border focus:border-cyan-500 focus:ring focus:ring-cyan-200 p-3 rounded-lg shadow-sm"
          />
          <select
            value={form.tier}
            onChange={(e) => setForm({ ...form, tier: e.target.value })}
            className="border focus:border-cyan-500 focus:ring focus:ring-cyan-200 p-3 rounded-lg shadow-sm"
          >
            <option value="retail">تجزئة</option>
            <option value="wholesale">جملة</option>
            <option value="superwholesale">جملة كبرى</option>
          </select>
          <input
            type="number"
            placeholder="الدين (مثال: 0)"
            value={form.totalDebt}
            onChange={(e) =>
              setForm({ ...form, totalDebt: parseFloat(e.target.value) || 0 })
            }
            min="0"
            className="border focus:border-cyan-500 focus:ring focus:ring-cyan-200 p-3 rounded-lg shadow-sm"
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="كلمة المرور"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="border focus:border-cyan-500 focus:ring focus:ring-cyan-200 p-3 rounded-lg shadow-sm w-full pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 end-3 flex items-center text-cyan-500 hover:text-cyan-700 transition"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
        <div className="flex gap-3 mt-2">
          <button className="bg-cyan-600 text-white px-6 py-3 rounded-xl shadow hover:bg-cyan-700 transition font-semibold">
            {editingId ? "تحديث" : "إضافة"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setForm(defaultCustomer);
                setEditingId(null);
              }}
              className="bg-gray-400 text-white px-6 py-3 rounded-xl hover:bg-gray-500 transition font-semibold"
            >
              إلغاء
            </button>
          )}
        </div>
      </form>

      <input
        type="text"
        placeholder="بحث بالاسم أو اسم المستخدم..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6 p-3 border rounded-lg w-full focus:border-cyan-500 focus:ring focus:ring-cyan-200 shadow-sm"
      />

      <div className="bg-white shadow-xl rounded-xl p-6">
        {loading ? (
          <div className="flex justify-center my-14">
            <div className="w-12 h-12 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-gray-500 text-center text-lg py-12">
            لا يوجد عملاء
          </p>
        ) : (
          <>
            {/* Desktop Table */}
            <table className="w-full text-sm text-right border-collapse border border-cyan-200 rounded-lg overflow-hidden hidden sm:table">
              <thead className="bg-cyan-100">
                <tr>
                  <th className="p-4 border-b border-cyan-300">الاسم</th>
                  <th className="p-4 border-b border-cyan-300">اسم المستخدم</th>
                  <th className="p-4 border-b border-cyan-300">الهاتف</th>
                  <th className="p-4 border-b border-cyan-300">النوع</th>
                  <th className="p-4 border-b border-cyan-300">الدين</th>
                  <th className="p-4 border-b border-cyan-300">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((cust) => (
                  <tr
                    key={cust._id}
                    className="border-b border-cyan-200 hover:bg-cyan-50 transition"
                  >
                    <td className="p-4">{cust.name}</td>
                    <td className="p-4">{cust.username}</td>
                    <td className="p-4">{cust.phoneNumber || "-"}</td>
                    <td className="p-4">
                      {{
                        retail: "تجزئة",
                        wholesale: "جملة",
                        superwholesale: "جملة كبرى",
                      }[cust.tier] || "غير معروف"}
                    </td>
                    <td className="p-4">{cust.totalDebt.toFixed(2)}</td>
                    <td className="p-4 space-x-6 rtl:space-x-reverse whitespace-nowrap">
                      <button
                        onClick={() => handleEdit(cust)}
                        className="bg-cyan-600 text-white px-3 py-1 rounded-md shadow hover:bg-cyan-700 transition font-semibold"
                      >
                        تعديل
                      </button>
                      <button
                        onClick={() => handleDelete(cust._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded-md shadow hover:bg-red-700 transition font-semibold"
                      >
                        حذف
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile Cards */}
            <div className="space-y-6 sm:hidden">
              {filtered.map((cust) => (
                <div
                  key={cust._id}
                  className="border border-cyan-200 rounded-xl p-5 shadow hover:bg-cyan-50 transition"
                >
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-lg">{cust.name}</span>
                    <div className="space-x-6 rtl:space-x-reverse">
                      <button
                        onClick={() => handleEdit(cust)}
                        className="bg-cyan-600 text-white px-4 py-2 rounded-md shadow hover:bg-cyan-700 transition font-semibold"
                      >
                        تعديل
                      </button>
                      <button
                        onClick={() => handleDelete(cust._id)}
                        className="bg-red-600 text-white px-4 py-2 rounded-md shadow hover:bg-red-700 transition font-semibold"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                  <div className="text-gray-700 space-y-1">
                    <div>
                      <span className="font-semibold">اسم المستخدم: </span>
                      {cust.username}
                    </div>
                    <div>
                      <span className="font-semibold">الهاتف: </span>
                      {cust.phoneNumber || "-"}
                    </div>
                    <div>
                      <span className="font-semibold">النوع: </span>
                      {{
                        retail: "تجزئة",
                        wholesale: "جملة",
                        superwholesale: "جملة كبرى",
                      }[cust.tier] || "غير معروف"}
                    </div>
                    <div>
                      <span className="font-semibold">الدين: </span>
                      {cust.totalDebt.toFixed(2)}
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

export default Customers;
