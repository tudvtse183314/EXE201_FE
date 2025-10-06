import React from 'react';

export default function StepsSection({ 
  title = "How Pawfect Match Works",
  steps = [],
  className = ''
}) {
  return (
    <section className={`py-20 px-4 bg-gray-50 ${className}`}>
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
          {title}
        </h2>
        <div className="space-y-16">
          {steps.map((step, index) => (
            <div key={index} className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12`}>
              <div className="flex-1">
                <div className="text-sm font-semibold text-indigo-600 mb-2">{step.step}</div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600 text-lg">{step.description}</p>
              </div>
              <div className="flex-1">
                <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-3xl p-12 text-center text-8xl shadow-lg">
                  {step.image}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
