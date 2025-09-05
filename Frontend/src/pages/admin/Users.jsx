import { useEffect, useState } from "react";
import api from "../../api/admin/axios";
import { toast } from "react-toastify";
import useAuthGuard from "../../components/admin/auth/useAuthGuard";
import axios from 'axios';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [newUser, setNewUser] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [loadComponent, setLoadComponent] = useState(false);
  
  useAuthGuard();
  
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await api.get("users/");
        setUsers(res.data);
      } catch(err) {
        const status = err?.response?.status;
        if (status === 401) {
        toast.error('Log in required to access this content.');
        return; 
        }
        toast.error("Failed to load users.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [loadComponent]);

  const handleDelete = async (id, isStaff) => {
    if (isStaff) {
      toast.error("Cannot delete admin user.");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await api.delete(`users/${id}/`);
      toast.success("User deleted");
      setUsers(users.filter((u) => u.id !== id));
    } catch {
      toast.error("Failed to delete user.");
    }
  };

  const handleAddUser = async () => {
    if (!newUser.username || !newUser.email || !newUser.password) {
      toast.error("All fields are required");
      return;
    }
    setSubmitting(true);
    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}api/auth/register/`, newUser);
      toast.success("User added");
      setNewUser({ username: "", email: "", password: "" });
      setUsers((prev) => [...prev, newUser]);
      setLoadComponent(!loadComponent);
    }catch (err) {
      const errorDetails = err.response?.data?.details;
      if (errorDetails) {
      Object.keys(errorDetails).forEach((field) => {
      const messages = errorDetails[field];
      messages.forEach((message) => {
        toast.error(`${message}`);});
      });
      } 
      else {
      toast.error('Failed to add user.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="px-2 py-2 lg:px-80">
      <h2 className="text-2xl font-bold mb-4">Users</h2>

      <div className="mb-4 flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder="Username"
          value={newUser.username}
          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
          className="border px-2 py-1 rounded w-full sm:flex-1"
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          className="border px-2 py-1 rounded w-full sm:flex-1"
        />
        <input
          type="password"
          placeholder="Password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          className="border px-2 py-1 rounded w-full sm:flex-1"
        />
        <button
          onClick={handleAddUser}
          disabled={submitting}
          className={`${
            submitting ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
          } text-white px-4 py-1 rounded`}
        >
          {submitting ? "Adding..." : "Add User"}
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by username or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-2 py-1 rounded w-full sm:w-1/3"
        />
      </div>

      {loading ? (
        <p className="text-gray-500">Loading users...</p>
      ) : filteredUsers.length === 0 ? (
        <p className="text-gray-500">No users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border min-w-[500px]">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-1">ID</th>
                <th className="border px-2 py-1">Username</th>
                <th className="border px-2 py-1">Email</th>
                <th className="border px-2 py-1">Admin</th>
                <th className="border px-2 py-1">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="border px-2 py-1">{u.id}</td>
                  <td className="border px-2 py-1">{u.username}</td>
                  <td className="border px-2 py-1">{u.email}</td>
                  <td className="border px-2 py-1">{u.is_staff ? "Yes" : "No"}</td>
                  <td className="border px-2 py-1">
                    {u.is_staff ? (
                      <span className="text-gray-500 italic">Restricted</span>
                    ) : (
                      <button
                        onClick={() => handleDelete(u.id, u.is_staff)}
                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
