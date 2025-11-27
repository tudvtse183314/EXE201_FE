// src/layouts/ProfileLayout.jsx - Profile Layout with Sidebar Menu
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Typography, Avatar, Space, Divider } from 'antd';
import { 
  UserOutlined,
  HeartOutlined,
  ShoppingOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';

const { Sider, Content } = Layout;
const { Title, Text } = Typography;

export default function ProfileLayout({ children, activeKey = 'profile' }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  // Xác định active key từ URL và query params
  const getActiveKey = () => {
    // Ưu tiên kiểm tra query params trước
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get('tab');
    if (tab) {
      return tab; // Trả về tab từ query params: pets, orders, order-status, profile
    }
    
    // Nếu không có query params, kiểm tra pathname
    const path = location.pathname;
    if (path.includes('/my-pets') || path.includes('/pets')) return 'pets';
    // Nhận diện cả /customer/orders và /customer/orders/:id
    if (path.includes('/orders')) return 'orders';
    return 'profile';
  };

  const menuItems = [
    { 
      key: 'profile', 
      label: 'Thông tin cá nhân', 
      icon: <UserOutlined />,
      onClick: () => navigate('/customer/profile')
    },
    { 
      key: 'pets', 
      label: 'My Pet', 
      icon: <HeartOutlined />,
      onClick: () => navigate('/customer/profile?tab=pets')
    },
    { 
      key: 'orders', 
      label: 'Lịch sử giao dịch', 
      icon: <ShoppingOutlined />,
      onClick: () => navigate('/customer/profile?tab=orders')
    },
  ];

  const handleMenuClick = ({ key }) => {
    const item = menuItems.find(i => i.key === key);
    if (item?.onClick) {
      item.onClick();
    } else {
      // Fallback: navigate with query param
      const params = new URLSearchParams(location.search);
      params.set('tab', key);
      navigate(`${location.pathname}?${params.toString()}`);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={280}
        style={{
          background: '#fff',
          boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'auto'
        }}
        theme="light"
      >
        {/* User Info Section */}
        <div style={{ 
          padding: collapsed ? '16px 8px' : '24px', 
          textAlign: collapsed ? 'center' : 'left',
          borderBottom: '1px solid #f0f0f0'
        }}>
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <Avatar
              size={collapsed ? 48 : 64}
              src={user?.avatar}
              icon={<UserOutlined />}
              style={{
                background: 'linear-gradient(135deg, #eda274 0%, #ffb07c 100%)',
                display: 'block',
                margin: collapsed ? '0 auto' : '0'
              }}
            />
            {!collapsed && (
              <>
                <Title level={5} style={{ margin: 0, textAlign: 'center' }}>
                  {user?.fullName || user?.name || 'Người dùng'}
                </Title>
                <Text type="secondary" style={{ fontSize: '12px', display: 'block', textAlign: 'center' }}>
                  {user?.email || ''}
                </Text>
                <Divider style={{ margin: '12px 0' }} />
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  👤 {user?.role || 'CUSTOMER'}
                </Text>
              </>
            )}
          </Space>
        </div>

        {/* Navigation Menu */}
        <Menu
          mode="inline"
          selectedKeys={[getActiveKey()]}
          onClick={handleMenuClick}
          style={{
            border: 'none',
            background: 'transparent',
            padding: '8px 0'
          }}
          items={menuItems.map(item => ({
            key: item.key,
            label: item.label,
            icon: item.icon
          }))}
        />

        {/* Quick Actions */}
        {!collapsed && (
          <div style={{ 
            padding: '16px 24px', 
            borderTop: '1px solid #f0f0f0',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: '#fff'
          }}>
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>
                Quick Actions
              </Text>
              <Menu
                mode="inline"
                style={{ border: 'none', background: 'transparent' }}
                items={[
                  {
                    key: 'home',
                    label: 'Về trang chủ',
                    icon: <HomeOutlined />,
                    onClick: () => navigate('/')
                  },
                  {
                    key: 'settings',
                    label: 'Cài đặt',
                    icon: <SettingOutlined />,
                    onClick: () => navigate('/customer/profile?tab=profile')
                  }
                ]}
              />
            </Space>
          </div>
        )}
      </Sider>

      {/* Content Area */}
      <Layout style={{ background: '#f5f5f5' }}>
        <Content
          style={{
            margin: '24px',
            padding: '24px',
            background: '#fff',
            borderRadius: '12px',
            minHeight: 'calc(100vh - 48px)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}

