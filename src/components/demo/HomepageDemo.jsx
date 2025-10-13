import React from 'react';
import { motion } from 'framer-motion';
import HomePage from '../pages/HomePage';

const HomepageDemo = () => {
  return (
    <div className="min-h-screen">
      {/* Demo Header */}
      <motion.div 
        className="bg-gradient-to-r from-pink-500 to-pink-600 text-white py-4 px-4 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold">🏠 New Homepage Demo</h1>
        <p className="text-pink-100 mt-1">
          Beautiful, responsive homepage with Framer Motion animations
        </p>
      </motion.div>

      {/* Homepage Content */}
      <HomePage />
    </div>
  );
};

export default HomepageDemo;
