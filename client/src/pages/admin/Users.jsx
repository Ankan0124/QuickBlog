import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAppContext } from "../../context/AppContext";

const Users = () => {
  const { axios, user: currentUser } = useAppContext();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get("/api/admin/users");
      if (data.success) {
        setUsers(data.users);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const changeRole = async (userId, role) => {
    try {
      setUpdatingId(userId);
      const { data } = await axios.post("/api/admin/users/role", { userId, role });

      if (data.success) {
        setUsers((previous) => previous.map((item) => (item.id === data.user.id ? data.user : item)));
        toast.success("User role updated");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="flex-1 pt-5 px-5 sm:pt-12 sm:pl-16 bg-blue-50/50">
      <h1 className="text-gray-700">Users</h1>
      <p className="text-sm text-gray-500 mt-1 mb-4">
        Promote members to authors when they should be able to publish.
      </p>

      <div className="relative max-w-4xl overflow-x-auto shadow rounded-lg scrollbar-hide bg-white">
        <table className="w-full text-sm text-gray-500">
          <thead className="text-xs text-gray-600 text-left uppercase">
            <tr>
              <th scope="col" className="px-4 py-4">Name</th>
              <th scope="col" className="px-4 py-4 max-sm:hidden">Email</th>
              <th scope="col" className="px-4 py-4">Role</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan="3" className="px-4 py-8 text-center">Loading users...</td></tr>
            ) : users.map((member) => {
              const isCurrentUser = member.id === currentUser?.id;
              return (
                <tr key={member.id} className="border-y border-gray-200">
                  <td className="px-4 py-4">{member.name}</td>
                  <td className="px-4 py-4 max-sm:hidden">{member.email}</td>
                  <td className="px-4 py-4">
                    <select
                      value={member.role}
                      disabled={isCurrentUser || updatingId === member.id}
                      onChange={(event) => changeRole(member.id, event.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 bg-white disabled:opacity-60"
                    >
                      <option value="user">User</option>
                      <option value="author">Author</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
