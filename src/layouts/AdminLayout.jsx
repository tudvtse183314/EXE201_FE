// src/layouts/AdminLayout.jsx - Admin Layout with Ant Design
import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu, Breadcrumb, Typography, Avatar, Dropdown, Button, Space } from 'antd';
import { 
  DashboardOutlined, 
  AppstoreOutlined, 
  ShoppingOutlined, 
  FileTextOutlined, 
  UserOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = React.useState(false);

  const menuItems = [
    { 
      key: 'dashboard', 
      label: 'Dashboard', 
      path: '/admin/dashboard', 
      icon: <DashboardOutlined /> 
    },
    { 
      key: 'categories', 
      label: 'Danh mục', 
      path: '/admin/categories', 
      icon: <AppstoreOutlined /> 
    },
    { 
      key: 'products', 
      label: 'Sản phẩm', 
      path: '/admin/products', 
      icon: <ShoppingOutlined /> 
    },
    { 
      key: 'orders', 
      label: 'Đơn hàng', 
      path: '/admin/orders', 
      icon: <FileTextOutlined /> 
    },
    { 
      key: 'accounts', 
      label: 'Tài khoản', 
      path: '/admin/accounts', 
      icon: <UserOutlined /> 
    },
    { 
      key: 'test', 
      label: '🧪 Test Categories', 
      path: '/admin/test', 
      icon: <UserOutlined /> 
    },
    { 
      key: 'test-products', 
      label: '🧪 Test Products', 
      path: '/admin/test-products', 
      icon: <UserOutlined /> 
    },
    { 
      key: 'api-summary', 
      label: '📊 API Summary', 
      path: '/admin/api-summary', 
      icon: <UserOutlined /> 
    },
  ];

  const getCurrentPageInfo = () => {
    const currentItem = menuItems.find(item => 
      location.pathname === item.path || 
      (item.path === '/admin/dashboard' && (location.pathname === '/admin' || location.pathname === '/admin/dashboard'))
    );
    return currentItem || { label: 'Dashboard', path: '/admin/dashboard' };
  };

  const currentPage = getCurrentPageInfo();

  const handleMenuClick = ({ key }) => {
    const item = menuItems.find(item => item.key === key);
    if (item) {
      navigate(item.path);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const userMenuItems = [
    {
      key: 'profile',
      label: 'Thông tin cá nhân',
      icon: <UserOutlined />,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: 'Đăng xuất',
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh', fontFamily: 'Poppins, Arial, sans-serif' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        style={{
          background: 'var(--pv-dark, #362319)',
          boxShadow: '4px 0 12px rgba(0,0,0,0.15)'
        }}
        width={280}
      >
        {/* Logo Header */}
        <div style={{ 
          padding: collapsed ? '20px 10px' : '30px 25px',
          borderBottom: '2px solid var(--pv-primary, #eda274)',
          background: 'linear-gradient(135deg, var(--pv-dark, #362319) 0%, var(--pv-secondary, #d5956d) 100%)',
          textAlign: 'center'
        }}>
          <Title 
            level={3} 
            style={{ 
              color: 'var(--pv-text-on-dark, #ffeadd)', 
              margin: 0,
              fontSize: collapsed ? '18px' : '24px',
              fontWeight: '800',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
            }}
          >
            {collapsed ? '🛡️' : '🛡️ Admin Panel'}
          </Title>
          {!collapsed && (
            <Text style={{
              color: 'var(--pv-text-on-dark, #ffeadd)',
              fontSize: '14px',
              opacity: 0.9,
              fontWeight: '500'
            }}>
              PetVibe Management
            </Text>
          )}
        </div>
        
        {/* Menu */}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[currentPage.key]}
          onClick={handleMenuClick}
          style={{
            background: 'var(--pv-dark, #362319)',
            border: 'none',
            marginTop: '20px'
          }}
          items={menuItems.map(item => ({
            key: item.key,
            icon: item.icon,
            label: item.label,
          }))}
        />

        {/* Footer */}
        {!collapsed && (
          <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            right: '20px',
            textAlign: 'center',
            fontSize: '12px',
            opacity: 0.7,
            color: 'var(--pv-text-on-dark, #ffeadd)'
          }}>
            PetVibe Admin v1.0
          </div>
        )}
      </Sider>

      <Layout>
        <Header style={{
          background: 'linear-gradient(135deg, #ffffff 0%, var(--pv-light, #ffeadd) 100%)',
          padding: '0 24px',
          borderBottom: '3px solid var(--pv-primary, #eda274)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 40,
                height: 40,
                color: 'var(--pv-primary, #eda274)'
              }}
            />
            <div>
              <Title level={3} style={{ 
                margin: 0, 
                fontSize: '24px',
                fontWeight: '700',
                color: 'var(--pv-text-heading, #2a1a10)'
              }}>
                {currentPage.label}
              </Title>
              <Text style={{
                color: 'var(--pv-text-muted, #7e5c48)',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                Quản lý hệ thống PetVibe
              </Text>
            </div>
          </div>
          
          {/* User Info */}
          <Dropdown
            menu={{ items: userMenuItems }}
            placement="bottomRight"
            arrow
          >
            <Space style={{ cursor: 'pointer' }}>
              <Avatar 
                size="large"
                style={{
                  background: 'linear-gradient(135deg, var(--pv-primary, #eda274) 0%, var(--pv-accent, #ffb07c) 100%)',
                  color: 'white',
                  fontWeight: 'bold'
                }}
              >
                A
              </Avatar>
              {!collapsed && (
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--pv-text-heading, #2a1a10)' }}>
                    Administrator
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--pv-text-muted, #7e5c48)' }}>
                    Online
                  </div>
                </div>
              )}
            </Space>
          </Dropdown>
        </Header>

        <Content style={{ 
          padding: '24px',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,234,221,0.6) 100%)',
          minHeight: 'calc(100vh - 64px)'
        }}>
          {/* Breadcrumb */}
          <Breadcrumb style={{ marginBottom: '24px' }}>
            <Breadcrumb.Item>Admin</Breadcrumb.Item>
            <Breadcrumb.Item>{currentPage.label}</Breadcrumb.Item>
          </Breadcrumb>
          
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
