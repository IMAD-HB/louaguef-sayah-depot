import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // ⬅️ added Link
import axios from "../services/axios";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

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

      toast.success("✅ مرحباً بك");
      navigate("/customer");
    } catch (err) {
      toast.error(err.response?.data?.message || "❌ فشل تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-sm"
      >
        <h2 className="text-2xl mb-6 text-center text-orange-600 font-bold">
          تسجيل دخول العميل
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

        {/* 🆕 Go to Home Page button */}
        <Link
          to="/"
          className="block text-center text-orange-500 font-semibold mt-4 hover:underline"
        >
          الرجوع إلى الصفحة الرئيسية
        </Link>
      </form>
    </div>
  );
};

export default Login;
