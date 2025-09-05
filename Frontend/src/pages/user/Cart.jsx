import { useState, useEffect } from 'react';
import api from '../../api/user/axios'
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import useAuthGuard from '../../components/user/auth/useAuthGuard';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  useAuthGuard();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const res = await api.get('/carts/');
        setCartItems(res.data.items || []);
      } catch (err) {
        const status = err?.response?.status;
        if (status === 401) {
        toast.error('Please login to view your cart.');
        return; 
        }
        toast.error('Failed to load cart items. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCartItems();
  }, []);

  const removeFromCart = async (id) => {
    try {
      await api.delete(`/cart/items/${id}/`);
      setCartItems(prev => prev.filter(item => item.id !== id));
      toast.success('Item removed from cart.');
    } catch {
      toast.error('Failed to remove item from cart. Please try again.');
    }
  };

  const checkout = () => navigate("/payment");

  const getCartTotal = () =>
    cartItems.reduce((total, item) => total + (item.product?.price || 0) * (item.quantity || 0), 0);

  if (isLoading) return <div className="text-center py-12 text-lg text-purple-700">Loading cart...</div>;
  if (!cartItems.length) return <div className="text-center py-12 text-gray-700">Your cart is empty.</div>;

  return (
    <>
      <div className="p-8 max-w-5xl mx-auto bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-8 text-purple-900">Your Cart</h1>
        <ul className="space-y-8">
          {cartItems.map(({ id, product, quantity }) => {
            if (!product) return null;
            const totalPrice = ((product.price || 0) * (quantity || 1)).toFixed(2);

            return (
              <li
                key={id}
                className="flex flex-col sm:flex-row items-center sm:justify-between border-b border-purple-200 pb-6"
              >
                <div className="flex items-center w-full sm:w-auto">
                  <img
                    src={product.image || 'https://via.placeholder.com/150'}
                    alt={product.name || 'Product'}
                    className="w-24 h-24 object-cover rounded-md"
                  />
                  <div className="ml-6">
                    <h3 className="text-xl font-semibold text-purple-900">{product.name || 'Product'}</h3>
                    <p className="text-gray-600 mt-1">Quantity: {quantity}</p>
                    <p className="text-gray-600 mt-1">Price each: ₹{(product.price || 0).toFixed(2)}</p>
                  </div>
                </div>
                <div className="mt-4 sm:mt-0 flex items-center space-x-16">
                  <span className="text-2xl font-bold text-purple-800">₹{totalPrice}</span>
                  <button
                    onClick={() => removeFromCart(id)}
                    className="px-5 py-2 bg-purple-600 font-semibold text-white rounded-lg hover:bg-purple-700 transition"
                    aria-label={`Remove ${product.name} from cart`}
                  >
                    Remove
                  </button>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="flex flex-col sm:flex-row justify-between items-center mt-12 pt-8 border-t border-purple-200">
          <div className="text-2xl font-extrabold text-purple-900 mb-4 sm:mb-0">
            Total: ₹{getCartTotal().toFixed(2)}
          </div>
          <button
            onClick={checkout}
            className="bg-purple-700 text-white font-bold px-8 py-3 rounded-lg hover:bg-purple-800 transition"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </>
  );
}


