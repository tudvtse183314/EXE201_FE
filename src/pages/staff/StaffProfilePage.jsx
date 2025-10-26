// src/pages/staff/StaffProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Typography, 
  Row, 
  Col,
  Form,
  Input,
  Button,
  Space,
  Avatar,
  Upload,
  message,
  Divider,
  Alert,
  Spin,
  Modal,
  InputNumber,
  Tag
} from 'antd';
import { 
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EditOutlined,
  SaveOutlined,
  CameraOutlined,
  LockOutlined,
  KeyOutlined
} from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import { updateAccount, resetPassword } from '../../services/auth';

const { Title, Text } = Typography;

export default function StaffProfilePage() {
  const { user, updateUser } = useAuth();
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    petName: '',
    petAge: '',
    petType: '',
    petSize: '',
    avatar: null,
    role: 'STAFF',
    createdAt: '',
    lastLogin: ''
  });

  useEffect(() => {
    if (user) {
      const userData = {
        name: user.name || user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        petName: user.petName || '',
        petAge: user.petAge || '',
        petType: user.petType || '',
        petSize: user.petSize || '',
        avatar: user.avatar || null,
        role: user.role || 'STAFF',
        createdAt: user.createdAt || '',
        lastLogin: user.lastLogin || ''
      };
      setProfileData(userData);
      form.setFieldsValue(userData);
    }
  }, [user]);

  const handleSave = async (values) => {
    try {
      setLoading(true);
      console.log("👤 StaffProfilePage: Saving profile", values);
      
      // Prepare data for API - map form values to API format
      const updateData = {
        fullName: values.name,
        email: values.email,
        phone: values.phone,
        petName: values.petName || '',
        petAge: values.petAge || '',
        petType: values.petType || '',
        petSize: values.petSize || '',
        address: values.address || ''
      };
      
      // Call API to update account
      const result = await updateAccount(user.id, updateData);
      console.log("👤 StaffProfilePage: API response", result);
      
      // Update auth context with merged user data
      if (updateUser) {
        const updatedUserData = {
          ...user,
          fullName: values.name,
          name: values.name,
          email: values.email,
          phone: values.phone,
          address: values.address,
          petName: values.petName || '',
          petAge: values.petAge || '',
          petType: values.petType || '',
          petSize: values.petSize || ''
        };
        updateUser(updatedUserData);
        console.log("👤 StaffProfilePage: Updated user context", updatedUserData);
      }
      
      setIsEditing(false);
      message.success('Cập nhật thông tin thành công!');
      console.log("👤 StaffProfilePage: Profile updated successfully");
    } catch (error) {
      console.error("👤 StaffProfilePage: Error saving profile", error);
      message.error('Lỗi khi cập nhật thông tin: ' + (error?.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (values) => {
    try {
      setLoading(true);
      console.log("👤 StaffProfilePage: Changing password");
      
      // Call API to reset password
      const result = await resetPassword({
        email: user.email,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword
      });
      
      setIsPasswordModalOpen(false);
      passwordForm.resetFields();
      message.success('Đổi mật khẩu thành công!');
      console.log("👤 StaffProfilePage: Password changed", result);
    } catch (error) {
      console.error("👤 StaffProfilePage: Error changing password", error);
      message.error('Lỗi khi đổi mật khẩu: ' + (error?.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = (info) => {
    if (info.file.status === 'done') {
      message.success('Cập nhật ảnh đại diện thành công!');
      setProfileData(prev => ({ ...prev, avatar: info.file.response?.url || info.file.thumbUrl }));
    } else if (info.file.status === 'error') {
      message.error('Lỗi khi tải ảnh lên!');
    }
  };

  const uploadProps = {
    name: 'avatar',
    showUploadList: false,
    onChange: handleAvatarUpload,
    beforeUpload: (file) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('Chỉ hỗ trợ file JPG/PNG!');
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Kích thước ảnh không được vượt quá 2MB!');
        return false;
      }
      return true;
    },
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

  return (
    <div>
      {/* Header */}
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
              👤 Hồ sơ cá nhân
            </Title>
            <Text style={{ color: 'var(--pv-text-muted, #7e5c48)' }}>
              Quản lý thông tin cá nhân và tài khoản của bạn
            </Text>
          </Col>
          <Col>
            <Space>
              {!isEditing ? (
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
              ) : (
                <Space>
                  <Button onClick={() => setIsEditing(false)}>
                    Hủy
                  </Button>
                  <Button 
                    type="primary"
                    icon={<SaveOutlined />}
                    onClick={() => form.submit()}
                    loading={loading}
                    style={{ 
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, var(--pv-primary, #eda274) 0%, var(--pv-accent, #ffb07c) 100%)',
                      border: 'none'
                    }}
                  >
                    Lưu thay đổi
                  </Button>
                </Space>
              )}
            </Space>
          </Col>
        </Row>
      </Card>

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
                <Col span={12}>
                  <Form.Item
                    label="Địa chỉ"
                    name="address"
                    rules={[
                      { required: true, message: 'Vui lòng nhập địa chỉ!' }
                    ]}
                  >
                    <Input 
                      placeholder="Nhập địa chỉ..."
                      size="large"
                      style={{ borderRadius: '8px' }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              {/* Pet Information Section */}
              <Divider orientation="left" style={{ marginTop: '24px' }}>
                <Text strong style={{ color: 'var(--pv-primary, #eda274)' }}>
                  🐾 Thông tin thú cưng
                </Text>
              </Divider>

              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item
                    label="Tên thú cưng"
                    name="petName"
                  >
                    <Input 
                      placeholder="Nhập tên thú cưng..."
                      size="large"
                      style={{ borderRadius: '8px' }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Tuổi thú cưng"
                    name="petAge"
                  >
                    <Input 
                      placeholder="Nhập tuổi thú cưng..."
                      size="large"
                      style={{ borderRadius: '8px' }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Loại thú cưng"
                    name="petType"
                  >
                    <Input 
                      placeholder="Nhập loại thú cưng..."
                      size="large"
                      style={{ borderRadius: '8px' }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Kích thước thú cưng"
                    name="petSize"
                  >
                    <Input 
                      placeholder="Nhập kích thước thú cưng..."
                      size="large"
                      style={{ borderRadius: '8px' }}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        </Col>

        {/* Avatar and Account Info */}
        <Col xs={24} lg={8}>
          <Card title="Ảnh đại diện" style={{ borderRadius: '12px', marginBottom: '24px' }}>
            <div style={{ textAlign: 'center' }}>
              <Upload {...uploadProps}>
                <Avatar
                  size={120}
                  src={profileData.avatar}
                  icon={<UserOutlined />}
                  style={{
                    background: 'linear-gradient(135deg, var(--pv-primary, #eda274) 0%, var(--pv-accent, #ffb07c) 100%)',
                    cursor: 'pointer',
                    border: '3px solid var(--pv-primary, #eda274)'
                  }}
                />
              </Upload>
              <div style={{ marginTop: '16px' }}>
                <Button 
                  icon={<CameraOutlined />}
                  onClick={() => document.querySelector('input[type="file"]')?.click()}
                  style={{ borderRadius: '8px' }}
                >
                  Thay đổi ảnh
                </Button>
              </div>
            </div>
          </Card>

          <Card title="Thông tin tài khoản" style={{ borderRadius: '12px' }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <Text strong>Vai trò:</Text>
                <br />
                <Tag color="blue" style={{ borderRadius: '6px' }}>
                  {profileData.role}
                </Tag>
              </div>
              
              <div>
                <Text strong>Ngày tạo tài khoản:</Text>
                <br />
                <Text type="secondary">
                  {profileData.createdAt ? new Date(profileData.createdAt).toLocaleDateString('vi-VN') : 'Không xác định'}
                </Text>
              </div>
              
              <div>
                <Text strong>Lần đăng nhập cuối:</Text>
                <br />
                <Text type="secondary">
                  {profileData.lastLogin ? new Date(profileData.lastLogin).toLocaleString('vi-VN') : 'Không xác định'}
                </Text>
              </div>

              {profileData.petName && (
                <>
                  <Divider />
                  <div>
                    <Text strong>🐾 Thú cưng:</Text>
                    <br />
                    <Text type="secondary">{profileData.petName}</Text>
                    {profileData.petType && (
                      <>
                        <br />
                        <Tag color="green" style={{ marginTop: '4px' }}>
                          {profileData.petType}
                        </Tag>
                      </>
                    )}
                  </div>
                </>
              )}

              <Divider />

              <Button 
                type="default"
                icon={<KeyOutlined />}
                onClick={() => setIsPasswordModalOpen(true)}
                style={{ 
                  width: '100%',
                  borderRadius: '8px',
                  border: '2px solid var(--pv-primary, #eda274)',
                  color: 'var(--pv-primary, #eda274)'
                }}
              >
                Đổi mật khẩu
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>

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
    </div>
  );
}
