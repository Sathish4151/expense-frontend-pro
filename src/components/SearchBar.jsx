import React from 'react';

const SearchBar = ({ searchTerm, setSearchTerm }) => (
  <div className="bg-white">
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search expenses…"
          className="w-full py-3 px-6 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />
        <button className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-black text-white p-2 rounded-full hover:bg-indigo-600 transition">
          🔍
        </button>
      </div>
    </div>
  </div>
);

export default SearchBar;
