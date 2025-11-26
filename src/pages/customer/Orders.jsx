// src/pages/customer/Orders.jsx
import React, { useState, useEffect } from 'react';
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
import {
  getOrdersByAccount,
  getStatusColor,
  getStatusText,
  getPaymentStatusColor,
  getPaymentStatusText
} from '../../services/orders';
import { toast } from 'react-toastify';

const { Title, Text } = Typography;
const { Option } = Select;

const formatCurrency = (value) => {
  if (typeof value !== 'number') return '--';
  return `${value.toLocaleString('vi-VN')}đ`;
};

export default function Orders() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const accountId = user?.id || user?.userId;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [allOrdersData, setAllOrdersData] = useState([]);
  const [previousOrdersMap, setPreviousOrdersMap] = useState(new Map()); // Lưu status cũ để phát hiện thay đổi

  const fetchOrders = async (silent = false) => {
    if (!accountId) return;

    try {
      if (!silent) {
        setLoading(true);
      }
      setError(null);

      const allOrders = await getOrdersByAccount(accountId);

      const sortedOrders = [...allOrders].sort((a, b) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return dateB - dateA;
      });

      // Phát hiện order bị cancel bởi admin
      if (!silent && previousOrdersMap.size > 0) {
        sortedOrders.forEach(order => {
          const orderId = order.orderId || order.id;
          const previousStatus = previousOrdersMap.get(orderId);
          const currentStatus = (order.status || '').toUpperCase();
          
          // Nếu order chuyển từ PENDING sang CANCELLED/CANCEL
          if (previousStatus === 'PENDING' && (currentStatus === 'CANCELLED' || currentStatus === 'CANCEL')) {
            toast.warning(`Đơn hàng #${orderId} đã bị hủy bởi admin.`, {
              autoClose: 5000,
            });
          }
        });
      }

      // Cập nhật map status cũ
      const newStatusMap = new Map();
      sortedOrders.forEach(order => {
        const orderId = order.orderId || order.id;
        newStatusMap.set(orderId, (order.status || '').toUpperCase());
      });
      setPreviousOrdersMap(newStatusMap);

      setAllOrdersData(sortedOrders);
    } catch (err) {
      console.error('📋 Orders: Error loading orders', {
        accountId,
        error: err.response?.data || err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
      });
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Không thể tải danh sách đơn hàng.';
      setError(message);
      if (!silent) {
        toast.error(message);
      }
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  };

  // Chỉ fetch khi accountId có và khi component mount / accountId thay đổi
  useEffect(() => {
    if (accountId) {
      fetchOrders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountId]); // không cần fetchOrders trong deps

  // Auto-refresh mỗi 30 giây khi component đang mount
  useEffect(() => {
    if (!accountId) return;

    const intervalId = setInterval(() => {
      // Silent refresh - không hiển thị loading spinner
      fetchOrders(true);
    }, 30000); // 30 giây

    return () => {
      clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountId]);

  // Filter + paginate
  useEffect(() => {
    let filteredOrders = allOrdersData;
    if (statusFilter !== 'ALL') {
      filteredOrders = allOrdersData.filter(order => {
        const orderStatus = (order.status || "").toUpperCase();
        const filterStatus = statusFilter.toUpperCase();
        // Hỗ trợ cả CANCEL và CANCELLED
        if (filterStatus === 'CANCELLED') {
          return orderStatus === 'CANCELLED' || orderStatus === 'CANCEL';
        }
        return orderStatus === filterStatus;
      });
    }

    const startIndex = (pagination.current - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

    setOrders(paginatedOrders);
    setPagination(prev => ({
      ...prev,
      total: filteredOrders.length,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allOrdersData, statusFilter, pagination.current, pagination.pageSize]);

  const handleRefresh = () => {
    fetchOrders();
  };

  const handleTableChange = (pager) => {
    setPagination(prev => ({
      ...prev,
      current: pager.current,
      pageSize: pager.pageSize || prev.pageSize
    }));
  };

  const handleStatusChange = (value) => {
    setStatusFilter(value);
    setPagination(prev => ({ ...prev, current: 1 })); // Reset về trang 1 khi đổi filter
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
              <Option value="CANCELLED">Đã hủy (CANCEL/CANCELLED)</Option>
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