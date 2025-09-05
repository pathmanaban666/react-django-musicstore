import { useState, useEffect } from "react";
import api from "../../api/admin/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
      const accessToken = localStorage.getItem('admin_access_token');
      if (accessToken) {
        navigate('/admin/dashboard');
      }
    }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("login/", { username, password });
      localStorage.setItem("admin_access_token", res.data.access);
      toast.success("Login successful");
      navigate("/admin/dashboard");
    } catch (err) {
      toast.error(err.response?.data.detail || "Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-40 p-8 border rounded">
      <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full p-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}
