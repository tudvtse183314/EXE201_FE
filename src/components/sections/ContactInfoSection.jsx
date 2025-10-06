import React from 'react';
import Card from '../common/Card';
import { getIcon } from '../../utils/iconUtils';

export default function ContactInfoSection({ 
  title = "Get in Touch",
  contactInfo = [],
  className = ''
}) {
  return (
    <section className={`py-20 px-4 bg-white ${className}`}>
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
          {title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {contactInfo.map((info, index) => (
            <Card key={index} className="text-center p-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full mb-4">
                {getIcon(info.iconName, "w-8 h-8")}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {info.title}
              </h3>
              <p className="text-gray-600">
                {info.value}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
