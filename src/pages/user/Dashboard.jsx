import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const dashboardItems = [
    {
      title: 'My Pets',
      description: 'Manage your pet profiles and preferences',
      icon: '🐕',
      action: () => navigate('/pets')
    },
    {
      title: 'My Orders',
      description: 'View and track your orders',
      icon: '📦',
      action: () => navigate('/orders')
    },
    {
      title: 'AI Recommendations',
      description: 'Get personalized product recommendations',
      icon: '🤖',
      action: () => navigate('/recommendations')
    },
    {
      title: 'Profile Settings',
      description: 'Update your account information',
      icon: '⚙️',
      action: () => navigate('/profile')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name || user?.email || 'User'}!
          </h1>
          <p className="text-xl text-gray-600">
            Manage your pets and discover new products tailored just for them.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-indigo-600 mb-2">2</div>
            <div className="text-gray-600">Active Pets</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">5</div>
            <div className="text-gray-600">Total Orders</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">12</div>
            <div className="text-gray-600">Recommendations</div>
          </Card>
        </div>

        {/* Dashboard Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardItems.map((item, index) => (
            <Card key={index} hover className="p-6 text-center cursor-pointer" onClick={item.action}>
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.description}</p>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mr-4">🛍️</div>
              <div>
                <div className="font-semibold">New order placed</div>
                <div className="text-sm text-gray-600">Premium dog food - 2 hours ago</div>
              </div>
            </div>
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mr-4">🤖</div>
              <div>
                <div className="font-semibold">AI recommendation updated</div>
                <div className="text-sm text-gray-600">New toys for Max - 1 day ago</div>
              </div>
            </div>
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mr-4">🐕</div>
              <div>
                <div className="font-semibold">Pet profile updated</div>
                <div className="text-sm text-gray-600">Max's preferences - 3 days ago</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Logout Button */}
        <div className="mt-8 text-center">
          <Button variant="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
