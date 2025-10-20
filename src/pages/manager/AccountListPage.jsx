import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  UserPlus, 
  Trash2, 
  RotateCw, 
  Search, 
  Filter, 
  Users, 
  UserCheck, 
  UserX,
  Mail,
  Phone,
  Calendar,
  Shield,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { 
  getAllAccounts, 
  createAccount, 
  restoreAccount, 
  deleteAccount, 
  searchAccounts,
  getAccountStats 
} from "../../api/account";

export default function AccountListPage() {
  const [accounts, setAccounts] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [stats, setStats] = useState(null);
  
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "STAFF",
    password: "123456"
  });

  useEffect(() => {
    fetchAccounts();
    fetchStats();
  }, []);

  useEffect(() => {
    filterAccounts();
  }, [accounts, searchQuery, roleFilter]);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const data = await getAllAccounts();
      setAccounts(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await getAccountStats();
      setStats(data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  };

  const filterAccounts = () => {
    let filtered = accounts;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(acc => 
        acc.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        acc.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        acc.phone?.includes(searchQuery)
      );
    }

    // Role filter
    if (roleFilter !== "ALL") {
      filtered = filtered.filter(acc => acc.role === roleFilter);
    }

    setFilteredAccounts(filtered);
  };

  const handleCreate = async () => {
    try {
      await createAccount(form);
      setOpen(false);
      setForm({ fullName: "", email: "", phone: "", role: "STAFF", password: "123456" });
      setSuccess("Tạo tài khoản thành công!");
      setTimeout(() => setSuccess(null), 3000);
      fetchAccounts();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa tài khoản "${name}"?`)) {
      try {
        await deleteAccount(id);
        setSuccess("Xóa tài khoản thành công!");
        setTimeout(() => setSuccess(null), 3000);
        fetchAccounts();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleRestore = async (id, name) => {
    if (window.confirm(`Bạn có chắc chắn muốn khôi phục tài khoản "${name}"?`)) {
      try {
        await restoreAccount(id);
        setSuccess("Khôi phục tài khoản thành công!");
        setTimeout(() => setSuccess(null), 3000);
        fetchAccounts();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'CUSTOMER': return 'bg-blue-100 text-blue-800';
      case 'STAFF': return 'bg-green-100 text-green-800';
      case 'MANAGER': return 'bg-purple-100 text-purple-800';
      case 'DOCTOR': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'CUSTOMER': return <Users className="w-4 h-4" />;
      case 'STAFF': return <UserCheck className="w-4 h-4" />;
      case 'MANAGER': return <Shield className="w-4 h-4" />;
      case 'DOCTOR': return <UserCheck className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
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
          <p className="text-[#34140e] text-lg">Đang tải danh sách tài khoản...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfaf7] p-8">
      <motion.div
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
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
                <Users className="text-[#c47256]" size={40} />
              </motion.div>
              Quản lý tài khoản
            </h1>
            <p className="text-[#8b5a3c] mt-2">Quản lý và theo dõi tất cả tài khoản trong hệ thống</p>
          </motion.div>

          <motion.button
            onClick={() => setOpen(true)}
            className="bg-[#c47256] hover:bg-[#a85d45] text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <UserPlus size={20} />
            Tạo tài khoản mới
          </motion.button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {[
              { label: 'Tổng tài khoản', value: stats.total, color: 'bg-blue-500' },
              { label: 'Khách hàng', value: stats.customers, color: 'bg-green-500' },
              { label: 'Nhân viên', value: stats.staff, color: 'bg-purple-500' },
              { label: 'Bác sĩ', value: stats.doctors, color: 'bg-orange-500' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl shadow-lg p-6 border border-[#e8d5c4]"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#8b5a3c] text-sm font-medium">{stat.label}</p>
                    <p className="text-3xl font-bold text-[#34140e]">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center`}>
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Messages */}
        <AnimatePresence>
          {success && (
            <motion.div
              className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                <p className="text-green-700 font-medium">{success}</p>
              </div>
            </motion.div>
          )}

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
        </AnimatePresence>

        {/* Filters */}
        <motion.div
          className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-[#e8d5c4]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8b5a3c] w-5 h-5" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên, email, số điện thoại..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-[#e8d5c4] rounded-lg focus:ring-2 focus:ring-[#c47256] focus:border-transparent transition-all"
                />
              </div>
            </div>
            <div className="md:w-48">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-4 py-3 border border-[#e8d5c4] rounded-lg focus:ring-2 focus:ring-[#c47256] focus:border-transparent transition-all"
              >
                <option value="ALL">Tất cả vai trò</option>
                <option value="CUSTOMER">Khách hàng</option>
                <option value="STAFF">Nhân viên</option>
                <option value="MANAGER">Quản lý</option>
                <option value="DOCTOR">Bác sĩ</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Accounts Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredAccounts.map((account, index) => (
            <motion.div
              key={account.id}
              variants={itemVariants}
              className="group"
            >
              <motion.div
                className={`bg-white rounded-xl shadow-lg border transition-all duration-300 overflow-hidden ${
                  account.deleted 
                    ? 'border-red-200 bg-red-50' 
                    : 'border-[#e8d5c4] hover:shadow-xl'
                }`}
                whileHover={{ 
                  y: -5,
                  boxShadow: "0 25px 50px -12px rgba(196, 114, 86, 0.25)"
                }}
              >
                <div className="p-6">
                  {/* Account Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        account.deleted ? 'bg-red-100' : 'bg-[#c47256]'
                      }`}>
                        {account.deleted ? (
                          <UserX className="w-6 h-6 text-red-500" />
                        ) : (
                          getRoleIcon(account.role)
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-[#34140e] group-hover:text-[#c47256] transition-colors">
                          {account.fullName}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(account.role)}`}>
                          {account.role}
                        </span>
                      </div>
                    </div>
                    {account.deleted && (
                      <span className="text-xs text-red-500 font-medium">Đã xóa</span>
                    )}
                  </div>

                  {/* Account Info */}
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-[#8b5a3c]">
                      <Mail className="w-4 h-4 mr-2 text-[#c47256]" />
                      <span className="truncate">{account.email}</span>
                    </div>
                    {account.phone && (
                      <div className="flex items-center text-sm text-[#8b5a3c]">
                        <Phone className="w-4 h-4 mr-2 text-[#c47256]" />
                        <span>{account.phone}</span>
                      </div>
                    )}
                    {account.createdAt && (
                      <div className="flex items-center text-sm text-[#8b5a3c]">
                        <Calendar className="w-4 h-4 mr-2 text-[#c47256]" />
                        <span>{new Date(account.createdAt).toLocaleDateString('vi-VN')}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-6">
                    {account.deleted ? (
                      <motion.button
                        onClick={() => handleRestore(account.id, account.fullName)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <RotateCw size={16} />
                        Khôi phục
                      </motion.button>
                    ) : (
                      <motion.button
                        onClick={() => handleDelete(account.id, account.fullName)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Trash2 size={16} />
                        Xóa
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredAccounts.length === 0 && !loading && (
          <motion.div
            className="text-center py-20"
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
              <Users size={80} className="mx-auto mb-6 text-[#c47256] opacity-60" />
            </motion.div>
            <h3 className="text-2xl font-semibold text-[#34140e] mb-4">
              {searchQuery || roleFilter !== "ALL" ? "Không tìm thấy tài khoản" : "Chưa có tài khoản nào"}
            </h3>
            <p className="text-[#8b5a3c] mb-8 max-w-md mx-auto">
              {searchQuery || roleFilter !== "ALL" 
                ? "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm"
                : "Hãy tạo tài khoản đầu tiên để bắt đầu quản lý"
              }
            </p>
          </motion.div>
        )}

        {/* Create Account Modal */}
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
                      <UserPlus className="text-[#c47256]" size={24} />
                      Tạo tài khoản mới
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
                        Họ và tên *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={form.fullName}
                        onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                        className="w-full px-4 py-3 border border-[#e8d5c4] rounded-lg focus:ring-2 focus:ring-[#c47256] focus:border-transparent transition-all"
                        placeholder="Nhập họ và tên"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#34140e] mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-4 py-3 border border-[#e8d5c4] rounded-lg focus:ring-2 focus:ring-[#c47256] focus:border-transparent transition-all"
                        placeholder="your@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#34140e] mb-2">
                        Số điện thoại *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full px-4 py-3 border border-[#e8d5c4] rounded-lg focus:ring-2 focus:ring-[#c47256] focus:border-transparent transition-all"
                        placeholder="0123456789"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#34140e] mb-2">
                        Vai trò *
                      </label>
                      <select
                        name="role"
                        value={form.role}
                        onChange={(e) => setForm({ ...form, role: e.target.value })}
                        className="w-full px-4 py-3 border border-[#e8d5c4] rounded-lg focus:ring-2 focus:ring-[#c47256] focus:border-transparent transition-all"
                      >
                        <option value="STAFF">Nhân viên</option>
                        <option value="DOCTOR">Bác sĩ</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-semibold text-[#34140e] mb-2">
                      Mật khẩu mặc định
                    </label>
                    <input
                      type="text"
                      value={form.password}
                      readOnly
                      className="w-full px-4 py-3 border border-[#e8d5c4] rounded-lg bg-gray-50 text-gray-600"
                      placeholder="Mật khẩu mặc định: 123456"
                    />
                    <p className="text-xs text-[#8b5a3c] mt-1">
                      Người dùng sẽ được yêu cầu đổi mật khẩu khi đăng nhập lần đầu
                    </p>
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
                      onClick={handleCreate}
                      className="flex-1 bg-[#c47256] hover:bg-[#a85d45] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Tạo tài khoản
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
