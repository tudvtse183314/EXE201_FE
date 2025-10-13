import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/register');
  };

  const handleLearnMore = () => {
    const whyChooseSection = document.getElementById('why-choose');
    if (whyChooseSection) {
      whyChooseSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="/src/assets/home/hero-dogs.png" 
          alt="Happy Dogs"
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to a gradient background if image fails to load
            e.target.style.display = 'none';
            e.target.parentElement.style.background = 'linear-gradient(135deg, #ff8fab 0%, #ffb6c1 50%, #ffc0cb 100%)';
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-6xl mx-auto">
        <motion.h1 
          className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg"
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Discover Your Pet's Perfect Match
        </motion.h1>
        
        <motion.p 
          className="text-xl md:text-2xl mb-8 drop-shadow-md max-w-4xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          Our AI-driven app helps you find the best accessories, toys, and food tailored to your pet's unique personality and needs.
        </motion.p>
        
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
        <motion.button 
          onClick={handleGetStarted}
          className="bg-gradient-to-r from-oldCopper-400 to-oldCopper-500 hover:from-oldCopper-500 hover:to-oldCopper-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-old-copper-warm"
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0 20px 25px -5px rgba(237, 162, 116, 0.3), 0 10px 10px -5px rgba(237, 162, 116, 0.1)"
          }}
          whileTap={{ scale: 0.95 }}
        >
          Get Started
        </motion.button>
          
          <motion.button 
            onClick={handleLearnMore}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 backdrop-blur-sm border border-white border-opacity-30"
            whileHover={{ 
              scale: 1.05,
              backgroundColor: "rgba(255, 255, 255, 0.3)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            Learn More
          </motion.button>
        </motion.div>
      </div>

      {/* Parallax Effect */}
      <motion.div 
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/src/assets/home/hero-dogs.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(0px)"
        }}
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </section>
  );
};

export default HeroSection;