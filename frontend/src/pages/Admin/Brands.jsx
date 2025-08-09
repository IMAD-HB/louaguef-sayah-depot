import React, { useEffect, useState } from "react";
import axios from "../../services/axios";
import { toast } from "react-toastify";

const Brands = () => {
  const [brands, setBrands] = useState([]);
  const [name, setName] = useState("");
  const [logo, setLogo] = useState(null);
  const [preview, setPreview] = useState(null);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/brands");
      setBrands(data);
    } catch {
      toast.error("فشل تحميل العلامات التجارية");
    } finally {
      setLoading(false);
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    setLogo(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || (!logo && !editId)) {
      toast.error("الاسم والشعار مطلوبان");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    if (logo) formData.append("logo", logo);

    try {
      if (editId) {
        await axios.put(`/brands/${editId}`, formData);
        toast.success("تم تعديل العلامة");
      } else {
        await axios.post("/brands", formData);
        toast.success("تم إضافة العلامة");
      }
      resetForm();
      fetchBrands();
    } catch (err) {
      toast.error(err.response?.data?.message || "حدث خطأ");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذه العلامة؟")) return;
    try {
      await axios.delete(`/brands/${id}`);
      toast.success("تم حذف العلامة");
      fetchBrands();
    } catch {
      toast.error("فشل الحذف");
    }
  };

  const startEdit = (brand) => {
    setEditId(brand._id);
    setName(brand.name);
    setPreview(brand.logo?.url);
    setLogo(null);
  };

  const resetForm = () => {
    setEditId(null);
    setName("");
    setLogo(null);
    setPreview(null);
  };

  const filtered = brands.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Page Title */}
      <h2 className="text-3xl font-bold text-cyan-700 mb-6 pb-2">
        العلامات التجارية
      </h2>

      {/* Add/Edit Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 rounded-xl shadow"
        encType="multipart/form-data"
      >
        <h3 className="text-lg font-semibold text-cyan-700 mb-2 pb-1">
          {editId ? "تعديل العلامة" : "إضافة علامة جديدة"}
        </h3>

        <input
          type="text"
          placeholder="اسم العلامة"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none"
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleLogoChange}
          className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none"
          {...(editId ? {} : { required: true })}
        />

        {preview && (
          <div className="flex justify-center">
            <img
              src={preview}
              alt="preview"
              className="h-20 object-contain rounded-lg border border-gray-300"
            />
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-lg font-semibold shadow transition"
          >
            {editId ? "تحديث" : "إضافة"}
          </button>
          {editId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-200 hover:bg-gray-300 px-6 py-2 rounded-lg font-semibold shadow transition"
            >
              إلغاء
            </button>
          )}
        </div>
      </form>

      {/* Search Input */}
      <input
        type="text"
        placeholder="بحث..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-4 border rounded-lg p-2 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none"
      />

      {/* Brand Cards */}
      {loading ? (
        <div className="flex justify-center my-10">
          <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((brand) => (
            <div
              key={brand._id}
              className="bg-white shadow rounded-xl p-4 flex justify-between items-center border border-cyan-100 hover:shadow-lg transition"
            >
              <div className="flex items-center gap-4">
                {brand.logo?.url && (
                  <img
                    src={brand.logo.url}
                    alt={brand.name}
                    className="h-12 w-12 object-contain rounded"
                  />
                )}
                <span className="text-gray-700 font-medium">{brand.name}</span>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => startEdit(brand)}
                  className="text-cyan-700 hover:text-cyan-900 font-semibold"
                >
                  تعديل
                </button>
                <button
                  onClick={() => handleDelete(brand._id)}
                  className="text-red-600 hover:underline font-semibold"
                >
                  حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Brands;
