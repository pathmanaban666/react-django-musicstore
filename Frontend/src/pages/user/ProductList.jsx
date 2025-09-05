import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/user/axios'
import { toast } from "react-toastify";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [filterProduct, setFilterProduct] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isSearchSubmitted, setIsSearchSubmitted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/product/');
        setProducts(res.data || []);
        setFilteredProducts(res.data || []);
        const initialQuantities = {};
        res.data.forEach(product => {
          initialQuantities[product.id] = 1;
        });
        setQuantities(initialQuantities);
      } catch {
        setError('Failed to load products.');
        toast.error('Failed to load products.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const filtered = products.filter(p =>
      p.name.toLowerCase().includes(filterProduct.toLowerCase())
    );
    setFilteredProducts(filtered);
    setIsSearchSubmitted(true);

    if (filtered.length === 0) {
      toast.info('No products matched your search.');
    }
  };

  const handleClear = () => {
    setFilterProduct('');
    setFilteredProducts(products);
    setIsSearchSubmitted(false);
  };

  const increment = productId => {
    setQuantities(prev => ({
      ...prev,
      [productId]: (prev[productId] || 1) + 1,
    }));
  };

  const decrement = productId => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) - 1),
    }));
  };

  const addToCart = async product_id => {
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

  if (isLoading) {
    return <div className="text-center py-12 text-lg text-purple-700">Loading Products...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-600">{error}</div>;
  }

  return (
    <div className="w-4/5 mx-auto space-y-10">
      <div className="flex flex-row justify-end mt-4">
        <form onSubmit={handleSubmit} className="flex gap-2 items-center">
          <input
            type="text"
            value={filterProduct}
            onChange={(e) => setFilterProduct(e.target.value)}
            placeholder="Search products..."
            className="p-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
          >
            Search
          </button>
          {isSearchSubmitted && (
            <button
              type="button"
              onClick={handleClear}
              className="p-2 bg-gray-400 rounded-lg hover:bg-gray-500 transition flex items-center justify-center"
              aria-label="Clear search"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </form>
      </div>

      <div className="grid xl:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <div
              key={product.id}
              className="border border-purple-200 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col"
            >
              <Link to={`/products/${product.id}`}>
                <div className="w-full h-48 overflow-hidden rounded-t-lg bg-gray-100 flex items-center justify-center">
                <img
                  src={product.image || 'https://via.placeholder.com/300x200?text=No+Image'}
                  alt={product.name}
                  className="w-full h-full transition-transform duration-300 hover:scale-105"
                />
                </div>
              </Link>

              <div className="p-4 flex flex-col flex-grow">
                <h3
                  className="text-lg text-purple-900 font-semibold font-serif truncate"
                  title={product.name}
                >
                  {product.name}
                </h3>
                <span className="text-purple-600 text-xl font-bold mt-1">₹{product.price}</span>

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

                <button
                  onClick={() => addToCart(product.id)}
                  className="mt-6 bg-purple-700 font-serif text-white px-4 py-2 rounded-lg hover:bg-purple-800 transition"
                >
                  Add To Cart
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500 mt-10">No products found.</p>
        )}
      </div>
    </div>
  );
}

