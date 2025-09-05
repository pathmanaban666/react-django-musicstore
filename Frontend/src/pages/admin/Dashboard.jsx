import { useEffect, useState } from "react";
import api from "../../api/admin/axios";
import { toast } from "react-toastify";
import { Package, ShoppingBag, Users } from "lucide-react";
import useAuthGuard from "../../components/admin/auth/useAuthGuard";

export default function Dashboard() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    users: 0,
  });
  useAuthGuard();
  
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [productsRes, ordersRes, usersRes] = await Promise.all([
        api.get("products/"),
        api.get("orders/"),
        api.get("users/"),
      ]);

      setStats({
        products: productsRes.data.length,
        orders: ordersRes.data.length,
        users: usersRes.data.length,
      });
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401) {
      toast.error('Log in required to access this content.');
      return; 
      }
      toast.error("Failed to load dashboard stats.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-4 px-6 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white shadow-md rounded-2xl p-6 flex items-center gap-4 hover:shadow-lg transition">
          <div className="p-3 rounded-full bg-purple-100 text-purple-600">
            <Package size={28} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-700">Products</h2>
            <p className="text-2xl font-bold text-purple-600">{stats.products}</p>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-2xl p-6 flex items-center gap-4 hover:shadow-lg transition">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600">
            <ShoppingBag size={28} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-700">Orders</h2>
            <p className="text-2xl font-bold text-blue-600">{stats.orders}</p>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-2xl p-6 flex items-center gap-4 hover:shadow-lg transition">
          <div className="p-3 rounded-full bg-green-100 text-green-600">
            <Users size={28} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-700">Users</h2>
            <p className="text-2xl font-bold text-green-600">{stats.users}</p>
          </div>
        </div>
      </div>
    </div>
  );
};


