// src/pages/staff/StaffDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Typography, Spin, Alert, Button, Space } from 'antd';
import { 
  ShoppingOutlined, 
  AppstoreOutlined, 
  FileTextOutlined, 
  StarOutlined,
  ReloadOutlined,
  PlusOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { getAllProducts } from '../../services/products';
import { getAllCategories } from '../../services/categories';
import { getAllOrders } from '../../services/orders';
import { dataManager } from '../../utils/dataManager';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

export default function StaffDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    orders: 0,
    pendingOrders: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("📊 StaffDashboard: Loading stats...");
      
      const [products, categories, orders] = await Promise.all([
        dataManager.get('products', getAllProducts),
        dataManager.get('categories', getAllCategories),
        dataManager.get('orders', getAllOrders)
      ]);
      
      console.log("📊 StaffDashboard: Stats loaded", { 
        products: products?.length || 0, 
        categories: categories?.length || 0,
        orders: orders?.length || 0
      });
      
      const pendingOrders = Array.isArray(orders) ? 
        orders.filter(order => order.status === 'PENDING').length : 0;
      
      setStats({
        products: Array.isArray(products) ? products.length : 0,
        categories: Array.isArray(categories) ? categories.length : 0,
        orders: Array.isArray(orders) ? orders.length : 0,
        pendingOrders
      });
    } catch (error) {
      console.error("📊 StaffDashboard: Error loading stats:", error);
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
        <div style={{ marginTop: '16px', fontSize: '16px', color: '#666' }}>
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
    <div style={{ padding: '0' }}>
      {/* Welcome Section */}
      <Card 
        style={{ 
          marginBottom: '24px',
          background: 'linear-gradient(135deg, var(--pv-primary, #eda274) 0%, var(--pv-accent, #ffb07c) 100%)',
          border: 'none',
          borderRadius: '12px'
        }}
        bodyStyle={{ padding: '32px' }}
      >
        <Row align="middle" justify="space-between">
          <Col>
            <Title level={2} style={{ color: 'white', margin: 0 }}>
              👋 Chào mừng Staff!
            </Title>
            <Text style={{ color: 'white', fontSize: '16px', opacity: 0.9 }}>
              Quản lý hệ thống PetVibe hiệu quả
            </Text>
          </Col>
          <Col>
            <Button 
              type="primary" 
              size="large"
              icon={<ReloadOutlined />}
              onClick={loadStats}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: '1px solid rgba(255,255,255,0.3)',
                color: 'white'
              }}
            >
              Làm mới
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Statistics Cards */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card 
            hoverable
            onClick={() => navigate('/staff/products')}
            style={{ 
              borderRadius: '12px',
              border: '2px solid var(--pv-primary, #eda274)',
              background: 'linear-gradient(135deg, #fff 0%, #ffeadd 100%)'
            }}
          >
            <Statistic
              title="Tổng sản phẩm"
              value={stats.products}
              prefix={<ShoppingOutlined style={{ color: 'var(--pv-primary, #eda274)' }} />}
              valueStyle={{ color: 'var(--pv-text-heading, #2a1a10)' }}
            />
            <div style={{ marginTop: '8px' }}>
              <Button 
                type="link" 
                size="small"
                icon={<EyeOutlined />}
                onClick={() => navigate('/staff/products')}
              >
                Xem chi tiết
              </Button>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card 
            hoverable
            onClick={() => navigate('/staff/categories')}
            style={{ 
              borderRadius: '12px',
              border: '2px solid var(--pv-secondary, #d5956d)',
              background: 'linear-gradient(135deg, #fff 0%, #ffeadd 100%)'
            }}
          >
            <Statistic
              title="Danh mục"
              value={stats.categories}
              prefix={<AppstoreOutlined style={{ color: 'var(--pv-secondary, #d5956d)' }} />}
              valueStyle={{ color: 'var(--pv-text-heading, #2a1a10)' }}
            />
            <div style={{ marginTop: '8px' }}>
              <Button 
                type="link" 
                size="small"
                icon={<EyeOutlined />}
                onClick={() => navigate('/staff/categories')}
              >
                Xem chi tiết
              </Button>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card 
            hoverable
            onClick={() => navigate('/staff/orders')}
            style={{ 
              borderRadius: '12px',
              border: '2px solid var(--pv-accent, #ffb07c)',
              background: 'linear-gradient(135deg, #fff 0%, #ffeadd 100%)'
            }}
          >
            <Statistic
              title="Tổng đơn hàng"
              value={stats.orders}
              prefix={<FileTextOutlined style={{ color: 'var(--pv-accent, #ffb07c)' }} />}
              valueStyle={{ color: 'var(--pv-text-heading, #2a1a10)' }}
            />
            <div style={{ marginTop: '8px' }}>
              <Button 
                type="link" 
                size="small"
                icon={<EyeOutlined />}
                onClick={() => navigate('/staff/orders')}
              >
                Xem chi tiết
              </Button>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card 
            hoverable
            onClick={() => navigate('/staff/orders?status=PENDING')}
            style={{ 
              borderRadius: '12px',
              border: '2px solid #ff7875',
              background: 'linear-gradient(135deg, #fff 0%, #ffeadd 100%)'
            }}
          >
            <Statistic
              title="Đơn chờ xử lý"
              value={stats.pendingOrders}
              prefix={<FileTextOutlined style={{ color: '#ff7875' }} />}
              valueStyle={{ color: '#ff7875' }}
            />
            <div style={{ marginTop: '8px' }}>
              <Button 
                type="link" 
                size="small"
                icon={<EyeOutlined />}
                onClick={() => navigate('/staff/orders?status=PENDING')}
              >
                Xử lý ngay
              </Button>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Card 
        title="🚀 Thao tác nhanh" 
        style={{ 
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #fff 0%, #ffeadd 100%)'
        }}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Button 
              type="primary" 
              size="large"
              icon={<PlusOutlined />}
              onClick={() => navigate('/staff/products')}
              style={{ 
                width: '100%',
                height: '60px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, var(--pv-primary, #eda274) 0%, var(--pv-accent, #ffb07c) 100%)',
                border: 'none'
              }}
            >
              Quản lý sản phẩm
            </Button>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Button 
              type="default" 
              size="large"
              icon={<AppstoreOutlined />}
              onClick={() => navigate('/staff/categories')}
              style={{ 
                width: '100%',
                height: '60px',
                borderRadius: '8px',
                border: '2px solid var(--pv-secondary, #d5956d)',
                color: 'var(--pv-secondary, #d5956d)'
              }}
            >
              Quản lý danh mục
            </Button>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Button 
              type="default" 
              size="large"
              icon={<FileTextOutlined />}
              onClick={() => navigate('/staff/orders')}
              style={{ 
                width: '100%',
                height: '60px',
                borderRadius: '8px',
                border: '2px solid var(--pv-accent, #ffb07c)',
                color: 'var(--pv-accent, #ffb07c)'
              }}
            >
              Xem đơn hàng
            </Button>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Button 
              type="default" 
              size="large"
              icon={<StarOutlined />}
              onClick={() => navigate('/staff/reviews')}
              style={{ 
                width: '100%',
                height: '60px',
                borderRadius: '8px',
                border: '2px solid #52c41a',
                color: '#52c41a'
              }}
            >
              Xem đánh giá
            </Button>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Button 
              type="default" 
              size="large"
              icon={<EyeOutlined />}
              onClick={() => navigate('/staff/profile')}
              style={{ 
                width: '100%',
                height: '60px',
                borderRadius: '8px',
                border: '2px solid #1890ff',
                color: '#1890ff'
              }}
            >
              Hồ sơ cá nhân
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Recent Activity */}
      <Card 
        title="📈 Hoạt động gần đây" 
        style={{ 
          marginTop: '24px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #fff 0%, #ffeadd 100%)'
        }}
      >
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#666' }}>
          <FileTextOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
          <div style={{ fontSize: '16px' }}>
            Tính năng theo dõi hoạt động sẽ được cập nhật sớm
          </div>
        </div>
      </Card>
    </div>
  );
}