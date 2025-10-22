// src/pages/customer/Orders.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Card, 
  Table, 
  Tag, 
  Button, 
  Typography, 
  Space,
  Spin,
  Alert,
  Empty
} from 'antd';
import { EyeOutlined, ReloadOutlined } from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';

const { Title } = Typography;

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('📋 Orders: Loading orders for user', user?.id);
      
      // TODO: Call API to get user orders
      // const response = await getUserOrders(user.id);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      const mockOrders = [
        {
          id: 1,
          orderNumber: 'ORD-001',
          status: 'pending',
          total: 250000,
          createdAt: '2024-01-15T10:30:00Z',
          items: [
            { name: 'Thức ăn cho chó', quantity: 2, price: 125000 }
          ]
        },
        {
          id: 2,
          orderNumber: 'ORD-002',
          status: 'confirmed',
          total: 180000,
          createdAt: '2024-01-14T15:20:00Z',
          items: [
            { name: 'Đồ chơi cho mèo', quantity: 1, price: 180000 }
          ]
        }
      ];
      
      setOrders(mockOrders);
    } catch (e) {
      console.error('📋 Orders: Error loading orders', e);
      setError(e?.message || 'Không thể tải danh sách đơn hàng.');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      loadOrders();
    }
  }, [loadOrders]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'orange';
      case 'confirmed': return 'blue';
      case 'shipped': return 'purple';
      case 'delivered': return 'green';
      case 'cancelled': return 'red';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Chờ xác nhận';
      case 'confirmed': return 'Đã xác nhận';
      case 'shipped': return 'Đang giao';
      case 'delivered': return 'Đã giao';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total',
      key: 'total',
      render: (total) => (
        <strong style={{ color: '#1890ff' }}>
          {total.toLocaleString()}đ
        </strong>
      ),
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => console.log('View order:', record.id)}
          >
            Xem chi tiết
          </Button>
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16, fontSize: 16, color: '#666' }}>
          Đang tải danh sách đơn hàng...
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
        style={{ margin: 20 }}
      />
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      {/* Header */}
      <Card style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title level={3} style={{ margin: 0 }}>
              📋 Đơn hàng của tôi
            </Title>
            <p style={{ margin: '8px 0 0 0', color: '#666' }}>
              Quản lý và theo dõi các đơn hàng của bạn
            </p>
          </div>
          <Button
            icon={<ReloadOutlined />}
            onClick={loadOrders}
            loading={loading}
          >
            Làm mới
          </Button>
        </div>
      </Card>

      {/* Orders Table */}
      <Card>
        {orders.length === 0 ? (
          <Empty
            description="Bạn chưa có đơn hàng nào"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <Table
            columns={columns}
            dataSource={orders}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} của ${total} đơn hàng`,
            }}
          />
        )}
      </Card>
    </div>
  );
}