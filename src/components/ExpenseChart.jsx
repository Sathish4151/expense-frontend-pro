import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const COLORS = ['#000000', '#444444', '#888888', '#BBBBBB', '#DDDDDD'];

export default function ExpenseChart({ expenses }) {
  const totals = {};
  expenses.forEach(({ category, amount }) => {
    totals[category] = (totals[category] || 0) + Number(amount);
  });
  const data = Object.entries(totals).map(([name, value]) => ({ name, value }));

  return (
    <div className="w-full bg-white border border-black rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold mb-4">Spending by Category</h3>
      {data.length === 0 ? (
        <p>No expenses yet to chart.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" outerRadius={100} label>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Legend verticalAlign="bottom" />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
