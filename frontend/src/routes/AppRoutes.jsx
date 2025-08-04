import { Routes, Route } from "react-router-dom";

// Layouts
import AdminLayout from "../layouts/AdminLayout";
import CustomerLayout from "../layouts/CustomerLayout";

// صفحات عامة
import Home from "../pages/Home";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import AdminLogin from "../pages/Admin/Login";

// صفحات المشرف
import AdminDashboard from "../pages/Admin/Dashboard";
import Brands from "../pages/Admin/Brands";
import Products from "../pages/Admin/Products";
import Orders from "../pages/Admin/Orders";
import EditOrder from "../pages/Admin/EditOrder";
import Customers from "../pages/Admin/Customers";
import Admins from "../pages/Admin/Admins";
import AdminDebt from "../pages/Admin/Debts";

// صفحات العميل
import CustomerDashboard from "../pages/Customer/Dashboard";
import CustomerOrders from "../pages/Customer/Orders";
import CustomerBrands from "../pages/Customer/Brands";
import CustomerProducts from "../pages/Customer/Products";
import CustomerProfile from "../pages/Customer/Profile";
import CustomerCart from "../pages/Customer/Cart";
import CustomerCheckout from "../pages/Customer/Checkout";
import ProductDetails from "../pages/Customer/ProductDetails";

// الحماية
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* صفحات عامة */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* صفحات المشرف مع الحماية */}
      <Route element={<ProtectedRoute allowedRole="admin" />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="brands" element={<Brands />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders/:id/edit" element={<EditOrder />} />
          <Route path="customers" element={<Customers />} />
          <Route path="admins" element={<Admins />} />
          <Route path="debt" element={<AdminDebt />} />
        </Route>
      </Route>

      {/* صفحات العميل مع الحماية */}
      <Route element={<ProtectedRoute allowedRole="customer" />}>
        <Route path="/customer" element={<CustomerLayout />}>
          <Route index element={<CustomerDashboard />} />
          <Route path="orders" element={<CustomerOrders />} />
          <Route path="brands" element={<CustomerBrands />} />
          <Route path=":id/products" element={<CustomerProducts />} />
          <Route path="product/:id" element={<ProductDetails />} />
          <Route path="cart" element={<CustomerCart />} />
          <Route path="checkout" element={<CustomerCheckout />} />
          <Route path="profile" element={<CustomerProfile />} />
        </Route>
      </Route>

      {/* صفحة الخطأ */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
