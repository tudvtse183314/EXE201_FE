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
  Empty,
  Select
} from 'antd';
import { EyeOutlined, ReloadOutlined, FilterOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  getMyOrders,
  getStatusColor,
  getStatusText,
  getPaymentStatusColor,
  getPaymentStatusText
} from '../../services/orders';

const { Title, Text } = Typography;
const { Option } = Select;

const formatCurrency = (value) => {
  if (typeof value !== 'number') return '--';
  return `${value.toLocaleString('vi-VN')}đ`;
};

const normalizeOrdersResponse = (response) => {
  if (Array.isArray(response)) {
    return { data: response, total: response.length, pageIndex: 0 };
  }

  const candidates = response?.content || response?.items || response?.data || [];
  const data = Array.isArray(candidates) ? candidates : [];
  const total = response?.totalElements
    ?? response?.total
    ?? response?.count
    ?? data.length;
  const pageIndex = response?.number
    ?? response?.page
    ?? response?.pageable?.pageNumber
    ?? 0;

  return { data, total, pageIndex };
};

export default function Orders() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showError } = useToast();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  const fetchOrders = useCallback(async (page = 1, pageSize = 10, status = statusFilter) => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      const query = {
        page: Math.max(page - 1, 0),
        size: pageSize
      };

      if (status && status !== 'ALL') {
        query.status = status;
      }

      const response = await getMyOrders(query);
      const { data, total, pageIndex } = normalizeOrdersResponse(response);

      setOrders(data);
      setPagination({
        current: (pageIndex ?? 0) + 1,
        pageSize,
        total
      });
    } catch (err) {
      console.error('📋 Orders: Error loading orders', err);
      const message = err?.response?.data?.message || err?.message || 'Không thể tải danh sách đơn hàng.';
      setError(message);
      showError(message);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, user?.id, showError]);

  useEffect(() => {
    if (user?.id) {
      fetchOrders(1, pagination.pageSize, statusFilter);
    }
  }, [user?.id, statusFilter, fetchOrders, pagination.pageSize]);

  const handleRefresh = () => {
    fetchOrders(pagination.current, pagination.pageSize, statusFilter);
  };

  const handleTableChange = (pager) => {
    fetchOrders(pager.current, pager.pageSize, statusFilter);
  };

  const handleStatusChange = (value) => {
    setStatusFilter(value);
    fetchOrders(1, pagination.pageSize, value);
  };

  const handleViewOrder = (orderId) => {
    navigate(`/customer/orders/${orderId}`);
  };

  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'orderId',
      key: 'orderId',
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: 'Trạng thái đơn',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
    },
    {
      title: 'Thanh toán',
      dataIndex: ['paymentInfo', 'status'],
      key: 'paymentStatus',
      render: (_, record) => {
        const paymentStatus = record?.paymentInfo?.status;
        return (
          <Tag color={getPaymentStatusColor(paymentStatus)}>
            {getPaymentStatusText(paymentStatus)}
          </Tag>
        );
      }
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (total) => (
        <Text strong style={{ color: '#1890ff' }}>{formatCurrency(total)}</Text>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => date ? new Date(date).toLocaleString('vi-VN') : '--',
    },
    {
      title: 'Cập nhật',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (date) => date ? new Date(date).toLocaleString('vi-VN') : '--',
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, record) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => handleViewOrder(record.orderId)}
        >
          Xem chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Card style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title level={3} style={{ margin: 0 }}>
              📋 Đơn hàng của tôi
            </Title>
            <p style={{ margin: '8px 0 0 0', color: '#666' }}>
              Quản lý và theo dõi các đơn hàng cùng trạng thái thanh toán
            </p>
          </div>
          <Space wrap>
            <Select
              value={statusFilter}
              style={{ minWidth: 180 }}
              onChange={handleStatusChange}
              suffixIcon={<FilterOutlined />}
              disabled={loading}
            >
              <Option value="ALL">Tất cả trạng thái</Option>
              <Option value="PENDING">Chờ thanh toán</Option>
              <Option value="PAID">Đã thanh toán</Option>
              <Option value="SHIPPED">Đang giao</Option>
              <Option value="DELIVERED">Đã giao</Option>
              <Option value="CANCELLED">Đã hủy</Option>
            </Select>
            <Button
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              loading={loading}
            >
              Làm mới
            </Button>
          </Space>
        </div>
      </Card>

      <Card>
        {error && (
          <Alert
            message="Không thể tải danh sách đơn hàng"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        <Table
          columns={columns}
          dataSource={orders}
          rowKey={(record) => record.orderId || record.id}
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            locale: { items_per_page: '/ trang' },
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} đơn hàng`
          }}
          onChange={handleTableChange}
          locale={{
            emptyText: loading ? <Spin /> : (
              <Empty
                description={statusFilter === 'ALL'
                  ? 'Bạn chưa có đơn hàng nào.'
                  : 'Không có đơn hàng phù hợp trạng thái này.'
                }
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )
          }}
        />
      </Card>
    </div>
  );
}