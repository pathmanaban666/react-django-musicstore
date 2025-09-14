import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from "react-toastify";
import api from '../../api/user/axios'

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [quantities, setQuantities] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/product/${id}`);
        setProduct(res.data);
      } catch(err) {
        const status = err?.response?.status;
        if (status === 404) {
        toast.error('No such product exist');
        navigate('/products')
        return; 
        }
        toast.error('Failed to load product details.');
      }
    };
    fetchProduct();
  }, [id]);

  const increment = (productId) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 1) + 1,
    }));
  };

  const decrement = (productId) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) - 1),
    }));
  };

  const addToCart = async (product_id) => {
    const quantity = quantities[product_id] || 1;
    try {
      const res = await api.post('cart/items/', { product_id, quantity });
      toast.success(res.data?.message || 'Added to cart successfully!');
    } catch(err) {
      const status = err?.response?.status;
      if (status === 401) {
      toast.error('Login is required to add items to the cart.');
      navigate('/login')
      return; 
      }
      toast.error('Failed to add product to cart. Please try again.');
    }
  };

  return (
    <>
      <div className="container mx-auto px-4 py-8 lg:mt-10">
        <div className="flex flex-wrap mx-4">
          <div className="w-full md:w-1/2 px-4 mb-8">
            <img
              src={product.image || 'https://via.placeholder.com/400'}
              alt={product.name || 'Product'}
              className="w-full max-w-[400px] h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] object-contain rounded-lg shadow-md mb-4 mx-auto"
            />
          </div>

          <div className="w-full md:w-1/2 px-4">
            <h2 className="text-3xl text-gray-700 font-bold mb-2">{product.name}</h2>
            <div className="mb-4">
              <span className="text-2xl font-bold text-gray-800 mr-2">₹{product.price}</span>
            </div>
            <p className="text-gray-700 mb-6">{product.description}</p>

            <div className="flex items-center mt-4 space-x-2">
              <button
                onClick={() => decrement(product.id)}
                className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="px-4 text-lg font-semibold text-purple-800">
                {quantities[product.id] || 1}
              </span>
              <button
                onClick={() => increment(product.id)}
                className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <div className="flex space-x-4 mt-6">
              <button
                onClick={() => addToCart(product.id)}
                className="bg-purple-600 flex gap-2 items-center text-white px-6 py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                  />
                </svg>
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


