// src/pages/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Typography, Spin, Alert, Button, Space, Tag, Progress } from 'antd';
import { 
  ShoppingOutlined, 
  AppstoreOutlined, 
  FileTextOutlined, 
  UserOutlined,
  ReloadOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  TruckOutlined,
  GiftOutlined,
  CloseCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined
} from '@ant-design/icons';
import { getAllProducts } from '../../services/products';
import { getAllCategories } from '../../services/categories';
import { getAllOrders } from '../../services/orders';
import { getAllAccounts } from '../../services/auth';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';

const { Title, Text } = Typography;

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { showError, showSuccess } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    accounts: 0,
    orders: 0,
    totalRevenue: 0,
    todayRevenue: 0,
    todayOrders: 0,
    orderStats: {
      pending: 0,
      paid: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0
    }
  });

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("📊 AdminDashboard: Loading stats...");
      
      // Gọi tất cả API song song
      const [products, categories, orders, accounts] = await Promise.allSettled([
        getAllProducts(),
        getAllCategories(),
        getAllOrders(),
        getAllAccounts()
      ]);

      // Xử lý kết quả products
      const productsData = products.status === 'fulfilled' 
        ? (Array.isArray(products.value) ? products.value : [])
        : [];
      
      // Xử lý kết quả categories
      const categoriesData = categories.status === 'fulfilled'
        ? (Array.isArray(categories.value) ? categories.value : [])
        : [];
      
      // Xử lý kết quả orders
      const ordersData = orders.status === 'fulfilled'
        ? (Array.isArray(orders.value) ? orders.value : [])
        : [];
      
      // Xử lý kết quả accounts
      const accountsData = accounts.status === 'fulfilled'
        ? (Array.isArray(accounts.value) ? accounts.value : [])
        : [];

      // Tính toán doanh thu - chỉ tính các order có status PAID, SHIPPED, DELIVERED
      // Loại bỏ PENDING và CANCELLED/CANCEL
      const validStatusOrders = ordersData.filter(order => {
        const status = (order.status || '').toUpperCase();
        return status === 'PAID' || status === 'SHIPPED' || status === 'DELIVERED';
      });

      const totalRevenue = validStatusOrders.reduce((sum, order) => {
        const amount = order.totalAmount || order.total_amount || 0;
        return sum + (typeof amount === 'number' ? amount : 0);
      }, 0);

      // Tính toán doanh thu và đơn hàng hôm nay - chỉ tính các order hợp lệ
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const todayOrders = validStatusOrders.filter(order => {
        const orderDate = new Date(order.createdAt || order.created_at || order.orderDate);
        orderDate.setHours(0, 0, 0, 0);
        return orderDate.getTime() === today.getTime();
      });

      const todayRevenue = todayOrders.reduce((sum, order) => {
        const amount = order.totalAmount || order.total_amount || 0;
        return sum + (typeof amount === 'number' ? amount : 0);
      }, 0);

      // Tính toán đơn hàng theo trạng thái
      const orderStats = {
        pending: 0,
        paid: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0
      };

      ordersData.forEach(order => {
        const status = (order.status || '').toUpperCase();
        if (status === 'PENDING') orderStats.pending++;
        else if (status === 'PAID') orderStats.paid++;
        else if (status === 'SHIPPED') orderStats.shipped++;
        else if (status === 'DELIVERED') orderStats.delivered++;
        else if (status === 'CANCELLED' || status === 'CANCEL') orderStats.cancelled++;
      });

      console.log("📊 AdminDashboard: Stats calculated", {
        products: productsData.length,
        categories: categoriesData.length,
        accounts: accountsData.length,
        orders: ordersData.length,
        totalRevenue,
        todayRevenue,
        todayOrders: todayOrders.length,
        orderStats
      });

      setStats({
        products: productsData.length,
        categories: categoriesData.length,
        accounts: accountsData.length,
        orders: ordersData.length,
        totalRevenue,
        todayRevenue,
        todayOrders: todayOrders.length,
        orderStats
      });

      // Hiển thị cảnh báo nếu có API lỗi
      const errors = [];
      if (products.status === 'rejected') errors.push('Sản phẩm');
      if (categories.status === 'rejected') errors.push('Danh mục');
      if (orders.status === 'rejected') errors.push('Đơn hàng');
      if (accounts.status === 'rejected') errors.push('Tài khoản');
      
      if (errors.length > 0) {
        console.warn("📊 AdminDashboard: Some APIs failed:", errors);
      }
    } catch (error) {
      console.error("📊 AdminDashboard: Error loading stats:", error);
      const message = error?.message || "Không thể tải thống kê";
      setError(message);
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

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

  return (
    <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '0 16px' }}>
      {/* Welcome Section */}
      <Card
        style={{
          background: 'linear-gradient(135deg, var(--pv-primary, #eda274) 0%, var(--pv-accent, #ffb07c) 100%)',
          border: 'none',
          marginBottom: '16px',
          borderRadius: '12px',
          boxShadow: '0 2px 12px rgba(237, 162, 116, 0.2)'
        }}
        styles={{ body: { padding: '24px' } }}
      >
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={1} style={{ color: 'white', margin: '0 0 8px 0', fontSize: '26px', fontWeight: '700' }}>
              🎉 Chào mừng đến Admin Dashboard
            </Title>
            <Text style={{ color: 'white', fontSize: '14px', opacity: 0.95, display: 'block' }}>
              Quản lý toàn bộ hệ thống PetVibe một cách hiệu quả
            </Text>
          </Col>
          <Col>
            <Button
              type="default"
              icon={<ReloadOutlined />}
              onClick={loadStats}
              loading={loading}
              size="middle"
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                borderColor: 'rgba(255, 255, 255, 0.3)',
                color: 'white',
                fontWeight: '600',
                borderRadius: '8px'
              }}
            >
              Làm mới
            </Button>
          </Col>
        </Row>
      </Card>

      {error && (
        <Alert
          message="Lỗi tải dữ liệu"
          description={error}
          type="error"
          showIcon
          closable
          style={{ marginBottom: '16px', borderRadius: '8px' }}
          action={
            <Button size="small" danger onClick={loadStats}>
              Thử lại
            </Button>
          }
        />
      )}

      {/* Main Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            style={{
              border: '2px solid var(--pv-primary, #eda274)',
              borderRadius: '10px',
              boxShadow: '0 2px 8px rgba(237, 162, 116, 0.12)',
              transition: 'all 0.3s ease'
            }}
            styles={{ body: { padding: '20px' } }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(237, 162, 116, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(237, 162, 116, 0.12)';
            }}
          >
            <Statistic
              title={<span style={{ fontSize: '14px', fontWeight: '600' }}>Sản phẩm</span>}
              value={stats.products}
              prefix={<ShoppingOutlined style={{ color: 'var(--pv-primary, #eda274)', fontSize: '20px' }} />}
              valueStyle={{ color: 'var(--pv-primary, #eda274)', fontSize: '28px', fontWeight: '700' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            style={{
              border: '2px solid var(--pv-secondary, #d5956d)',
              borderRadius: '10px',
              boxShadow: '0 2px 8px rgba(213, 149, 109, 0.12)',
              transition: 'all 0.3s ease'
            }}
            styles={{ body: { padding: '20px' } }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(213, 149, 109, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(213, 149, 109, 0.12)';
            }}
          >
            <Statistic
              title={<span style={{ fontSize: '14px', fontWeight: '600' }}>Danh mục</span>}
              value={stats.categories}
              prefix={<AppstoreOutlined style={{ color: 'var(--pv-secondary, #d5956d)', fontSize: '20px' }} />}
              valueStyle={{ color: 'var(--pv-secondary, #d5956d)', fontSize: '28px', fontWeight: '700' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            style={{
              border: '2px solid #52c41a',
              borderRadius: '10px',
              boxShadow: '0 2px 8px rgba(82, 196, 26, 0.12)',
              transition: 'all 0.3s ease'
            }}
            styles={{ body: { padding: '20px' } }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(82, 196, 26, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(82, 196, 26, 0.12)';
            }}
          >
            <Statistic
              title={<span style={{ fontSize: '14px', fontWeight: '600' }}>Tài khoản</span>}
              value={stats.accounts}
              prefix={<UserOutlined style={{ color: '#52c41a', fontSize: '20px' }} />}
              valueStyle={{ color: '#52c41a', fontSize: '28px', fontWeight: '700' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            style={{
              border: '2px solid var(--pv-accent, #ffb07c)',
              borderRadius: '10px',
              boxShadow: '0 2px 8px rgba(255, 176, 124, 0.12)',
              transition: 'all 0.3s ease'
            }}
            styles={{ body: { padding: '20px' } }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 176, 124, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(255, 176, 124, 0.12)';
            }}
          >
            <Statistic
              title={<span style={{ fontSize: '14px', fontWeight: '600' }}>Tổng đơn hàng</span>}
              value={stats.orders}
              prefix={<FileTextOutlined style={{ color: 'var(--pv-accent, #ffb07c)', fontSize: '20px' }} />}
              valueStyle={{ color: 'var(--pv-accent, #ffb07c)', fontSize: '28px', fontWeight: '700' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Revenue Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
        <Col xs={24} lg={12}>
          <Card
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: '10px',
              boxShadow: '0 2px 12px rgba(102, 126, 234, 0.25)'
            }}
            styles={{ body: { padding: '20px' } }}
          >
            <Statistic
              title={<span style={{ color: 'white', fontSize: '14px', fontWeight: '600' }}>Tổng doanh thu</span>}
              value={stats.totalRevenue}
              prefix={<DollarOutlined style={{ color: 'white', fontSize: '22px' }} />}
              valueStyle={{ color: 'white', fontSize: '28px', fontWeight: '700' }}
              formatter={(value) => formatCurrency(value)}
            />
            <div style={{ marginTop: '12px' }}>
              <Button
                type="default"
                size="small"
                onClick={() => navigate('/admin/revenue')}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  fontWeight: '600',
                  fontSize: '12px'
                }}
              >
                Xem chi tiết →
              </Button>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            style={{
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              border: 'none',
              borderRadius: '10px',
              boxShadow: '0 2px 12px rgba(245, 87, 108, 0.25)'
            }}
            styles={{ body: { padding: '20px' } }}
          >
            <Statistic
              title={<span style={{ color: 'white', fontSize: '14px', fontWeight: '600' }}>Doanh thu hôm nay</span>}
              value={stats.todayRevenue}
              prefix={<DollarOutlined style={{ color: 'white', fontSize: '22px' }} />}
              valueStyle={{ color: 'white', fontSize: '28px', fontWeight: '700' }}
              formatter={(value) => formatCurrency(value)}
            />
            <div style={{ marginTop: '12px', color: 'white', fontSize: '13px' }}>
              <FileTextOutlined /> {stats.todayOrders} đơn hàng hôm nay
            </div>
          </Card>
        </Col>
      </Row>

      {/* Order Status Stats */}
      <Card 
        title={<span style={{ fontSize: '16px', fontWeight: '700' }}>📊 Thống kê đơn hàng theo trạng thái</span>}
        style={{ borderRadius: '10px', marginBottom: '16px' }}
        styles={{ body: { padding: '16px' } }}
      >
        <Row gutter={[12, 12]}>
          <Col xs={24} sm={12} md={8} lg={4}>
            <Card style={{ 
              background: 'linear-gradient(135deg, #fff7e6 0%, #ffe7ba 100%)', 
              border: '1px solid #ffa940', 
              borderRadius: '8px', 
              textAlign: 'center',
              margin: 0
            }}
            styles={{ body: { padding: '16px' } }}
            >
              <ClockCircleOutlined style={{ fontSize: '24px', color: '#ffa940', marginBottom: '6px' }} />
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ffa940' }}>{stats.orderStats.pending}</div>
              <div style={{ color: '#7e5c48', fontSize: '12px' }}>Chờ thanh toán</div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={4}>
            <Card style={{ 
              background: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)', 
              border: '1px solid #1890ff', 
              borderRadius: '8px', 
              textAlign: 'center',
              margin: 0
            }}
            styles={{ body: { padding: '16px' } }}
            >
              <CheckCircleOutlined style={{ fontSize: '24px', color: '#1890ff', marginBottom: '6px' }} />
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>{stats.orderStats.paid}</div>
              <div style={{ color: '#7e5c48', fontSize: '12px' }}>Đã thanh toán</div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={4}>
            <Card style={{ 
              background: 'linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)', 
              border: '1px solid #52c41a', 
              borderRadius: '8px', 
              textAlign: 'center',
              margin: 0
            }}
            styles={{ body: { padding: '16px' } }}
            >
              <TruckOutlined style={{ fontSize: '24px', color: '#52c41a', marginBottom: '6px' }} />
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#52c41a' }}>{stats.orderStats.shipped}</div>
              <div style={{ color: '#7e5c48', fontSize: '12px' }}>Đang giao hàng</div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={4}>
            <Card style={{ 
              background: 'linear-gradient(135deg, #e6fffb 0%, #b5f5ec 100%)', 
              border: '1px solid #13c2c2', 
              borderRadius: '8px', 
              textAlign: 'center',
              margin: 0
            }}
            styles={{ body: { padding: '16px' } }}
            >
              <GiftOutlined style={{ fontSize: '24px', color: '#13c2c2', marginBottom: '6px' }} />
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#13c2c2' }}>{stats.orderStats.delivered}</div>
              <div style={{ color: '#7e5c48', fontSize: '12px' }}>Đã giao hàng</div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={4}>
            <Card style={{ 
              background: 'linear-gradient(135deg, #fff1f0 0%, #ffccc7 100%)', 
              border: '1px solid #ff4d4f', 
              borderRadius: '8px', 
              textAlign: 'center',
              margin: 0
            }}
            styles={{ body: { padding: '16px' } }}
            >
              <CloseCircleOutlined style={{ fontSize: '24px', color: '#ff4d4f', marginBottom: '6px' }} />
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ff4d4f' }}>{stats.orderStats.cancelled}</div>
              <div style={{ color: '#7e5c48', fontSize: '12px' }}>Đã hủy</div>
            </Card>
          </Col>
        </Row>
      </Card>

      {/* Quick Actions */}
      <Card 
        title={<span style={{ fontSize: '16px', fontWeight: '700' }}>🚀 Hành động nhanh</span>}
        style={{ borderRadius: '10px' }}
        styles={{ body: { padding: '16px' } }}
      >
        <Row gutter={[12, 12]}>
          <Col xs={24} sm={12} lg={8}>
            <Card
              hoverable
              style={{
                background: 'linear-gradient(135deg, var(--pv-primary, #eda274) 0%, var(--pv-accent, #ffb07c) 100%)',
                border: 'none',
                color: 'white',
                textAlign: 'center',
                cursor: 'pointer',
                borderRadius: '10px',
                transition: 'all 0.3s ease',
                margin: 0
              }}
              styles={{ body: { padding: '20px' } }}
              onClick={() => navigate('/admin/products')}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(237, 162, 116, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <ShoppingOutlined style={{ fontSize: '32px', marginBottom: '12px' }} />
              <div style={{ fontWeight: '700', fontSize: '16px' }}>Quản lý sản phẩm</div>
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
                cursor: 'pointer',
                borderRadius: '10px',
                transition: 'all 0.3s ease',
                margin: 0
              }}
              styles={{ body: { padding: '20px' } }}
              onClick={() => navigate('/admin/categories')}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(213, 149, 109, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <AppstoreOutlined style={{ fontSize: '32px', marginBottom: '12px' }} />
              <div style={{ fontWeight: '700', fontSize: '16px' }}>Quản lý danh mục</div>
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
                cursor: 'pointer',
                borderRadius: '10px',
                transition: 'all 0.3s ease',
                margin: 0
              }}
              styles={{ body: { padding: '20px' } }}
              onClick={() => navigate('/admin/orders')}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 176, 124, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <FileTextOutlined style={{ fontSize: '32px', marginBottom: '12px' }} />
              <div style={{ fontWeight: '700', fontSize: '16px' }}>Xem đơn hàng</div>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
}
