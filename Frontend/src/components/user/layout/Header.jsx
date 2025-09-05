import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const accessToken = localStorage.getItem("user_access_token");
  const username = localStorage.getItem("username");
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [showUsername, setShowUsername] = useState(false);

  const logoutHandler = () => {
    localStorage.removeItem("user_access_token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  useEffect(() => {
    let timer;
    if (showUsername) {
      timer = setTimeout(() => setShowUsername(false), 2000); // 2 seconds
    }
    return () => clearTimeout(timer);
  }, [showUsername]);

  return (
    <nav className="w-11/12 xl:w-4/5 m-auto flex justify-between items-center py-5 relative font-sans">
      {/* Logo */}
      <Link to="/">
        <h1 className="text-2xl font-bold text-purple-600 cursor-pointer select-none">
          MusicStore
        </h1>
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex space-x-8 text-base text-purple-700 font-bold">
        <Link to="/"><li className="cursor-pointer hover:text-purple-900 list-none">Home</li></Link>
        <Link to="/products"><li className="cursor-pointer hover:text-purple-900 list-none">Products</li></Link>
        <Link to="/about"><li className="cursor-pointer hover:text-purple-900 list-none">About</li></Link>
        <Link to="/contact"><li className="cursor-pointer hover:text-purple-900 list-none">Contact Us</li></Link>
        {!accessToken && (
          <>
            <Link to="/login"><li className="cursor-pointer hover:text-purple-900 list-none">Login</li></Link>
            <Link to="/register"><li className="cursor-pointer hover:text-purple-900 list-none">Register</li></Link>
          </>
        )}
      </div>

      {/* Right Side Icons + Hamburger */}
      <div className="flex items-center space-x-4">
        {/* User Icon with popup */}
        <div className="relative">
          <button
            className="inline-block hover:text-purple-900"
            onClick={() => setShowUsername(true)}
            aria-label="User profile"
          >
            <svg
              className="fill-current text-purple-600 mt-2 hover:text-purple-900"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <circle fill="none" cx="12" cy="7" r="3" />
              <path d="M12 2C9.243 2 7 4.243 7 7s2.243 5 5 5 5-2.243 5-5S14.757 2 12 2zM12 10c-1.654 0-3-1.346-3-3s1.346-3 3-3 3 1.346 3 3S13.654 10 12 10zM21 21v-1c0-3.859-3.141-7-7-7h-4c-3.86 0-7 3.141-7 7v1h2v-1c0-2.757 2.243-5 5-5h4c2.757 0 5 2.243 5 5v1H21z" />
            </svg>
          </button>

          {showUsername && username && (
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 px-3 py-1 text-sm bg-purple-600 text-white rounded shadow whitespace-nowrap">
              {username}
            </div>
          )}
        </div>

        {/* Cart Icon */}
        <Link to="/cart" className="inline-block hover:text-purple-900" aria-label="Shopping cart">
          <svg
            className="fill-current text-purple-600 hover:text-purple-900"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path d="M21,7H7.462L5.91,3.586C5.748,3.229,5.392,3,5,3H2v2h2.356L9.09,15.414C9.252,15.771,9.608,16,10,16h8c0.4,0,0.762-0.238,0.919-0.606l3-7c0.133-0.309,0.101-0.663-0.084-0.944C21.649,7.169,21.336,7,21,7z M17.341,14h-6.697L8.371,9h11.112L17.341,14z" />
            <circle cx="10.5" cy="18.5" r="1.5" />
            <circle cx="17.5" cy="18.5" r="1.5" />
          </svg>
        </Link>

        {/* Logout */}
        {accessToken && (
          <button onClick={logoutHandler} className="text-purple-600 hover:text-purple-900" aria-label="Logout" title="Logout">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler-logout" viewBox="0 0 24 24">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2"/>
              <path d="M9 12h12l-3 -3"/>
              <path d="M18 15l3 -3"/>
            </svg>
          </button>
        )}

        {/* Hamburger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden focus:outline-none text-purple-700"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
        >
          {isOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600 hover:text-purple-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600 hover:text-purple-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md md:hidden z-20">
          <ul className="flex flex-col space-y-4 p-5 text-purple-700">
            <Link to="/"><li onClick={() => setIsOpen(false)} className="cursor-pointer hover:text-purple-900 list-none">Home</li></Link>
            <Link to="/products"><li onClick={() => setIsOpen(false)} className="cursor-pointer hover:text-purple-900 list-none">Products</li></Link>
            <Link to="/about"><li onClick={() => setIsOpen(false)} className="cursor-pointer hover:text-purple-900 list-none">About</li></Link>
            <Link to="/contact"><li onClick={() => setIsOpen(false)} className="cursor-pointer hover:text-purple-900 list-none">Contact Us</li></Link>
            {!accessToken && (
              <>
                <Link to="/login"><li onClick={() => setIsOpen(false)} className="cursor-pointer hover:text-purple-900 list-none">Login</li></Link>
                <Link to="/register"><li onClick={() => setIsOpen(false)} className="cursor-pointer hover:text-purple-900 list-none">Register</li></Link>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}
