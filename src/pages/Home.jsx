import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user, logout } = useAuth();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Welcome {user?.name || user?.email || 'Guest'}</h1>
      <p className="mt-4">This is the home page of your Pawfect Match app.</p>
      <div className="mt-6">
        <button onClick={logout} className="px-3 py-2 bg-red-600 text-white rounded">Logout</button>
      </div>
    </div>
  );
}
