import React from 'react';
import { Camera, Brain, ShoppingBag, CheckCircle } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      icon: Camera,
      title: 'Upload Photo',
      description: 'Take a clear photo of your pet or upload an existing one'
    },
    {
      icon: Brain,
      title: 'AI Analysis',
      description: 'Our AI analyzes breed, size, age, and temperament'
    },
    {
      icon: ShoppingBag,
      title: 'Get Recommendations',
      description: 'Receive personalized product recommendations'
    },
    {
      icon: CheckCircle,
      title: 'Shop & Enjoy',
      description: 'Add items to cart and provide the best for your pet'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">How It Works</h3>
      
      <div className="space-y-6">
        {steps.map((step, index) => (
          <div key={index} className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                <step.icon className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-1">
                {index + 1}. {step.title}
              </h4>
              <p className="text-gray-600 text-sm">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
        <h4 className="font-semibold text-indigo-900 mb-2">Why Choose AI Analysis?</h4>
        <ul className="text-sm text-indigo-800 space-y-1">
          <li>• 95% accuracy in breed identification</li>
          <li>• Personalized recommendations</li>
          <li>• Saves time and money</li>
          <li>• Expert-level insights</li>
        </ul>
      </div>
    </div>
  );
}
