import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import emailjs from "@emailjs/browser";

const RequestAccess = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    address: "",
    businessType: "",
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs
      .send(
        "service_fhqsine", // e.g. 'service_xxx'
        "template_slyo2do", // e.g. 'template_yyy'
        formData,
        "6NBJp8fnx_H1ttjUb" // user ID from EmailJS
      )
      .then(() => {
        setSubmitted(true);
      })
      .catch((err) => {
        alert("حدث خطأ أثناء إرسال النموذج، يرجى المحاولة مرة أخرى.");
        console.error(err);
      });
  };

  if (submitted) {
    return (
      <div className="min-h-screen font-sans bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 sm:p-10 max-w-md w-full text-center"
        >
          <div className="flex justify-center mb-6">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-cyan-600 dark:text-cyan-400 mb-4">
            تم إرسال طلبك بنجاح
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            سنقوم بمراجعة طلبك والاتصال بك في أقرب وقت ممكن.
          </p>
          <Link
            to="/"
            className="inline-block bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transform hover:scale-[1.02] transition duration-200"
          >
            العودة إلى الصفحة الرئيسية
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 sm:p-10"
        >
          <h2 className="text-2xl sm:text-3xl font-extrabold text-cyan-600 dark:text-cyan-400 mb-8 text-center">
            طلب الوصول
          </h2>

          <div className="space-y-6">
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                الاسم الكامل
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="px-5 py-3 rounded-xl w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-500/30 focus:outline-none transition text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="أدخل اسمك الكامل"
                required
              />
            </div>

            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                رقم الهاتف
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="px-5 py-3 rounded-xl w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-500/30 focus:outline-none transition text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="أدخل رقم هاتفك"
                required
              />
            </div>

            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                العنوان
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className="px-5 py-3 rounded-xl w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-500/30 focus:outline-none transition text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="أدخل عنوانك"
                required
              ></textarea>
            </div>

            <div>
              <label
                htmlFor="businessType"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                نوع النشاط التجاري
              </label>
              <select
                id="businessType"
                name="businessType"
                value={formData.businessType}
                onChange={handleChange}
                className="px-5 py-3 rounded-xl w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-500/30 focus:outline-none transition text-gray-900 dark:text-white"
                required
              >
                <option value="">اختر نوع النشاط</option>
                <option value="سوبر ماركت">سوبر ماركت</option>
                <option value="بائع بالجملة">بائع بالجملة</option>
                <option value="موزع">موزع</option>
                <option value="أخرى">أخرى</option>
              </select>
            </div>
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-8 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-6 rounded-xl w-full shadow-lg transform transition duration-200"
          >
            إرسال الطلب
          </motion.button>

          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-cyan-600 dark:text-cyan-400 font-medium hover:underline transition"
            >
              العودة إلى الصفحة الرئيسية
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default RequestAccess;
