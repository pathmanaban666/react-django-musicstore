import { useState, useEffect } from "react";
import api from "../../api/admin/axios";
import { toast } from "react-toastify";
import useAuthGuard from "../../components/admin/auth/useAuthGuard";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "",
  });
  useAuthGuard();
  
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("products/");
      setProducts(res.data);
    } catch(err) {
      const status = err?.response?.status;
      if (status === 401) {
      toast.error('Log in required to access this content.');
      return; 
      }
      toast.error("Failed to fetch products.");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("categories/");
      setCategories(res.data);
    } catch(err) {
      const status = err?.response?.status;
      if (status === 401) {
      toast.error('Log in required to access this content.');
      return; 
      }
      toast.error("Failed to fetch categories.");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing && editingProduct) {
        await api.put(`products/${editingProduct.id}/`, form);
        toast.success("Product updated");
      } else {
        await api.post("products/", form);
        toast.success("Product added");
      }
      setForm({ name: "", description: "", price: "", image: "", category: "" });
      setIsEditing(false);
      setEditingProduct(null);
      fetchProducts();
    } catch {
      toast.error("Operation failed");
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      category: product.category?.id || product.category,
    });
    setEditingProduct(product);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await api.delete(`products/${id}/`);
      toast.success("Product deleted");
      fetchProducts();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="bg-white shadow-lg rounded-2xl p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          {isEditing ? "Edit Product" : "Add Product"}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
            className="border px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-400 outline-none"
            required
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="border px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-400 outline-none"
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            className="border px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-400 outline-none"
            required
          />
          <input
            type="text"
            name="image"
            placeholder="Image URL"
            value={form.image}
            onChange={handleChange}
            className="border px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-400 outline-none"
            required
          />
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="border px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-400 outline-none md:col-span-2"
            required
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 transition text-white px-4 py-2 rounded-lg font-medium shadow md:col-span-2"
          >
            {isEditing ? "Update Product" : "Add Product"}
          </button>
        </form>
      </div>

      <h2 className="text-2xl font-bold mb-4 text-gray-800">All Products</h2>

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-lg rounded-2xl overflow-hidden">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-left">Price</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, i) => (
              <tr key={p.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-4 py-2">{p.id}</td>
                <td className="px-4 py-2">{p.name}</td>
                <td className="px-4 py-2">{p.category_name}</td>
                <td className="px-4 py-2 font-medium text-purple-600">₹{p.price}</td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    onClick={() => handleEdit(p)}
                    className="bg-yellow-500 hover:bg-yellow-600 transition text-white px-3 py-1 rounded-lg shadow"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="bg-red-500 hover:bg-red-600 transition text-white px-3 py-1 rounded-lg shadow"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 md:hidden">
        {products.map((p) => (
          <div key={p.id} className="bg-white shadow-lg rounded-2xl p-4 border">
            <h3 className="text-lg font-semibold text-gray-800">{p.name}</h3>
            <p className="text-gray-600 text-sm">{p.category_name}</p>
            <p className="font-bold text-purple-600 mt-1">₹{p.price}</p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => handleEdit(p)}
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 transition text-white px-3 py-1 rounded-lg"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(p.id)}
                className="flex-1 bg-red-500 hover:bg-red-600 transition text-white px-3 py-1 rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
