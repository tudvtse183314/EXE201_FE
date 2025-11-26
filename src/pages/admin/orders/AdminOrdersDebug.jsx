// src/pages/admin/orders/AdminOrdersDebug.jsx
// Component debug đơn giản để test getAllOrders service
import React, { useEffect, useState } from 'react';
import { Table, Card, Alert, Spin } from 'antd';
import { getAllOrders } from '../../../services/orders';

export default function AdminOrdersDebug() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await getAllOrders();
        
        console.log("🔍 DEBUG getAllOrders ->", {
          isArray: Array.isArray(data),
          length: Array.isArray(data) ? data.length : 'N/A',
          sample: Array.isArray(data) && data.length > 0 ? {
            orderId: data[0].orderId,
            accountName: data[0].accountName
          } : null
        });
        
        const normalized = Array.isArray(data) ? data : [];
        setOrders(normalized);
      } catch (err) {
        console.error("🔍 DEBUG: Error in getAllOrders", err);
        setError(err.message || 'Unknown error');
        setOrders([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px' }}>Đang tải...</div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Lỗi"
        description={error}
        type="error"
        showIcon
      />
    );
  }

  return (
    <Card title="🔍 DEBUG: Admin Orders Test">
      <Alert
        message={`Đã tải ${orders.length} đơn hàng`}
        type={orders.length > 0 ? 'success' : 'warning'}
        showIcon
        style={{ marginBottom: 16 }}
      />
      <Table
        rowKey="orderId"
        dataSource={orders}
        columns={[
          { 
            title: 'ID', 
            dataIndex: 'orderId',
            key: 'orderId',
            width: 80
          },
          { 
            title: 'Khách hàng', 
            dataIndex: 'accountName',
            key: 'accountName'
          },
          { 
            title: 'Tổng tiền', 
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render: (value) => value?.toLocaleString('vi-VN') + ' VNĐ'
          },
          { 
            title: 'Trạng thái', 
            dataIndex: 'status',
            key: 'status'
          },
          { 
            title: 'Ngày tạo', 
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (value) => value ? new Date(value).toLocaleString('vi-VN') : '---'
          },
        ]}
        pagination={{ pageSize: 10 }}
        loading={loading}
      />
    </Card>
  );
}

