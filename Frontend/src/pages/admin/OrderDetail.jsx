import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/admin/axios";
import { toast } from "react-toastify";
import useAuthGuard from "../../components/admin/auth/useAuthGuard";

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("");
  useAuthGuard();
  
  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const res = await api.get(`orders/${id}/`);
      setOrder(res.data);
      setStatus(res.data.shipping_address?.order_status || "Pending");
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401) {
      toast.error('Log in required to access this content.');
      return; 
      }
      toast.error("Failed to load order");
    }
  };

  const updateStatus = async () => {
    try {
      await api.patch(`orders/${order.id}/update_status/`, {
        order_status: status,
      });
      await fetchOrder();
      toast.success("Order status updated!");
    } catch {
      toast.error("Failed to update status.");
    }
  };

  if (!order) return <p className="text-center py-6">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto px-2 sm:px-4 py-6 space-y-6">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center sm:text-left">
        Order #{order.id}
      </h2>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        <div className="bg-white border shadow rounded-2xl p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-3">
            Order Info
          </h3>
          <p><b>User:</b> {order.user_name}</p>
          <p>
            <b>Total:</b>{" "}
            <span className="font-semibold text-purple-600 ml-1">
              ₹{order.total_price}
            </span>
          </p>
          <p><b>Payment Method:</b> {order.payment_method}</p>
          <p>
            <b>Paid:</b>{" "}
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                order.is_paid
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {order.is_paid ? "Yes" : "No"}
            </span>
          </p>
        </div>

        <div className="bg-white border shadow rounded-2xl p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-3">
            Shipping Info
          </h3>
          <p>
            {order.shipping_address?.full_name},{" "}
            {order.shipping_address?.address},{" "}
            {order.shipping_address?.city}
          </p>
          <p className="mt-2">
            <b>Status:</b>{" "}
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                order.shipping_address?.order_status === "Delivered"
                  ? "bg-green-100 text-green-700"
                  : order.shipping_address?.order_status === "Pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : order.shipping_address?.order_status === "Processing"
                  ? "bg-blue-100 text-blue-700"
                  : order.shipping_address?.order_status === "Cancelled"
                  ? "bg-red-100 text-red-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {order.shipping_address?.order_status || "N/A"}
            </span>
          </p>

          <div className="mt-4">
            <label className="block sm:inline mr-2 font-medium">
              Update Status:
            </label>
            <div className="flex flex-col sm:flex-row gap-2 mt-2">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="border px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-400 outline-none"
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <button
                onClick={updateStatus}
                className="bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-2 rounded-lg shadow"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border shadow rounded-2xl p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4">
          Ordered Products
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm sm:text-base">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-3 sm:px-4 py-2 text-left">Product</th>
                <th className="px-3 sm:px-4 py-2 text-left">Quantity</th>
                <th className="px-3 sm:px-4 py-2 text-left">Price</th>
                <th className="px-3 sm:px-4 py-2 text-left">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, i) => (
                <tr
                  key={item.id}
                  className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-3 sm:px-4 py-2">{item.product_name}</td>
                  <td className="px-3 sm:px-4 py-2">{item.quantity}</td>
                  <td className="px-3 sm:px-4 py-2">₹{item.price}</td>
                  <td className="px-3 sm:px-4 py-2 font-medium text-purple-600">
                    ₹{item.price * item.quantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

