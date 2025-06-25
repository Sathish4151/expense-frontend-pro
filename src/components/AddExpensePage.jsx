import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const AddExpensePage = ({ token, expenses, setExpenses, onNavigate }) => {
  const [form, setForm] = useState({
    title: '',
    amount: '',
    category: '',
    type: 'Need',
    date: new Date().toISOString().slice(0, 10),
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const categories = [
    'Food & Dining',
    'Transportation',
    'Housing',
    'Entertainment',
    'Shopping',
    'Healthcare',
    'Education',
    'Utilities',
    'Insurance',
    'Travel',
    'Other'
  ];

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await axios.post('/api/expenses', form, {
        headers: { 'x-auth-token': token }
      });
      
      setExpenses([...expenses, response.data]);
      setMessage('Expense added successfully!');
      
      // Reset form
      setForm({
        title: '',
        amount: '',
        category: '',
        type: 'Need',
        date: new Date().toISOString().slice(0, 10),
        description: ''
      });

      // Clear success message after 3 seconds
      setTimeout(() => {
        setMessage('');
        if (onNavigate) onNavigate('dashboard');
      }, 3000);

    } catch (error) {
      setMessage('Error adding expense. Please try again.');
      console.error('Error adding expense:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">Add New Expense</h1>
          <p className="text-gray-600 mt-2">Track your spending to better manage your finances</p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Expense Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g., Grocery shopping, Netflix subscription"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>

            {/* Amount */}
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                Amount (₹) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  placeholder="0"
                  step="1"
                  min="0"
                  required
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Expense Type *
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all ${
                  form.type === 'Need' 
                    ? 'border-orange-500 bg-orange-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="type"
                    value="Need"
                    checked={form.type === 'Need'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                      form.type === 'Need' ? 'border-orange-500 bg-orange-500' : 'border-gray-300'
                    }`}>
                      {form.type === 'Need' && (
                        <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Need</div>
                      <div className="text-sm text-gray-500">Essential expenses</div>
                    </div>
                  </div>
                </label>

                <label className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all ${
                  form.type === 'Want' 
                    ? 'border-purple-500 bg-purple-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="type"
                    value="Want"
                    checked={form.type === 'Want'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                      form.type === 'Want' ? 'border-purple-500 bg-purple-500' : 'border-gray-300'
                    }`}>
                      {form.type === 'Want' && (
                        <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Want</div>
                      <div className="text-sm text-gray-500">Discretionary expenses</div>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Date */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                Date *
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Add any additional notes about this expense..."
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
              />
            </div>

            {/* Message */}
            {message && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg ${
                  message.includes('successfully') 
                    ? 'bg-green-100 text-green-800 border border-green-200' 
                    : 'bg-red-100 text-red-800 border border-red-200'
                }`}
              >
                {message}
              </motion.div>
            )}

            {/* Buttons */}
            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('dashboard')}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Adding...' : 'Add Expense'}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Quick Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-200"
        >
          <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 Quick Tips</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• <strong>Needs:</strong> Essential expenses like rent, food, utilities, and transportation</li>
            <li>• <strong>Wants:</strong> Discretionary expenses like entertainment, shopping, and dining out</li>
            <li>• Be specific with titles to make tracking easier</li>
            <li>• Add descriptions for better expense categorization</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default AddExpensePage; 