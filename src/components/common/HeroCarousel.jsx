import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { gif1, gif2, gif3, gif4, gif5, gif6, gif7 } from '../../assets/images';

const HeroCarousel = ({ 
  className = '', 
  autoPlay = true, 
  interval = 5000,
  showControls = true,
  showDots = true 
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      id: 1,
      image: gif1,
      title: "Chào mừng đến với Pawfect Match",
      subtitle: "Tìm phụ kiện hoàn hảo cho thú cưng của bạn",
      description: "Gợi ý dựa trên AI được tùy chỉnh theo nhu cầu độc đáo của thú cưng"
    },
    {
      id: 2,
      image: gif2,
      title: "Chăm sóc thú cưng thông minh",
      subtitle: "Công nghệ AI tiên tiến gặp tình yêu thú cưng",
      description: "Nhận gợi ý sản phẩm cá nhân hóa dựa trên đặc điểm của thú cưng"
    },
    {
      id: 3,
      image: gif3,
      title: "Sản phẩm chất lượng",
      subtitle: "Được tuyển chọn bởi chuyên gia thú cưng",
      description: "Chỉ những sản phẩm tốt nhất từ các thương hiệu uy tín toàn cầu"
    },
    {
      id: 4,
      image: gif4,
      title: "Thú cưng hạnh phúc",
      subtitle: "Cảm nhận niềm vui trong mỗi gợi ý",
      description: "Xem thú cưng tận hưởng những sản phẩm được khớp hoàn hảo"
    },
    {
      id: 5,
      image: gif5,
      title: "Tình yêu cộng đồng",
      subtitle: "Tham gia hàng nghìn người yêu thú cưng",
      description: "Chia sẻ kinh nghiệm và nhận tư vấn từ cộng đồng thú cưng của chúng tôi"
    },
    {
      id: 6,
      image: gif6,
      title: "Hỗ trợ chuyên gia",
      subtitle: "Hỗ trợ chăm sóc thú cưng 24/7",
      description: "Nhận sự giúp đỡ từ bác sĩ thú y và chuyên gia chăm sóc thú cưng"
    },
    {
      id: 7,
      image: gif7,
      title: "Bắt đầu hành trình của bạn",
      subtitle: "Tạo hồ sơ thú cưng ngay hôm nay",
      description: "Bắt đầu khám phá những sản phẩm sẽ làm cho cuộc sống thú cưng tốt hơn"
    }
  ];

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className={`relative w-full h-screen overflow-hidden ${className}`}>
      {/* Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0.5 }}
          transition={{ duration: 0, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <img
            src={slides[currentSlide].image}
            alt={slides[currentSlide].title}
            className="w-full h-full object-cover"
          />
          
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/40" />
          
          {/* Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="max-w-2xl">
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-5xl md:text-6xl font-bold text-white mb-4"
                >
                  {slides[currentSlide].title}
                </motion.h1>
                
                <motion.h2
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-2xl md:text-3xl text-yellow-300 mb-6"
                >
                  {slides[currentSlide].subtitle}
                </motion.h2>
                
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="text-lg text-gray-200 mb-8"
                >
                  {slides[currentSlide].description}
                </motion.p>
                
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-8 rounded-lg transition-colors duration-300">
                    Bắt đầu
                  </button>
                  <button className="border-2 border-white text-white hover:bg-white hover:text-black font-bold py-3 px-8 rounded-lg transition-colors duration-300">
                    Tìm hiểu thêm
                  </button>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      {showControls && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors duration-300 z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors duration-300 z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {showDots && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-yellow-400 scale-125'
                  : 'bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      )}

      {/* Slide Counter */}
      <div className="absolute top-8 right-8 bg-black/50 text-white px-4 py-2 rounded-full text-sm z-10">
        {currentSlide + 1} / {slides.length}
      </div>
    </div>
  );
};

export default HeroCarousel;
