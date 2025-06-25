import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import axios from 'axios';

const Dashboard = ({ expenses, token }) => {
  const [monthlyBudget, setMonthlyBudget] = useState(50000); // Default budget in INR
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [isUpdatingBudget, setIsUpdatingBudget] = useState(false);

  // Fetch user's budget on component mount
  useEffect(() => {
    const fetchUserBudget = async () => {
      try {
        const response = await axios.get('/api/auth/profile', {
          headers: { 'x-auth-token': token }
        });
        if (response.data.monthlyBudget) {
          setMonthlyBudget(response.data.monthlyBudget);
        }
      } catch (error) {
        console.error('Error fetching user budget:', error);
      }
    };
    fetchUserBudget();
  }, [token]);

  // Calculate current month expenses
  const currentMonthExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
  });

  // Calculate totals
  const totalSpent = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const needsTotal = currentMonthExpenses
    .filter(expense => expense.type === 'Need')
    .reduce((sum, expense) => sum + expense.amount, 0);
  const wantsTotal = currentMonthExpenses
    .filter(expense => expense.type === 'Want')
    .reduce((sum, expense) => sum + expense.amount, 0);

  // Calculate savings/overspending
  const savings = monthlyBudget - totalSpent;
  const isOverspent = savings < 0;
  const budgetUsage = (totalSpent / monthlyBudget) * 100;

  // Category breakdown
  const categoryData = currentMonthExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  const pieData = Object.entries(categoryData).map(([category, amount]) => ({
    name: category,
    value: amount
  }));

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  // Monthly trend data (last 6 months)
  const getMonthlyData = () => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentYear, currentMonth - i, 1);
      const monthExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === date.getMonth() && expenseDate.getFullYear() === date.getFullYear();
      });
      const total = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      months.push({
        month: date.toLocaleDateString('en-IN', { month: 'short' }),
        total,
        needs: monthExpenses.filter(e => e.type === 'Need').reduce((sum, e) => sum + e.amount, 0),
        wants: monthExpenses.filter(e => e.type === 'Want').reduce((sum, e) => sum + e.amount, 0)
      });
    }
    return months;
  };

  const monthlyData = getMonthlyData();

  // Update budget function
  const handleUpdateBudget = async () => {
    setIsUpdatingBudget(true);
    try {
      await axios.put('/api/auth/budget', 
        { monthlyBudget }, 
        { headers: { 'x-auth-token': token } }
      );
    } catch (error) {
      console.error('Error updating budget:', error);
    } finally {
      setIsUpdatingBudget(false);
    }
  };

  // Format currency in Indian Rupees
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Financial Dashboard</h1>
          <p className="text-gray-600 mt-2">Track your spending and stay on budget</p>
        </div>

        {/* Budget Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Monthly Budget</h3>
              <p className="text-sm text-gray-600">Set your monthly spending limit</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                <input
                  type="number"
                  value={monthlyBudget}
                  onChange={(e) => setMonthlyBudget(Number(e.target.value))}
                  className="pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-40"
                  placeholder="Budget amount"
                />
              </div>
              <button 
                onClick={handleUpdateBudget}
                disabled={isUpdatingBudget}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {isUpdatingBudget ? 'Updating...' : 'Update'}
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalSpent)}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Available</p>
                <p className={`text-2xl font-bold ${isOverspent ? 'text-red-600' : 'text-green-600'}`}>
                  {formatCurrency(Math.abs(savings))}
                </p>
                <p className="text-xs text-gray-500">{isOverspent ? 'Overspent' : 'Remaining'}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Needs</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(needsTotal)}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Wants</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(wantsTotal)}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Budget Progress</h3>
            <span className="text-sm text-gray-600">
              {budgetUsage.toFixed(1)}% used
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${
                budgetUsage > 100 ? 'bg-red-500' : budgetUsage > 80 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(budgetUsage, 100)}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>{formatCurrency(totalSpent)} spent</span>
            <span>{formatCurrency(monthlyBudget)} budget</span>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Category Breakdown */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending by Category</h3>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                <p>No expenses this month</p>
              </div>
            )}
          </div>

          {/* Monthly Trend */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">6-Month Spending Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="needs" fill="#f97316" name="Needs" radius={[4, 4, 0, 0]} />
                <Bar dataKey="wants" fill="#8b5cf6" name="Wants" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Expenses */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Expenses</h3>
          {currentMonthExpenses.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentMonthExpenses.slice(0, 5).map((expense) => (
                    <tr key={expense._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {expense.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {expense.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          expense.type === 'Need' 
                            ? 'bg-orange-100 text-orange-800' 
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {expense.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {formatCurrency(expense.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(expense.date).toLocaleDateString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>No expenses recorded this month</p>
              <p className="text-sm mt-2">Add your first expense to get started!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 