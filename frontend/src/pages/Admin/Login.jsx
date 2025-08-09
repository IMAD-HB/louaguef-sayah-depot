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

      toast.success("تم تسجيل دخول المشرف");
      navigate("/admin");
    } catch (err) {
      toast.error(err.response?.data?.message || "فشل تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {showWelcome ? (
        <motion.div
          key="welcome"
          className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-cyan-50 to-blue-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ scale: 0, rotate: -15 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 150,
              damping: 10,
            }}
            whileHover={{ scale: 1.05 }}
          >
            <motion.img
              src="/logo.png"
              alt="Logo"
              className="w-40 mb-6 drop-shadow-lg"
              whileTap={{ scale: 0.95 }}
            />
          </motion.div>

          <motion.h1
            className="text-3xl md:text-4xl font-bold bg-cyan-700 bg-clip-text text-transparent text-center mb-2"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              delay: 0.3,
              type: "spring",
              stiffness: 100,
            }}
          >
            مرحبا بك
          </motion.h1>

          <motion.p
            className="text-cyan-700 text-center max-w-md"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            نرحب بك في موقعنا
          </motion.p>
        </motion.div>
      ) : (
        <motion.div
          key="login"
          className="min-h-screen flex items-center justify-center bg-cyan-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-sm"
          >
            <h2 className="text-2xl mb-6 text-center text-cyan-700 font-bold">
              تسجيل دخول المشرف
            </h2>

            <input
              type="text"
              placeholder="اسم المستخدم"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mb-4 px-4 py-2 border rounded w-full focus:outline-cyan-500"
              required
            />

            <div className="relative mb-6">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="px-4 py-2 border rounded w-full focus:outline-cyan-500 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-2 flex items-center text-gray-600 hover:text-cyan-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-cyan-700 hover:bg-cyan-800 text-white font-bold py-2 px-4 rounded w-full transition"
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
