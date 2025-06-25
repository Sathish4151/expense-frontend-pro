import React, { useState } from 'react';
import jsPDF from 'jspdf';
// Import your logo
import logo from '../assets/logo.png';

export default function Navbar({ token, onLogout, expenses, activePage }) {
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
      ).toLocaleDateString()}`;
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
    `hover:underline ${activePage === page ? 'underline font-bold' : ''}`;

  return (
    <nav className="w-full bg-white border-b">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo + Brand */}
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="h-8 w-8 mr-3" />
          <span className="text-xl font-bold">ExpenseTracker</span>
        </div>

        {/* Nav links */}
        <ul className="flex space-x-8 text-black">
          <li>
            <button
              onClick={() =>
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }
              className={linkClass('dashboard')}
            >
              Dashboard
            </button>
          </li>
          <li>
            <button onClick={downloadReport} className={linkClass('report')}>
              Report
            </button>
          </li>

          {token ? (
            <li className="relative">
              <button
                onClick={() => setOpen(o => !o)}
                className="px-3 py-1 border border-black"
              >
                Profile ▼
              </button>
              {open && (
                <ul className="absolute right-0 mt-2 bg-white border border-black">
                  <li>
                    <button
                      onClick={onLogout}
                      className="block px-4 py-2 text-left w-full hover:bg-gray-100"
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
                <button className={linkClass('signup')}>Sign Up</button>
              </li>
              <li>
                <button className={linkClass('signin')}>Sign In</button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
