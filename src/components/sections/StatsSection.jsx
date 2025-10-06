import React from 'react';
import { getIcon } from '../../utils/iconUtils';

export default function StatsSection({ 
  title = "Our Impact",
  stats = [],
  className = ''
}) {
  return (
    <section className={`py-20 px-4 bg-white ${className}`}>
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
          {title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-6 rounded-xl hover:bg-gray-50 transition-all hover:transform hover:-translate-y-2">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full mb-4">
                {getIcon(stat.iconName, "w-8 h-8")}
              </div>
              <div className="text-4xl font-bold text-indigo-600 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
