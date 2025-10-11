import React from 'react';
import { Camera, Brain, Sparkles, CheckCircle, Clock, Heart } from 'lucide-react';

/**
 * HowItWorks Component
 * Explains the AI analysis process and benefits
 */
export default function HowItWorks({ className = '' }) {
  const steps = [
    {
      icon: Camera,
      title: 'Upload Photo',
      description: 'Simply upload a clear photo of your beloved pet to get started.',
      color: 'indigo'
    },
    {
      icon: Brain,
      title: 'AI Processes',
      description: 'Our advanced AI analyzes breed, size, and behavioral cues from the image.',
      color: 'purple'
    },
    {
      icon: Sparkles,
      title: 'Get Recommendations',
      description: 'Receive personalized suggestions for accessories tailored to your pet\'s unique needs.',
      color: 'pink'
    }
  ];

  const benefits = [
    {
      icon: CheckCircle,
      title: 'Precision Matching',
      description: 'Eliminate guesswork with recommendations perfectly suited for your pet.',
      color: 'green'
    },
    {
      icon: Clock,
      title: 'Save Time & Money',
      description: 'Avoid costly returns and find the right products the first time.',
      color: 'blue'
    },
    {
      icon: Heart,
      title: 'Happier Pets',
      description: 'Ensure your pet enjoys comfortable, safe, and stylish accessories.',
      color: 'pink'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      indigo: 'bg-indigo-100 text-indigo-600',
      purple: 'bg-purple-100 text-purple-600',
      pink: 'bg-pink-100 text-pink-600',
      green: 'bg-green-100 text-green-600',
      blue: 'bg-blue-100 text-blue-600'
    };
    return colors[color] || colors.indigo;
  };

  return (
    <div className={className}>
      {/* How It Works Section */}
      <div className="mb-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h3>
        <div className="space-y-6">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(step.color)}`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">{step.title}</h4>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute left-6 mt-12 w-0.5 h-8 bg-gray-200"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Benefits Section */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Benefits of AI Analysis</h3>
        <div className="space-y-6">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0">
                  <IconComponent className={`w-6 h-6 ${getColorClasses(benefit.color).split(' ')[1]}`} />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">{benefit.title}</h4>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Technology Info */}
      <div className="mt-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-3">🤖 Powered by Advanced AI</h4>
        <p className="text-gray-700 text-sm leading-relaxed mb-4">
          Our AI system uses computer vision and machine learning to analyze your pet's physical characteristics, 
          breed traits, and behavioral indicators. This technology helps us understand your pet's unique needs 
          and recommend products that will enhance their comfort and happiness.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="text-center">
            <div className="font-semibold text-indigo-600">95%+</div>
            <div className="text-gray-600">Accuracy Rate</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-purple-600">1000+</div>
            <div className="text-gray-600">Pet Breeds Analyzed</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-pink-600">50K+</div>
            <div className="text-gray-600">Successful Matches</div>
          </div>
        </div>
      </div>
    </div>
  );
}

