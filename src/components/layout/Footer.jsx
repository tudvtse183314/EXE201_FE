import React from 'react';

export default function Footer() {
  const footerLinks = [
    { label: 'Privacy', href: '#' },
    { label: 'Terms', href: '#' },
    { label: 'Contact', href: '#' }
  ];

  return (
    <footer className="bg-gray-900 text-white py-12 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-gray-400">© 2025 Pawfect Match</p>
        
        {/* Footer Links */}
        <div className="mt-4 flex justify-center gap-6">
          {footerLinks.map((link, index) => (
            <a 
              key={index}
              href={link.href} 
              className="text-gray-400 hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
        
        {/* Attribution */}
        <div className="mt-8 text-sm text-gray-500">
          Made with ❤️ Visily
        </div>
      </div>
    </footer>
  );
}
