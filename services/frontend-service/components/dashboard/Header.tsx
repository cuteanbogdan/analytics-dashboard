import React from "react";

const Header: React.FC = () => {
  return (
    <header className="w-full max-w-5xl p-4 flex justify-between items-center">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
      <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
        Logout
      </button>
    </header>
  );
};

export default Header;
