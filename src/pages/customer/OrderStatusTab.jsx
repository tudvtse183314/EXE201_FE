// src/pages/customer/OrderStatusTab.jsx
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
  Select,
  Timeline,
  Descriptions
} from 'antd';
import { EyeOutlined, ReloadOutlined, FilterOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import {
  getOrdersByAccount,
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

// Order status flow visualization
const ORDER_STATUS_FLOW = [
  { status: 'PENDING', label: 'Chờ thanh toán', color: 'orange' },
  { status: 'PAID', label: 'Đã thanh toán', color: 'blue' },
  { status: 'SHIPPED', label: 'Đang giao hàng', color: 'purple' },
  { status: 'DELIVERED', label: 'Đã giao hàng', color: 'green' }
];

const getStatusIndex = (status) => {
  return ORDER_STATUS_FLOW.findIndex(s => s.status === status.toUpperCase());
};

export default function OrderStatusTab() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const accountId = user?.id || user?.userId;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [allOrdersData, setAllOrdersData] = useState([]);

  const fetchOrders = async () => {
    if (!accountId) return;

    try {
      setLoading(true);
      setError(null);

      const allOrders = await getOrdersByAccount(accountId);

      const sortedOrders = [...allOrders].sort((a, b) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return dateB - dateA;
      });

      setAllOrdersData(sortedOrders);
    } catch (err) {
      console.error('📋 OrderStatusTab: Error loading orders', {
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
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Chỉ fetch khi accountId có và khi component mount / accountId thay đổi
  useEffect(() => {
    if (accountId) {
      fetchOrders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountId]); // không cần fetchOrders trong deps

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

  const handleViewStatus = (order) => {
    setSelectedOrder(order);
  };

  const renderStatusTimeline = (order) => {
    const currentStatus = order.status?.toUpperCase();
    const currentIndex = getStatusIndex(currentStatus);
    
    return (
      <Timeline
        items={ORDER_STATUS_FLOW.map((statusItem, index) => {
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;
          
          return {
            color: isCompleted ? statusItem.color : 'gray',
            dot: isCurrent ? <CheckCircleOutlined style={{ fontSize: '16px' }} /> : undefined,
            children: (
              <div>
                <Text strong={isCurrent} style={{ color: isCompleted ? undefined : '#999' }}>
                  {statusItem.label}
                </Text>
                {isCurrent && (
                  <Tag color={statusItem.color} style={{ marginLeft: 8 }}>
                    Trạng thái hiện tại
                  </Tag>
                )}
                {(order.status?.toUpperCase() === 'CANCELLED' || order.status?.toUpperCase() === 'CANCEL') && statusItem.status === 'PENDING' && (
                  <Tag color="red" style={{ marginLeft: 8 }}>
                    Đã hủy
                  </Tag>
                )}
              </div>
            )
          };
        })}
      />
    );
  };

  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'orderId',
      key: 'orderId',
      render: (text) => <Text strong>#{text}</Text>,
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
      title: 'Hành động',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewStatus(record)}
          >
            Xem trạng thái
          </Button>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewOrder(record.orderId)}
          >
            Chi tiết
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title level={4} style={{ margin: 0 }}>
              📦 Trạng thái đơn hàng
            </Title>
            <p style={{ margin: '8px 0 0 0', color: '#666' }}>
              Theo dõi trạng thái và tiến trình giao hàng
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

      {selectedOrder && (
        <Card
          title={`Chi tiết trạng thái đơn hàng #${selectedOrder.orderId}`}
          extra={
            <Button onClick={() => setSelectedOrder(null)}>Đóng</Button>
          }
          style={{ marginBottom: 24 }}
        >
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Mã đơn hàng">
              #{selectedOrder.orderId}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color={getStatusColor(selectedOrder.status)}>
                {getStatusText(selectedOrder.status)}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Thanh toán">
              <Tag color={getPaymentStatusColor(selectedOrder?.paymentInfo?.status)}>
                {getPaymentStatusText(selectedOrder?.paymentInfo?.status)}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Tổng tiền">
              <Text strong style={{ color: '#1890ff' }}>
                {formatCurrency(selectedOrder.totalAmount)}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tạo" span={2}>
              {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString('vi-VN') : '--'}
            </Descriptions.Item>
            <Descriptions.Item label="Cập nhật lần cuối" span={2}>
              {selectedOrder.updatedAt ? new Date(selectedOrder.updatedAt).toLocaleString('vi-VN') : '--'}
            </Descriptions.Item>
          </Descriptions>
          
          <div style={{ marginTop: 24 }}>
            <Title level={5}>Tiến trình đơn hàng</Title>
            {renderStatusTimeline(selectedOrder)}
          </div>
        </Card>
      )}

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

