import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../services/axios";
import { toast } from "react-toastify";

const EditOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [customerTier, setCustomerTier] = useState("retail");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [paidAmount, setPaidAmount] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data: order } = await axios.get(`/orders/${id}`);
        setSelectedCustomer(order.userId._id);
        setCustomerTier(order.userId?.tier || "retail");
        setPaidAmount(order.paidAmount);

        const productIds = order.products.map((item) => item.productId._id);
        const { data: selectedProds } = await axios.get("/products", {
          params: { ids: productIds },
        });

        setProducts(selectedProds);

        const mapped = order.products.map((item) => ({
          productId: item.productId._id,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          customPrice: item.unitPrice,
        }));
        setSelectedProducts(mapped);
      } catch (err) {
        toast.error("فشل تحميل بيانات الطلب");
        navigate("/admin/orders");
      }
    };

    fetchOrder();
  }, [id, navigate]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!searchTerm.trim()) return;

      try {
        const { data } = await axios.get("/products", {
          params: { q: searchTerm },
        });

        const existingIds = new Set(products.map((p) => p._id));
        const combined = [...products];
        data.forEach((p) => {
          if (!existingIds.has(p._id)) combined.push(p);
        });

        setProducts(combined);
      } catch {
        toast.error("فشل البحث عن المنتجات");
      }
    };

    const delay = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(delay);
  }, [searchTerm]);

  const getUnitPrice = (product) =>
    product?.prices?.[customerTier] ?? product?.prices?.retail ?? 0;

  const handleProductChange = (productId, quantity, customPriceInput) => {
    const qty = Number(quantity);
    const product = products.find((p) => p._id === productId);
    const defaultUnitPrice = getUnitPrice(product);

    setSelectedProducts((prev) => {
      const existing = prev.find((p) => p.productId === productId);
      if (qty <= 0) return prev.filter((p) => p.productId !== productId);

      let customPrice = existing?.customPrice;
      if (customPriceInput !== undefined) {
        const inputValue = Number(customPriceInput);
        customPrice = inputValue > 0 ? inputValue : undefined;
      }

      const unitPrice =
        customPrice !== undefined ? customPrice : defaultUnitPrice;

      const updated = {
        productId,
        quantity: qty,
        unitPrice,
        customPrice,
      };

      if (existing) {
        return prev.map((p) => (p.productId === productId ? updated : p));
      }

      return [...prev, updated];
    });
  };

  const getSelectedQuantity = (productId) =>
    selectedProducts.find((p) => p.productId === productId)?.quantity || 0;

  const totalPrice = selectedProducts.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCustomer || selectedProducts.length === 0) {
      toast.warning("يرجى اختيار عميل وإضافة منتجات");
      return;
    }

    try {
      await axios.put(`/orders/${id}`, {
        userId: selectedCustomer,
        products: selectedProducts.map((p) => ({
          productId: p.productId,
          quantity: p.quantity,
          unitPrice: p.unitPrice,
        })),
        paidAmount: paidAmount ? Number(paidAmount) : 0,
      });

      toast.success("تم تحديث الطلب بنجاح");
      navigate("/admin/orders");
    } catch (err) {
      toast.error("فشل تحديث الطلب");
    }
  };

  const filteredProducts = searchTerm.trim()
    ? products.filter((p) => {
        const brand = p.brand?.name?.toLowerCase() || "";
        const name = p.name?.toLowerCase() || "";
        return (
          name.includes(searchTerm.toLowerCase()) ||
          brand.includes(searchTerm.toLowerCase())
        );
      })
    : products.filter((p) =>
        selectedProducts.some((sp) => sp.productId === p._id)
      );

  const groupedByBrand = filteredProducts.reduce((groups, product) => {
    const brandName = product.brand?.name || "بدون علامة تجارية";
    if (!groups[brandName]) groups[brandName] = [];
    groups[brandName].push(product);
    return groups;
  }, {});

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-cyan-700 mb-6">تعديل الطلب</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2 text-cyan-800 font-semibold">
            💰 المبلغ المدفوع:
          </label>
          <input
            type="number"
            value={paidAmount}
            onChange={(e) => setPaidAmount(e.target.value)}
            className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="مثلاً: 2000"
          />
        </div>

        <div>
          <label className="block mb-2 text-cyan-800 font-semibold">
            🔍 ابحث عن منتج أو علامة تجارية:
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="مثلاً: المرجان..."
          />
        </div>

        {Object.keys(groupedByBrand).length > 0 && (
          <div className="space-y-4">
            {Object.entries(groupedByBrand).map(([brand, brandProducts]) => (
              <div key={brand}>
                <h3 className="text-lg font-semibold text-cyan-700 mb-2 border-b pb-1">
                  🏷️ {brand}
                </h3>
                {brandProducts.map((product) => {
                  const quantity = getSelectedQuantity(product._id);
                  const currentCustomPrice =
                    selectedProducts.find((p) => p.productId === product._id)
                      ?.customPrice ?? "";

                  return (
                    <div
                      key={product._id}
                      className="flex items-center justify-between mb-2"
                    >
                      <span className="flex-1 text-gray-800">
                        {product.name} - {getUnitPrice(product)} دج (المخزون:{" "}
                        {product.stock})
                      </span>
                      <div className="flex items-center border rounded px-2 ml-4">
                        <button
                          type="button"
                          onClick={() =>
                            handleProductChange(product._id, quantity - 1)
                          }
                          className="px-2 text-lg font-bold text-cyan-700"
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
                          className="px-2 text-lg font-bold text-cyan-700"
                          disabled={quantity >= product.stock}
                        >
                          +
                        </button>
                      </div>
                      <input
                        type="number"
                        className={`w-24 border rounded p-2 ml-4 focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                          currentCustomPrice === 0 ? "border-red-500" : ""
                        }`}
                        placeholder={`سعر مخصص (اختياري)`}
                        value={currentCustomPrice}
                        onChange={(e) =>
                          handleProductChange(
                            product._id,
                            quantity,
                            e.target.value || undefined
                          )
                        }
                      />
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}

        {selectedProducts.length > 0 && (
          <div className="mt-8 border-t border-cyan-200 pt-4 space-y-3">
            <h3 className="text-xl font-semibold text-cyan-800 mb-2">
              🛒 المنتجات المحددة:
            </h3>
            {selectedProducts.map((item) => {
              const product = products.find((p) => p._id === item.productId);
              if (!product) return null;

              return (
                <div
                  key={item.productId}
                  className="bg-cyan-50 p-3 rounded shadow-sm text-sm flex justify-between items-center"
                >
                  <span>
                    {product.name} - الكمية: {item.quantity} - السعر:{" "}
                    {item.customPrice !== undefined
                      ? `${item.customPrice} دج (مخصص)`
                      : `${item.unitPrice} دج`}{" "}
                    - الإجمالي: {item.quantity * item.unitPrice} دج
                  </span>
                  <span className="text-gray-500 text-xs">
                    (المخزون: {product.stock})
                  </span>
                </div>
              );
            })}

            <div className="text-right text-lg font-bold text-cyan-700">
              💵 المجموع الكلي: {totalPrice} دج
            </div>
          </div>
        )}

        <button
          type="submit"
          className="bg-cyan-700 text-white px-6 py-2 rounded shadow hover:bg-cyan-800 transition"
        >
          تحديث الطلب
        </button>
      </form>
    </div>
  );
};

export default EditOrder;
