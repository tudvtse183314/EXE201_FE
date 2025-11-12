// src/pages/admin/orders/OrdersPage.jsx
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Space, 
  Typography, 
  Tag, 
  Input, 
  Select, 
  message,
  Row,
  Col,
  Statistic,
  Alert,
  Descriptions,
  Modal,
  Badge
} from 'antd';
import { 
  ReloadOutlined, 
  SearchOutlined,
  ShoppingOutlined,
  EyeOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { getAllOrders, getStatusColor, getStatusText } from '../../../services/orders';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

export default function OrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [userIdFilter, setUserIdFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const ordersData = await getAllOrders();
      setOrders(ordersData);
    } catch (e) {
      console.error('Error loading orders data:', e);
      setError(e.message);
      message.error('Không thể tải dữ liệu đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = !searchTerm || 
      order.orderId?.toString().includes(searchTerm) ||
      order.accountId?.toString().includes(searchTerm) ||
      order.shippingAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phoneContact?.includes(searchTerm);
    
    const matchesUser = userIdFilter === 'all' || 
      order.accountId?.toString() === userIdFilter;
    
    const matchesStatus = statusFilter === 'all' || 
      order.status?.toUpperCase() === statusFilter.toUpperCase();
    
    return matchesSearch && matchesUser && matchesStatus;
  });

  // Get unique user IDs for filter
  const uniqueUserIds = [...new Set(orders.map(o => o.accountId))].filter(Boolean).sort((a, b) => a - b);

  // Calculate statistics
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'PENDING').length;
  const paidOrders = orders.filter(o => o.status === 'PAID').length;
  const shippedOrders = orders.filter(o => o.status === 'SHIPPED').length;
  const deliveredOrders = orders.filter(o => o.status === 'DELIVERED').length;
  const totalRevenue = orders
    .filter(o => o.status === 'PAID' || o.status === 'SHIPPED' || o.status === 'DELIVERED')
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const formatCurrency = (value) => {
    if (typeof value !== 'number') return '--';
    return `${value.toLocaleString('vi-VN')}đ`;
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  const handleViewOrderDetail = (orderId) => {
    navigate(`/customer/orders/${orderId}`);
  };

  const getPaymentStatusColor = (status) => {
    const statusUpper = (status || '').toUpperCase();
    switch (statusUpper) {
      case 'COMPLETED': return 'green';
      case 'PENDING': return 'orange';
      case 'FAILED': return 'red';
      case 'EXPIRED': return 'volcano';
      default: return 'default';
    }
  };

  const getPaymentStatusText = (status) => {
    const statusUpper = (status || '').toUpperCase();
    switch (statusUpper) {
      case 'COMPLETED': return 'Đã thanh toán';
      case 'PENDING': return 'Đang chờ';
      case 'FAILED': return 'Thất bại';
      case 'EXPIRED': return 'Hết hạn';
      default: return status || '--';
    }
  };

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'orderId',
      key: 'orderId',
      width: 100,
      sorter: (a, b) => a.orderId - b.orderId,
      render: (orderId) => (
        <Button 
          type="link" 
          onClick={() => handleViewOrderDetail(orderId)}
          style={{ padding: 0 }}
        >
          <Tag color="blue">#{orderId}</Tag>
        </Button>
      ),
    },
    {
      title: 'User ID',
      dataIndex: 'accountId',
      key: 'accountId',
      width: 100,
      sorter: (a, b) => (a.accountId || 0) - (b.accountId || 0),
      render: (accountId) => (
        <Tag color={accountId ? 'blue' : 'orange'}>
          {accountId ? `User ${accountId}` : 'Guest'}
        </Tag>
      ),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 150,
      sorter: (a, b) => (a.totalAmount || 0) - (b.totalAmount || 0),
      render: (amount) => (
        <Text strong style={{ color: '#eda274', fontSize: '15px' }}>
          {formatCurrency(amount)}
        </Text>
      ),
    },
    {
      title: 'Địa chỉ giao hàng',
      dataIndex: 'shippingAddress',
      key: 'shippingAddress',
      width: 200,
      ellipsis: true,
      render: (address) => address || '--',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phoneContact',
      key: 'phoneContact',
      width: 130,
      render: (phone) => phone || '--',
    },
    {
      title: 'Trạng thái đơn',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      filters: [
        { text: 'Chờ thanh toán', value: 'PENDING' },
        { text: 'Đã thanh toán', value: 'PAID' },
        { text: 'Đang giao', value: 'SHIPPED' },
        { text: 'Đã giao', value: 'DELIVERED' },
        { text: 'Đã hủy', value: 'CANCELLED' },
      ],
      onFilter: (value, record) => record.status?.toUpperCase() === value,
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: 'Trạng thái thanh toán',
      key: 'paymentStatus',
      width: 150,
      render: (_, record) => {
        const paymentStatus = record.paymentInfo?.status;
        return paymentStatus ? (
          <Tag color={getPaymentStatusColor(paymentStatus)}>
            {getPaymentStatusText(paymentStatus)}
          </Tag>
        ) : (
          <Tag color="default">--</Tag>
        );
      },
    },
    {
      title: 'Số sản phẩm',
      key: 'itemsCount',
      width: 100,
      render: (_, record) => {
        const itemsCount = record.items?.length || 0;
        return (
          <Badge count={itemsCount} showZero>
            <Tag>{itemsCount} SP</Tag>
          </Badge>
        );
      },
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      sorter: (a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
        const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
        return dateA - dateB;
      },
      render: (date) => {
        if (!date) return '--';
        return new Date(date).toLocaleString('vi-VN');
      },
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button 
            type="link" 
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
          >
            Chi tiết
          </Button>
        </Space>
      ),
    },
  ];

  if (error) {
    return (
      <Alert
        message="Lỗi tải dữ liệu"
        description={error}
        type="error"
        showIcon
        action={
          <Button size="small" danger onClick={loadData}>
            Thử lại
          </Button>
        }
      />
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2} style={{ margin: 0, color: '#362319' }}>
          📋 Quản lý Đơn hàng
        </Title>
        <Text type="secondary">
          Quản lý tất cả đơn hàng trong hệ thống
        </Text>
      </div>

      {/* Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Tổng số đơn"
              value={totalOrders}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: '#eda274' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Chờ thanh toán"
              value={pendingOrders}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Đã thanh toán"
              value={paidOrders}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Tổng doanh thu"
              value={totalRevenue}
              formatter={(value) => formatCurrency(value)}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={6}>
            <Search
              placeholder="Tìm kiếm Order ID, User ID, địa chỉ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%' }}
              prefix={<SearchOutlined />}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              value={userIdFilter}
              onChange={setUserIdFilter}
              style={{ width: '100%' }}
              placeholder="Lọc theo User ID"
            >
              <Option value="all">Tất cả người dùng</Option>
              {uniqueUserIds.map(userId => (
                <Option key={userId} value={userId.toString()}>
                  User {userId}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: '100%' }}
              placeholder="Lọc theo trạng thái"
            >
              <Option value="all">Tất cả trạng thái</Option>
              <Option value="PENDING">Chờ thanh toán</Option>
              <Option value="PAID">Đã thanh toán</Option>
              <Option value="SHIPPED">Đang giao</Option>
              <Option value="DELIVERED">Đã giao</Option>
              <Option value="CANCELLED">Đã hủy</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button 
                icon={<ReloadOutlined />} 
                onClick={loadData}
                loading={loading}
              >
                Làm mới
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Orders Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredOrders}
          rowKey="orderId"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} orders`,
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
          scroll={{ x: 'max-content' }}
        />
      </Card>

      {/* Order Details Modal */}
      <Modal
        title={`Chi tiết đơn hàng #${selectedOrder?.orderId}`}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>
            Đóng
          </Button>,
          <Button 
            key="view" 
            type="primary"
            onClick={() => {
              setModalVisible(false);
              if (selectedOrder?.orderId) {
                handleViewOrderDetail(selectedOrder.orderId);
              }
            }}
          >
            Xem chi tiết đầy đủ
          </Button>
        ]}
        width={800}
      >
        {selectedOrder && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Order ID">
              <Tag color="blue">#{selectedOrder.orderId}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="User ID">
              {selectedOrder.accountId ? (
                <Tag color="blue">User {selectedOrder.accountId}</Tag>
              ) : (
                <Tag color="orange">Guest</Tag>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Tổng tiền">
              <Text strong style={{ color: '#eda274', fontSize: '18px' }}>
                {formatCurrency(selectedOrder.totalAmount)}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái đơn hàng">
              <Tag color={getStatusColor(selectedOrder.status)}>
                {getStatusText(selectedOrder.status)}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái thanh toán">
              {selectedOrder.paymentInfo?.status ? (
                <Tag color={getPaymentStatusColor(selectedOrder.paymentInfo.status)}>
                  {getPaymentStatusText(selectedOrder.paymentInfo.status)}
                </Tag>
              ) : (
                <Tag color="default">--</Tag>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Địa chỉ giao hàng">
              {selectedOrder.shippingAddress || '--'}
            </Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">
              {selectedOrder.phoneContact || '--'}
            </Descriptions.Item>
            <Descriptions.Item label="Ghi chú">
              {selectedOrder.note || '--'}
            </Descriptions.Item>
            <Descriptions.Item label="Số sản phẩm">
              <Badge count={selectedOrder.items?.length || 0} showZero>
                <Tag>{selectedOrder.items?.length || 0} sản phẩm</Tag>
              </Badge>
            </Descriptions.Item>
            {selectedOrder.paymentInfo && (
              <>
                <Descriptions.Item label="Ngân hàng">
                  {selectedOrder.paymentInfo.bankId || '--'}
                </Descriptions.Item>
                <Descriptions.Item label="Số tài khoản">
                  <Text code>{selectedOrder.paymentInfo.accountNo || '--'}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Tên tài khoản">
                  {selectedOrder.paymentInfo.accountName || '--'}
                </Descriptions.Item>
                <Descriptions.Item label="Nội dung chuyển khoản">
                  {selectedOrder.paymentInfo.description || '--'}
                </Descriptions.Item>
              </>
            )}
            <Descriptions.Item label="Ngày tạo">
              {selectedOrder.createdAt 
                ? new Date(selectedOrder.createdAt).toLocaleString('vi-VN')
                : '--'}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày cập nhật">
              {selectedOrder.updatedAt 
                ? new Date(selectedOrder.updatedAt).toLocaleString('vi-VN')
                : '--'}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}

