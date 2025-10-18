import React from 'react';
import { useAuth } from "../../context/AuthContext";



export default function AdminDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <button
              onClick={logout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Users</h3>
              <p className="text-blue-700">Manage user accounts</p>
              <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                View Users
              </button>
            </div>
            
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-green-900 mb-2">Products</h3>
              <p className="text-green-700">Manage product catalog</p>
              <button className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors">
                Manage Products
              </button>
            </div>
            
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-900 mb-2">Analytics</h3>
              <p className="text-purple-700">View system analytics</p>
              <button className="mt-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors">
                View Reports
              </button>
            </div>
            
            <div className="bg-orange-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-orange-900 mb-2">Settings</h3>
              <p className="text-orange-700">System configuration</p>
              <button className="mt-2 bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition-colors">
                Configure
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
