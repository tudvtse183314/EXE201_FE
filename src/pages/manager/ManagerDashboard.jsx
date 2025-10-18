import React from 'react';
import { useAuth } from '../../context/AuthContext';

export default function ManagerDashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.name || 'Manager'}!</p>
            </div>
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              MANAGER
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Team Management</h3>
              <p className="text-indigo-100">Manage staff and team performance</p>
            </div>
            
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Analytics & Reports</h3>
              <p className="text-orange-100">View business analytics and reports</p>
            </div>
            
            <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Operations</h3>
              <p className="text-teal-100">Oversee daily operations and processes</p>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center">
              <div className="text-yellow-600 mr-3">⚠️</div>
              <div>
                <h4 className="text-yellow-800 font-medium">Coming Soon</h4>
                <p className="text-yellow-700 text-sm">Full management features are under development.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
