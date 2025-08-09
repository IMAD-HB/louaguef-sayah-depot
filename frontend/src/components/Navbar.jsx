import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Sun, Moon } from "lucide-react";
import logo from "../assets/logo.png";
import { scroller } from "react-scroll";

const navLinks = [
  { to: "hero", label: "الرئيسية" },
  { to: "about", label: "من نحن" },
  { to: "brands", label: "المنتجات" },
  { to: "contact", label: "تواصل معنا" },
];

// Avoid theme flicker: set theme before render
if (
  localStorage.getItem("theme") === "dark" ||
  (!localStorage.getItem("theme") &&
    window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
  document.documentElement.classList.add("dark");
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(
    document.documentElement.classList.contains("dark")
  );

  const location = useLocation();
  const navigate = useNavigate();

  // Change background on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Toggle dark mode
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Auto-close mobile menu on resize
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setIsOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Scroll on nav click
  const handleNavClick = (section) => {
    if (location.pathname === "/") {
      scroller.scrollTo(section, { smooth: true, duration: 600, offset: -80 });
    } else {
      navigate("/", { state: { section } });
    }
    setIsOpen(false);
  };

  const NavButton = ({ link }) => (
    <button
      type="button"
      onClick={() => handleNavClick(link.to)}
      className="relative cursor-pointer text-gray-700 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors duration-200 px-3 py-2"
    >
      {link.label}
    </button>
  );

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isOpen
          ? "bg-white dark:bg-gray-900 shadow-lg"
          : scrolled
          ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center flex-row-reverse">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="w-20 h-auto" />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4">
          {navLinks.map((link) => (
            <NavButton key={link.to} link={link} />
          ))}

          <Link
            to="/request-access"
            className="border-2 border-cyan-600 dark:border-cyan-400 hover:bg-cyan-600 dark:hover:bg-cyan-400 hover:text-white text-cyan-700 dark:text-cyan-300 font-bold px-6 py-2 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            طلب الوصول
          </Link>

          <Link
            to="/login"
            className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold px-6 py-2 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            تسجيل الدخول
          </Link>

          {/* Desktop Theme Switch */}
          <div className="flex items-center">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
              />
              <div className="w-14 h-8 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:bg-cyan-600 transition-colors duration-300"></div>
              <div className="absolute left-1 top-1 bg-white dark:bg-gray-300 border border-gray-300 dark:border-gray-500 rounded-full h-6 w-6 peer-checked:translate-x-6 transition-transform duration-300 flex items-center justify-center">
                {darkMode ? (
                  <Moon size={16} className="text-gray-700" />
                ) : (
                  <Sun size={16} className="text-yellow-400" />
                )}
              </div>
            </label>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button
          type="button"
          className="md:hidden text-gray-800 dark:text-gray-200 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 px-6 py-4 flex flex-col gap-4 shadow-lg">
          {navLinks.map((link) => (
            <NavButton key={link.to} link={link} />
          ))}
          <div className="flex flex-col gap-3 mt-2">
            <Link
              to="/request-access"
              className="border-2 border-cyan-600 hover:bg-cyan-600 hover:text-white text-cyan-700 dark:text-cyan-400 dark:border-cyan-400 dark:hover:bg-cyan-400 font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition"
            >
              طلب الوصول
            </Link>
            <Link
              to="/login"
              className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition"
            >
              تسجيل الدخول
            </Link>

            {/* Mobile Theme Switch */}
            <div className="flex items-center gap-3">
              <span className="text-gray-700 dark:text-gray-300">
                {darkMode ? "الوضع المظلم" : "الوضع المضيء"}
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={darkMode}
                  onChange={() => setDarkMode(!darkMode)}
                />
                <div className="w-14 h-8 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:bg-cyan-600 transition-colors duration-300"></div>
                <div className="absolute left-1 top-1 bg-white dark:bg-gray-300 border border-gray-300 dark:border-gray-500 rounded-full h-6 w-6 peer-checked:translate-x-6 transition-transform duration-300 flex items-center justify-center">
                  {darkMode ? (
                    <Moon size={16} className="text-gray-700" />
                  ) : (
                    <Sun size={16} className="text-yellow-400" />
                  )}
                </div>
              </label>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
