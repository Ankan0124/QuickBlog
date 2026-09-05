import React from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";

const Sidebar = () => {
  const { user } = useAppContext();

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-64 cursor-pointer ${isActive && "bg-primary/10 border-r-4 border-primary"}`;

  return (
    <div className="flex flex-col border-r border-gray-200 min-h-full pt-6">
      <NavLink end to="/admin" className={linkClass}>
        <img src={assets.home_icon} alt="" className="min-w-4 w-5" />
        <p className="hidden md:inline-block">Dashboard</p>
      </NavLink>

      <NavLink to="/admin/addBlog" className={linkClass}>
        <img src={assets.add_icon} alt="" className="min-w-4 w-5" />
        <p className="hidden md:inline-block">Add blogs</p>
      </NavLink>

      <NavLink to="/admin/listBlog" className={linkClass}>
        <img src={assets.list_icon} alt="" className="min-w-4 w-5" />
        <p className="hidden md:inline-block">Blog lists</p>
      </NavLink>

      {user?.role === "admin" && (
        <>
          <NavLink to="/admin/comments" className={linkClass}>
            <img src={assets.comment_icon} alt="" className="min-w-4 w-5" />
            <p className="hidden md:inline-block">Comments</p>
          </NavLink>

          <NavLink to="/admin/users" className={linkClass}>
            <img src={assets.user_icon} alt="" className="min-w-4 w-5" />
            <p className="hidden md:inline-block">Users</p>
          </NavLink>
        </>
      )}
    </div>
  );
};
export default Sidebar;
