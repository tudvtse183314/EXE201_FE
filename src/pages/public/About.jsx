import React from 'react';
import { motion } from 'framer-motion';
import { dog3, dog4, cat3, cat4, pet3, pet4, banner5 } from '../../assets/images';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={banner5} 
            alt="About background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/70 via-purple-800/60 to-pink-700/50"></div>
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            className="text-4xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Giới thiệu về Pawfect Match
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-200 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Chúng tôi đam mê giúp chủ thú cưng tìm được những sản phẩm hoàn hảo cho người bạn đồng hành yêu quý.
          </motion.p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Sứ mệnh của chúng tôi</h2>
              <p className="text-lg text-gray-600 mb-6">
                Tại Pawfect Match, chúng tôi tin rằng mỗi thú cưng đều xứng đáng với những điều tốt đẹp nhất. 
                Nền tảng AI của chúng tôi giúp bạn khám phá những sản phẩm phù hợp hoàn hảo với tính cách, 
                nhu cầu và sở thích độc đáo của thú cưng.
              </p>
              <p className="text-lg text-gray-600">
                Từ đồ chơi và phụ kiện đến thức ăn và sản phẩm chăm sóc sức khỏe, chúng tôi giúp bạn dễ dàng 
                tìm thấy chính xác những gì người bạn bốn chân cần để sống hạnh phúc và khỏe mạnh nhất.
              </p>
            </div>
            <div className="relative">
              <img 
                src={dog3} 
                alt="Happy dog" 
                className="w-full h-80 object-cover rounded-2xl shadow-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Gặp gỡ đội ngũ của chúng tôi</h2>
            <p className="text-lg text-gray-600">
              Những người yêu thú cưng, người đam mê công nghệ và chuyên gia sản phẩm cùng làm việc vì thú cưng của bạn.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="relative mb-4">
                <img 
                  src={cat3} 
                  alt="Tech team" 
                  className="w-32 h-32 object-cover rounded-full mx-auto shadow-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-600/80 to-transparent rounded-full flex items-end justify-center pb-4">
                  <span className="text-2xl text-white">👨‍💻</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Đội ngũ Công nghệ</h3>
              <p className="text-gray-600">
                Xây dựng công nghệ AI cung cấp năng lượng cho thuật toán khớp của chúng tôi.
              </p>
            </div>
            
            <div className="text-center">
              <div className="relative mb-4">
                <img 
                  src={dog4} 
                  alt="Pet experts" 
                  className="w-32 h-32 object-cover rounded-full mx-auto shadow-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-600/80 to-transparent rounded-full flex items-end justify-center pb-4">
                  <span className="text-2xl text-white">🐕</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Chuyên gia Thú cưng</h3>
              <p className="text-gray-600">
                Bác sĩ thú y và chuyên gia chăm sóc thú cưng đảm bảo chất lượng sản phẩm.
              </p>
            </div>
            
            <div className="text-center">
              <div className="relative mb-4">
                <img 
                  src={cat4} 
                  alt="Product team" 
                  className="w-32 h-32 object-cover rounded-full mx-auto shadow-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-green-600/80 to-transparent rounded-full flex items-end justify-center pb-4">
                  <span className="text-2xl text-white">🛍️</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Đội ngũ Sản phẩm</h3>
              <p className="text-gray-600">
                Tuyển chọn những sản phẩm tốt nhất từ các thương hiệu uy tín trên toàn thế giới.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pet Gallery Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Cộng đồng thú cưng của chúng tôi</h2>
            <p className="text-lg text-gray-600">
              Hãy gặp gỡ một số thú cưng tuyệt vời đã truyền cảm hứng cho các gợi ý sản phẩm của chúng tôi.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="relative group">
              <img 
                src={pet3} 
                alt="Happy pet" 
                className="w-full h-64 object-cover rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl flex items-end p-4">
                <span className="text-white font-semibold">Luna</span>
              </div>
            </div>
            
            <div className="relative group">
              <img 
                src={pet4} 
                alt="Happy pet" 
                className="w-full h-64 object-cover rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl flex items-end p-4">
                <span className="text-white font-semibold">Max</span>
              </div>
            </div>
            
            <div className="relative group">
              <img 
                src={dog3} 
                alt="Happy pet" 
                className="w-full h-64 object-cover rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl flex items-end p-4">
                <span className="text-white font-semibold">Bella</span>
              </div>
            </div>
            
            <div className="relative group">
              <img 
                src={cat3} 
                alt="Happy pet" 
                className="w-full h-64 object-cover rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl flex items-end p-4">
                <span className="text-white font-semibold">Whiskers</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
