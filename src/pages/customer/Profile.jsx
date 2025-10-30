import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { updateAccount, resetPassword, deleteAccount, restoreAccount } from '../../services/auth';
import { toast } from 'react-toastify';

export default function CustomerProfile() {
  const { user, logout, login } = useAuth();
  const [edit, setEdit] = useState(false);
  const [fields, setFields] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [pwForm, setPwForm] = useState({
    email: user?.email || '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [pwErr, setPwErr] = useState({});
  const [pwLoading, setPwLoading] = useState(false);
  const [emailChanged, setEmailChanged] = useState(false);
  const [showEmailVerify, setShowEmailVerify] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [delLoading, setDelLoading] = useState(false);
  const [restoreLoading, setRestoreLoading] = useState(false);

  const handleFieldChange = (k, v) => {
    setFields(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: '' }));
    // Track email change for verification
    if (k === 'email' && v !== user?.email) {
      setEmailChanged(true);
    } else if (k === 'email' && v === user?.email) {
      setEmailChanged(false);
    }
  };
  const validateProfile = () => {
    let errs = {};
    if (!fields.fullName.trim()) errs.fullName = 'Họ tên không được bỏ trống';
    if (!fields.email.trim() ||
      !/^\S+@\S+$/.test(fields.email)) errs.email = 'Email không hợp lệ';
    if (!fields.phone.trim() || !/^[0-9]{10,11}$/.test(fields.phone)) errs.phone = 'SĐT phải có 10-11 số';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };
  const handleUpdate = async () => {
    if (!validateProfile()) return;
    
    // Nếu email thay đổi, yêu cầu xác minh
    if (emailChanged && fields.email !== user?.email) {
      if (!window.confirm('Email đã thay đổi. Bạn sẽ cần xác minh email mới. Tiếp tục?')) {
        return;
      }
      // TODO: Gửi OTP đến email mới (nếu BE hỗ trợ)
      // setShowEmailVerify(true);
      // return;
    }
    
    setLoading(true);
    try {
      const data = await updateAccount(user.id || user.accountId, fields);
      toast.success('Cập nhật thông tin thành công!' + (emailChanged ? ' Vui lòng kiểm tra email mới để xác minh.' : ''));
      // Update AuthContext + localStorage
      login({ ...user, ...fields }, localStorage.getItem('accessToken'));
      setEdit(false);
      setEmailChanged(false);
    } catch (e) {
      toast.error(e.message || 'Lỗi cập nhật');
    }
    setLoading(false);
  };
  const handleDelete = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn xoá tài khoản này?')) return;
    setDelLoading(true);
    try {
      await deleteAccount(user.id || user.accountId);
      toast.success('Đã xoá tài khoản!');
      logout();
    } catch (e) {
      toast.error(e.message || 'Lỗi xoá tài khoản');
    }
    setDelLoading(false);
  };
  const handleRestore = async () => {
    setRestoreLoading(true);
    try {
      await restoreAccount(user.id || user.accountId);
      toast.success('Khôi phục tài khoản thành công!');
    } catch (e) {
      toast.error(e.message || 'Lỗi khôi phục tài khoản');
    }
    setRestoreLoading(false);
  };

  const validatePW = () => {
    const errs = {};
    if (!pwForm.oldPassword) {
      errs.oldPassword = 'Vui lòng nhập mật khẩu cũ';
    }
    if (!pwForm.newPassword || pwForm.newPassword.length < 6) {
      errs.newPassword = 'Mật khẩu mới tối thiểu 6 ký tự';
    }
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      errs.confirmPassword = 'Mật khẩu nhập lại không khớp';
    }
    if (pwForm.oldPassword === pwForm.newPassword) {
      errs.newPassword = 'Mật khẩu mới phải khác mật khẩu cũ';
    }
    setPwErr(errs);
    return Object.keys(errs).length === 0;
  };
  
  const handleChangePassword = async () => {
    if (!validatePW()) return;
    setPwLoading(true);
    try {
      // API BE hiện nhận: { email, newPassword, confirmPassword }
      // Vẫn kiểm tra oldPassword ở FE (không gửi lên nếu BE không yêu cầu)
      await resetPassword({
        email: pwForm.email,
        newPassword: pwForm.newPassword,
        confirmPassword: pwForm.confirmPassword
      });
      toast.success('Đổi mật khẩu thành công!');
      setShowPasswordModal(false);
      setPwForm({ email: user?.email || '', oldPassword: '', newPassword: '', confirmPassword: '' });
      setPwErr({});
    } catch (e) {
      const msg = e?.response?.data?.message || e.message || 'Lỗi đổi mật khẩu!';
      if (msg.toLowerCase().includes('old') || msg.toLowerCase().includes('cũ') || msg.toLowerCase().includes('current')) {
        setPwErr({ oldPassword: msg });
      } else {
        toast.error(msg);
      }
    }
    setPwLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Thông tin tài khoản</h1>
            <Button onClick={logout} variant="secondary">Đăng xuất</Button>
          </div>
          <div className="space-y-8">
            {/* Thông tin tài khoản (editable) */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Cập nhật thông tin</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Họ tên</label>
                  <Input value={fields.fullName} onChange={e=>handleFieldChange('fullName', e.target.value)} disabled={!edit} />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <Input value={fields.email} onChange={e=>handleFieldChange('email', e.target.value)} disabled={!edit} type="email" />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  {emailChanged && fields.email !== user?.email && (
                    <p className="text-amber-600 text-xs mt-1">⚠️ Email đã thay đổi. Bạn sẽ cần xác minh email mới sau khi lưu.</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                  <Input value={fields.phone} onChange={e=>handleFieldChange('phone', e.target.value)} disabled={!edit} />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                {!edit ? (
                  <Button onClick={()=>setEdit(true)} variant="primary">Sửa thông tin</Button>
                ) : (
                  <>
                    <Button onClick={handleUpdate} variant="primary" disabled={loading}>Lưu thay đổi</Button>
                    <Button onClick={()=>{setEdit(false); setFields({fullName:user.fullName,email:user.email,phone:user.phone});setErrors({});setEmailChanged(false);}} variant="secondary" disabled={loading}>Huỷ</Button>
                  </>
                )}
                <Button variant="secondary" onClick={()=>setShowPasswordModal(true)}>Đổi mật khẩu</Button>
                <Button variant="secondary" danger onClick={handleDelete} disabled={delLoading}>Xoá tài khoản</Button>
                {user?.status==='DELETED' || user?.status==='DISABLED' ? (
                  <Button variant="primary" onClick={handleRestore} disabled={restoreLoading}>Khôi phục tài khoản</Button>
                ) : null}
              </div>
            </div>
          </div>
          {/* Modal đổi mật khẩu */}
          {showPasswordModal && (
            <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={() => setShowPasswordModal(false)}>
              <div className="bg-white rounded-xl shadow-lg py-8 px-10 w-full max-w-md relative" onClick={(e) => e.stopPropagation()}>
                <button onClick={()=>{setShowPasswordModal(false); setPwForm({email:user?.email||'',oldPassword:'',newPassword:'',confirmPassword:''});setPwErr({});}} className="absolute right-3 top-2 text-gray-700 hover:text-gray-900 text-xl">✕</button>
                <h2 className="text-xl font-bold mb-4">Đổi mật khẩu</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <Input type="email" disabled value={pwForm.email} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu cũ *</label>
                    <Input 
                      type="password" 
                      placeholder="Nhập mật khẩu cũ" 
                      value={pwForm.oldPassword} 
                      onChange={e=>{setPwForm(f=>({...f,oldPassword:e.target.value})); setPwErr({...pwErr, oldPassword:''});}}
                    />
                    {pwErr.oldPassword && <p className="text-red-500 text-xs mt-1">{pwErr.oldPassword}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới *</label>
                    <Input 
                      type="password" 
                      placeholder="Mật khẩu mới (tối thiểu 6 ký tự)" 
                      value={pwForm.newPassword} 
                      onChange={e=>{setPwForm(f=>({...f,newPassword:e.target.value})); setPwErr({...pwErr, newPassword:''});}}
                    />
                    {pwErr.newPassword && <p className="text-red-500 text-xs mt-1">{pwErr.newPassword}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nhập lại mật khẩu mới *</label>
                    <Input 
                      type="password" 
                      placeholder="Nhập lại mật khẩu mới" 
                      value={pwForm.confirmPassword} 
                      onChange={e=>{setPwForm(f=>({...f,confirmPassword:e.target.value})); setPwErr({...pwErr, confirmPassword:''});}}
                    />
                    {pwErr.confirmPassword && <p className="text-red-500 text-xs mt-1">{pwErr.confirmPassword}</p>}
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button onClick={handleChangePassword} variant="primary" disabled={pwLoading}>
                      {pwLoading ? 'Đang xử lý...' : 'Xác nhận'}
                    </Button>
                    <Button onClick={()=>{setShowPasswordModal(false); setPwForm({email:user?.email||'',oldPassword:'',newPassword:'',confirmPassword:''});setPwErr({});}} variant="secondary" disabled={pwLoading}>Huỷ</Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
