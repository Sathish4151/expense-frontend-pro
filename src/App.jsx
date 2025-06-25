import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import AddExpensePage from './components/AddExpensePage';
import AuthForm from './components/AuthForm';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [editingExpense, setEditingExpense] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

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
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  if (!token) return <AuthForm setToken={setToken} />;

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
    if (page !== 'add-expense') {
      setEditingExpense(null);
    }
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setCurrentPage('add-expense');
  };

  const handleToggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard expenses={expenses} token={token} setExpenses={setExpenses} onEditExpense={handleEditExpense} />;
      case 'add-expense':
        return (
          <AddExpensePage 
            token={token} 
            expenses={expenses} 
            setExpenses={setExpenses}
            onNavigate={handleNavigate}
            editingExpense={editingExpense}
            setEditingExpense={setEditingExpense}
          />
        );
      default:
        return <Dashboard expenses={expenses} token={token} setExpenses={setExpenses} onEditExpense={handleEditExpense} />;
    }
  };

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <Navbar
        token={token}
        onLogout={handleLogout}
        expenses={expenses}
        activePage={currentPage}
        onNavigate={handleNavigate}
        onToggleTheme={handleToggleTheme}
      />
      {renderCurrentPage()}
    </div>
  );
}

export default App;
