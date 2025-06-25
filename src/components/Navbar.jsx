import React, { useState } from 'react';
import jsPDF from 'jspdf';
import logo from '../assets/logo.png';

export default function Navbar({ token, onLogout, expenses, activePage, onNavigate }) {
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
        ? 'bg-blue-600 text-white shadow-md' 
        : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
    }`;

  return (
    <nav className="w-full bg-white border-b shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo + Brand */}
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="h-8 w-8 mr-3" />
          <span className="text-xl font-bold text-gray-900">ExpenseTracker</span>
        </div>

        {/* Nav links */}
        <ul className="flex space-x-4 text-black">
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
              className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-all duration-200"
            >
              Download Report
            </button>
          </li>

          {token ? (
            <li className="relative">
              <button
                onClick={() => setOpen(o => !o)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200"
              >
                Profile ▼
              </button>
              {open && (
                <ul className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <li>
                    <button
                      onClick={onLogout}
                      className="block px-4 py-2 text-left w-full hover:bg-gray-100 rounded-lg transition-colors"
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
                <button className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-all duration-200">
                  Sign Up
                </button>
              </li>
              <li>
                <button className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-all duration-200">
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
