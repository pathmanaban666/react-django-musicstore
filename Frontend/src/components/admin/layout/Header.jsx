import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const adminToken = localStorage.getItem("admin_access_token");
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  if (!adminToken) return null;

  const handleLogout = () => {
    localStorage.removeItem("admin_access_token");
    navigate("/admin/login");
  };

  const links = [
    { name: "Dashboard", to: "/admin/dashboard" },
    { name: "Products", to: "/admin/products" },
    { name: "Categories", to: "/admin/categories" },
    { name: "Orders", to: "/admin/orders" },
    { name: "Users", to: "/admin/users" },
  ];

  return (
    <nav className="w-11/12 xl:w-4/5 m-auto flex justify-between items-center py-5 relative font-sans">
      {/* Logo */}
      <Link to="/admin/dashboard">
        <h1 className="text-2xl font-bold text-purple-600 cursor-pointer select-none">
          MusicStore
        </h1>
      </Link>

      {/* Desktop Menu */}
      <ul className="hidden md:flex space-x-8 text-base font-bold text-purple-700">
        {links.map((link) => (
          <li key={link.to}>
            <Link className="cursor-pointer hover:text-purple-900" to={link.to}>
              {link.name}
            </Link>
          </li>
        ))}
      </ul>

      {/* Right side */}
      <div className="flex items-center space-x-4">
        {/* Logout */}
        <button
          onClick={handleLogout}
          className="bg-purple-600 px-4 py-1 rounded text-white font-bold hover:bg-purple-700 transition"
          aria-label="Logout"
        >
          Logout
        </button>

        {/* Hamburger for Mobile */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden focus:outline-none text-purple-700"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
        >
          {isOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-purple-600 hover:text-purple-900"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-purple-600 hover:text-purple-900"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md md:hidden z-20">
          <ul className="flex flex-col space-y-4 p-5 text-purple-700">
            {links.map((link) => (
              <li key={link.to}>
                <Link
                  onClick={() => setIsOpen(false)}
                  to={link.to}
                  className="cursor-pointer hover:text-purple-900"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
