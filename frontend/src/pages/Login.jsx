import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../services/axios";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post("/customers/login", {
        username,
        password,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("userType", "customer");
      localStorage.setItem("customerInfo", JSON.stringify(data));

      toast.success("مرحباً بك");
      navigate("/customer");
    } catch (err) {
      toast.error(err.response?.data?.message || "فشل تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  };

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
            تسجيل دخول العميل
          </h2>

          <div className="mb-6">
            <input
              type="text"
              placeholder="اسم المستخدم"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="px-5 py-3 rounded-xl w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-500/30 focus:outline-none transition text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              required
            />
          </div>

          <div className="mb-8 relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-5 py-3 rounded-xl w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-500/30 focus:outline-none transition text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-6 rounded-xl w-full shadow-lg transform transition duration-200"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                جاري الدخول...
              </span>
            ) : (
              "تسجيل الدخول"
            )}
          </motion.button>

          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-cyan-600 dark:text-cyan-400 font-medium hover:underline transition"
            >
              الرجوع إلى الصفحة الرئيسية
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
