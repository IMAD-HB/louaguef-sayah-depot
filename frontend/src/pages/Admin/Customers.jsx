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
};

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(defaultCustomer);
  const [editingId, setEditingId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const fetchCustomers = async () => {
    try {
      const { data } = await axios.get("/customers");
      setCustomers(data);
    } catch {
      toast.error("❌ فشل تحميل العملاء");
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
        toast.success("✅ تم تحديث العميل");
      } else {
        await axios.post("/customers/register", form);
        toast.success("✅ تم إضافة العميل");
      }

      setForm(defaultCustomer);
      setEditingId(null);
      fetchCustomers();
    } catch (err) {
      toast.error(err.response?.data?.message || "❌ فشل العملية");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("❗ هل أنت متأكد من الحذف؟")) return;
    try {
      await axios.delete(`/customers/${id}`);
      toast.success("✅ تم الحذف");
      fetchCustomers();
    } catch {
      toast.error("❌ فشل الحذف");
    }
  };

  const handleEdit = (customer) => {
    setForm({
      name: customer.name,
      username: customer.username,
      phoneNumber: customer.phoneNumber || "",
      tier: customer.tier,
      password: "",
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
    <div className="p-4">
      <h2 className="text-2xl font-bold text-orange-600 mb-4">إدارة العملاء</h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow mb-6 space-y-4"
      >
        <h3 className="text-lg font-semibold text-gray-700">
          {editingId ? "تعديل عميل" : "إضافة عميل"}
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            placeholder="الاسم"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="اسم المستخدم"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="رقم الهاتف"
            value={form.phoneNumber}
            onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
            className="border p-2 rounded"
          />
          <select
            value={form.tier}
            onChange={(e) => setForm({ ...form, tier: e.target.value })}
            className="border p-2 rounded"
          >
            <option value="retail">تجزئة</option>
            <option value="wholesale">جملة</option>
            <option value="superwholesale">جملة كبرى</option>
          </select>
          <div className="relative col-span-2">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="كلمة المرور"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="border p-2 rounded w-full pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 end-2 flex items-center text-gray-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
            {editingId ? "تحديث" : "إضافة"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setForm(defaultCustomer);
                setEditingId(null);
              }}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
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
        className="mb-4 p-2 border rounded w-full"
      />

      <div className="bg-white shadow rounded-lg p-4">
        {filtered.length === 0 ? (
          <p className="text-gray-500">لا يوجد عملاء</p>
        ) : (
          <table className="w-full text-sm text-right hidden sm:table">
            <thead>
              <tr className="border-b font-bold text-gray-700">
                <th>الاسم</th>
                <th>اسم المستخدم</th>
                <th>الهاتف</th>
                <th>النوع</th>
                <th>الدين</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((cust) => (
                <tr key={cust._id} className="border-b">
                  <td>{cust.name}</td>
                  <td>{cust.username}</td>
                  <td>{cust.phoneNumber || "-"}</td>
                  <td>
                    {{
                      retail: "تجزئة",
                      wholesale: "جملة",
                      superwholesale: "جملة كبرى",
                    }[cust.tier] || "غير معروف"}
                  </td>
                  <td>{cust.totalDebt.toFixed(2)}</td>
                  <td className="space-x-2 rtl:space-x-reverse">
                    <button
                      onClick={() => handleEdit(cust)}
                      className="text-blue-600 hover:underline"
                    >
                      تعديل
                    </button>
                    <button
                      onClick={() => handleDelete(cust._id)}
                      className="text-red-500 hover:underline"
                    >
                      حذف
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {/* Card layout for small screens */}
        <div className="space-y-4 sm:hidden">
          {filtered.map((cust) => (
            <div key={cust._id} className="border rounded p-4 shadow">
              <div>
                <span className="font-semibold">الاسم: </span>
                {cust.name}
              </div>
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
              <div className="flex gap-4 mt-2">
                <button
                  onClick={() => handleEdit(cust)}
                  className="text-blue-600 hover:underline"
                >
                  تعديل
                </button>
                <button
                  onClick={() => handleDelete(cust._id)}
                  className="text-red-500 hover:underline"
                >
                  حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Customers;
