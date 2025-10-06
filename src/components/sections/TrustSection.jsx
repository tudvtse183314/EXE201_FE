import React from 'react';

export default function TrustSection({ 
  title = "Trusted by Pet Lovers Everywhere",
  trustItems = [],
  className = ''
}) {
  const defaultTrustItems = ['🐾', '🏆', '⭐', '💝', '🎯', '🌟'];

  return (
    <section className={`py-16 px-4 bg-white ${className}`}>
      <div className="max-w-7xl mx-auto">
        <h3 className="text-2xl font-bold text-center text-gray-900 mb-12">
          {title}
        </h3>
        <div className="flex flex-wrap justify-center items-center gap-12 opacity-50">
          {(trustItems.length > 0 ? trustItems : defaultTrustItems).map((item, index) => (
            <div key={index} className="text-4xl">
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
