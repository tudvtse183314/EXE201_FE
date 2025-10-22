// src/pages/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Typography, Spin, Alert, Button, Space } from 'antd';
import { 
  ShoppingOutlined, 
  AppstoreOutlined, 
  FileTextOutlined, 
  UserOutlined,
  ReloadOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { getAllProducts } from '../../services/products';
import { getAllCategories } from '../../services/categories';
import { dataManager } from '../../utils/dataManager';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    orders: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("📊 AdminDashboard: Loading stats...");
      
      const [products, categories] = await Promise.all([
        dataManager.get('products', getAllProducts),
        dataManager.get('categories', getAllCategories)
      ]);
      
      console.log("📊 AdminDashboard: Stats loaded", { 
        products: products?.length || 0, 
        categories: categories?.length || 0 
      });
      
      setStats({
        products: Array.isArray(products) ? products.length : 0,
        categories: Array.isArray(categories) ? categories.length : 0,
        orders: 0 // TODO: Implement orders count
      });
    } catch (error) {
      console.error("📊 AdminDashboard: Error loading stats:", error);
      setError(error?.message || "Không thể tải thống kê");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px', fontSize: '16px', color: 'var(--pv-text-muted, #7e5c48)' }}>
          Đang tải thống kê...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Lỗi tải dữ liệu"
        description={error}
        type="error"
        showIcon
        action={
          <Button size="small" danger onClick={loadStats}>
            Thử lại
          </Button>
        }
      />
    );
  }

  return (
    <div>
      {/* Welcome Section */}
      <Card
        style={{
          background: 'linear-gradient(135deg, var(--pv-primary, #eda274) 0%, var(--pv-accent, #ffb07c) 100%)',
          border: 'none',
          marginBottom: '24px',
          textAlign: 'center'
        }}
        bodyStyle={{ padding: '40px' }}
      >
        <Title level={1} style={{ color: 'white', margin: '0 0 16px 0' }}>
          🎉 Chào mừng đến Admin Dashboard
        </Title>
        <Text style={{ color: 'white', fontSize: '16px', opacity: 0.9 }}>
          Quản lý toàn bộ hệ thống PetVibe một cách hiệu quả
        </Text>
      </Card>

      {/* Stats Cards */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={8}>
          <Card
            hoverable
            style={{
              border: '2px solid var(--pv-primary, #eda274)',
              borderRadius: '12px'
            }}
          >
            <Statistic
              title="Sản phẩm"
              value={stats.products}
              prefix={<ShoppingOutlined style={{ color: 'var(--pv-primary, #eda274)' }} />}
              valueStyle={{ color: 'var(--pv-primary, #eda274)' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card
            hoverable
            style={{
              border: '2px solid var(--pv-secondary, #d5956d)',
              borderRadius: '12px'
            }}
          >
            <Statistic
              title="Danh mục"
              value={stats.categories}
              prefix={<AppstoreOutlined style={{ color: 'var(--pv-secondary, #d5956d)' }} />}
              valueStyle={{ color: 'var(--pv-secondary, #d5956d)' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card
            hoverable
            style={{
              border: '2px solid var(--pv-accent, #ffb07c)',
              borderRadius: '12px'
            }}
          >
            <Statistic
              title="Đơn hàng"
              value={stats.orders}
              prefix={<FileTextOutlined style={{ color: 'var(--pv-accent, #ffb07c)' }} />}
              valueStyle={{ color: 'var(--pv-accent, #ffb07c)' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Card title="🚀 Hành động nhanh" style={{ borderRadius: '12px' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={8}>
            <Card
              hoverable
              style={{
                background: 'linear-gradient(135deg, var(--pv-primary, #eda274) 0%, var(--pv-accent, #ffb07c) 100%)',
                border: 'none',
                color: 'white',
                textAlign: 'center',
                cursor: 'pointer'
              }}
              onClick={() => navigate('/admin/products')}
            >
              <ShoppingOutlined style={{ fontSize: '32px', marginBottom: '12px' }} />
              <div style={{ fontWeight: '600', fontSize: '16px' }}>Quản lý sản phẩm</div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Card
              hoverable
              style={{
                background: 'linear-gradient(135deg, var(--pv-secondary, #d5956d) 0%, var(--pv-primary, #eda274) 100%)',
                border: 'none',
                color: 'white',
                textAlign: 'center',
                cursor: 'pointer'
              }}
              onClick={() => navigate('/admin/categories')}
            >
              <AppstoreOutlined style={{ fontSize: '32px', marginBottom: '12px' }} />
              <div style={{ fontWeight: '600', fontSize: '16px' }}>Quản lý danh mục</div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Card
              hoverable
              style={{
                background: 'linear-gradient(135deg, var(--pv-accent, #ffb07c) 0%, var(--pv-primary, #eda274) 100%)',
                border: 'none',
                color: 'white',
                textAlign: 'center',
                cursor: 'pointer'
              }}
              onClick={() => navigate('/admin/orders')}
            >
              <FileTextOutlined style={{ fontSize: '32px', marginBottom: '12px' }} />
              <div style={{ fontWeight: '600', fontSize: '16px' }}>Xem đơn hàng</div>
            </Card>
          </Col>
        </Row>
      </Card>

      {/* Refresh Button */}
      <div style={{ textAlign: 'center', marginTop: '24px' }}>
        <Button 
          type="primary" 
          icon={<ReloadOutlined />} 
          onClick={loadStats}
          style={{
            background: 'var(--pv-primary, #eda274)',
            borderColor: 'var(--pv-primary, #eda274)'
          }}
        >
          Làm mới dữ liệu
        </Button>
      </div>
    </div>
  );
}
