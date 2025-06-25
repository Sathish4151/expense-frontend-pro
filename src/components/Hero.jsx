import React from 'react';

const Hero = () => (
  <section className="bg-white">
    <div className="max-w-4xl mx-auto px-6 py-20 text-center">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
        Manage your expenses effortlessly
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Add, track, and organize your spending all in one place.
      </p>
      <button
        onClick={() => document.getElementById('form-section').scrollIntoView({ behavior: 'smooth' })}
        className="px-8 py-3 bg-black text-white rounded-full hover:bg-indigo-600 transition"
      >
        Get Started
      </button>
    </div>
  </section>
);

export default Hero;
