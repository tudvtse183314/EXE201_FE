import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axiosInstance.post('/auth/login', { email, password });
      // Expect backend to return { user: {...}, token: '...' }
      const { user, token } = res.data;
      if (!token) {
        setError('Login failed: no token returned');
        return;
      }
      login(user, token);
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Đăng nhập thất bại');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Đăng nhập</h2>
        {error && <div className="mb-4 text-red-600">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              type="email"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Mật khẩu</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              type="password"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Đăng nhập</button>
            <button type="button" onClick={()=>navigate('/register')} className="text-sm text-blue-600">Đăng ký</button>
          </div>
        </form>
      </div>
    </div>
  );
}
