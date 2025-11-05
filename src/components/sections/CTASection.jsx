import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { banner4 } from '../../assets/images';
import { PawPrint } from 'lucide-react';

const CTASection = () => {
  const navigate = useNavigate();

  const handleGetRecommendations = () => {
    navigate('/register');
  };

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={banner4} 
          alt="CTA background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Decorative Paw Prints */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-10 left-10 w-20 h-20 text-white/20"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <PawPrint className="w-full h-full" />
        </motion.div>
        <motion.div 
          className="absolute bottom-10 right-10 w-16 h-16 text-white/20"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        >
          <PawPrint className="w-full h-full" />
        </motion.div>
        <motion.div 
          className="absolute top-1/2 left-1/4 w-12 h-12 text-white/15"
          animate={{ 
            scale: [1, 1.4, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        >
          <PawPrint className="w-full h-full" />
        </motion.div>
      </div>

      <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
            Sẵn sàng tìm sự lựa chọn hoàn hảo cho thú cưng của bạn?
          </h2>
          
          <motion.p 
            className="text-xl md:text-2xl text-white mb-8 leading-relaxed max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            Tham gia hàng nghìn chủ thú cưng hạnh phúc đã tìm được sản phẩm lý tưởng cho bạn bốn chân của họ.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            <motion.button 
              onClick={handleGetRecommendations}
              className="bg-yellow-400 hover:bg-orange-500 text-black px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl relative overflow-hidden group"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 25px -5px rgba(255, 179, 71, 0.4), 0 10px 10px -5px rgba(255, 179, 71, 0.2)"
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
                Nhận gợi ý cá nhân hóa
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
            <p className="text-white">Chủ thú cưng hạnh phúc</p>
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
            <p className="text-white">Sản phẩm được khớp</p>
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
            <p className="text-white">Tỷ lệ hài lòng</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;