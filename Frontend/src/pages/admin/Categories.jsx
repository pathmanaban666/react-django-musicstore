import { useEffect, useState } from "react";
import api from "../../api/admin/axios";
import { toast } from "react-toastify";
import useAuthGuard from "../../components/admin/auth/useAuthGuard";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  useAuthGuard();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get("categories/");
      setCategories(res.data);
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401) {
      toast.error('Log in required to access this content.');
      return; 
      }
      toast.error("Failed to load categories.");
    }
  };

  const addOrUpdateCategory = async () => {
    if (!newCategory) return toast.error("Category name cannot be empty");
    try {
      if (isEditing && editingCategory) {
        await api.put(`categories/${editingCategory.id}/`, {
          name: newCategory,
        });
        toast.success("Category updated");
      } else {
        await api.post("categories/", { name: newCategory });
        toast.success("Category added");
      }
      setNewCategory("");
      setIsEditing(false);
      setEditingCategory(null);
      fetchCategories();
    } catch (err) {
      toast.error("Operation failed");
    }
  };

  const startEdit = (category) => {
    setNewCategory(category.name);
    setEditingCategory(category);
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setNewCategory("");
    setEditingCategory(null);
    setIsEditing(false);
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await api.delete(`categories/${id}/`);
      toast.success("Category deleted");
      fetchCategories();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Manage Categories</h2>

      {/* Add/Edit Form */}
      <div className="bg-white shadow-lg rounded-2xl p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Category Name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="flex-1 border px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-400 outline-none"
          />
          <button
            onClick={addOrUpdateCategory}
            className={`${
              isEditing ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-600 hover:bg-green-700"
            } transition text-white px-4 py-2 rounded-lg shadow`}
          >
            {isEditing ? "Update" : "Add"}
          </button>
          {isEditing && (
            <button
              onClick={cancelEdit}
              className="bg-gray-500 hover:bg-gray-600 transition text-white px-4 py-2 rounded-lg shadow"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Categories List */}
      <h3 className="text-xl font-semibold mb-4 text-gray-700">All Categories</h3>

      {/* Table for desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-lg rounded-2xl overflow-hidden">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-20 py-3 text-left">ID</th>
              <th className="px-20 py-3 text-left">Name</th>
              <th className="px-20 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c, i) => (
              <tr key={c.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-20 py-3">{c.id}</td>
                <td className="px-20 py-3">{c.name}</td>
                <td className="px-20 py-3 space-x-4">
                  <button
                    onClick={() => startEdit(c)}
                    className="bg-yellow-500 hover:bg-yellow-600 transition text-white px-3 py-1 rounded-lg shadow"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteCategory(c.id)}
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

      {/* Cards for mobile */}
      <div className="grid gap-4 md:hidden">
        {categories.map((c) => (
          <div key={c.id} className="bg-white shadow-lg rounded-2xl p-4 border">
            <p className="text-sm text-gray-500">ID: {c.id}</p>
            <h4 className="text-lg font-semibold text-gray-800">{c.name}</h4>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => startEdit(c)}
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 transition text-white px-3 py-1 rounded-lg"
              >
                Edit
              </button>
              <button
                onClick={() => deleteCategory(c.id)}
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
