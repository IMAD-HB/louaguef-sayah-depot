import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "../services/axios";
import Slider from "react-slick";
import { scroller } from "react-scroll";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Home = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Fetch brands
  useEffect(() => {
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
  }, []);

  // Scroll if coming from navbar navigation
  useEffect(() => {
    if (location.state?.section) {
      scroller.scrollTo(location.state.section, {
        smooth: true,
        duration: 600,
        offset: -80,
      });
    }
  }, [location]);

  return (
    <div className="font-sans bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Hero */}
      <section
        id="hero"
        className="min-h-screen w-full flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-transparent to-white dark:from-cyan-500/20 dark:via-transparent dark:to-gray-900 animate-gradient"></div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 max-w-3xl"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-cyan-600 dark:text-cyan-400 mb-4 drop-shadow-md">
            مرحباً بك في مستودعنا
          </h1>
          <p className="mb-6 text-lg sm:text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
            منتجات عالية الجودة وخدمات احترافية لعملائنا.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition"
            >
              تسجيل الدخول
            </Link>
            <Link
              to="/request-access"
              href="#request"
              className="border-2 border-cyan-600 hover:bg-cyan-600 hover:text-white text-cyan-700 dark:text-cyan-400 font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition"
            >
              طلب الوصول
            </Link>
          </div>
        </motion.div>
      </section>

      {/* About */}
      <section
        id="about"
        className="min-h-screen w-full flex flex-col justify-center px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800"
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-cyan-600 dark:text-cyan-400 mb-4">
            من نحن
          </h2>
          <p className="text-gray-700 dark:text-gray-300 max-w-3xl mx-auto text-sm sm:text-base leading-relaxed mb-8">
            نحن مستودع متخصص في توفير منتجات عالية الجودة وخدمات التخزين والنقل
            والتوريد الموثوقة التي تدعم أعمالك.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            { title: "التخزين", desc: "مساحات آمنة لحفظ منتجاتك.", icon: "📦" },
            { title: "النقل", desc: "توصيل سريع وآمن.", icon: "🚚" },
            { title: "التوريد", desc: "إمداد مستمر لعملك.", icon: "🔗" },
          ].map((srv, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-white dark:bg-gray-700 p-6 rounded-2xl shadow-lg hover:shadow-xl text-center transition"
            >
              <div className="text-5xl mb-4">{srv.icon}</div>
              <h3 className="text-xl font-bold text-cyan-600 dark:text-cyan-400 mb-2">
                {srv.title}
              </h3>
              <p className="text-gray-700 dark:text-gray-300">{srv.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Brands */}
      <section
        id="brands"
        className="min-h-screen w-full flex flex-col justify-center px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-cyan-600 dark:text-cyan-400 text-center mb-8">
          العلامات التجارية المتاحة
        </h2>

        {loading ? (
          <div className="flex justify-center items-center my-16">
            <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : brands.length > 0 ? (
          <Slider
            dots={false}
            infinite
            speed={600}
            slidesToShow={3}
            slidesToScroll={1}
            autoplay
            autoplaySpeed={2000}
            arrows={false}
            className=""
            responsive={[
              { breakpoint: 1024, settings: { slidesToShow: 2 } },
              {
                breakpoint: 640,
                settings: { slidesToShow: 1, centerMode: true },
              },
            ]}
          >
            {brands.map((brand) => (
              <motion.div
                key={brand._id}
                whileHover={{ scale: 1.05 }}
                className="p-4"
              >
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition">
                  <div className="h-32 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                    <img
                      src={brand.logo?.url}
                      alt={brand.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <p className="mt-4 text-center text-gray-700 dark:text-gray-300 font-medium">
                    {brand.name}
                  </p>
                </div>
              </motion.div>
            ))}
          </Slider>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center col-span-full">
            لا توجد علامات تجارية حالياً.
          </p>
        )}

        <div className="text-center mt-8">
          <Link
            to="/products"
            className="bg-cyan-600 hover:bg-cyan-700 text-white py-3 px-6 rounded-full shadow-md hover:shadow-lg transition text-sm sm:text-base"
          >
            مشاهدة جميع المنتجات
          </Link>
        </div>
      </section>

      {/* Contact */}
      <section
        id="contact"
        className="min-h-screen w-full flex flex-col justify-center bg-gray-50 dark:bg-gray-800 text-center px-4 sm:px-6 lg:px-8"
      >
        <h2 className="text-3xl font-bold text-cyan-600 dark:text-cyan-400 mb-8 relative inline-block">
          تواصل معنا
          <span className="block w-16 h-1 bg-cyan-500 mx-auto mt-2 rounded-full"></span>
        </h2>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">
          📞 الهاتف: 123-456-789
        </p>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          📍 العنوان: شارع المثال، المدينة
        </p>
      </section>
    </div>
  );
};

export default Home;
