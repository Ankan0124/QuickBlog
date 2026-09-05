import React from "react";
import { Outlet } from "react-router-dom";
import { assets } from "../../assets/assets";
import Sidebar from "../../components/admin/Sidebar";
import { useAppContext } from "../../context/AppContext";

const Layout = () => {
  const { navigate, user, logout } = useAppContext();

  return (
    <>
      <div className="flex items-center justify-between py-2 h-[70px] px-4 sm:px-12 border-b border-gray-200">
        <img src={assets.logo} alt="" className="w-32 sm:w-40 cursor-pointer" onClick={() => navigate("/")} />
        <div className="flex items-center gap-4">
          <p className="hidden sm:block text-sm text-gray-500">{user?.name} · {user?.role}</p>
          <button onClick={logout} className="text-sm px-8 py-2 bg-primary text-white rounded-full cursor-pointer">
            Logout
          </button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-70px)]">
        <Sidebar />
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
