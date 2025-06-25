import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import ExpenseChart from './components/ExpenseChart';
import AuthForm from './components/AuthForm';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    if (token) {
      axios
        .get('/api/expenses', { headers: { 'x-auth-token': token } })
        .then(r => setExpenses(r.data))
        .catch(() => {
          localStorage.removeItem('token');
          setToken(null);
        });
    }
  }, [token]);

  useEffect(() => {
    const h = new Date().getHours();
    let g = 'Hello';
    if (h < 12) g = 'Good morning';
    else if (h < 17) g = 'Good afternoon';
    else if (h < 21) g = 'Good evening';
    else g = 'Good night';
    setGreeting(g);
  }, []);

  if (!token) return <AuthForm setToken={setToken} />;

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <>
      <Navbar
        token={token}
        onLogout={handleLogout}
        expenses={expenses}
        activePage="dashboard"
      />

      <div className="min-h-screen flex flex-col items-center py-12 px-4 bg-white">
        <div className="w-full max-w-6xl px-6">
          <h1 className="text-3xl font-bold mb-2">{greeting}! 👋</h1>
          <p className="text-lg mb-8">Let’s make your money work for you 💸</p>

          {/* 
            Make both cards equal height (h-96 on md+), 
            and stretch children to fill via h-full 
          */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <ExpenseForm
              token={token}
              expenses={expenses}
              setExpenses={setExpenses}
              editingExpense={editingExpense}
              setEditingExpense={setEditingExpense}
            />
            <ExpenseList
              expenses={expenses}
              setExpenses={setExpenses}
              setEditingExpense={setEditingExpense}
            />
          </div>

          {/* Chart below, with its own card styling */}
          <div className="mt-12">
            <ExpenseChart expenses={expenses} />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
