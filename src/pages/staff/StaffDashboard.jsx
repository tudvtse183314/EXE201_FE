import React from 'react';
import { useAuth } from '../../context/AuthContext';

export default function StaffDashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Staff Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.name || 'Staff Member'}!</p>
            </div>
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              STAFF
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Orders Management</h3>
              <p className="text-blue-100">Manage customer orders and fulfillment</p>
            </div>
            
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Inventory</h3>
              <p className="text-green-100">Track and manage product inventory</p>
            </div>
            
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Customer Support</h3>
              <p className="text-purple-100">Handle customer inquiries and issues</p>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center">
              <div className="text-yellow-600 mr-3">⚠️</div>
              <div>
                <h4 className="text-yellow-800 font-medium">Coming Soon</h4>
                <p className="text-yellow-700 text-sm">Full staff management features are under development.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

