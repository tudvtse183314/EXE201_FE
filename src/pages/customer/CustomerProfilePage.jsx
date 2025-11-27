// src/pages/customer/CustomerProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Card, 
  Typography, 
  Row, 
  Col,
  Form,
  Input,
  Button,
  Space,
  Divider,
  Alert,
  Spin,
  Modal,
  Tag
} from 'antd';
import { 
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EditOutlined,
  SaveOutlined,
  KeyOutlined
} from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { updateAccount, resetPassword } from '../../services/auth';
import PetProfilePage from './PetProfilePage';
import Orders from './Orders';
import OrderStatusTab from './OrderStatusTab';
import ProfileLayout from '../../layouts/ProfileLayout';

const { Title, Text } = Typography;

export default function CustomerProfilePage() {
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'profile';
  
  const { user, updateUser } = useAuth();
  const { showSuccess, showError } = useToast();
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'CUSTOMER',
    createdAt: ''
  });

  useEffect(() => {
    if (user) {
      const userData = {
        name: user.name || user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role || 'CUSTOMER',
        createdAt: user.createdAt || ''
      };
      setProfileData(userData);
      form.setFieldsValue({
        name: userData.name,
        email: userData.email,
        phone: userData.phone
      });
    }
  }, [user, form]);

  const handleSave = async (values) => {
    try {
      setLoading(true);
      console.log("👤 CustomerProfilePage: Saving profile", { values, userId: user?.id || user?.userId });
      
      // Prepare data for API - API chỉ nhận 3 fields: fullName, email, phone
      // Theo UpdateAccountRequest schema từ backend
      const updateData = {
        fullName: values.name?.trim() || '',
        email: values.email?.trim() || '',
        phone: values.phone?.trim() || ''
      };
      
      // Validate required fields
      if (!updateData.fullName) {
        showError('Vui lòng nhập họ và tên!');
        return;
      }
      if (!updateData.email) {
        showError('Vui lòng nhập email!');
        return;
      }
      if (!updateData.phone) {
        showError('Vui lòng nhập số điện thoại!');
        return;
      }
      
      const accountId = user?.id || user?.userId;
      if (!accountId) {
        showError('Không tìm thấy ID tài khoản. Vui lòng đăng nhập lại.');
        return;
      }
      
      // Call API to update account
      const result = await updateAccount(accountId, updateData);
      console.log("👤 CustomerProfilePage: API response", { result, accountId });
      
      // Update local profileData state
      const updatedProfileData = {
        name: updateData.fullName,
        email: updateData.email,
        phone: updateData.phone,
        role: profileData.role,
        createdAt: profileData.createdAt
      };
      setProfileData(updatedProfileData);
      
      // Update auth context with merged user data
      if (updateUser) {
        const updatedUserData = {
          ...user,
          fullName: updateData.fullName,
          name: updateData.fullName,
          email: updateData.email,
          phone: updateData.phone,
          // Giữ lại các field khác từ user hiện tại
        };
        updateUser(updatedUserData);
        console.log("👤 CustomerProfilePage: Updated user context", updatedUserData);
      }
      
      // Update form fields to reflect new values
      form.setFieldsValue({
        name: updatedProfileData.name,
        email: updatedProfileData.email,
        phone: updatedProfileData.phone
      });
      
      setIsEditing(false);
      showSuccess('Cập nhật thông tin thành công!');
      console.log("👤 CustomerProfilePage: Profile updated successfully");
    } catch (error) {
      console.error("👤 CustomerProfilePage: Error saving profile", {
        error: error.response?.data || error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        userId: user?.id || user?.userId,
      });
      
      // Hiển thị error message chi tiết
      let errorMessage = 'Lỗi khi cập nhật thông tin.';
      if (error.response?.status === 400) {
        errorMessage = error.response?.data?.message || 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
      } else if (error.response?.status === 403) {
        errorMessage = 'Bạn không có quyền cập nhật tài khoản này.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Không tìm thấy tài khoản để cập nhật.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (values) => {
    try {
      setLoading(true);
      console.log("👤 CustomerProfilePage: Changing password", { email: user.email });
      
      // Call API to reset password - POST /api/reset
      const result = await resetPassword({
        email: user.email || user.email,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword
      });
      
      setIsPasswordModalOpen(false);
      passwordForm.resetFields();
      showSuccess('Đổi mật khẩu thành công!');
      console.log("👤 CustomerProfilePage: Password changed successfully", result);
    } catch (error) {
      console.error("👤 CustomerProfilePage: Error changing password", {
        email: user.email,
        error: error.response?.data || error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
      });
      
      // Hiển thị error message chi tiết
      let errorMessage = 'Lỗi khi đổi mật khẩu.';
      if (error.response?.status === 400) {
        errorMessage = error.response?.data?.message || 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Không tìm thấy tài khoản với email này.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };


  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px', fontSize: '16px', color: '#666' }}>
          Đang tải thông tin người dùng...
        </div>
      </div>
    );
  }

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'pets':
        return <PetProfilePage />;
      case 'orders':
        return <Orders />;
      case 'order-status':
        return <OrderStatusTab />;
      case 'profile':
      default:
        return (
        <Row gutter={[24, 24]}>
        {/* Profile Information */}
        <Col xs={24} lg={16}>
          <Card title="Thông tin cá nhân" style={{ borderRadius: '12px' }}>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSave}
              disabled={!isEditing}
            >
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item
                    label="Họ và tên"
                    name="name"
                    rules={[
                      { required: true, message: 'Vui lòng nhập họ và tên!' },
                      { min: 2, message: 'Họ và tên phải có ít nhất 2 ký tự!' }
                    ]}
                  >
                    <Input 
                      prefix={<UserOutlined />}
                      placeholder="Nhập họ và tên..."
                      size="large"
                      style={{ borderRadius: '8px' }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, message: 'Vui lòng nhập email!' },
                      { type: 'email', message: 'Email không hợp lệ!' }
                    ]}
                  >
                    <Input 
                      prefix={<MailOutlined />}
                      placeholder="Nhập email..."
                      size="large"
                      style={{ borderRadius: '8px' }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Số điện thoại"
                    name="phone"
                    rules={[
                      { required: true, message: 'Vui lòng nhập số điện thoại!' },
                      { pattern: /^(\+84|84|0)[1-9][0-9]{8,9}$/, message: 'Số điện thoại không hợp lệ!' }
                    ]}
                  >
                    <Input 
                      prefix={<PhoneOutlined />}
                      placeholder="Nhập số điện thoại..."
                      size="large"
                      style={{ borderRadius: '8px' }}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        </Col>

        {/* Account Info */}
        <Col xs={24} lg={8}>
          <Card title="Thông tin tài khoản" style={{ borderRadius: '12px' }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <Text strong style={{ fontSize: '15px' }}>Vai trò:</Text>
                <br />
                <Tag color="green" style={{ borderRadius: '6px', fontSize: '14px', marginTop: '4px' }}>
                  {profileData.role}
                </Tag>
              </div>
              
              <div>
                <Text strong style={{ fontSize: '15px' }}>Ngày tạo tài khoản:</Text>
                <br />
                <Text type="secondary" style={{ fontSize: '14px' }}>
                  {profileData.createdAt ? new Date(profileData.createdAt).toLocaleDateString('vi-VN') : 'Không xác định'}
                </Text>
              </div>

              <Divider />

              <Button 
                type="default"
                icon={<KeyOutlined />}
                onClick={() => setIsPasswordModalOpen(true)}
                size="large"
                style={{ 
                  width: '100%',
                  borderRadius: '8px',
                  border: '2px solid var(--pv-primary, #eda274)',
                  color: 'var(--pv-primary, #eda274)',
                  fontSize: '15px'
                }}
              >
                Đổi mật khẩu
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
        );
    }
  };

  return (
    <ProfileLayout activeKey={activeTab}>
      {/* Header - chỉ hiển thị khi ở tab profile */}
      {activeTab === 'profile' && (
        <Card 
          style={{ 
            marginBottom: '24px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #fff 0%, #ffeadd 100%)'
          }}
        >
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={3} style={{ margin: 0, color: 'var(--pv-text-heading, #2a1a10)' }}>
                👤 Thông tin cá nhân
              </Title>
              <Text style={{ color: 'var(--pv-text-muted, #7e5c48)' }}>
                Quản lý thông tin cá nhân và thú cưng của bạn
              </Text>
            </Col>
            {!isEditing && (
              <Col>
                <Button 
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => setIsEditing(true)}
                  style={{ 
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, var(--pv-primary, #eda274) 0%, var(--pv-accent, #ffb07c) 100%)',
                    border: 'none'
                  }}
                >
                  Chỉnh sửa
                </Button>
              </Col>
            )}
          </Row>
        </Card>
      )}

      {/* Content */}
      {renderContent()}

      {/* Password Change Modal */}
      <Modal
        title="Đổi mật khẩu"
        open={isPasswordModalOpen}
        onCancel={() => setIsPasswordModalOpen(false)}
        footer={null}
        width={500}
        style={{ borderRadius: '12px' }}
      >
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handlePasswordChange}
          style={{ marginTop: '24px' }}
        >
          <Alert
            message="⚠️ Lưu ý quan trọng"
            description="Để đổi mật khẩu, bạn cần nhập email và mật khẩu mới. Hệ thống sẽ gửi email xác thực."
            type="warning"
            showIcon
            style={{ marginBottom: '24px' }}
          />

          <Form.Item
            label="Mật khẩu mới"
            name="newPassword"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
              { 
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                message: 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số!'
              }
            ]}
          >
            <Input.Password 
              prefix={<KeyOutlined />}
              placeholder="Nhập mật khẩu mới..."
              size="large"
              style={{ borderRadius: '8px' }}
            />
          </Form.Item>

          <Form.Item
            label="Xác nhận mật khẩu mới"
            name="confirmPassword"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu mới!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password 
              prefix={<KeyOutlined />}
              placeholder="Nhập lại mật khẩu mới..."
              size="large"
              style={{ borderRadius: '8px' }}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setIsPasswordModalOpen(false)}>
                Hủy
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                style={{ 
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, var(--pv-primary, #eda274) 0%, var(--pv-accent, #ffb07c) 100%)',
                  border: 'none'
                }}
              >
                Đổi mật khẩu
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </ProfileLayout>
  );
}
