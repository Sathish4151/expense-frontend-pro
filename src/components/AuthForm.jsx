import React, { useState } from 'react';
import axios from 'axios';

const AuthForm = ({ setToken }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const toggle = () => {
    setError('');
    setIsLogin(!isLogin);
  };

  const handleChange = e =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const res = await axios.post(
        endpoint,
        form,
        { headers: { 'Content-Type': 'application/json' } }
      );
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
      } else {
        setError('Authentication failed: No token returned');
      }
    } catch (err) {
      console.error('Auth error:', err);
      const msg =
        err.response?.data?.msg ||
        err.response?.data ||
        err.message ||
        'Authentication failed';
      setError(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white border border-gray-200 rounded-3xl shadow-xl">
        <h2 className="text-2xl font-semibold mb-4 text-black">
          {isLogin ? 'Login' : 'Sign Up'}
        </h2>

        {error && (
          <p className="bg-red-100 text-red-700 p-2 rounded mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            type="email"
            required
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 rounded border border-gray-300 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />

          <input
            name="password"
            type="password"
            required
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-3 rounded border border-gray-300 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />

          <button
            type="submit"
            className="w-full py-3 rounded bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-4 text-center text-black">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button onClick={toggle} className="text-indigo-600 hover:underline">
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
