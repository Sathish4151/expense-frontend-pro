import React from 'react';

const ExpenseGrid = ({ expenses, onDelete }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
    {expenses.map(exp => (
      <div
        key={exp._id}
        className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between"
      >
        <div>
          <h4 className="text-xl font-semibold mb-2 text-gray-900">
            {exp.title}
          </h4>
          <p className="text-gray-600 mb-4">{exp.category}</p>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-900 font-bold">₹{exp.amount}</span>
          <button
            onClick={() => onDelete(exp._id)}
            className="text-red-600 hover:text-red-800 transition"
          >
            Delete
          </button>
        </div>
      </div>
    ))}
  </div>
);

export default ExpenseGrid;
