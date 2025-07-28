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

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchBrands();
    }, 300); 

    return () => clearTimeout(timeoutId); 
  }, []);

  const fetchBrands = async () => {
    try {
      const { data } = await axios.get("/brands");
      setBrands(data);
    } catch {
      toast.error("❌ فشل تحميل العلامات التجارية");
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
      toast.error("❌ الاسم والشعار مطلوبان");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    if (logo) formData.append("logo", logo);

    try {
      if (editId) {
        await axios.put(`/brands/${editId}`, formData);
        toast.success("✅ تم تعديل العلامة");
      } else {
        await axios.post("/brands", formData);
        toast.success("✅ تم إضافة العلامة");
      }

      resetForm();
      fetchBrands();
    } catch (err) {
      toast.error(err.response?.data?.message || "❌ حدث خطأ");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("❗ هل أنت متأكد من حذف هذه العلامة؟")) return;
    try {
      await axios.delete(`/brands/${id}`);
      toast.success("✅ تم حذف العلامة");
      fetchBrands();
    } catch {
      toast.error("❌ فشل الحذف");
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
    <div className="p-4">
      <h2 className="text-2xl font-bold text-orange-600 mb-4">
        العلامات التجارية
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow space-y-4 mb-6"
        encType="multipart/form-data"
      >
        <h3 className="text-lg font-semibold">
          {editId ? "تعديل العلامة" : "إضافة علامة جديدة"}
        </h3>

        <input
          type="text"
          placeholder="اسم العلامة"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleLogoChange}
          className="w-full border p-2 rounded"
          {...(editId ? {} : { required: true })}
        />

        {preview && (
          <img
            src={preview}
            alt="preview"
            className="h-20 object-contain mb-2 rounded"
          />
        )}

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
          >
            {editId ? "تحديث" : "إضافة"}
          </button>
          {editId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            >
              إلغاء
            </button>
          )}
        </div>
      </form>

      <input
        type="text"
        placeholder="بحث..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 w-full border p-2 rounded"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((brand) => (
          <div
            key={brand._id}
            className="bg-white shadow rounded p-4 flex justify-between items-center"
          >
            <div className="flex items-center gap-4">
              {brand.logo?.url && (
                <img
                  src={brand.logo.url}
                  alt={brand.name}
                  className="h-12 w-12 object-contain"
                />
              )}
              <span className="font-medium">{brand.name}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => startEdit(brand)}
                className="text-blue-600 hover:underline"
              >
                تعديل
              </button>
              <button
                onClick={() => handleDelete(brand._id)}
                className="text-red-600 hover:underline"
              >
                حذف
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Brands;
