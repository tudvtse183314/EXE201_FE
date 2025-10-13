import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { 
  Brain, 
  User, 
  ShoppingCart, 
  Package, 
  Star, 
  Shield 
} from 'lucide-react';

const WhyChooseSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Matching",
      description: "Advanced AI analyzes traits to recommend accessories tailored to each pet."
    },
    {
      icon: User,
      title: "Personalized Profiles",
      description: "Create detailed pet profiles for smarter recommendations."
    },
    {
      icon: ShoppingCart,
      title: "Seamless Shopping",
      description: "Shop your pet's favorites directly within the app."
    },
    {
      icon: Package,
      title: "Order Tracking",
      description: "Track every order in real time from purchase to delivery."
    },
    {
      icon: Star,
      title: "Curated Collections",
      description: "Discover handpicked selections for every breed and mood."
    },
    {
      icon: Shield,
      title: "Quality Guaranteed",
      description: "Partnered with trusted brands ensuring comfort and safety."
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
    hidden: { opacity: 0, y: 50 },
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
    <section id="why-choose" className="py-20 bg-oldCopper-100">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#2a1a10' }}>
            Why Choose Pawfect Match
          </h2>
          <p className="text-xl max-w-3xl mx-auto" style={{ color: '#553d2d' }}>
            Experience the future of pet care with our innovative AI-powered platform
          </p>
        </motion.div>
        
        <motion.div 
          ref={ref}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl shadow-old-copper-card p-8 hover:shadow-old-copper-glow transition-all duration-300 group"
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 25px 50px -12px rgba(237, 162, 116, 0.25)"
              }}
            >
              <div className="flex flex-col items-center text-center">
                <motion.div 
                  className="w-16 h-16 bg-gradient-to-br from-oldCopper-100 to-oldCopper-200 rounded-full flex items-center justify-center mb-6 group-hover:from-oldCopper-200 group-hover:to-oldCopper-300 transition-all duration-300"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <feature.icon className="w-8 h-8" style={{ color: '#eda274' }} />
                </motion.div>
                
                <h3 className="text-xl font-bold mb-4" style={{ color: '#2a1a10' }}>
                  {feature.title}
                </h3>
                
                <p className="leading-relaxed" style={{ color: '#553d2d' }}>
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseSection;
