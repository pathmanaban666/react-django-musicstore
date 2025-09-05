import { useState, useEffect } from 'react';
import api from '../../api/user/axios'
import { useNavigate, Link } from 'react-router-dom';
import { toast } from "react-toastify";

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem('user_access_token');
    if (accessToken) {
      navigate('/');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !email || !password || !confirmPassword) {
      toast.error('Please fill all fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsSubmitting(true);

    try {
      await api.post('/auth/register/', { username, email, password });
      toast.success('Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
  const errorDetails = err.response?.data?.details;
  if (errorDetails) {
    Object.keys(errorDetails).forEach((field) => {
      const messages = errorDetails[field];
      messages.forEach((message) => {
        toast.error(`${message}`);
      });
    });
  } else {
    toast.error('Registration failed. Please try again.');
  }
} finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="flex justify-center mt-10 lg:mt-16 lg:mt-24">
      <div className="flex max-w-3xl border-2 rounded-2xl p-5 items-center mx-2 sm:mx-6">
        <div className="md:w-1/2 px-8">
          <h2 className="text-3xl font-bold text-purple-700">Register</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8">
            <input
              type="text"
              placeholder="Username"
              className="p-2 rounded-xl border"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="p-2 rounded-xl border"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                className="p-2 rounded-xl border w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              className="p-2 rounded-xl border"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-purple-700 text-white py-2 rounded-xl hover:scale-105 duration-300 hover:bg-purple-800 font-medium"
            >
              {isSubmitting ? 'Registering...' : 'Register'}
            </button>
          </form>

          <div className="mt-4 text-sm flex justify-between items-center">
            <p>Already have an account?</p>
            <Link to="/login">
              <button className="text-white bg-purple-700 py-2 px-5 rounded-xl hover:scale-110 hover:bg-purple-800 hover:border hover:border-gray-400 font-semibold duration-300">
                Login
              </button>
            </Link>
          </div>
        </div>

        <div className="md:block hidden w-1/2">
          <img
            className="rounded-2xl max-h-[1600px]"
            src="https://png.pngtree.com/png-clipart/20230425/original/pngtree-guitar-music-note-musical-instrument-cartoon-illustration-png-image_9100556.png"
            alt="register illustration"
          />
        </div>
      </div>
    </section>
  );
};


