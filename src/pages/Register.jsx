import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }
    try {
      const res = await axiosInstance.post('/auth/register', { name, email, password });
      // assume success -> redirect to login
      navigate('/login', { replace: true });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Đăng ký thất bại');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Đăng ký</h2>
        {error && <div className="mb-4 text-red-600">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Họ và tên</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={name}
              onChange={(e)=>setName(e.target.value)}
              required
            />
          </div>
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
          <div>
            <label className="block text-sm font-medium">Xác nhận mật khẩu</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={confirmPassword}
              onChange={(e)=>setConfirmPassword(e.target.value)}
              type="password"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Đăng ký</button>
            <button type="button" onClick={()=>navigate('/login')} className="text-sm text-blue-600">Đăng nhập</button>
          </div>
        </form>
      </div>
    </div>
  );
}
