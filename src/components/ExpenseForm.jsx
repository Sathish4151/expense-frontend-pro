import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ExpenseForm = ({
  token,
  expenses,
  setExpenses,
  editingExpense,
  setEditingExpense
}) => {
  const blank = { title: '', amount: '', category: '', type: 'Need', date: '' };
  const [form, setForm] = useState(blank);

  useEffect(() => {
    if (editingExpense) {
      setForm({
        title: editingExpense.title,
        amount: editingExpense.amount,
        category: editingExpense.category,
        type: editingExpense.type,
        date: new Date(editingExpense.date).toISOString().slice(0, 10)
      });
    } else {
      setForm(blank);
    }
  }, [editingExpense]);

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (editingExpense) {
      const res = await axios.put(`/api/expenses/${editingExpense._id}`, form, {
        headers: { 'x-auth-token': token }
      });
      setExpenses(expenses.map(x => (x._id === res.data._id ? res.data : x)));
      setEditingExpense(null);
    } else {
      const res = await axios.post('/api/expenses', form, {
        headers: { 'x-auth-token': token }
      });
      setExpenses([...expenses, res.data]);
    }
    setForm(blank);
  };

  const handleCancel = () => {
    setEditingExpense(null);
    setForm(blank);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="
        w-full h-full                 /* fill the grid cell */
        bg-white border border-black
        rounded-xl shadow-lg
        p-6 flex flex-col overflow-y-auto
      "
    >
      <h3 className="text-2xl font-bold mb-4">Add Expense</h3>

      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Title"
        required
        className="w-full mb-3 p-2 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
      />
      <input
        name="amount"
        type="number"
        value={form.amount}
        onChange={handleChange}
        placeholder="Amount"
        required
        className="w-full mb-3 p-2 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
      />
      <input
        name="category"
        value={form.category}
        onChange={handleChange}
        placeholder="Category"
        required
        className="w-full mb-3 p-2 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
      />
      <select
        name="type"
        value={form.type}
        onChange={handleChange}
        className="w-full mb-3 p-2 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
      >
        <option>Need</option>
        <option>Want</option>
      </select>
      <input
        name="date"
        type="date"
        value={form.date}
        onChange={handleChange}
        required
        className="w-full mb-6 p-2 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
      />

      <div className="mt-auto flex space-x-4">
        <button
          type="submit"
          className="flex-1 py-2 bg-black text-white font-semibold hover:bg-gray-800 transition"
        >
          {editingExpense ? 'Update' : 'Add'}
        </button>
        {editingExpense && (
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 py-2 bg-red-600 text-white font-semibold hover:bg-red-700 transition"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default ExpenseForm;
