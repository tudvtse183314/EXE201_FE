// src/layouts/AdminLayout.jsx
import React, { useMemo } from 'react';
import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  AppstoreOutlined,
  TagsOutlined,
  ShoppingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const { Sider, Content, Header } = Layout;

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const selectedKeys = useMemo(() => {
    if (location.pathname.startsWith('/admin/categories')) return ['categories'];
    if (location.pathname === '/admin' || location.pathname === '/admin/dashboard') return ['dashboard'];
    if (location.pathname.startsWith('/admin/products')) return ['products'];
    if (location.pathname.startsWith('/admin/orders')) return ['orders'];
    if (location.pathname.startsWith('/admin/accounts')) return ['accounts'];
    return [];
  }, [location.pathname]);

  const items = [
    { key: 'dashboard', icon: <DashboardOutlined />, label: 'Dashboard', onClick: () => navigate('/admin/dashboard') },
    { key: 'categories', icon: <TagsOutlined />, label: 'Categories', onClick: () => navigate('/admin/categories') },
    { key: 'products', icon: <AppstoreOutlined />, label: 'Products', onClick: () => navigate('/admin/products') },
    { key: 'orders', icon: <ShoppingOutlined />, label: 'Orders', onClick: () => navigate('/admin/orders') },
    { key: 'accounts', icon: <UserOutlined />, label: 'Accounts', onClick: () => navigate('/admin/accounts') },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider breakpoint="lg" collapsedWidth="0">
        <div style={{ height: 56, margin: 16, color: '#fff', fontWeight: 700 }}>
          Admin Panel
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={selectedKeys}
          items={items}
        />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: '0 16px', fontWeight: 600 }}>
          Admin Console
        </Header>
        <Content style={{ margin: 16, background: '#fff', borderRadius: 12, padding: 16 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
