export const logout = () => {
  const userType = localStorage.getItem("userType"); // "admin" or "customer"

  localStorage.removeItem("token");
  localStorage.removeItem("userType");

  // إعادة التوجيه حسب نوع المستخدم
  if (userType === "admin") {
    window.location.href = "/admin/login";
  } else {
    window.location.href = "/login";
  }
};
