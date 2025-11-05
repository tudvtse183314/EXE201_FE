import React from 'react';
import { useAuth } from '../../context/AuthContext';

export default function DoctorDashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Doctor Dashboard</h1>
              <p className="text-gray-600">Welcome back, Dr. {user?.name || 'Doctor'}!</p>
            </div>
            <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
              DOCTOR
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Pet Consultations</h3>
              <p className="text-red-100">Schedule and manage pet consultations</p>
            </div>
            
            <div className="bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Medical Records</h3>
              <p className="text-pink-100">Access and update pet medical records</p>
            </div>
            
            <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Health Recommendations</h3>
              <p className="text-cyan-100">Provide health recommendations for pets</p>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center">
              <div className="text-yellow-600 mr-3">⚠️</div>
              <div>
                <h4 className="text-yellow-800 font-medium">Sắp ra mắt</h4>
                <p className="text-yellow-700 text-sm">Tính năng thú y đầy đủ đang được phát triển.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
