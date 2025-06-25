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

  if (!token) return <AuthForm setToken={setToken} />;

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard expenses={expenses} token={token} />;
      case 'add-expense':
        return (
          <AddExpensePage 
            token={token} 
            expenses={expenses} 
            setExpenses={setExpenses}
            onNavigate={handleNavigate}
          />
        );
      default:
        return <Dashboard expenses={expenses} token={token} />;
    }
  };

  return (
    <>
      <Navbar
        token={token}
        onLogout={handleLogout}
        expenses={expenses}
        activePage={currentPage}
        onNavigate={handleNavigate}
      />
      {renderCurrentPage()}
    </>
  );
}

export default App;
