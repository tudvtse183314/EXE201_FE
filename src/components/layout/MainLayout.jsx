import React from 'react';
import Header from './Header';
import Footer from './Footer';

export default function MainLayout({ children, className = '' }) {
  return (
    <div className={`min-h-screen bg-white ${className}`}>
      <Header />
      <main className="pt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
}
