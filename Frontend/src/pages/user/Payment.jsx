import { useState, useEffect } from "react";
import api from '../../api/user/axios'
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import useAuthGuard from "../../components/user/auth/useAuthGuard";

export default function Payment() {
  const [cartItems, setCartItems] = useState([]);
  const [cardDetails, setCardDetails] = useState({
    name: "",
    number: "",
    exp: "",
    cvv: "",
  });
  const [shippingDetails, setShippingDetails] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const navigate = useNavigate();
  useAuthGuard();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await api.get("/carts/");
        setCartItems(res.data.items || []);
      } catch(err) {
        const status = err?.response?.status;
        if (status === 401) {
        toast.error('Please login to make payment.');
        return; 
        }
        toast.error("Failed to load cart items.");
      }
    };
    fetchCart();
  }, []);

  const handleCardChange = (e) =>
    setCardDetails({ ...cardDetails, [e.target.name]: e.target.value });

  const handleShippingChange = (e) =>
    setShippingDetails({ ...shippingDetails, [e.target.name]: e.target.value });

  const getCartTotal = () =>
    cartItems.reduce(
      (total, item) => total + (item.product?.price || 0) * item.quantity,
      0
    );

  const handlePayment = async () => {
    for (const key in shippingDetails) {
      if (!shippingDetails[key]) {
        return toast.error(
          `Please fill in your ${key.replace(/([A-Z])/g, " $1").toLowerCase()}.`
        );
      }
    }

    if (!cardDetails.name || !cardDetails.number || !cardDetails.exp || !cardDetails.cvv) {
      return toast.error("Please fill in all card details.");
    }

    setIsSubmitting(true);
    try {
      await api.post("/checkout/", {
        payment_method: "card",
        card_details: cardDetails,
        shipping_details: shippingDetails,
        cart_items: cartItems,
      });

      toast.success("Payment successful! Your order has been placed.");
      setPaymentSuccess(true);
      setCartItems([]);
    } catch {
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <svg
          className="w-16 h-16 text-green-500 mb-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        <h2 className="text-2xl font-semibold text-slate-900 mb-2">
          Payment Successful 🎉
        </h2>
        <p className="text-gray-600 mb-6">
          Thank you for your order. Your payment has been processed.
        </p>
        <button
          onClick={() => navigate("/products")}
          className="px-6 py-3 text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-md"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return <div className="text-center py-12 text-gray-600">Your cart is empty.</div>;
  }

  return (
    <div className="bg-white p-4 mt-4 lg:ms-20">
      <div className="md:max-w-5xl max-w-xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 order-1">
            <h2 className="text-3xl font-semibold text-slate-900">
              Shipping Address And Payment Info
            </h2>
            <div className="mt-8 max-w-lg">
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { name: "fullName", placeholder: "Full Name", maxLength: 50 },
                  { name: "phone", placeholder: "Phone Number", maxLength: 15 },
                  { name: "address", placeholder: "Address", maxLength: 100, span: "col-span-full" },
                  { name: "city", placeholder: "City", maxLength: 50 },
                  { name: "state", placeholder: "State/Province", maxLength: 50 },
                  { name: "postalCode", placeholder: "Postal Code", maxLength: 10 },
                  { name: "country", placeholder: "Country", maxLength: 50 },
                ].map((field) => (
                  <input
                    key={field.name}
                    type="text"
                    name={field.name}
                    placeholder={field.placeholder}
                    value={shippingDetails[field.name]}
                    onChange={handleShippingChange}
                    maxLength={field.maxLength}
                    className={`px-4 py-3.5 bg-gray-100 text-slate-900 text-sm border border-gray-200 rounded-md focus:border-purple-500 focus:bg-transparent outline-0 ${field.span || ""}`}
                  />
                ))}
              </div>

              <div className="mt-8 grid gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Cardholder's Name"
                  value={cardDetails.name}
                  onChange={handleCardChange}
                  maxLength={50}
                  className="px-4 py-3.5 bg-gray-100 text-slate-900 w-full text-sm border border-gray-200 rounded-md focus:border-purple-500 focus:bg-transparent outline-0"
                />
                <input
                  type="text"
                  name="number"
                  placeholder="Card Number"
                  value={cardDetails.number}
                  onChange={handleCardChange}
                  maxLength={19}
                  className="px-4 py-3.5 bg-gray-100 text-slate-900 w-full text-sm border border-gray-200 rounded-md focus:border-purple-500 focus:bg-transparent outline-0"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="exp"
                    placeholder="EXP (MM/YY)"
                    value={cardDetails.exp}
                    onChange={handleCardChange}
                    maxLength={5}
                    className="px-4 py-3.5 bg-gray-100 text-slate-900 text-sm border border-gray-200 rounded-md focus:border-purple-500 focus:bg-transparent outline-0"
                  />
                  <input
                    type="text"
                    name="cvv"
                    placeholder="CVV"
                    value={cardDetails.cvv}
                    onChange={handleCardChange}
                    maxLength={4}
                    className="px-4 py-3.5 bg-gray-100 text-slate-900 text-sm border border-gray-200 rounded-md focus:border-purple-500 focus:bg-transparent outline-0"
                  />
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={isSubmitting}
                className="mt-8 w-40 py-3 text-[15px] font-medium bg-purple-500 text-white rounded-md hover:bg-purple-600 tracking-wide"
              >
                {isSubmitting ? "Processing..." : "Pay ₹" + getCartTotal().toFixed(2)}
              </button>
            </div>
          </div>

          <div className="bg-gray-100 p-6 rounded-md">
            <h2 className="text-2xl font-semibold text-slate-900">
              ₹{getCartTotal().toFixed(2)}
            </h2>
            <ul className="text-slate-500 font-medium mt-8 space-y-4">
              {cartItems.map((item) => (
                <li key={item.id} className="flex justify-between text-sm">
                  {item.product?.name || "Item"} × {item.quantity}
                  <span className="font-semibold text-slate-900">
                    ₹{(item.product?.price * item.quantity).toFixed(2)}
                  </span>
                </li>
              ))}
              <li className="flex justify-between text-[15px] font-semibold text-slate-900 border-t border-gray-300 pt-4">
                Total <span>₹{getCartTotal().toFixed(2)}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
