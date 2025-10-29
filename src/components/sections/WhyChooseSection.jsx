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
import { dog1, dog2, cat1, cat2, pet1, pet2 } from '../../assets/images';

const WhyChooseSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    {
      icon: Brain,
      title: "Khớp sản phẩm bằng AI",
      description: "AI tiên tiến phân tích đặc điểm để gợi ý phụ kiện phù hợp với từng thú cưng.",
      image: dog1
    },
    {
      icon: User,
      title: "Hồ sơ cá nhân hóa",
      description: "Tạo hồ sơ thú cưng chi tiết để nhận gợi ý thông minh hơn.",
      image: cat1
    },
    {
      icon: ShoppingCart,
      title: "Mua sắm mượt mà",
      description: "Mua sắm những sản phẩm yêu thích của thú cưng trực tiếp trong ứng dụng.",
      image: dog2
    },
    {
      icon: Package,
      title: "Theo dõi đơn hàng",
      description: "Theo dõi mọi đơn hàng theo thời gian thực từ mua đến giao hàng.",
      image: cat2
    },
    {
      icon: Star,
      title: "Bộ sưu tập được tuyển chọn",
      description: "Khám phá lựa chọn được tuyển chọn cho mọi giống và tâm trạng.",
      image: pet1
    },
    {
      icon: Shield,
      title: "Đảm bảo chất lượng",
      description: "Đối tác với các thương hiệu uy tín đảm bảo sự thoải mái và an toàn.",
      image: pet2
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
    <section id="why-choose" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Tại sao chọn Pawfect Match
          </h2>
          <p className="text-xl max-w-3xl mx-auto text-gray-600">
            Trải nghiệm tương lai của chăm sóc thú cưng với nền tảng AI sáng tạo của chúng tôi
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
              className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 25px 50px -12px rgba(255, 210, 143, 0.4)"
              }}
            >
              {/* Pet Image Background */}
              <div className="relative h-64">
                <img 
                  src={feature.image} 
                  alt={feature.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                
                {/* Icon */}
                <div className="absolute top-4 right-4 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-200 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
                
                {/* Hover border effect */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-yellow-300 transition-all duration-300 rounded-2xl"></div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseSection;
