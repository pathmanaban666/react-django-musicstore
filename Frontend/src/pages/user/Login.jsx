import { useState, useEffect } from 'react';
import api from '../../api/user/axios'
import { useNavigate, Link } from 'react-router-dom';
import { toast } from "react-toastify";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem('user_access_token');
    if (accessToken) {
      navigate('/');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post('/auth/login/', { email, password });

      localStorage.setItem('user_access_token', res.data.access_token);
      localStorage.setItem('username', res.data.username);

      toast.success('Login successful!');
      navigate('/');
    } catch (err) {
      toast.error('Login failed. Please check your credentials.');
    }
  };

  return (
    <section className="flex justify-center mt-14 lg:mt-24">
      <div className="rounded-2xl border-2 mx-2 sm:mx-6 flex max-w-3xl p-5 items-center">
        <div className="md:w-1/2 px-8">
          <h2 className="font-bold text-3xl text-purple-900">Login</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              className="p-2 mt-8 rounded-xl border"
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="relative">
              <input
                className="p-2 rounded-xl border w-full"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
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

            <button
              className="bg-purple-700 text-white py-2 rounded-xl hover:scale-105 duration-300 hover:bg-purple-800 font-medium"
              type="submit"
            >
              Login
            </button>
          </form>

          <div className="mt-4 text-sm flex justify-between items-center">
            <p>If you don't have an account..</p>
            <Link to="/register">
              <button className="text-white bg-purple-700 rounded-xl py-2 px-5 hover:scale-110 hover:bg-purple-800 hover:border hover:border-gray-400 font-semibold duration-300">
                Register
              </button>
            </Link>
          </div>
        </div>

        <div className="md:block hidden w-1/2">
          <img
            className="rounded-2xl max-h-[1600px]"
            src="https://png.pngtree.com/png-clipart/20230425/original/pngtree-guitar-music-note-musical-instrument-cartoon-illustration-png-image_9100556.png"
            alt="login form"
          />
        </div>
      </div>
    </section>
  );
};


