import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/admin/axios";
import { toast } from "react-toastify";
import useAuthGuard from "../../components/admin/auth/useAuthGuard";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  useAuthGuard();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("orders/");
        setOrders(res.data);
      } catch(err) {
        const status = err?.response?.status;
        if (status === 401) {
        toast.error('Log in required to access this content.');
      return; 
      }
        toast.error("Failed to fetch orders.");
      }
    };
    fetchOrders();
  }, []);

  const getStatusClass = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Processing":
        return "bg-blue-100 text-blue-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">All Orders</h2>

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-lg rounded-2xl overflow-hidden">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-8 py-3 text-left">Order ID</th>
              <th className="px-8 py-3 text-left">User</th>
              <th className="px-8 py-3 text-left">Total</th>
              <th className="px-8 py-3 text-left">Status</th>
              <th className="px-8 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, i) => (
              <tr
                key={order.id}
                className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="px-8 py-3">{order.id}</td>
                <td className="px-8 py-3">{order.user_name}</td>
                <td className="px-8 py-3 font-medium text-purple-600">
                  ₹{order.total_price}
                </td>
                <td className="px-8 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                      order.shipping_address?.order_status
                    )}`}
                  >
                    {order.shipping_address?.order_status || "N/A"}
                  </span>
                </td>
                <td className="px-8 py-3">
                  <Link
                    to={`/admin/orders/${order.id}`}
                    className="bg-green-500 hover:bg-green-600 transition text-white px-4 py-2 rounded-lg shadow"
                  >
                    View Info
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 md:hidden">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white shadow-lg rounded-2xl p-4 border"
          >
            <p className="text-sm text-gray-500">Order ID: {order.id}</p>
            <h3 className="text-lg font-semibold text-gray-800">
              {order.user_name}
            </h3>
            <p className="font-bold text-purple-600 mt-1">
              ₹{order.total_price}
            </p>
            <p className="mt-2">
              <b>Status:</b>{" "}
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                  order.shipping_address?.order_status
                )}`}
              >
                {order.shipping_address?.order_status || "N/A"}
              </span>
            </p>
            <Link
              to={`/admin/orders/${order.id}`}
              className="mt-3 block text-center bg-green-500 hover:bg-green-600 transition text-white px-4 py-2 rounded-lg shadow"
            >
              View Info
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};


