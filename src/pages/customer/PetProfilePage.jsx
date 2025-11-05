import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PawPrint, Plus, Edit, Trash2, Heart, Calendar, Weight, Stethoscope, Camera } from "lucide-react";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { getMyPets, createPetProfile, updatePetProfile, deletePetProfile } from "../../api/petProfile";
import { message } from 'antd';

export default function PetProfilePage() {
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    petName: "",
    petType: "",
    breed: "",
    birthDate: "",
    weight: "",
    healthNotes: "",
    imageUrl: ""
  });

  // Ref để tránh gọi API liên tục
  const hasLoadedRef = useRef(false);
  const isLoadingRef = useRef(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    
    // Session guard: tránh fetch lặp khi trang bị remount ngoài ý muốn
    const sessionKey = 'pv-pets-loaded';
    const alreadyLoaded = sessionStorage.getItem(sessionKey) === '1';

    // Chỉ fetch nếu chưa load và không đang load
    if (!hasLoadedRef.current && !isLoadingRef.current && !alreadyLoaded) {
      fetchPets().finally(() => {
        sessionStorage.setItem(sessionKey, '1');
      });
    }

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const fetchPets = async () => {
    // Guard: tránh gọi nhiều lần
    if (isLoadingRef.current) {
      return;
    }

    isLoadingRef.current = true;
    
    try {
      setLoading(true);
      setError(null);
      const data = await getMyPets();
      
      if (isMountedRef.current) {
        setPets(Array.isArray(data) ? data : []);
        setError(null);
        hasLoadedRef.current = true;
      }
    } catch (err) {
      if (isMountedRef.current) {
        // Xử lý lỗi 502 Bad Gateway
        if (err?.response?.status === 502) {
          setError("Máy chủ đang quá tải. Vui lòng thử lại sau vài giây.");
        } else {
          setError(err.message || "Không thể tải danh sách thú cưng. Vui lòng thử lại!");
        }
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
      isLoadingRef.current = false;
    }
  };

  const handleSubmit = async () => {
    try {
      if (!form.petName || !form.petType) {
        message.error("Vui lòng nhập tên thú cưng và loại thú cưng!");
        return;
      }

      if (selectedPet) {
        const targetId = selectedPet.id || selectedPet.petId;
        await updatePetProfile(targetId, form);
        message.success("Cập nhật hồ sơ thú cưng thành công!");
      } else {
        await createPetProfile(form);
        message.success("Thêm thú cưng thành công!");
      }
      setOpen(false);
      setSelectedPet(null);
      setForm({
        petName: "",
        petType: "",
        breed: "",
        birthDate: "",
        weight: "",
        healthNotes: "",
        imageUrl: ""
      });
      // Reset flag để fetch lại sau khi tạo/sửa
      hasLoadedRef.current = false;
      sessionStorage.removeItem('pv-pets-loaded');
      fetchPets().finally(() => sessionStorage.setItem('pv-pets-loaded', '1'));
    } catch (err) {
      setError(err.message);
      message.error(err.message || "Có lỗi xảy ra. Vui lòng thử lại!");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa hồ sơ thú cưng này?")) {
      try {
        const targetId = id?.id || id?.petId || id;
        await deletePetProfile(targetId);
        message.success("Xóa hồ sơ thú cưng thành công!");
        // Reset flag để fetch lại sau khi xóa
        hasLoadedRef.current = false;
        sessionStorage.removeItem('pv-pets-loaded');
        fetchPets().finally(() => sessionStorage.setItem('pv-pets-loaded', '1'));
      } catch (err) {
        setError(err.message);
        message.error(err.message || "Có lỗi xảy ra khi xóa!");
      }
    }
  };

  const handleEdit = (pet) => {
    setSelectedPet(pet);
    setForm({
      petName: pet.petName || pet.name || "",
      petType: pet.petType || pet.type || "",
      breed: pet.breed || "",
      birthDate: pet.birthDate || pet.dob || "",
      weight: pet.weight || pet.weightKg || "",
      healthNotes: pet.healthNotes || pet.notes || "",
      imageUrl: pet.imageUrl || pet.image || ""
    });
    setOpen(true);
  };

  const handleAddNew = () => {
    setSelectedPet(null);
    setForm({
      petName: "",
      petType: "",
      breed: "",
      birthDate: "",
      weight: "",
      healthNotes: "",
      imageUrl: ""
    });
    setOpen(true);
  };

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fdfaf7] flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="w-16 h-16 border-4 border-[#c47256] border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-[#34140e] text-lg">Đang tải hồ sơ thú cưng...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfaf7] p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="text-4xl font-bold text-[#34140e] flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <PawPrint className="text-[#c47256]" size={40} />
              </motion.div>
              Hồ sơ thú cưng của tôi
            </h1>
            <p className="text-[#8b5a3c] mt-2">Quản lý thông tin và theo dõi sức khỏe thú cưng</p>
          </motion.div>

          <motion.button
            onClick={handleAddNew}
            className="bg-[#c47256] hover:bg-[#a85d45] text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Plus size={20} />
            Thêm thú cưng
          </motion.button>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
          >
            <p className="text-red-600">{error}</p>
          </motion.div>
        )}

        {/* Empty State */}
        {pets.length === 0 && !loading ? (
          <motion.div
            className="text-center mt-20"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                repeatDelay: 2
              }}
            >
              <PawPrint size={80} className="mx-auto mb-6 text-[#c47256] opacity-60" />
            </motion.div>
            <h3 className="text-2xl font-semibold text-[#34140e] mb-4">Chưa có hồ sơ thú cưng nào</h3>
            <p className="text-[#8b5a3c] mb-8 max-w-md mx-auto">
              Hãy thêm thông tin thú cưng đầu tiên để bắt đầu sử dụng các tính năng AI của chúng tôi
            </p>
            <motion.button
              onClick={handleAddNew}
              className="bg-[#c47256] hover:bg-[#a85d45] text-white px-8 py-4 rounded-xl font-semibold flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus size={20} />
              Thêm thú cưng đầu tiên
            </motion.button>
          </motion.div>
        ) : (
          /* Pet Cards Grid */
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {pets.map((pet, idx) => (
              <motion.div
                key={pet.petId || idx}
                variants={itemVariants}
                className="group"
              >
                <motion.div
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-[#e8d5c4]"
                  whileHover={{ 
                    y: -8,
                    boxShadow: "0 25px 50px -12px rgba(196, 114, 86, 0.25)"
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Pet Image */}
                  <div className="relative h-48 overflow-hidden">
                    {pet.imageUrl ? (
                      <LazyLoadImage 
                        src={pet.imageUrl} 
                        alt={pet.petName}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        effect="blur"
                        placeholderSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3C/svg%3E"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-[#c47256] to-[#a85d45] ${pet.imageUrl ? 'hidden' : 'flex'}`}
                    >
                      <PawPrint size={60} className="text-white opacity-80" />
                    </div>
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Action Buttons */}
                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <motion.button
                        onClick={() => handleEdit(pet)}
                        className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Edit size={16} className="text-[#c47256]" />
                      </motion.button>
                      <motion.button
                        onClick={() => handleDelete(pet.petId)}
                        className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-red-50 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Trash2 size={16} className="text-red-500" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Pet Info */}
                  <div className="p-6">
                    <h3 className="font-bold text-xl text-[#34140e] mb-2 group-hover:text-[#c47256] transition-colors">
                      {pet.petName}
                    </h3>
                    
                    <div className="space-y-2 text-sm text-[#8b5a3c]">
                      <div className="flex items-center gap-2">
                        <Heart size={16} className="text-[#c47256]" />
                        <span>{pet.petType} • {pet.breed}</span>
                      </div>
                      
                      {pet.birthDate && (
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-[#c47256]" />
                          <span>{new Date(pet.birthDate).toLocaleDateString('vi-VN')}</span>
                        </div>
                      )}
                      
                      {pet.weight && (
                        <div className="flex items-center gap-2">
                          <Weight size={16} className="text-[#c47256]" />
                          <span>{pet.weight}kg</span>
                        </div>
                      )}
                      
                      {pet.healthNotes && (
                        <div className="flex items-start gap-2">
                          <Stethoscope size={16} className="text-[#c47256] mt-0.5" />
                          <span className="line-clamp-2">{pet.healthNotes}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Modal */}
        <AnimatePresence>
          {open && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            >
              <motion.div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 50 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-[#34140e] flex items-center gap-2">
                      <PawPrint className="text-[#c47256]" size={24} />
                      {selectedPet ? "Cập nhật hồ sơ" : "Thêm thú cưng mới"}
                    </h2>
                    <motion.button
                      onClick={() => setOpen(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      ✕
                    </motion.button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-[#34140e] mb-2">
                        Tên thú cưng *
                      </label>
                      <input
                        type="text"
                        value={form.petName}
                        onChange={(e) => setForm({ ...form, petName: e.target.value })}
                        className="w-full px-4 py-3 border border-[#e8d5c4] rounded-lg focus:ring-2 focus:ring-[#c47256] focus:border-transparent transition-all"
                        placeholder="Nhập tên thú cưng"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#34140e] mb-2">
                        Loại thú cưng *
                      </label>
                      <select
                        value={form.petType}
                        onChange={(e) => setForm({ ...form, petType: e.target.value })}
                        className="w-full px-4 py-3 border border-[#e8d5c4] rounded-lg focus:ring-2 focus:ring-[#c47256] focus:border-transparent transition-all"
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
                      <label className="block text-sm font-semibold text-[#34140e] mb-2">
                        Giống loài
                      </label>
                      <input
                        type="text"
                        value={form.breed}
                        onChange={(e) => setForm({ ...form, breed: e.target.value })}
                        className="w-full px-4 py-3 border border-[#e8d5c4] rounded-lg focus:ring-2 focus:ring-[#c47256] focus:border-transparent transition-all"
                        placeholder="Ví dụ: Golden Retriever, Persian"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#34140e] mb-2">
                        Ngày sinh
                      </label>
                      <input
                        type="date"
                        value={form.birthDate}
                        onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
                        className="w-full px-4 py-3 border border-[#e8d5c4] rounded-lg focus:ring-2 focus:ring-[#c47256] focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#34140e] mb-2">
                        Cân nặng (kg)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={form.weight}
                        onChange={(e) => setForm({ ...form, weight: e.target.value })}
                        className="w-full px-4 py-3 border border-[#e8d5c4] rounded-lg focus:ring-2 focus:ring-[#c47256] focus:border-transparent transition-all"
                        placeholder="Ví dụ: 5.5"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#34140e] mb-2">
                        Ảnh thú cưng (URL)
                      </label>
                      <div className="relative">
                        <input
                          type="url"
                          value={form.imageUrl}
                          onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                          className="w-full px-4 py-3 pr-10 border border-[#e8d5c4] rounded-lg focus:ring-2 focus:ring-[#c47256] focus:border-transparent transition-all"
                          placeholder="https://example.com/pet-image.jpg"
                        />
                        <Camera size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#c47256]" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-semibold text-[#34140e] mb-2">
                      Ghi chú sức khỏe
                    </label>
                    <textarea
                      value={form.healthNotes}
                      onChange={(e) => setForm({ ...form, healthNotes: e.target.value })}
                      className="w-full px-4 py-3 border border-[#e8d5c4] rounded-lg focus:ring-2 focus:ring-[#c47256] focus:border-transparent transition-all"
                      rows="3"
                      placeholder="Ghi chú về tình trạng sức khỏe, dị ứng, thuốc đang dùng..."
                    />
                  </div>

                  <div className="flex gap-4 mt-8">
                    <motion.button
                      onClick={() => setOpen(false)}
                      className="flex-1 px-6 py-3 border border-[#e8d5c4] text-[#8b5a3c] rounded-lg hover:bg-gray-50 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Hủy
                    </motion.button>
                    <motion.button
                      onClick={handleSubmit}
                      className="flex-1 bg-[#c47256] hover:bg-[#a85d45] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {selectedPet ? "Cập nhật" : "Thêm mới"}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
