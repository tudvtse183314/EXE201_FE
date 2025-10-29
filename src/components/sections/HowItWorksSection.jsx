import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { banner2 } from '../../assets/images';
import { Heart, PawPrint, Gift } from 'lucide-react';

const HowItWorksSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const steps = [
    {
      number: "01",
      title: "Tạo hồ sơ thú cưng của bạn",
      description: "Cho chúng tôi biết về giống, tuổi, tính cách và sở thích của thú cưng. AI của chúng tôi học những gì làm cho người bạn lông thú trở nên độc đáo.",
      image: "/src/assets/home/step1-create-profile.png",
      reverse: false,
      icon: PawPrint
    },
    {
      number: "02", 
      title: "Nhận gợi ý cá nhân hóa",
      description: "Nhận gợi ý dựa trên AI cho đồ chơi, thức ăn và phụ kiện phù hợp hoàn hảo với nhu cầu và tính cách của thú cưng.",
      image: "/src/assets/home/step2-recommendations.png",
      reverse: true,
      icon: Heart
    },
    {
      number: "03",
      title: "Mua sắm dễ dàng",
      description: "Duyệt qua các bộ sưu tập được tuyển chọn và mua hàng trực tiếp trong ứng dụng. Theo dõi đơn hàng và quản lý danh sách yêu thích của thú cưng.",
      image: "/src/assets/home/step3-shop.png",
      reverse: false,
      icon: Gift
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const imageVariantsReverse = {
    hidden: { opacity: 0, x: -100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={banner2} 
          alt="How it works background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-purple-800/70 to-pink-700/60"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Cách Pawfect Match hoạt động
          </h2>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            Ba bước đơn giản để tìm sản phẩm hoàn hảo cho thú cưng
          </p>
        </motion.div>
        
        <motion.div 
          ref={ref}
          className="space-y-20"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className={`flex flex-col ${step.reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12`}
              variants={stepVariants}
            >
              {/* Content */}
              <div className="flex-1">
                <motion.div
                  className="flex items-center gap-4 mb-4"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-6xl font-bold text-white">
                    {step.number}
                  </div>
                </motion.div>
                
                <motion.h3 
                  className="text-3xl md:text-4xl font-bold text-white mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  {step.title}
                </motion.h3>
                
                <motion.p 
                  className="text-lg text-gray-200 leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  {step.description}
                </motion.p>
              </div>
              
              {/* Image */}
              <motion.div 
                className="flex-1"
                variants={step.reverse ? imageVariantsReverse : imageVariants}
              >
                <div className="relative">
                  <img 
                    src={step.image}
                    alt={step.title}
                    className="w-full h-auto rounded-2xl shadow-2xl"
                    onError={(e) => {
                      // Fallback to a placeholder with gradient background
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = `
                        <div class="w-full h-80 bg-gradient-to-br from-pink-100 to-pink-200 rounded-2xl shadow-2xl flex items-center justify-center">
                          <div class="text-center text-pink-600">
                            <div class="text-6xl mb-4">🐾</div>
                            <p class="text-lg font-semibold">${step.title}</p>
                          </div>
                        </div>
                      `;
                    }}
                  />
                  
                  {/* Decorative elements */}
                  <motion.div 
                    className="absolute -top-4 -right-4 w-8 h-8 bg-pink-400 rounded-full"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  <motion.div 
                    className="absolute -bottom-4 -left-4 w-6 h-6 bg-pink-300 rounded-full"
                    animate={{ 
                      scale: [1, 1.3, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{ 
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5
                    }}
                  />
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
