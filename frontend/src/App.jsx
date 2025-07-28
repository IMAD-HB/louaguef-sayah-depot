import React from "react";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import AppRoutes from "./routes/AppRoutes";
import { CartProvider } from "./context/CartContext";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <BrowserRouter>
      <CartProvider>
        <main className="min-h-screen bg-orange-50 p-4 font-[Tajawal]">
          <AppRoutes />
          <ToastContainer position="top-center" autoClose={1500} rtl theme="colored" />
        </main>
      </CartProvider>
    </BrowserRouter>
  );
};

export default App;
