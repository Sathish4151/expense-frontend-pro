// src/components/ExpenseList.jsx
import React from 'react';
import axios from 'axios';

const ExpenseList = ({ expenses, setExpenses, setEditingExpense }) => {
  const deleteExp = async id => {
    await axios.delete(`/api/expenses/${id}`, {
      headers: { 'x-auth-token': localStorage.getItem('token') }
    });
    setExpenses(expenses.filter(e => e._id !== id));
  };

  return (
    <div className="w-full bg-white border border-black rounded-xl shadow-lg">
      {/* Header – sits flush to top border */}
      <div className="px-6 py-4 border-b border-gray-300">
        <h3 className="text-2xl font-bold">Your Expenses</h3>
      </div>

      {/* Scrollable list */}
      <div className="h-96 overflow-y-auto">
        {expenses.length === 0 ? (
          <p className="px-6 py-4">No expenses yet.</p>
        ) : (
          <ul className="px-6 py-4 space-y-2">
            {expenses.map(exp => (
              <li
                key={exp._id}
                className="flex justify-between items-center py-2 border-b last:border-none"
              >
                <div
                  onClick={() => setEditingExpense(exp)}
                  className="cursor-pointer"
                >
                  <p className="font-semibold">{exp.title}</p>
                  <p className="text-sm text-gray-600">
                    {exp.category} · {new Date(exp.date).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="font-semibold">₹{exp.amount}</span>
                  <button
                    onClick={() => deleteExp(exp._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    🗑️
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ExpenseList;
