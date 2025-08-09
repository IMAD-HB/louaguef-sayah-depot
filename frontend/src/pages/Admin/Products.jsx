import React, { useEffect, useState, useRef, useMemo } from "react";
import axios from "../../services/axios";
import { toast } from "react-toastify";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: { line1: "", line2: "", line3: "", line4: "", line5: "" },
    brand: "",
    retail: "",
    wholesale: "",
    superwholesale: "",
    stock: "",
    image: null,
  });
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingBrands, setLoadingBrands] = useState(false);
  const [preview, setPreview] = useState(null);

  const fetchThrottleRef = useRef(null);

  const throttledFetchProducts = () => {
    if (fetchThrottleRef.current) return;
    fetchThrottleRef.current = setTimeout(async () => {
      fetchThrottleRef.current = null;
      setLoadingProducts(true);
      try {
        const { data } = await axios.get("/products");
        setProducts(data);
      } catch {
        toast.error("فشل في تحميل المنتجات");
      } finally {
        setLoadingProducts(false);
      }
    }, 300);
  };

  const fetchBrands = async () => {
    setLoadingBrands(true);
    try {
      const { data } = await axios.get("/brands");
      setBrands(Array.isArray(data) ? data : []);
    } catch {
      setBrands([]);
    } finally {
      setLoadingBrands(false);
    }
  };

  useEffect(() => {
    throttledFetchProducts();
    fetchBrands();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name
        .toLowerCase()
        .includes(debouncedSearch.toLowerCase());
      const matchesBrand = selectedBrand ? p.brand._id === selectedBrand : true;
      return matchesSearch && matchesBrand;
    });
  }, [debouncedSearch, selectedBrand, products]);

  const groupedByBrand = useMemo(() => {
    return filteredProducts.reduce((acc, product) => {
      const brandName = product.brand?.name || "بدون ماركة";
      if (!acc[brandName]) acc[brandName] = [];
      acc[brandName].push(product);
      return acc;
    }, {});
  }, [filteredProducts]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
      setPreview(files[0] ? URL.createObjectURL(files[0]) : null);
    } else if (name.startsWith("line")) {
      setFormData({
        ...formData,
        description: { ...formData.description, [name]: value },
      });
    } else if (name === "stock") {
      setFormData({ ...formData, stock: Math.max(0, Number(value)) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    Object.entries(formData.description).forEach(([key, val]) =>
      data.append(`description[${key}]`, val)
    );
    data.append("brand", formData.brand);
    data.append("prices[retail]", formData.retail);
    data.append("prices[wholesale]", formData.wholesale);
    data.append("prices[superwholesale]", formData.superwholesale);
    data.append("stock", formData.stock);
    if (formData.image) data.append("image", formData.image);

    try {
      if (editId) {
        await axios.put(`/products/${editId}`, data);
        toast.success("تم تحديث المنتج بنجاح");
      } else {
        await axios.post("/products", data);
        toast.success("تمت إضافة المنتج بنجاح");
      }
      throttledFetchProducts();
      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.message || "حدث خطأ أثناء الحفظ");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: { line1: "", line2: "", line3: "", line4: "", line5: "" },
      brand: "",
      retail: "",
      wholesale: "",
      superwholesale: "",
      stock: 0,
      image: null,
    });
    setEditId(null);
    setPreview(null);
  };

  const handleEdit = (product) => {
    setEditId(product._id);
    setFormData({
      name: product.name,
      description: {
        line1: product.description?.line1 || "",
        line2: product.description?.line2 || "",
        line3: product.description?.line3 || "",
        line4: product.description?.line4 || "",
        line5: product.description?.line5 || "",
      },
      brand: product.brand._id,
      retail: product.prices.retail,
      wholesale: product.prices.wholesale,
      superwholesale: product.prices.superwholesale,
      stock: product.stock,
      image: null,
    });
    setPreview(product.image?.url || null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("هل أنت متأكد من حذف المنتج؟")) {
      try {
        await axios.delete(`/products/${id}`);
        toast.success("تم حذف المنتج بنجاح");
        throttledFetchProducts();
      } catch {
        toast.error("فشل في حذف المنتج");
      }
    }
  };

  return (
    <div className="p-4 max-w-screen-md mx-auto">
      <h2 className="text-2xl font-bold text-cyan-700 mb-4">إدارة المنتجات</h2>

      <form
        onSubmit={handleSubmit}
        className="grid gap-4 mb-6 bg-white p-4 rounded shadow w-full"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="اسم المنتج"
            required
            className="border p-2 rounded w-full"
          />
          <select
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            required
            className="border p-2 rounded w-full"
            disabled={loadingBrands}
          >
            <option value="">
              {loadingBrands
                ? "جاري تحميل العلامات التجارية..."
                : "اختر العلامة التجارية"}
            </option>
            {brands.map((b) => (
              <option key={b._id} value={b._id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5].map((n) => (
            <input
              key={n}
              name={`line${n}`}
              value={formData.description[`line${n}`]}
              onChange={handleChange}
              placeholder={`الوصف - سطر ${n}`}
              className="border p-2 rounded w-full"
            />
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input
            type="number"
            name="retail"
            value={formData.retail}
            onChange={handleChange}
            placeholder="سعر التجزئة"
            required
            className="border p-2 rounded w-full"
          />
          <input
            type="number"
            name="wholesale"
            value={formData.wholesale}
            onChange={handleChange}
            placeholder="سعر الجملة"
            required
            className="border p-2 rounded w-full"
          />
          <input
            type="number"
            name="superwholesale"
            value={formData.superwholesale}
            onChange={handleChange}
            placeholder="سعر الجملة الكبرى"
            required
            className="border p-2 rounded w-full"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() =>
              setFormData({
                ...formData,
                stock: Math.max(0, Number(formData.stock) - 1),
              })
            }
            className="bg-gray-200 px-3 py-1 rounded text-lg"
          >
            −
          </button>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            placeholder="الكمية في المخزون"
            className="border p-2 rounded w-24 text-center"
          />
          <button
            type="button"
            onClick={() =>
              setFormData({ ...formData, stock: Number(formData.stock) + 1 })
            }
            className="bg-gray-200 px-3 py-1 rounded text-lg"
          >
            +
          </button>
        </div>

        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          className="border p-2 rounded w-full"
          {...(editId ? {} : { required: true })}
        />

        {preview && (
          <div className="flex justify-center mb-4">
            <img
              src={preview}
              alt="preview"
              className="h-32 object-contain rounded-lg border border-gray-300"
            />
          </div>
        )}

        <button
          type="submit"
          className="bg-cyan-700 hover:bg-cyan-800 text-white px-4 py-2 rounded w-full"
        >
          {editId ? "تحديث المنتج" : "إضافة منتج"}
        </button>

        {editId && (
          <button
            type="button"
            onClick={resetForm}
            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded w-full mt-2"
          >
            إلغاء
          </button>
        )}
      </form>

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="ابحث عن منتج بالاسم..."
        className="border p-2 rounded w-full mb-6"
      />

      <select
        value={selectedBrand}
        onChange={(e) => setSelectedBrand(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      >
        <option value="">كل العلامات التجارية</option>
        {brands.map((b) => (
          <option key={b._id} value={b._id}>
            {b.name}
          </option>
        ))}
      </select>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loadingProducts ? (
          <div className="col-span-full flex justify-center my-10">
            <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredProducts.length > 0 ? (
          Object.keys(groupedByBrand).map((brand) => (
            <div key={brand} className="col-span-full">
              <h3 className="text-xl font-bold text-cyan-600 mb-2">{brand}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {groupedByBrand[brand].map((p) => (
                  <div key={p._id} className="bg-white rounded shadow p-4">
                    <img
                      src={p.image.url}
                      alt={p.name}
                      className="w-full h-48 object-cover rounded mb-2"
                    />
                    <h3 className="text-lg font-semibold">{p.name}</h3>
                    {[1, 2, 3, 4, 5].map(
                      (n) =>
                        p.description?.[`line${n}`] && (
                          <p key={n} className="text-sm text-gray-600">
                            {p.description[`line${n}`]}
                          </p>
                        )
                    )}
                    <p className="text-sm">الماركة: {p.brand?.name}</p>
                    <p className="text-sm">سعر التجزئة: {p.prices.retail}</p>
                    <p className="text-sm">سعر الجملة: {p.prices.wholesale}</p>
                    <p className="text-sm">
                      سعر الجملة الكبرى: {p.prices.superwholesale}
                    </p>
                    <p className="text-sm">المخزون: {p.stock}</p>
                    <div className="flex justify-between mt-2">
                      <button
                        onClick={() => handleEdit(p)}
                        className="text-cyan-700 hover:underline"
                      >
                        تعديل
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="text-red-600 hover:underline"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            لا توجد منتجات حالياً
          </p>
        )}
      </div>
    </div>
  );
};

export default Products;
