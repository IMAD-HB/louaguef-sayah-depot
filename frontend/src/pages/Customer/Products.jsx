import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../../services/axios";

const CustomerProducts = () => {
  const { id: brandId } = useParams();
  const [products, setProducts] = useState([]);
  const [brandName, setBrandName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true); // 🆕 loading state

  const customer = JSON.parse(localStorage.getItem("customerInfo"));

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const fetchData = async () => {
        try {
          setLoading(true); // 🆕 start loading

          const [productRes, brandRes] = await Promise.all([
            axios.get("/products"),
            axios.get(`/brands/${brandId}`),
          ]);

          const filteredProducts = productRes.data.filter(
            (product) => product.brand?._id === brandId
          );

          setProducts(filteredProducts);
          setBrandName(brandRes.data.name);
        } catch (err) {
          setError("فشل تحميل المنتجات أو الماركة، يرجى المحاولة لاحقاً.");
        } finally {
          setLoading(false); // 🆕 stop loading
        }
      };

      fetchData();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [brandId]);

  return (
    <div>
      <h2 className="text-2xl font-bold text-orange-600 text-center mb-6">
        منتجات ماركة: {brandName}
      </h2>

      {error && (
        <p className="text-center text-red-500 font-semibold mb-4">{error}</p>
      )}

      {/* 🆕 Loading State */}
      {loading ? (
        <p className="text-center text-gray-600 animate-pulse">جارٍ تحميل المنتجات...</p>
      ) : products.length === 0 && !error ? (
        <p className="text-center text-gray-600">
          لا توجد منتجات حالياً لهذه الماركة.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const price =
              product.prices?.[customer?.tier] || product.prices?.retail;

            return (
              <Link
                key={product._id}
                to={`/customer/product/${product._id}`}
                className="bg-white rounded shadow p-4 hover:shadow-lg transition text-center"
              >
                <img
                  src={product.image?.url}
                  alt={product.name}
                  className="h-32 object-contain mx-auto mb-2"
                />
                <h3 className="text-lg font-semibold text-orange-700">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600">{price} د.ج</p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CustomerProducts;
