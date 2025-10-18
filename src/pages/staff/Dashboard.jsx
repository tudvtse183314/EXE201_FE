import React from 'react';
import { useAuth } from '../../context/AuthContext';

export default function StaffDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Staff Dashboard
            </h1>
            <button
              onClick={logout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Orders Management</h3>
              <p className="text-blue-700">Process and manage customer orders</p>
              <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                Manage Orders
              </button>
            </div>
            
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-green-900 mb-2">Inventory</h3>
              <p className="text-green-700">Track and manage product inventory</p>
              <button className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors">
                View Inventory
              </button>
            </div>
            
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-900 mb-2">Customer Support</h3>
              <p className="text-purple-700">Handle customer inquiries and support</p>
              <button className="mt-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors">
                Support Center
              </button>
            </div>
            
            <div className="bg-orange-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-orange-900 mb-2">Reports</h3>
              <p className="text-orange-700">Generate and view business reports</p>
              <button className="mt-2 bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition-colors">
                View Reports
              </button>
            </div>
            
            <div className="bg-indigo-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-indigo-900 mb-2">Product Management</h3>
              <p className="text-indigo-700">Add and update product information</p>
              <button className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors">
                Manage Products
              </button>
            </div>
            
            <div className="bg-pink-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-pink-900 mb-2">Analytics</h3>
              <p className="text-pink-700">View sales and performance analytics</p>
              <button className="mt-2 bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 transition-colors">
                View Analytics
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
