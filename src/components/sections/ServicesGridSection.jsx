import React from 'react';
import Card from '../common/Card';
import { getIcon } from '../../utils/iconUtils';

export default function ServicesGridSection({ 
  title = "Our Services",
  services = [],
  className = ''
}) {
  return (
    <section className={`py-20 px-4 bg-white ${className}`}>
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
          {title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} hover className="text-center p-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-100 to-purple-100 text-pink-600 rounded-full mb-6">
                {getIcon(service.iconName, "w-8 h-8")}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {service.title}
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {service.description}
              </p>
              {service.features && (
                <ul className="text-left space-y-2 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-gray-600">
                      <span className="w-2 h-2 bg-pink-500 rounded-full mr-3"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              )}
              {service.price && (
                <div className="text-2xl font-bold text-indigo-600 mb-4">
                  {service.price}
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
