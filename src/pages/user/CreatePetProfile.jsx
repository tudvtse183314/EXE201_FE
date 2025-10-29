import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle } from 'lucide-react';
import { createPetProfile } from '../../api/petProfile';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';

export default function CreatePetProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Basic Information
    petName: '',
    petType: '',
    breed: '',
    birthDate: '',
    weight: '',
    healthNotes: '',
    imageUrl: ''
  });

  const [currentStep, setCurrentStep] = useState(3); // Behavior & Preferences

  const steps = [
    { id: 1, title: 'Đã tạo tài khoản', completed: true },
    { id: 2, title: 'Thông tin cơ bản', completed: true },
    { id: 3, title: 'Đặc điểm thể chất', completed: true },
    { id: 4, title: 'Hành vi & Sở thích', completed: false, current: true },
    { id: 5, title: 'Nhu cầu dinh dưỡng', completed: false },
    { id: 6, title: 'Xem lại hồ sơ', completed: false }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked 
        ? [...prev[name], value]
        : prev[name].filter(item => item !== value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.petName || !formData.petType) {
      message.error("Vui lòng nhập tên thú cưng và loại thú cưng!");
      return;
    }

    try {
      setLoading(true);
      await createPetProfile(formData);
      message.success("Tạo hồ sơ thú cưng thành công!");
      navigate('/customer/pet-profiles');
    } catch (error) {
      message.error(error.message || "Có lỗi xảy ra. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar trái - Profile Setup */}
          <div className="lg:col-span-1">
            <motion.div 
              className="bg-white shadow-md rounded-xl p-6 sticky top-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="font-bold text-lg text-gray-800 mb-2">Thiết lập hồ sơ</h2>
              <p className="text-sm text-gray-600 mb-6">
                Hoàn thành các bước để mở khóa gợi ý cá nhân hóa.
              </p>
              
              <div className="space-y-3">
                {steps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    className={`flex items-center space-x-3 p-2 rounded-lg transition-colors duration-200 ${
                      step.current ? 'bg-purple-50' : 'hover:bg-gray-50'
                    }`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    {step.completed ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : step.current ? (
                      <Circle className="w-5 h-5 text-purple-600 fill-current" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-400" />
                    )}
                    <span className={`text-sm font-medium ${
                      step.current ? 'text-purple-600' : 
                      step.completed ? 'text-gray-700' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Main content bên phải */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  Tạo hồ sơ thú cưng của bạn
                </h1>
                <p className="text-gray-600 text-lg">
                  Cung cấp thông tin chi tiết về thú cưng để nhận gợi ý phụ kiện được cá nhân hóa cao.
                </p>
              </div>

              {/* Ảnh minh họa */}
              <div className="mb-8">
                <img
                  src="https://cdn.pixabay.com/photo/2018/03/30/07/53/dog-3277415_1280.jpg"
                  alt="Pet Profile Banner"
                  className="w-full h-auto rounded-xl shadow-sm"
                />
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Basic Information Card */}
                <motion.div 
                  className="bg-white p-6 rounded-xl shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <h3 className="font-semibold text-lg text-gray-800 mb-4">Thông tin cơ bản</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tên thú cưng
                      </label>
                      <input
                        type="text"
                        name="petName"
                        value={formData.petName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                        placeholder="Nhập tên thú cưng của bạn"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Loại thú cưng *
                      </label>
                      <select
                        name="petType"
                        value={formData.petType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                      >
                        <option value="">Chọn loại thú cưng</option>
                        <option value="dog">Chó</option>
                        <option value="cat">Mèo</option>
                        <option value="bird">Chim</option>
                        <option value="rabbit">Thỏ</option>
                        <option value="other">Khác</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Giống
                      </label>
                      <input
                        type="text"
                        name="breed"
                        value={formData.breed}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                        placeholder="Nhập giống"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ngày sinh
                      </label>
                      <input
                        type="date"
                        name="birthDate"
                        value={formData.birthDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cân nặng (kg)
                      </label>
                      <input
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                        placeholder="Cân nặng (kg)"
                        min="0"
                        step="0.1"
                      />
                    </div>
                    
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ghi chú sức khỏe
                      </label>
                      <textarea
                        name="healthNotes"
                        value={formData.healthNotes}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                        rows="3"
                        placeholder="Ghi chú về tình trạng sức khỏe, dị ứng..."
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ảnh thú cưng (URL)
                      </label>
                      <input
                        type="url"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                        placeholder="https://example.com/pet-image.jpg"
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Physical Traits Card - Optional for future use */}
                {false && (
                <motion.div 
                  className="bg-white p-6 rounded-xl shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <h3 className="font-semibold text-lg text-gray-800 mb-4">Đặc điểm thể chất</h3>
                </motion.div>
                )}

                {/* Save Button */}
                <motion.div 
                  className="flex justify-end"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Đang lưu...' : 'Lưu hồ sơ'}
                  </button>
                </motion.div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
