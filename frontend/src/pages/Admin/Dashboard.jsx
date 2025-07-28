import React, { useEffect, useState } from "react";
import axios from "../../services/axios";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [paidAmount, setPaidAmount] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [customerSearch, setCustomerSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customersRes, productsRes] = await Promise.all([
          axios.get("/customers"),
          axios.get("/products"),
        ]);

        setCustomers(customersRes.data || []);
        setProducts(productsRes.data || []);
      } catch (error) {
        toast.error("فشل تحميل البيانات");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const getCustomerTier = () => {
    const customer = customers.find((c) => c._id === selectedCustomer);
    return customer?.tier || "retail";
  };

  const getUnitPrice = (product) => {
    const tier = getCustomerTier();
    return product?.prices?.[tier] ?? product?.prices?.retail ?? 0;
  };

  const handleProductChange = (productId, quantity, customPrice) => {
    const qty = Number(quantity);
    const product = products.find((p) => p._id === productId);
    const defaultUnitPrice = getUnitPrice(product);

    setSelectedProducts((prev) => {
      const existing = prev.find((p) => p.productId === productId);
      if (qty <= 0) return prev.filter((p) => p.productId !== productId);

      const updated = {
        productId,
        quantity: qty,
        unitPrice:
          customPrice !== undefined
            ? Number(customPrice)
            : existing?.customPrice ?? defaultUnitPrice,
        ...(customPrice !== undefined && { customPrice: Number(customPrice) }),
      };

      if (existing) {
        return prev.map((p) => (p.productId === productId ? updated : p));
      }
      return [...prev, updated];
    });
  };

  const getSelectedQuantity = (productId) => {
    const item = selectedProducts.find((p) => p.productId === productId);
    return item?.quantity || "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCustomer || selectedProducts.length === 0) {
      toast.warning("يرجى اختيار العميل وإضافة منتجات");
      return;
    }

    const totalPrice = selectedProducts.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );

    try {
      await axios.post("/orders", {
        userId: selectedCustomer,
        products: selectedProducts,
        totalPrice,
        paidAmount: paidAmount ? Number(paidAmount) : undefined,
      });

      toast.success("✅ تم إنشاء الطلب بنجاح");

      // 🧠 Update product stock locally
      setProducts((prevProducts) =>
        prevProducts.map((product) => {
          const purchased = selectedProducts.find(
            (p) => p.productId === product._id
          );
          if (purchased) {
            return {
              ...product,
              stock: Math.max(product.stock - purchased.quantity, 0),
            };
          }
          return product;
        })
      );

      // 🧼 Reset form
      setSelectedCustomer("");
      setSelectedProducts([]);
      setSearchTerm("");
      setPaidAmount("");
    } catch (err) {
      toast.error("❌ فشل إنشاء الطلب");
    }
  };

  const filteredProducts = products.filter((p) => {
    const brandName = p.brand?.name?.toLowerCase() || "";
    return (
      p.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      brandName.includes(debouncedSearchTerm.toLowerCase())
    );
  });

  const groupedByBrand = filteredProducts.reduce((groups, product) => {
    const brandName = product.brand?.name || "بدون علامة تجارية";
    if (!groups[brandName]) groups[brandName] = [];
    groups[brandName].push(product);
    return groups;
  }, {});

  const totalPrice = selectedProducts.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-orange-600 mb-6">
        إنشاء طلب جديد
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Search */}
        <div className="mb-4">
          <label className="block mb-2">🔍 ابحث عن العميل:</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            placeholder="مثلاً: أحمد أو شركة..."
            value={customerSearch}
            onChange={(e) => setCustomerSearch(e.target.value)}
          />
        </div>

        {/* Customer Select */}
        <div>
          <label className="block mb-2">العميل:</label>
          <select
            value={selectedCustomer}
            onChange={(e) => {
              setSelectedCustomer(e.target.value);
              setSelectedProducts([]);
              setSearchTerm("");
            }}
            className="w-full border rounded p-2"
          >
            <option value="">اختر عميلاً</option>
            {customers
              .filter((c) =>
                c.name.toLowerCase().includes(customerSearch.toLowerCase())
              )
              .map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name} (
                  {{
                    retail: "تجزئة",
                    wholesale: "جملة",
                    superwholesale: "جملة كبرى",
                  }[c.tier] || "غير معروف"}
                  )
                </option>
              ))}
          </select>
        </div>

        {/* Versé Input */}
        <div>
          <label className="block mb-2">💰 المبلغ المدفوع (اختياري):</label>
          <input
            type="number"
            value={paidAmount}
            onChange={(e) => setPaidAmount(e.target.value)}
            className="w-full border rounded p-2"
            placeholder="مثلاً: 1500"
          />
        </div>

        {/* Product Search */}
        <div>
          <label className="block mb-2">🔍 ابحث عن منتج أو علامة تجارية:</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full border rounded p-2 ${
              !selectedCustomer
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : ""
            }`}
            placeholder="مثلاً: Danone أو جبنة..."
            disabled={!selectedCustomer}
          />
        </div>

        {/* Product Selection */}
        {/* Inside Product Selection Section */}
        {searchTerm.trim() && Object.keys(groupedByBrand).length > 0 && (
          <div className="space-y-4">
            {Object.entries(groupedByBrand).map(([brand, brandProducts]) => (
              <div key={brand}>
                <h3 className="text-lg font-semibold text-gray-700 mb-2 border-b pb-1">
                  🏷️ {brand}
                </h3>
                {brandProducts.map((product) => {
                  const quantity = getSelectedQuantity(product._id);
                  return (
                    <div
                      key={product._id}
                      className="flex items-center justify-between mb-2"
                    >
                      <span className="flex-1">
                        {product.name} - {getUnitPrice(product)} دج (المخزون:{" "}
                        {product.stock})
                      </span>

                      {/* Quantity Selector UI */}
                      <div className="flex items-center border rounded px-2 ml-4">
                        <button
                          type="button"
                          onClick={() =>
                            handleProductChange(product._id, quantity - 1)
                          }
                          className="px-2 text-lg font-bold text-orange-600"
                          disabled={quantity <= 0}
                        >
                          −
                        </button>
                        <input
                          type="number"
                          className="w-12 text-center outline-none"
                          value={quantity}
                          readOnly
                        />
                        <button
                          type="button"
                          onClick={() =>
                            handleProductChange(product._id, quantity + 1)
                          }
                          className="px-2 text-lg font-bold text-orange-600"
                          disabled={quantity >= product.stock}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}

        {/* Selected Products Summary */}
        {selectedProducts.length > 0 && (
          <>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-2 border-b pb-1">
                🛒 المنتجات المحددة:
              </h3>
              {selectedProducts.map((item) => {
                const product = products.find((p) => p._id === item.productId);
                if (!product) return null;
                return (
                  <div
                    key={product._id}
                    className="bg-yellow-50 p-3 rounded mb-2 space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <span>
                        {product.name} - السعر:{" "}
                        {item.customPrice !== undefined
                          ? `${item.customPrice} دج (مخصص)`
                          : `${item.unitPrice} دج`}{" "}
                        (المخزون: {product.stock})
                      </span>

                      <div className="flex items-center border rounded px-2 ml-4">
                        <button
                          type="button"
                          onClick={() =>
                            handleProductChange(product._id, item.quantity - 1)
                          }
                          className="px-2 text-lg font-bold text-orange-600"
                          disabled={item.quantity <= 0}
                        >
                          −
                        </button>
                        <input
                          type="number"
                          className="w-12 text-center outline-none"
                          value={item.quantity}
                          readOnly
                        />
                        <button
                          type="button"
                          onClick={() =>
                            handleProductChange(product._id, item.quantity + 1)
                          }
                          className="px-2 text-lg font-bold text-orange-600"
                          disabled={item.quantity >= product.stock}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Custom Price Input */}
                    <input
                      type="number"
                      className="w-full border rounded p-2 mt-1"
                      placeholder={`سعر مخصص (اختياري)`}
                      value={item.customPrice ?? ""}
                      onChange={(e) =>
                        handleProductChange(
                          product._id,
                          item.quantity,
                          e.target.value || undefined
                        )
                      }
                    />
                  </div>
                );
              })}
            </div>

            {/* Total Price */}
            <div className="text-right text-lg font-bold text-gray-700">
              المجموع: {totalPrice} دج
            </div>
          </>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-orange-600 text-white px-6 py-2 rounded"
        >
          إنشاء الطلب
        </button>
      </form>
    </div>
  );
};

export default AdminDashboard;
