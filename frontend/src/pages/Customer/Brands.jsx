import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../../services/axios";

const CustomerBrands = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const fetchBrands = async () => {
        try {
          setLoading(true);
          const { data } = await axios.get("/brands");
          setBrands(data);
        } catch (err) {
          console.error("فشل تحميل الماركات", err);
        } finally {
          setLoading(false);
        }
      };

      fetchBrands();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div>
      <h2 className="text-3xl font-bold text-cyan-700 text-center mb-8">
        اختر ماركة لعرض المنتجات
      </h2>

      {loading ? (
        <div className="flex justify-center items-center my-16">
          <div className="w-12 h-12 border-4 border-cyan-700 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {brands.map((brand) => (
            <Link
              to={`/customer/${brand._id}/products`}
              key={brand._id}
              className="bg-cyan-50 rounded-lg shadow-md p-5 hover:shadow-xl transition text-center flex flex-col items-center"
            >
              <img
                src={brand.logo?.url}
                alt={brand.name}
                className="h-24 mb-4 object-contain"
              />
              <h3 className="text-lg font-semibold text-cyan-800">
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
