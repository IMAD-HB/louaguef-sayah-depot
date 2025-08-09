import React from "react";
import { Outlet } from "react-router-dom";

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 text-gray-800">
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default PublicLayout;
