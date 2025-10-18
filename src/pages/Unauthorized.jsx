import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react';

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-4xl font-bold text-red-600 mb-2">403</h1>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Unauthorized Access</h2>
          <p className="text-gray-600">
            You don't have permission to view this page. Please contact your administrator if you believe this is an error.
          </p>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={() => navigate(-1)}
            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Home className="h-4 w-4 mr-2" />
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}