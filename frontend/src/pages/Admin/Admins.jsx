import React, { useEffect, useState } from "react";
import axios from "../../services/axios";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

const Admins = () => {
  const [admins, setAdmins] = useState([]);
  const [search, setSearch] = useState("");
  const [newAdmin, setNewAdmin] = useState({
    username: "",
    name: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", username: "" });
  const [loading, setLoading] = useState(false);

  const fetchAdmins = async () => {
    try {
      const { data } = await axios.get("/admins");
      setAdmins(data);
    } catch (err) {
      toast.error("❌ فشل تحميل المدراء");
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchAdmins();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, []);

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/admins/register", newAdmin);
      toast.success("✅ تم إضافة المشرف");
      setNewAdmin({ username: "", name: "", password: "" });
      fetchAdmins();
    } catch (err) {
      toast.error(err.response?.data?.message || "❌ فشل الإضافة");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("❗ هل أنت متأكد من الحذف؟")) return;

    try {
      await axios.delete(`/admins/${id}`);
      toast.success("✅ تم الحذف");
      fetchAdmins();
    } catch {
      toast.error("❌ فشل الحذف");
    }
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put(`/admins/${id}`, editForm);
      toast.success("✅ تم التحديث");
      setEditingId(null);
      setEditForm({ name: "", username: "" });
      fetchAdmins();
    } catch {
      toast.error("❌ فشل التحديث");
    }
  };

  const filtered = admins.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-orange-600 mb-4">
        إدارة المشرفين
      </h2>

      {/* Add / Edit Form */}
      <form
        onSubmit={handleAddAdmin}
        className="bg-white p-4 rounded shadow mb-6 space-y-4"
      >
        <h3 className="text-lg font-semibold text-gray-700">إضافة مشرف جديد</h3>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            placeholder="الاسم الكامل"
            value={newAdmin.name}
            onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
            required
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="اسم المستخدم"
            value={newAdmin.username}
            onChange={(e) =>
              setNewAdmin({ ...newAdmin, username: e.target.value })
            }
            required
            className="border p-2 rounded"
          />
          <div className="relative col-span-2">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="كلمة المرور"
              value={newAdmin.password}
              onChange={(e) =>
                setNewAdmin({ ...newAdmin, password: e.target.value })
              }
              className="border p-2 rounded w-full pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-2 top-2.5 text-gray-600 hover:text-orange-500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
        >
          {loading ? "جارٍ الإضافة..." : "إضافة"}
        </button>
      </form>

      {/* Search */}
      <input
        type="text"
        placeholder="بحث بالاسم أو اسم المستخدم..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 p-2 border rounded w-full"
      />

      {/* Admins List */}
      <div className="bg-white shadow rounded-lg p-4">
        {filtered.length === 0 ? (
          <p className="text-gray-500">لا يوجد مشرفين</p>
        ) : (
          <>
            {/* Table for larger screens */}
            <table className="w-full text-sm text-right hidden sm:table">
              <thead>
                <tr className="border-b font-bold text-gray-700">
                  <th>الاسم</th>
                  <th>اسم المستخدم</th>
                  <th>إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((admin) => (
                  <tr key={admin._id} className="border-b">
                    <td>
                      {editingId === admin._id ? (
                        <input
                          value={editForm.name}
                          onChange={(e) =>
                            setEditForm({ ...editForm, name: e.target.value })
                          }
                          className="border p-1 rounded w-full"
                        />
                      ) : (
                        admin.name
                      )}
                    </td>
                    <td>
                      {editingId === admin._id ? (
                        <input
                          value={editForm.username}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              username: e.target.value,
                            })
                          }
                          className="border p-1 rounded w-full"
                        />
                      ) : (
                        admin.username
                      )}
                    </td>
                    <td className="space-x-2 rtl:space-x-reverse">
                      {editingId === admin._id ? (
                        <>
                          <button
                            onClick={() => handleUpdate(admin._id)}
                            className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                          >
                            حفظ
                          </button>
                          <button
                            onClick={() => {
                              setEditingId(null);
                              setEditForm({ name: "", username: "" });
                            }}
                            className="bg-gray-400 text-white px-3 py-1 rounded text-sm"
                          >
                            إلغاء
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setEditingId(admin._id);
                              setEditForm({
                                name: admin.name,
                                username: admin.username,
                              });
                            }}
                            className="text-blue-600 hover:underline"
                          >
                            تعديل
                          </button>
                          <button
                            onClick={() => handleDelete(admin._id)}
                            className="text-red-500 hover:underline"
                          >
                            حذف
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Cards for small screens */}
            <div className="space-y-4 sm:hidden">
              {filtered.map((admin) => (
                <div key={admin._id} className="border rounded p-4 shadow">
                  {editingId === admin._id ? (
                    <>
                      <div className="mb-2">
                        <span className="font-semibold">الاسم: </span>
                        <input
                          value={editForm.name}
                          onChange={(e) =>
                            setEditForm({ ...editForm, name: e.target.value })
                          }
                          className="border p-1 rounded w-full mt-1"
                        />
                      </div>
                      <div className="mb-2">
                        <span className="font-semibold">اسم المستخدم: </span>
                        <input
                          value={editForm.username}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              username: e.target.value,
                            })
                          }
                          className="border p-1 rounded w-full mt-1"
                        />
                      </div>
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => handleUpdate(admin._id)}
                          className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                        >
                          حفظ
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(null);
                            setEditForm({ name: "", username: "" });
                          }}
                          className="bg-gray-400 text-white px-3 py-1 rounded text-sm"
                        >
                          إلغاء
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <span className="font-semibold">الاسم: </span>
                        {admin.name}
                      </div>
                      <div>
                        <span className="font-semibold">اسم المستخدم: </span>
                        {admin.username}
                      </div>
                      <div className="flex gap-4 mt-2">
                        <button
                          onClick={() => {
                            setEditingId(admin._id);
                            setEditForm({
                              name: admin.name,
                              username: admin.username,
                            });
                          }}
                          className="text-blue-600 hover:underline"
                        >
                          تعديل
                        </button>
                        <button
                          onClick={() => handleDelete(admin._id)}
                          className="text-red-500 hover:underline"
                        >
                          حذف
                        </button>
                      </div>
                    </>
                  )}
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
