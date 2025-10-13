import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const CTASection = () => {
  const navigate = useNavigate();

  const handleGetRecommendations = () => {
    navigate('/register');
  };

  return (
    <section className="py-20 bg-gradient-to-br from-oldCopper-300 via-oldCopper-400 to-oldCopper-500 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-10 left-10 w-20 h-20 bg-white bg-opacity-20 rounded-full"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-10 right-10 w-16 h-16 bg-white bg-opacity-20 rounded-full"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/4 w-12 h-12 bg-white bg-opacity-15 rounded-full"
          animate={{ 
            scale: [1, 1.4, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
            Ready to Find the Perfect Match for Your Pet?
          </h2>
          
          <motion.p 
            className="text-xl md:text-2xl text-white mb-8 leading-relaxed max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            Join thousands of happy pet owners who found ideal products tailored to their furry friends.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            <motion.button 
              onClick={handleGetRecommendations}
              className="bg-white text-oldCopper-400 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-oldCopper-100 transition-all duration-300 transform hover:scale-105 shadow-old-copper-warm relative overflow-hidden group"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 25px -5px rgba(237, 162, 116, 0.3), 0 10px 10px -5px rgba(237, 162, 116, 0.1)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20"
                animate={{
                  x: ['-100%', '100%']
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              
              <span className="relative z-10">
                Get Personalized Recommendations
              </span>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Stats */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
        >
          <div className="text-center">
            <motion.div 
              className="text-3xl md:text-4xl font-bold text-white mb-2"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8, type: "spring", stiffness: 200 }}
            >
              10K+
            </motion.div>
            <p className="text-white">Happy Pet Owners</p>
          </div>
          
          <div className="text-center">
            <motion.div 
              className="text-3xl md:text-4xl font-bold text-white mb-2"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 1.0, type: "spring", stiffness: 200 }}
            >
              50K+
            </motion.div>
            <p className="text-white">Products Matched</p>
          </div>
          
          <div className="text-center">
            <motion.div 
              className="text-3xl md:text-4xl font-bold text-white mb-2"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 1.2, type: "spring", stiffness: 200 }}
            >
              98%
            </motion.div>
            <p className="text-white">Satisfaction Rate</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;