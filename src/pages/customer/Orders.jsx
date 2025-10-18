import React from 'react';
import { useAuth } from '../../context/AuthContext';

export default function CustomerOrders() {
  const { user } = useAuth();

  // Mock orders data
  const orders = [
    {
      id: 1,
      date: '2025-01-15',
      status: 'Delivered',
      total: 89.99,
      items: ['Premium Dog Collar', 'Interactive Toy']
    },
    {
      id: 2,
      date: '2025-01-10',
      status: 'Shipped',
      total: 45.50,
      items: ['Dog Food Bowl Set']
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">My Orders</h1>
          
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Order #{order.id}</h3>
                    <p className="text-sm text-gray-600">Ordered on {order.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">${order.total}</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Items:</h4>
                  <ul className="text-sm text-gray-600">
                    {order.items.map((item, index) => (
                      <li key={index}>• {item}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-4 flex gap-2">
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                    View Details
                  </button>
                  {order.status === 'Delivered' && (
                    <button className="border border-indigo-600 text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-50 transition-colors">
                      Reorder
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
