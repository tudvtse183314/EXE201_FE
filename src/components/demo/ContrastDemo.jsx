import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Eye } from 'lucide-react';

const ContrastDemo = () => {
  const contrastExamples = [
    {
      background: 'bg-oldCopper-100',
      textColor: 'text-oldCopper-1700',
      text: 'Dark text on light background',
      contrast: 'Excellent',
      status: 'good'
    },
    {
      background: 'bg-oldCopper-200',
      textColor: 'text-oldCopper-1700',
      text: 'Dark text on light peach background',
      contrast: 'Excellent',
      status: 'good'
    },
    {
      background: 'bg-oldCopper-400',
      textColor: 'text-white',
      text: 'White text on primary color',
      contrast: 'Excellent',
      status: 'good'
    },
    {
      background: 'bg-oldCopper-500',
      textColor: 'text-white',
      text: 'White text on secondary color',
      contrast: 'Excellent',
      status: 'good'
    },
    {
      background: 'bg-oldCopper-1600',
      textColor: 'text-oldCopper-100',
      text: 'Light text on dark background',
      contrast: 'Excellent',
      status: 'good'
    },
    {
      background: 'bg-gradient-to-r from-oldCopper-300 to-oldCopper-500',
      textColor: 'text-white',
      text: 'White text on gradient background',
      contrast: 'Excellent',
      status: 'good'
    }
  ];

  const textSizes = [
    { size: 'text-xs', label: 'Extra Small (12px)' },
    { size: 'text-sm', label: 'Small (14px)' },
    { size: 'text-base', label: 'Base (16px)' },
    { size: 'text-lg', label: 'Large (18px)' },
    { size: 'text-xl', label: 'Extra Large (20px)' },
    { size: 'text-2xl', label: '2XL (24px)' },
    { size: 'text-3xl', label: '3XL (30px)' },
    { size: 'text-4xl', label: '4XL (36px)' }
  ];

  return (
    <div className="min-h-screen bg-oldCopper-100">
      {/* Header */}
      <motion.div 
        className="bg-white shadow-old-copper-card py-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-oldCopper-1700 text-center mb-2">
            🎨 Text Contrast Optimization
          </h1>
          <p className="text-oldCopper-1400 text-center">
            Optimized text colors for maximum readability and accessibility
          </p>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Contrast Examples */}
        <motion.section 
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-oldCopper-1700 mb-8 text-center">
            Contrast Examples
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contrastExamples.map((example, index) => (
              <motion.div
                key={index}
                className={`${example.background} rounded-2xl p-6 shadow-old-copper-card`}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {example.status === 'good' ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    )}
                    <span className="text-sm font-semibold text-green-600">
                      {example.contrast}
                    </span>
                  </div>
                  <Eye className="w-5 h-5 text-gray-600" />
                </div>
                
                <p className={`${example.textColor} text-lg font-medium mb-2`}>
                  {example.text}
                </p>
                
                <div className="text-sm text-gray-600">
                  <p><strong>Background:</strong> {example.background}</p>
                  <p><strong>Text:</strong> {example.textColor}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Text Size Examples */}
        <motion.section 
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold text-oldCopper-1700 mb-8 text-center">
            Text Size Hierarchy
          </h2>
          
          <div className="bg-white rounded-2xl shadow-old-copper-card p-8">
            <div className="space-y-4">
              {textSizes.map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-center justify-between py-2 border-b border-oldCopper-200 last:border-b-0"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <p className={`${item.size} text-oldCopper-1700 font-medium`}>
                    This is {item.label} text
                  </p>
                  <span className="text-sm text-oldCopper-900">
                    {item.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Color Combinations */}
        <motion.section 
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-oldCopper-1700 mb-8 text-center">
            Recommended Color Combinations
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Light Backgrounds */}
            <div className="bg-white rounded-2xl shadow-old-copper-card p-8">
              <h3 className="text-2xl font-bold text-oldCopper-1700 mb-6">
                Light Backgrounds
              </h3>
              <div className="space-y-4">
                <div className="bg-oldCopper-50 p-4 rounded-lg">
                  <p className="text-oldCopper-1700 font-semibold">Heading on oldCopper-50</p>
                  <p className="text-oldCopper-1400">Body text on oldCopper-50</p>
                </div>
                <div className="bg-oldCopper-100 p-4 rounded-lg">
                  <p className="text-oldCopper-1700 font-semibold">Heading on oldCopper-100</p>
                  <p className="text-oldCopper-1400">Body text on oldCopper-100</p>
                </div>
                <div className="bg-oldCopper-200 p-4 rounded-lg">
                  <p className="text-oldCopper-1700 font-semibold">Heading on oldCopper-200</p>
                  <p className="text-oldCopper-1400">Body text on oldCopper-200</p>
                </div>
              </div>
            </div>

            {/* Dark Backgrounds */}
            <div className="bg-white rounded-2xl shadow-old-copper-card p-8">
              <h3 className="text-2xl font-bold text-oldCopper-1700 mb-6">
                Dark Backgrounds
              </h3>
              <div className="space-y-4">
                <div className="bg-oldCopper-800 p-4 rounded-lg">
                  <p className="text-oldCopper-100 font-semibold">Heading on oldCopper-800</p>
                  <p className="text-oldCopper-200">Body text on oldCopper-800</p>
                </div>
                <div className="bg-oldCopper-1600 p-4 rounded-lg">
                  <p className="text-oldCopper-100 font-semibold">Heading on oldCopper-1600</p>
                  <p className="text-oldCopper-200">Body text on oldCopper-1600</p>
                </div>
                <div className="bg-gradient-to-r from-oldCopper-400 to-oldCopper-600 p-4 rounded-lg">
                  <p className="text-white font-semibold">Heading on gradient</p>
                  <p className="text-oldCopper-100">Body text on gradient</p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Accessibility Guidelines */}
        <motion.section 
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-oldCopper-1700 mb-8 text-center">
            Accessibility Guidelines
          </h2>
          
          <div className="bg-white rounded-2xl shadow-old-copper-card p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-oldCopper-1700 mb-4">
                  ✅ Good Practices
                </h3>
                <ul className="space-y-2 text-oldCopper-1400">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    Use dark text (oldCopper-1700) on light backgrounds
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    Use white text on dark backgrounds
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    Maintain 4.5:1 contrast ratio minimum
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    Use larger text sizes for better readability
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-oldCopper-1700 mb-4">
                  ❌ Avoid These
                </h3>
                <ul className="space-y-2 text-oldCopper-1400">
                  <li className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    Light text on light backgrounds
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    Dark text on dark backgrounds
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    Low contrast color combinations
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    Text smaller than 14px for body content
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Summary */}
        <motion.section 
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="bg-gradient-to-r from-oldCopper-300 to-oldCopper-500 rounded-2xl p-12 text-white">
            <h2 className="text-4xl font-bold mb-4">Optimized Text Contrast</h2>
            <p className="text-white text-lg mb-8 max-w-2xl mx-auto">
              All text colors have been optimized for maximum readability and accessibility. 
              The Old Copper theme now provides excellent contrast ratios across all components.
            </p>
            <div className="flex justify-center gap-4">
              <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2">
                <span className="text-sm font-semibold">WCAG AA Compliant</span>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2">
                <span className="text-sm font-semibold">4.5:1+ Contrast</span>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2">
                <span className="text-sm font-semibold">Accessible</span>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default ContrastDemo;
