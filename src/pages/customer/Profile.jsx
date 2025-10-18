import React from 'react';
import { useAuth } from '../../context/AuthContext';

export default function CustomerProfile() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <button
              onClick={logout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <p className="mt-1 text-sm text-gray-900">{user?.fullName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-sm text-gray-900">{user?.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <p className="mt-1 text-sm text-gray-900">{user?.phone}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Pet Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Pet Name</label>
                  <p className="mt-1 text-sm text-gray-900">{user?.petName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Pet Type</label>
                  <p className="mt-1 text-sm text-gray-900">{user?.petType}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Pet Size</label>
                  <p className="mt-1 text-sm text-gray-900">{user?.petSize}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Pet Age</label>
                  <p className="mt-1 text-sm text-gray-900">{user?.petAge}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
