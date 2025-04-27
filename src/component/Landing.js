import React from 'react';
import Header from './Header';
import { Link } from 'react-router';

function Landing() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      {/* Dashboard Content */}
      <main className="max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
  <h2 className="text-2xl font-semibold text-gray-800">Dashboard</h2>
  
  <Link to="/projects">
    <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition">
      Manage Projects
    </button>
  </Link>
</div>


        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-lg font-medium text-gray-700">Pending Tasks</h3>
            <p className="text-3xl font-bold text-indigo-600 mt-2">3</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-lg font-medium text-gray-700">Ongoing Projects</h3>
            <p className="text-3xl font-bold text-indigo-600 mt-2">4</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-lg font-medium text-gray-700">Completed Tasks</h3>
            <p className="text-3xl font-bold text-indigo-600 mt-2">7</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-lg font-medium text-gray-700">Upcoming Deadlines</h3>
            <p className="text-3xl font-bold text-indigo-600 mt-2">2</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-lg font-medium text-gray-700">Total Projects</h3>
            <p className="text-3xl font-bold text-indigo-600 mt-2">6</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-lg font-medium text-gray-700">Overdue Tasks</h3>
            <p className="text-3xl font-bold text-red-500 mt-2">1</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Landing;
