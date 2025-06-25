import React, { useState } from 'react';
import jsPDF from 'jspdf';
import logo from '../assets/logo.png';

export default function Navbar({ token, onLogout, expenses, activePage, onNavigate, onToggleTheme }) {
  const [open, setOpen] = useState(false);

  const downloadReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Your Expense Report', 14, 22);
    doc.setFontSize(12);
    let y = 32;
    expenses.forEach(e => {
      const line = `${e.title} | ₹${e.amount} | ${e.category} | ${new Date(
        e.date
      ).toLocaleDateString('en-IN')}`;
      doc.text(line, 14, y);
      y += 8;
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
    });
    doc.save('expense-report.pdf');
  };

  const linkClass = page =>
    `px-4 py-2 rounded-lg transition-all duration-200 ${
      activePage === page 
        ? 'bg-blue-600 text-white shadow-md dark:bg-blue-500 dark:text-white' 
        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400'
    }`;

  return (
    <nav className="w-full bg-white dark:bg-gray-900 border-b dark:border-gray-800 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo + Brand */}
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="h-8 w-8 mr-3" />
          <span className="text-xl font-bold text-gray-900 dark:text-white">ExpenseTracker</span>
        </div>

        {/* Nav links */}
        <ul className="flex space-x-4 text-black dark:text-gray-200 items-center">
          <li>
            <button
              onClick={() => onNavigate && onNavigate('dashboard')}
              className={linkClass('dashboard')}
            >
              Dashboard
            </button>
          </li>
          <li>
            <button 
              onClick={() => onNavigate && onNavigate('add-expense')}
              className={linkClass('add-expense')}
            >
              Add Expense
            </button>
          </li>
          <li>
            <button 
              onClick={downloadReport} 
              className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200"
            >
              Download Report
            </button>
          </li>
          <li>
            <button
              onClick={onToggleTheme}
              className="px-2 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200"
              title="Toggle theme"
            >
              {/* Sun/Moon icon (auto switch with CSS if desired) */}
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.95l-.71.71M21 12h-1M4 12H3m16.66 5.66l-.71-.71M4.05 4.05l-.71-.71M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </button>
          </li>

          {token ? (
            <li className="relative">
              <button
                onClick={() => setOpen(o => !o)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 text-gray-700 dark:text-gray-200"
              >
                Profile ▼
              </button>
              {open && (
                <ul className="absolute right-0 mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                  <li>
                    <button
                      onClick={onLogout}
                      className="block px-4 py-2 text-left w-full hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-700 dark:text-gray-200"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              )}
            </li>
          ) : (
            <>
              <li>
                <button className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200">
                  Sign Up
                </button>
              </li>
              <li>
                <button className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200">
                  Sign In
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
