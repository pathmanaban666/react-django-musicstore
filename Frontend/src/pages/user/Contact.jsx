import { useState } from "react";
import { toast } from "react-toastify";
import api from '../../api/user/axios'

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
      try {
      const res = await api.post('/auth/contact/', form);
      if (res.status === 201) {
        toast.success(
          "Your message has been submitted successfully. Our team will get back to you shortly."
        );
        setForm({ name: "", email: "", message: "" });
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again later.");
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto px-6 py-6 lg:py-16 text-purple-900 max-w-lg">
      <h1 className="text-4xl font-bold mb-8 text-center">Contact Us</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-semibold mb-1" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Your Full Name"
            className="w-full border border-purple-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="Your Email Address"
            className="w-full border border-purple-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1" htmlFor="message">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows="5"
            value={form.message}
            onChange={handleChange}
            required
            placeholder="Your Message"
            className="w-full border border-purple-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full bg-purple-700 text-white py-3 font-semibold rounded hover:bg-purple-800 transition"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}
