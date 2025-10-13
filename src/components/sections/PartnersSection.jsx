import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const PartnersSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const partners = [
    {
      name: "PetCo",
      logo: "/src/assets/home/partner-1.png",
      alt: "PetCo Logo"
    },
    {
      name: "Chewy",
      logo: "/src/assets/home/partner-2.png", 
      alt: "Chewy Logo"
    },
    {
      name: "PetSmart",
      logo: "/src/assets/home/partner-3.png",
      alt: "PetSmart Logo"
    },
    {
      name: "Royal Canin",
      logo: "/src/assets/home/partner-4.png",
      alt: "Royal Canin Logo"
    },
    {
      name: "Hill's",
      logo: "/src/assets/home/partner-5.png",
      alt: "Hill's Logo"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Trusted by Pet Lovers
          </h2>
          <p className="text-xl text-gray-600">
            Partnered with leading brands in pet care and nutrition
          </p>
        </motion.div>
        
        <motion.div 
          ref={ref}
          className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {partners.map((partner, index) => (
            <motion.div
              key={index}
              className="flex items-center justify-center p-6 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all duration-300 group"
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
              }}
            >
              <div className="relative">
                <img 
                  src={partner.logo}
                  alt={partner.alt}
                  className="h-12 w-auto object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                  onError={(e) => {
                    // Fallback to text-based logo
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = `
                      <div class="text-center">
                        <div class="text-2xl font-bold text-gray-600 group-hover:text-pink-600 transition-colors duration-300">
                          ${partner.name}
                        </div>
                        <div class="text-xs text-gray-400 mt-1">Partner</div>
                      </div>
                    `;
                  }}
                />
                
                {/* Hover effect overlay */}
                <motion.div 
                  className="absolute inset-0 bg-pink-100 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional trust indicators */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-500">
            <div className="flex items-center gap-2">
              <motion.div 
                className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-white text-xs">✓</span>
              </motion.div>
              <span className="text-sm font-medium">Verified Partners</span>
            </div>
            
            <div className="flex items-center gap-2">
              <motion.div 
                className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              >
                <span className="text-white text-xs">🔒</span>
              </motion.div>
              <span className="text-sm font-medium">Secure Shopping</span>
            </div>
            
            <div className="flex items-center gap-2">
              <motion.div 
                className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              >
                <span className="text-white text-xs">⭐</span>
              </motion.div>
              <span className="text-sm font-medium">Quality Guaranteed</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PartnersSection;
