import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../../services/axios";

const CustomerBrands = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true); // 🆕 loading state

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const fetchBrands = async () => {
        try {
          setLoading(true); // 🆕 start loading
          const { data } = await axios.get("/brands");
          setBrands(data);
        } catch (err) {
          console.error("فشل تحميل الماركات", err);
        } finally {
          setLoading(false); // 🆕 stop loading
        }
      };

      fetchBrands();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-orange-600 text-center mb-6">
        اختر ماركة لعرض المنتجات
      </h2>

      {loading ? (
        <p className="text-center text-gray-600 animate-pulse">جارٍ تحميل الماركات...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {brands.map((brand) => (
            <Link
              to={`/customer/${brand._id}/products`}
              key={brand._id}
              className="bg-white rounded shadow p-4 hover:shadow-lg transition text-center"
            >
              <img
                src={brand.logo?.url}
                alt={brand.name}
                className="h-24 mx-auto mb-3 object-contain"
              />
              <h3 className="text-lg font-semibold text-orange-700">
                {brand.name}
              </h3>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerBrands;
