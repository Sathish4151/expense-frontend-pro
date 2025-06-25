import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const AuthForm = ({ setToken }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const toggle = () => {
    setError('');
    setIsLogin(!isLogin);
  };

  const handleChange = e =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
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
    } finally {
      setIsLoading(false);
    }
  };

  // Static grid style, no animation
  const gridStaticStyle = {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    zIndex: 1,
    pointerEvents: 'none',
    transform: 'none',
  };

  return (
    <div className="min-h-screen w-full relative flex items-stretch font-sans">
      {/* Fullscreen Blue Gradient + Static Grid Pattern */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="w-full h-full bg-gradient-to-br from-blue-600 to-blue-800 absolute inset-0" />
        <div style={gridStaticStyle} aria-hidden="true">
          <svg className="w-full h-full" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
                <path d="M 8 0 L 0 0 0 8" fill="none" stroke="white" strokeWidth="0.25" opacity="0.15"/>
              </pattern>
            </defs>
            <rect width="200" height="200" fill="url(#grid)" />
          </svg>
        </div>
      </div>
      {/* Main Content */}
      <div className="relative z-10 flex flex-1 min-h-screen flex-col lg:flex-row">
        {/* Left Side: Brand & Features */}
        <div className="flex flex-1 items-center justify-center px-6 py-12 lg:py-0">
          <div className="w-full max-w-lg mx-auto flex flex-col justify-center h-full">
            <div className="mb-12">
              <div className="mb-8 flex flex-col items-start">
                <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                  {/* Dollar Icon */}
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h1 className="text-5xl font-extrabold mb-2 tracking-tight leading-tight drop-shadow-lg text-white">ExpenseTracker</h1>
                <p className="text-2xl text-blue-100 font-light mb-8">Smart Financial Management</p>
              </div>
              <div className="space-y-8">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mr-4">
                    {/* Chart Bar Icon */}
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3v18h18" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white">Track Expenses</h3>
                    <p className="text-blue-100 text-base">Monitor your spending with detailed analytics</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mr-4">
                    {/* Lock Closed Icon */}
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a5 5 0 00-10 0v2a2 2 0 00-2 2v7a2 2 0 002 2h10a2 2 0 002-2v-7a2 2 0 00-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white">Smart Budgeting</h3>
                    <p className="text-blue-100 text-base">Set budgets and stay on track with alerts</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mr-4">
                    {/* Shield Check Icon */}
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white">Secure & Private</h3>
                    <p className="text-blue-100 text-base">Your financial data is encrypted and secure</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Right Side: Login Form */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 bg-transparent">
          <div className="w-full max-w-md">
            {/* Main Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden drop-shadow-[0_8px_32px_rgba(0,0,0,0.18)]"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-7 text-white rounded-t-2xl border-b border-blue-500">
                <h2 className="text-3xl font-bold text-center tracking-tight">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                <p className="text-center text-blue-100 text-base mt-2">{isLogin ? 'Sign in to your account to continue' : 'Join us to start managing your finances'}</p>
              </div>
              {/* Form Section */}
              <div className="px-8 py-8">
                {/* Toggle Buttons */}
                <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
                  <button
                    onClick={() => setIsLogin(true)}
                    className={`flex-1 py-2 px-4 rounded-md text-base font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isLogin
                        ? 'bg-white text-blue-600 shadow-sm ring-2 ring-blue-500'
                        : 'text-gray-600 hover:text-blue-700'
                    }`}
                    aria-current={isLogin ? 'page' : undefined}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setIsLogin(false)}
                    className={`flex-1 py-2 px-4 rounded-md text-base font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      !isLogin
                        ? 'bg-white text-blue-600 shadow-sm ring-2 ring-blue-500'
                        : 'text-gray-600 hover:text-blue-700'
                    }`}
                    aria-current={!isLogin ? 'page' : undefined}
                  >
                    Sign Up
                  </button>
                </div>
                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
                  >
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-red-700 text-sm">{error}</p>
                    </div>
                  </motion.div>
                )}
                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-base font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="Enter your email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-base"
                        autoComplete="email"
                        aria-label="Email Address"
                      />
                    </div>
                  </div>
                  {/* Password Field */}
                  <div>
                    <label htmlFor="password" className="block text-base font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        placeholder="Enter your password"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-base"
                        autoComplete="current-password"
                        aria-label="Password"
                      />
                    </div>
                  </div>
                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-base shadow-sm"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {isLogin ? 'Signing In...' : 'Creating Account...'}
                      </div>
                    ) : (
                      isLogin ? 'Sign In' : 'Create Account'
                    )}
                  </motion.button>
                </form>
                {/* Divider */}
                <div className="my-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Secure Authentication</span>
                    </div>
                  </div>
                </div>
                {/* Footer */}
                <div className="text-center">
                  <p className="text-base text-gray-600">
                    {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                    <button
                      onClick={toggle}
                      className="font-semibold text-blue-600 hover:text-blue-500 transition-colors duration-200 focus:outline-none"
                    >
                      {isLogin ? 'Create one here' : 'Sign in here'}
                    </button>
                  </p>
                </div>
              </div>
            </motion.div>
            {/* Footer Note */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 text-center"
            >
              <p className="text-xs text-gray-200/80 drop-shadow-sm">
                © 2024 ExpenseTracker. All rights reserved.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
