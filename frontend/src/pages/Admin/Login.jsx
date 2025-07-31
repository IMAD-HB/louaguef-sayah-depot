import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../services/axios";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post("/admins/login", {
        username,
        password,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("userType", "admin");
      localStorage.setItem("adminInfo", JSON.stringify(data));

      toast.success("✅ تم تسجيل دخول المشرف");
      navigate("/admin");
    } catch (err) {
      toast.error(err.response?.data?.message || "❌ فشل تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {showWelcome ? (
        <motion.div
          key="welcome"
          className="min-h-screen flex flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.img
            src="/logo.png"
            alt="Logo"
            className="w-32 h-32 mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 120 }}
          />
          <motion.h1
            className="text-2xl font-bold text-orange-600 text-center"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            مرحبا بك في مجمع لواقف سايح
          </motion.h1>
        </motion.div>
      ) : (
        <motion.div
          key="login"
          className="min-h-screen flex items-center justify-center bg-orange-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-sm"
          >
            <h2 className="text-2xl mb-6 text-center text-orange-600 font-bold">
              تسجيل دخول المشرف
            </h2>

            <input
              type="text"
              placeholder="اسم المستخدم"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mb-4 px-4 py-2 border rounded w-full focus:outline-orange-400"
              required
            />

            <div className="relative mb-6">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="px-4 py-2 border rounded w-full focus:outline-orange-400 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-2 flex items-center text-gray-600 hover:text-orange-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded w-full"
            >
              {loading ? "جاري الدخول..." : "تسجيل الدخول"}
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AdminLogin;
