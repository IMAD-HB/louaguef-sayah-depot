import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../../services/axios";

const CustomerProducts = () => {
  const { id: brandId } = useParams();
  const [products, setProducts] = useState([]);
  const [brandName, setBrandName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const customer = JSON.parse(localStorage.getItem("customerInfo"));

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const fetchData = async () => {
        try {
          setLoading(true);

          const [productRes, brandRes] = await Promise.all([
            axios.get("/products"),
            axios.get(`/brands/${brandId}`),
          ]);

          const filteredProducts = productRes.data.filter(
            (product) => product.brand?._id === brandId
          );

          setProducts(filteredProducts);
          setBrandName(brandRes.data.name);
          setError("");
        } catch (err) {
          setError("فشل تحميل المنتجات أو الماركة، يرجى المحاولة لاحقاً.");
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [brandId]);

  return (
    <div>
      <h2 className="text-3xl font-bold text-cyan-700 text-center mb-8">
        منتجات ماركة: {brandName}
      </h2>

      {error && (
        <p className="text-center text-red-500 font-semibold mb-6">{error}</p>
      )}

      {loading ? (
        <div className="flex justify-center items-center my-16">
          <div className="w-12 h-12 border-4 border-cyan-700 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : products.length === 0 && !error ? (
        <p className="text-center text-cyan-700 text-lg">
          لا توجد منتجات حالياً لهذه الماركة.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => {
            const price =
              product.prices?.[customer?.tier] || product.prices?.retail;

            return (
              <Link
                key={product._id}
                to={`/customer/product/${product._id}`}
                className="bg-cyan-50 rounded-lg shadow-md p-5 hover:shadow-xl transition text-center flex flex-col items-center"
              >
                <img
                  src={product.image?.url}
                  alt={product.name}
                  className="h-32 object-contain mx-auto mb-4"
                />
                <h3 className="text-lg font-semibold text-cyan-800 mb-1">
                  {product.name}
                </h3>
                <p className="text-cyan-700 font-semibold">{price} د.ج</p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CustomerProducts;
