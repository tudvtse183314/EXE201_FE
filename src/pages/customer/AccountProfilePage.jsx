import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Save, CheckCircle, AlertCircle, Phone, Mail, PawPrint, Calendar, Weight } from "lucide-react";
import { updateAccount } from "../../api/account";
import { useAuth } from "../../context/AuthContext";

export default function AccountProfilePage() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    petName: user?.petName || "",
    petAge: user?.petAge || "",
    petType: user?.petType || "",
    petSize: user?.petSize || "",
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
    setSuccess(false);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await updateAccount(user.id, form);
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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

  return (
    <motion.div
      className="min-h-screen bg-[#fdfaf7] py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 bg-[#c47256] rounded-full mb-4"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <User className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold text-[#34140e] mb-2">Cập nhật thông tin cá nhân</h1>
          <p className="text-[#8b5a3c] text-lg">Quản lý thông tin tài khoản và thú cưng của bạn</p>
        </motion.div>

        {/* Success Message */}
        {success && (
          <motion.div
            className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
              <p className="text-green-700 font-medium">Cập nhật thông tin thành công!</p>
            </div>
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </motion.div>
        )}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Personal Information Card */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl shadow-lg border border-[#e8d5c4] p-6"
          >
            <div className="flex items-center mb-6">
              <User className="w-6 h-6 text-[#c47256] mr-3" />
              <h2 className="text-2xl font-bold text-[#34140e]">Thông tin cá nhân</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#34140e] mb-2">
                  Họ và tên *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[#e8d5c4] rounded-lg focus:ring-2 focus:ring-[#c47256] focus:border-transparent transition-all"
                  placeholder="Nhập họ và tên"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#34140e] mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[#e8d5c4] rounded-lg focus:ring-2 focus:ring-[#c47256] focus:border-transparent transition-all"
                  placeholder="your@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#34140e] mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Số điện thoại *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[#e8d5c4] rounded-lg focus:ring-2 focus:ring-[#c47256] focus:border-transparent transition-all"
                  placeholder="0123456789"
                />
              </div>
            </div>
          </motion.div>

          {/* Pet Information Card */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl shadow-lg border border-[#e8d5c4] p-6"
          >
            <div className="flex items-center mb-6">
              <PawPrint className="w-6 h-6 text-[#c47256] mr-3" />
              <h2 className="text-2xl font-bold text-[#34140e]">Thông tin thú cưng</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#34140e] mb-2">
                  Tên thú cưng
                </label>
                <input
                  type="text"
                  name="petName"
                  value={form.petName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[#e8d5c4] rounded-lg focus:ring-2 focus:ring-[#c47256] focus:border-transparent transition-all"
                  placeholder="Tên thú cưng của bạn"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#34140e] mb-2">
                  Loại thú cưng
                </label>
                <select
                  name="petType"
                  value={form.petType}
                  onChange={handleChange}
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
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Tuổi thú cưng
                </label>
                <input
                  type="text"
                  name="petAge"
                  value={form.petAge}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[#e8d5c4] rounded-lg focus:ring-2 focus:ring-[#c47256] focus:border-transparent transition-all"
                  placeholder="Ví dụ: 2 tuổi, 6 tháng"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#34140e] mb-2">
                  <Weight className="w-4 h-4 inline mr-2" />
                  Kích thước thú cưng
                </label>
                <select
                  name="petSize"
                  value={form.petSize}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[#e8d5c4] rounded-lg focus:ring-2 focus:ring-[#c47256] focus:border-transparent transition-all"
                >
                  <option value="">Chọn kích thước</option>
                  <option value="small">Nhỏ</option>
                  <option value="medium">Vừa</option>
                  <option value="large">Lớn</option>
                  <option value="extra_large">Rất lớn</option>
                </select>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Save Button */}
        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <motion.button
            onClick={handleSave}
            disabled={loading}
            className="bg-[#c47256] hover:bg-[#a85d45] disabled:bg-[#a85d45] text-white px-8 py-4 rounded-xl font-semibold flex items-center gap-3 mx-auto shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {loading ? (
              <>
                <motion.div
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                Đang lưu...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Lưu thay đổi
              </>
            )}
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}
