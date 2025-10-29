import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
// import { banner3 } from '../../assets/images';

const TestimonialsSection = () => {
  const [currentGroup, setCurrentGroup] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const testimonials = [
    {
      id: 1,
      name: "Sarah L.",
      role: "Người nuôi chó",
      image: "/src/assets/home/testimonial-1.png",
      quote: "Pawfect Match thực sự hiểu chú chó Max của tôi! Việc mua sắm thật dễ dàng.",
      rating: 5
    },
    {
      id: 2,
      name: "David K.",
      role: "Người nuôi mèo", 
      image: "/src/assets/home/testimonial-2.png",
      quote: "Cuối cùng, một ứng dụng hiểu được! Các gợi ý phụ kiện thật hoàn hảo.",
      rating: 5
    },
    {
      id: 3,
      name: "Jessica T.",
      role: "Huấn luyện viên thú cưng",
      image: "/src/assets/home/testimonial-3.png",
      quote: "Không còn lãng phí hàng giờ để tìm kiếm! Rất khuyên dùng.",
      rating: 5
    },
    {
      id: 4,
      name: "Michael B.",
      role: "Bác sĩ thú y",
      image: "/src/assets/home/testimonial-4.png",
      quote: "Gợi ý thức ăn cá nhân hóa đã thay đổi sức khỏe chú chó của tôi.",
      rating: 5
    },
    {
      id: 5,
      name: "Lisa M.",
      role: "Người đam mê thú cưng",
      image: "/src/assets/home/testimonial-5.png",
      quote: "Thú cưng của tôi hạnh phúc hơn bao giờ hết. Các gợi ý thật hoàn hảo!",
      rating: 5
    },
    {
      id: 6,
      name: "John D.",
      role: "Chủ cửa hàng thú cưng",
      image: "/src/assets/home/testimonial-6.png",
      quote: "Nền tảng này đã cách mạng hóa cách tôi giới thiệu sản phẩm cho khách hàng.",
      rating: 5
    }
  ];

  // Group testimonials into sets of 3
  const testimonialGroups = [];
  for (let i = 0; i < testimonials.length; i += 3) {
    testimonialGroups.push(testimonials.slice(i, i + 3));
  }

  // Auto-scroll functionality for groups
  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        setCurrentGroup((prev) => (prev + 1) % testimonialGroups.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isHovered, testimonialGroups.length]);

  const nextGroup = () => {
    setCurrentGroup((prev) => (prev + 1) % testimonialGroups.length);
  };

  const prevGroup = () => {
    setCurrentGroup((prev) => (prev - 1 + testimonialGroups.length) % testimonialGroups.length);
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
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Khách hàng nói gì về chúng tôi
          </h2>
          <p className="text-xl text-gray-600">
            Tham gia hàng nghìn chủ thú cưng hạnh phúc đã tìm thấy sự lựa chọn hoàn hảo
          </p>
        </motion.div>

        <div 
          className="relative max-w-6xl mx-auto"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Testimonials Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentGroup}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {testimonialGroups[currentGroup]?.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  <div className="flex flex-col items-center text-center">
                    {/* Avatar */}
                    <div className="w-16 h-16 rounded-full overflow-hidden shadow-lg mb-4 border-2 border-white">
                      <img 
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = `
                            <div class="w-full h-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                              ${testimonial.name.charAt(0)}
                            </div>
                          `;
                        }}
                      />
                    </div>

                    {/* Rating */}
                    <div className="flex justify-center mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    
                    {/* Quote */}
                    <blockquote className="text-sm text-gray-700 mb-4 italic leading-relaxed">
                      "{testimonial.quote}"
                    </blockquote>
                    
                    {/* Name and Role */}
                    <div>
                      <div className="font-bold text-gray-900 text-base">
                        {testimonial.name}
                      </div>
                      <div className="text-gray-600 text-sm">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex justify-center items-center mt-8 space-x-4">
            <button
              onClick={prevGroup}
              className="p-3 bg-white hover:bg-gray-50 text-gray-700 rounded-full transition-colors duration-300 shadow-md border border-gray-200"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <div className="flex space-x-2">
              {testimonialGroups.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentGroup(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentGroup
                      ? 'bg-orange-500 scale-125'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
            
            <button
              onClick={nextGroup}
              className="p-3 bg-white hover:bg-gray-50 text-gray-700 rounded-full transition-colors duration-300 shadow-md border border-gray-200"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;