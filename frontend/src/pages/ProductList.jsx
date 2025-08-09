import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "../services/axios";
import { toast } from "react-toastify";

const ProductList = () => {
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState(null);

  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const toggleDescription = (id) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchData = async () => {
      try {
        setLoading(true);
        const brandsResponse = await axios.get("/brands");
        setBrands(brandsResponse.data);

        const productsResponse = await axios.get("/products");
        setProducts(productsResponse.data);
      } catch (err) {
        toast.error("حدث خطأ أثناء جلب البيانات. الرجاء المحاولة لاحقاً.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = selectedBrand
    ? products.filter(
        (product) =>
          product.brand._id === selectedBrand._id ||
          product.brand.toString() === selectedBrand._id.toString()
      )
    : products;

  return (
    <section className="min-h-screen w-full bg-white dark:bg-gray-900 px-4 sm:px-6 lg:px-8 pt-28 pb-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-cyan-600 dark:text-cyan-400 mb-4">
            المنتجات المتوفرة
          </h1>
        </motion.div>

        {/* Brand Filter */}
        <div className="mb-12 overflow-x-auto">
          <div className="flex flex-wrap gap-4 pb-2">
            <button
              onClick={() => setSelectedBrand(null)}
              className={`px-6 py-2 rounded-full whitespace-nowrap ${
                !selectedBrand
                  ? "bg-cyan-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              }`}
            >
              الكل
            </button>
            {brands.map((brand) => (
              <button
                key={brand._id}
                onClick={() => setSelectedBrand(brand)}
                className={`px-6 py-2 rounded-full whitespace-nowrap ${
                  selectedBrand?._id === brand._id
                    ? "bg-cyan-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                }`}
              >
                {brand.name}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {filteredProducts.map((product, index) => {
              const descriptionLines = product.description
                ? Object.values(product.description).filter(Boolean)
                : [];

              const isExpanded = expandedDescriptions[product._id];

              return (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.03 }}
                  className="bg-white dark:bg-gray-800 p-2 rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg mb-1 flex items-center justify-center overflow-hidden">
                    {product.image?.url ? (
                      <img
                        src={product.image.url}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-400 text-xs">
                        لا توجد صورة
                      </span>
                    )}
                  </div>

                  <h2 className="text-xs sm:text-sm font-semibold text-center text-cyan-600 dark:text-cyan-400 line-clamp-2">
                    {product.name}
                  </h2>

                  {descriptionLines.length > 0 && (
                    <div className="mt-2 text-xs text-gray-700 dark:text-gray-300 text-center">
                      {isExpanded ? (
                        <>
                          {descriptionLines.map((line, i) => (
                            <p key={i}>{line}</p>
                          ))}
                          <button
                            onClick={() => toggleDescription(product._id)}
                            className="mt-1 text-cyan-600 dark:text-cyan-400 underline"
                          >
                            إخفاء الوصف
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => toggleDescription(product._id)}
                          className="underline text-cyan-600 dark:text-cyan-400"
                        >
                          عرض الوصف
                        </button>
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              لا توجد منتجات متاحة حالياً
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductList;
