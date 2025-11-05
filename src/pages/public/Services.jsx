import React from 'react';
import { motion } from 'framer-motion';
import { dog5, dog6, cat5, cat6, pet5, pet6 } from '../../assets/images';

export default function Services() {
  const services = [
    {
      icon: '🤖',
      title: 'Khớp sản phẩm AI',
      description: 'AI tiên tiến của chúng tôi phân tích giống, tuổi, kích cỡ và tính cách thú cưng để gợi ý sản phẩm hoàn hảo.',
      features: ['Gợi ý theo giống', 'Gợi ý phù hợp độ tuổi', 'Khớp theo tính cách']
    },
    {
      icon: '🛍️',
      title: 'Danh mục sản phẩm được tuyển chọn',
      description: 'Sản phẩm được tuyển chọn từ các thương hiệu uy tín, được kiểm tra và phê duyệt bởi các chuyên gia thú cưng.',
      features: ['Đảm bảo chất lượng', 'Đánh giá chuyên gia', 'Đối tác thương hiệu']
    },
    {
      icon: '📱',
      title: 'Ứng dụng di động',
      description: 'Truy cập hồ sơ thú cưng và nhận gợi ý khi di chuyển với ứng dụng di động thân thiện.',
      features: ['Quản lý hồ sơ', 'Gợi ý nhanh', 'Theo dõi đơn hàng']
    },
    {
      icon: '💬',
      title: 'Hỗ trợ chuyên gia',
      description: 'Nhận lời khuyên cá nhân hóa từ đội ngũ bác sĩ thú y và chuyên gia chăm sóc thú cưng.',
      features: ['Hỗ trợ chat 24/7', 'Tư vấn chuyên gia', 'Lời khuyên sức khỏe']
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={dog5} 
            alt="Happy dog" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/70 to-purple-900/70"></div>
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            className="text-4xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Dịch vụ của chúng tôi
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-200 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Giải pháp chăm sóc thú cưng toàn diện với công nghệ AI và kiến thức chuyên gia.
          </motion.p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-3xl">{service.icon}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{service.title}</h3>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <ul className="space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                          <span className="w-2 h-2 bg-indigo-600 rounded-full mr-3"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Cách hoạt động</h2>
            <p className="text-lg text-gray-600">
              Bắt đầu chỉ trong vài bước đơn giản
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="relative mb-4">
                <img 
                  src={cat5} 
                  alt="Create profile" 
                  className="w-32 h-32 object-cover rounded-full mx-auto shadow-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-600/80 to-transparent rounded-full flex items-end justify-center pb-4">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Tạo hồ sơ thú cưng</h3>
              <p className="text-gray-600">
                Cho chúng tôi biết về giống, tuổi, kích cỡ và đặc điểm tính cách của thú cưng.
              </p>
            </div>
            
            <div className="text-center">
              <div className="relative mb-4">
                <img 
                  src={dog6} 
                  alt="AI recommendations" 
                  className="w-32 h-32 object-cover rounded-full mx-auto shadow-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-600/80 to-transparent rounded-full flex items-end justify-center pb-4">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Nhận gợi ý AI</h3>
              <p className="text-gray-600">
                AI của chúng tôi phân tích hồ sơ thú cưng và đề xuất sản phẩm hoàn hảo.
              </p>
            </div>
            
            <div className="text-center">
              <div className="relative mb-4">
                <img 
                  src={cat6} 
                  alt="Shop and enjoy" 
                  className="w-32 h-32 object-cover rounded-full mx-auto shadow-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-600/80 to-transparent rounded-full flex items-end justify-center pb-4">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Mua sắm & Tận hưởng</h3>
              <p className="text-gray-600">
                Mua sản phẩm được gợi ý và xem thú cưng tận hưởng các sản phẩm yêu thích mới.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pet Success Stories */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Câu chuyện thành công</h2>
            <p className="text-lg text-gray-600">
              Xem cách gợi ý AI của chúng tôi đã giúp đỡ thú cưng và chủ sở hữu.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="relative group">
              <img 
                src={pet5} 
                alt="Happy pet story" 
                className="w-full h-64 object-cover rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-xl flex items-end p-6">
                <div>
                  <h3 className="text-white font-semibold text-lg mb-2">Bella's New Toy</h3>
                  <p className="text-gray-200 text-sm">
                    "The AI recommended the perfect chew toy for Bella's teething phase. She loves it!"
                  </p>
                </div>
              </div>
            </div>
            
            <div className="relative group">
              <img 
                src={pet6} 
                alt="Happy pet story" 
                className="w-full h-64 object-cover rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-xl flex items-end p-6">
                <div>
                  <h3 className="text-white font-semibold text-lg mb-2">Max's Health Journey</h3>
                  <p className="text-gray-200 text-sm">
                    "The nutrition recommendations helped Max maintain a healthy weight and energy level."
                  </p>
                </div>
              </div>
            </div>
            
            <div className="relative group">
              <img 
                src={dog5} 
                alt="Happy pet story" 
                className="w-full h-64 object-cover rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-xl flex items-end p-6">
                <div>
                  <h3 className="text-white font-semibold text-lg mb-2">Luna's Comfort</h3>
                  <p className="text-gray-200 text-sm">
                    "The perfect bed recommendation made Luna's sleep so much better. Thank you!"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
