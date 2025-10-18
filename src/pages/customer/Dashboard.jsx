import React from 'react';
import { useAuth } from "../../context/AuthContext";


export default function UserDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome, {user?.fullName}!
            </h1>
            <button
              onClick={logout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-indigo-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-indigo-900 mb-2">Pet Profile</h3>
              <p className="text-indigo-700">Name: {user?.petName}</p>
              <p className="text-indigo-700">Type: {user?.petType}</p>
              <p className="text-indigo-700">Size: {user?.petSize}</p>
            </div>
            
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-green-900 mb-2">AI Analysis</h3>
              <p className="text-green-700">Get personalized recommendations</p>
              <button className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors">
                Start Analysis
              </button>
            </div>
            
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-900 mb-2">Shop</h3>
              <p className="text-purple-700">Browse pet accessories</p>
              <button className="mt-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors">
                Go Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
