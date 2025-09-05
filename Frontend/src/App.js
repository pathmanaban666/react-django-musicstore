import { Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Payment from "./pages/user/Payment";
import About from "./pages/user/About";
import Cart from "./pages/user/Cart";
import Contact from "./pages/user/Contact";
import ProductDetail from "./pages/user/ProductDetial";
import ProductList from "./pages/user/ProductList";
import Register from "./pages/user/Register";
import Login from "./pages/user/Login";
import Home from "./pages/user/Home";
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import Categories from "./pages/admin/Categories";
import Users from "./pages/admin/Users";
import Orders from "./pages/admin/Orders";
import OrderDetail from "./pages/admin/OrderDetail";
import AdminLogin from "./pages/admin/Login";
import AdminHeader from "./components/admin/layout/Header";
import Footer from "./components/user/layout/Footer";
import Header from "./components/user/layout/Header";
import NotFound from "./pages/user/NotFound";
import './index.css';


function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>

      {!isAdminRoute ? <Header />:<AdminHeader />}
      <main className='flex flex-col min-h-screen'>
        <Routes>
          {/* User Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/about" element={<About />} />
          <Route path="/payment" element={<Payment />} />

          {/* Admin Routes */}
            
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin">
                <Route path="dashboard" element={<Dashboard/>} />
                <Route path="products" element={<Products />} />
                <Route path="categories" element={<Categories />} />
                <Route path="users" element={<Users />} />
                <Route path="orders" element={<Orders />} />
                <Route path="orders/:id" element={<OrderDetail />} />        
          </Route>
        <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      
      {/* Global Toast Container */}
      <ToastContainer 
        position="top-center" 
        autoClose={2000} 
        hideProgressBar={false} 
        newestOnTop 
        closeOnClick 
        pauseOnHover 
        draggable 
      />

    </>
  );
}

export default App;
