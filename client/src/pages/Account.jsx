import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";

const Account = () => {
  const { axios, user, updateUser, logout } = useAppContext();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || "");
  const [isSaving, setIsSaving] = useState(false);

  const saveProfile = async (event) => {
    event.preventDefault();

    try {
      setIsSaving(true);
      const { data } = await axios.put("/api/auth/profile", { name });

      if (data.success) {
        updateUser(data.user);
        toast.success("Profile updated");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return null;

  const canManageContent = ["author", "admin"].includes(user.role);

  return (
    <div className="min-h-screen bg-blue-50/50 text-gray-600">
      <div className="flex justify-between items-center py-5 mx-8 sm:mx-20 xl:mx-32">
        <button onClick={() => navigate("/")} className="text-xl font-semibold text-primary cursor-pointer">
          QuickBlog
        </button>
        <button onClick={logout} className="rounded-full text-sm cursor-pointer bg-primary text-white px-8 py-2.5">
          Logout
        </button>
      </div>

      <main className="max-w-2xl mx-auto px-6 py-12">
        <div className="bg-white rounded-lg shadow p-6 sm:p-10">
          <p className="text-primary font-medium mb-2">Your account</p>
          <h1 className="text-3xl font-semibold text-gray-800">Welcome, {user.name}</h1>
          <p className="mt-2 text-sm text-gray-500">
            You are signed in as a {user.role}.
          </p>

          <form onSubmit={saveProfile} className="mt-8 max-w-md">
            <label className="block text-sm font-medium mb-2">Display name</label>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              minLength="2"
              maxLength="60"
              className="w-full border-b-2 border-gray-300 p-2 outline-none"
            />
            <p className="mt-2 text-sm text-gray-500">{user.email}</p>
            <button
              disabled={isSaving}
              type="submit"
              className="mt-6 rounded bg-primary text-white px-6 py-2.5 text-sm cursor-pointer disabled:cursor-not-allowed"
            >
              {isSaving ? "Saving..." : "Save changes"}
            </button>
          </form>

          <div className="mt-10 pt-6 border-t border-gray-100">
            <h2 className="font-semibold text-gray-800">Publishing access</h2>
            {canManageContent ? (
              <>
                <p className="mt-2 text-sm text-gray-500">
                  Your account can manage blog content.
                </p>
                <button
                  onClick={() => navigate("/admin")}
                  className="mt-4 rounded bg-primary text-white px-6 py-2.5 text-sm cursor-pointer"
                >
                  Open dashboard
                </button>
              </>
            ) : (
              <p className="mt-2 text-sm text-gray-500">
                Your account can comment on posts. An administrator can promote you to author when you are ready to publish.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Account;
