import React, { useEffect, useState } from "react";
import axios from "../../services/axios";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

const defaultAdmin = {
  name: "",
  username: "",
  password: "",
};

const Admins = () => {
  const [admins, setAdmins] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(defaultAdmin);
  const [editingId, setEditingId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filtered, setFiltered] = useState([]);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/admins");
      setAdmins(data);
    } catch {
      toast.error("فشل تحميل المدراء");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchAdmins();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const lower = search.toLowerCase();
      setFiltered(
        admins.filter(
          (a) =>
            a.name.toLowerCase().includes(lower) ||
            a.username.toLowerCase().includes(lower)
        )
      );
    }, 300);
    return () => clearTimeout(timeout);
  }, [search, admins]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await axios.put(`/admins/${editingId}`, form);
        toast.success("تم تحديث المشرف");
      } else {
        await axios.post("/admins/register", form);
        toast.success("تم إضافة المشرف");
      }
      setForm(defaultAdmin);
      setEditingId(null);
      fetchAdmins();
    } catch (err) {
      toast.error(err.response?.data?.message || "فشل العملية");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من الحذف؟")) return;
    try {
      await axios.delete(`/admins/${id}`);
      toast.success("تم الحذف");
      fetchAdmins();
    } catch {
      toast.error("فشل الحذف");
    }
  };

  const handleEdit = (admin) => {
    setForm({
      name: admin.name,
      username: admin.username,
      password: "",
    });
    setEditingId(admin._id);
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h2 className="text-3xl font-extrabold text-cyan-700 mb-6">إدارة المشرفين</h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-lg mb-8 space-y-5"
      >
        <h3 className="text-xl font-semibold text-gray-800">
          {editingId ? "تعديل مشرف" : "إضافة مشرف"}
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
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="كلمة المرور"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="border focus:border-cyan-500 focus:ring focus:ring-cyan-200 p-3 rounded-lg shadow-sm w-full pr-12"
              required={!editingId}
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
          <button
            type="submit"
            disabled={loading}
            className="bg-cyan-600 text-white px-6 py-3 rounded-xl shadow hover:bg-cyan-700 transition font-semibold"
          >
            {editingId ? "تحديث" : "إضافة"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setForm(defaultAdmin);
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
          <p className="text-gray-500 text-center text-lg py-12">لا يوجد مشرفين</p>
        ) : (
          <>
            {/* Desktop Table */}
            <table className="w-full text-sm text-right border-collapse border border-cyan-200 rounded-lg overflow-hidden hidden sm:table">
              <thead className="bg-cyan-100">
                <tr>
                  <th className="p-4 border-b border-cyan-300">الاسم</th>
                  <th className="p-4 border-b border-cyan-300">اسم المستخدم</th>
                  <th className="p-4 border-b border-cyan-300">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((admin) => (
                  <tr
                    key={admin._id}
                    className="border-b border-cyan-200 hover:bg-cyan-50 transition"
                  >
                    <td className="p-4">{admin.name}</td>
                    <td className="p-4">{admin.username}</td>
                    <td className="p-4 space-x-6 rtl:space-x-reverse whitespace-nowrap">
                      <button
                        onClick={() => handleEdit(admin)}
                        className="bg-cyan-600 text-white px-3 py-1 rounded-md shadow hover:bg-cyan-700 transition font-semibold"
                      >
                        تعديل
                      </button>
                      <button
                        onClick={() => handleDelete(admin._id)}
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
              {filtered.map((admin) => (
                <div
                  key={admin._id}
                  className="border border-cyan-200 rounded-xl p-5 shadow hover:bg-cyan-50 transition"
                >
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-lg">{admin.name}</span>
                    <div className="space-x-6 rtl:space-x-reverse">
                      <button
                        onClick={() => handleEdit(admin)}
                        className="bg-cyan-600 text-white px-4 py-2 rounded-md shadow hover:bg-cyan-700 transition font-semibold"
                      >
                        تعديل
                      </button>
                      <button
                        onClick={() => handleDelete(admin._id)}
                        className="bg-red-600 text-white px-4 py-2 rounded-md shadow hover:bg-red-700 transition font-semibold"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-700">اسم المستخدم: {admin.username}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Admins;
