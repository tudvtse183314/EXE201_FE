// src/pages/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Card, Statistic, Row, Col, Spin } from 'antd';
import { getAllProducts } from '../../services/products';
import { getAllCategories } from '../../services/categories';
import { dataManager } from '../../utils/dataManager';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    orders: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadStats = async () => {
      try {
        setLoading(true);
        console.log("📊 AdminDashboard: Loading stats...");
        
        const [products, categories] = await Promise.all([
          dataManager.get('products', getAllProducts),
          dataManager.get('categories', getAllCategories)
        ]);
        
        if (!isMounted) return;
        
        console.log("📊 AdminDashboard: Stats loaded", { 
          products: products?.length || 0, 
          categories: categories?.length || 0 
        });
        
        setStats({
          products: Array.isArray(products) ? products.length : 0,
          categories: Array.isArray(categories) ? categories.length : 0,
          orders: 0
        });
      } catch (error) {
        console.error('📊 AdminDashboard: Error loading stats:', error);
        if (isMounted) {
          setStats({
            products: 0,
            categories: 0,
            orders: 0
          });
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadStats();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16, fontSize: 16, color: '#666' }}>
          Đang tải thống kê...
        </div>
      </div>
    );
  }

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card>
            <Statistic 
              title="Products" 
              value={stats.products}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic 
              title="Categories" 
              value={stats.categories}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic 
              title="Orders" 
              value={stats.orders}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Card style={{ marginTop: 16 }}>
        <h3>Welcome to Admin Dashboard</h3>
        <p>Chọn mục bên trái để quản trị.</p>
        <p>
          <strong>Hiện tại có:</strong> {stats.products} sản phẩm và {stats.categories} danh mục.
        </p>
        <div style={{ marginTop: 16, padding: 12, background: '#f0f2f5', borderRadius: 6 }}>
          <p style={{ margin: 0, fontSize: 14, color: '#666' }}>
            💡 <strong>Gợi ý:</strong> Sử dụng menu bên trái để quản lý danh mục và sản phẩm.
          </p>
        </div>
      </Card>
    </div>
  );
}
