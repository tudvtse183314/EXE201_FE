import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, User, Star, ArrowRight, CheckCircle } from 'lucide-react';

const OldCopperDemo = () => {
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
          <h1 className="text-4xl font-bold text-oldCopper-1600 text-center mb-2">
            🎨 Old Copper Theme Demo
          </h1>
          <p className="text-oldCopper-1300 text-center">
            Warm, friendly, and professional pet care aesthetic
          </p>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Color Palette Showcase */}
        <motion.section 
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-oldCopper-1600 mb-8 text-center">
            Color Palette
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: '50', color: 'bg-oldCopper-50', text: 'text-oldCopper-1600' },
              { name: '100', color: 'bg-oldCopper-100', text: 'text-oldCopper-1600' },
              { name: '200', color: 'bg-oldCopper-200', text: 'text-oldCopper-1600' },
              { name: '300', color: 'bg-oldCopper-300', text: 'text-white' },
              { name: '400', color: 'bg-oldCopper-400', text: 'text-white' },
              { name: '500', color: 'bg-oldCopper-500', text: 'text-white' },
              { name: '600', color: 'bg-oldCopper-600', text: 'text-white' },
              { name: '700', color: 'bg-oldCopper-700', text: 'text-white' },
              { name: '800', color: 'bg-oldCopper-800', text: 'text-white' },
              { name: '900', color: 'bg-oldCopper-900', text: 'text-white' },
              { name: '1300', color: 'bg-oldCopper-1300', text: 'text-white' },
              { name: '1600', color: 'bg-oldCopper-1600', text: 'text-white' },
            ].map((item, index) => (
              <motion.div
                key={index}
                className={`${item.color} ${item.text} p-4 rounded-lg text-center font-semibold shadow-old-copper-card`}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                {item.name}
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Button Showcase */}
        <motion.section 
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold text-oldCopper-1600 mb-8 text-center">
            Button Styles
          </h2>
          
          <div className="flex flex-wrap justify-center gap-6">
            <motion.button 
              className="bg-oldCopper-400 hover:bg-oldCopper-500 text-white px-6 py-3 rounded-lg font-semibold shadow-old-copper-warm transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Primary Button
            </motion.button>
            
            <motion.button 
              className="bg-oldCopper-500 hover:bg-oldCopper-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Secondary Button
            </motion.button>
            
            <motion.button 
              className="bg-oldCopper-300 hover:bg-oldCopper-400 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Accent Button
            </motion.button>
            
            <motion.button 
              className="border-2 border-oldCopper-400 text-oldCopper-400 hover:bg-oldCopper-400 hover:text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Outline Button
            </motion.button>
          </div>
        </motion.section>

        {/* Card Showcase */}
        <motion.section 
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-oldCopper-1600 mb-8 text-center">
            Card Components
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Heart,
                title: "AI-Powered Matching",
                description: "Advanced AI analyzes traits to recommend accessories tailored to each pet."
              },
              {
                icon: ShoppingCart,
                title: "Seamless Shopping",
                description: "Shop your pet's favorites directly within the app with ease."
              },
              {
                icon: User,
                title: "Personalized Profiles",
                description: "Create detailed pet profiles for smarter recommendations."
              }
            ].map((card, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl shadow-old-copper-card p-8 hover:shadow-old-copper-glow transition-all duration-300 group"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex flex-col items-center text-center">
                  <motion.div 
                    className="w-16 h-16 bg-gradient-to-br from-oldCopper-100 to-oldCopper-200 rounded-full flex items-center justify-center mb-6 group-hover:from-oldCopper-200 group-hover:to-oldCopper-300 transition-all duration-300"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <card.icon className="w-8 h-8 text-oldCopper-400" />
                  </motion.div>
                  
                  <h3 className="text-xl font-bold text-oldCopper-1600 mb-4">
                    {card.title}
                  </h3>
                  
                  <p className="text-oldCopper-1300 leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Gradient Showcase */}
        <motion.section 
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-oldCopper-1600 mb-8 text-center">
            Gradient Backgrounds
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div 
              className="bg-gradient-to-r from-oldCopper-300 to-oldCopper-400 rounded-2xl p-8 text-white"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-2xl font-bold mb-4">Warm Glow</h3>
              <p className="text-oldCopper-100">Perfect for hero sections and primary CTAs</p>
            </motion.div>
            
            <motion.div 
              className="bg-gradient-to-br from-oldCopper-300 via-oldCopper-500 to-oldCopper-700 rounded-2xl p-8 text-white"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-2xl font-bold mb-4">Sunset</h3>
              <p className="text-oldCopper-100">Full spectrum gradient for special sections</p>
            </motion.div>
          </div>
        </motion.section>

        {/* Form Elements */}
        <motion.section 
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-oldCopper-1600 mb-8 text-center">
            Form Elements
          </h2>
          
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-old-copper-card p-8">
            <div className="space-y-6">
              <div>
                <label className="block text-oldCopper-1600 font-semibold mb-2">
                  Email Address
                </label>
                <input 
                  type="email" 
                  className="w-full px-4 py-3 border-2 border-oldCopper-300 rounded-lg focus:border-oldCopper-400 focus:outline-none transition-colors duration-300"
                  placeholder="Enter your email"
                />
              </div>
              
              <div>
                <label className="block text-oldCopper-1600 font-semibold mb-2">
                  Password
                </label>
                <input 
                  type="password" 
                  className="w-full px-4 py-3 border-2 border-oldCopper-300 rounded-lg focus:border-oldCopper-400 focus:outline-none transition-colors duration-300"
                  placeholder="Enter your password"
                />
              </div>
              
              <motion.button 
                className="w-full bg-oldCopper-400 hover:bg-oldCopper-500 text-white px-6 py-3 rounded-lg font-semibold shadow-old-copper-warm transition-all duration-300 flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Sign In
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </motion.section>

        {/* Typography Showcase */}
        <motion.section 
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <h2 className="text-3xl font-bold text-oldCopper-1600 mb-8 text-center">
            Typography
          </h2>
          
          <div className="bg-white rounded-2xl shadow-old-copper-card p-8">
            <div className="space-y-6">
              <h1 className="text-5xl font-bold text-oldCopper-1600">Heading 1</h1>
              <h2 className="text-4xl font-semibold text-oldCopper-1500">Heading 2</h2>
              <h3 className="text-3xl font-medium text-oldCopper-1600">Heading 3</h3>
              <h4 className="text-2xl font-medium text-oldCopper-1600">Heading 4</h4>
              <p className="text-lg text-oldCopper-1300">Large body text for important content</p>
              <p className="text-base text-oldCopper-1300">Regular body text for general content</p>
              <p className="text-sm text-oldCopper-900">Small text for secondary information</p>
              
              <div className="pt-4">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-oldCopper-400 to-oldCopper-700 bg-clip-text text-transparent mb-4">
                  Gradient Text
                </h3>
                <p className="text-oldCopper-1300">Perfect for special headings and highlights</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Call to Action */}
        <motion.section 
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <div className="bg-gradient-to-r from-oldCopper-300 to-oldCopper-500 rounded-2xl p-12 text-white">
            <h2 className="text-4xl font-bold mb-4">Ready to Use Old Copper Theme?</h2>
            <p className="text-oldCopper-100 text-lg mb-8 max-w-2xl mx-auto">
              The Old Copper theme provides a warm, friendly, and professional aesthetic perfect for pet care applications.
            </p>
            <motion.button 
              className="bg-white text-oldCopper-400 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-oldCopper-100 transition-all duration-300 shadow-old-copper-warm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started with PetVibe
            </motion.button>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default OldCopperDemo;
