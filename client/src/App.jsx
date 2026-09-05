import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import Layout from "./pages/admin/Layout";
import Dashboard from "./pages/admin/Dashboard";
import AddBlog from "./pages/admin/AddBlog";
import ListBlog from "./pages/admin/ListBlog";
import Comments from "./pages/admin/Comments";
import Users from "./pages/admin/Users";
import Login from "./components/admin/Login";
import Account from "./pages/Account";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import "quill/dist/quill.snow.css";
import { Toaster } from "react-hot-toast";
import { useAppContext } from "./context/AppContext";

const App = () => {
  const { authLoading } = useAppContext();

  if (authLoading) {
    return <div className="min-h-screen bg-blue-50/50" />;
  }

  return (
    <div>
      <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog/:id" element={<Blog />} />
        <Route path="/login" element={<Login />} />
        <Route path="/account" element={<Account />} />

        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <Layout />
            </ProtectedAdminRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="addBlog" element={<AddBlog />} />
          <Route path="listBlog" element={<ListBlog />} />
          <Route
            path="comments"
            element={
              <ProtectedAdminRoute adminOnly>
                <Comments />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="users"
            element={
              <ProtectedAdminRoute adminOnly>
                <Users />
              </ProtectedAdminRoute>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;
