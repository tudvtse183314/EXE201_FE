// src/pages/admin/payments/PaymentsPage.jsx
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
  Modal
} from 'antd';
import { 
  ReloadOutlined, 
  SearchOutlined,
  DollarOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { getAllOrders } from '../../../services/orders';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [userIdFilter, setUserIdFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState(null);
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
      
      // Extract payment info from orders
      const paymentsData = ordersData
        .filter(order => order.paymentInfo) // Chỉ lấy orders có paymentInfo
        .map(order => ({
          ...order.paymentInfo,
          orderId: order.orderId,
          accountId: order.accountId,
          totalAmount: order.totalAmount,
          orderStatus: order.status,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt
        }));
      
      setPayments(paymentsData);
    } catch (e) {
      console.error('Error loading payments data:', e);
      setError(e.message);
      message.error('Không thể tải dữ liệu thanh toán');
    } finally {
      setLoading(false);
    }
  };

  // Filter payments
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = !searchTerm || 
      payment.orderId?.toString().includes(searchTerm) ||
      payment.accountId?.toString().includes(searchTerm) ||
      payment.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.accountName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesUser = userIdFilter === 'all' || 
      payment.accountId?.toString() === userIdFilter;
    
    const matchesStatus = statusFilter === 'all' || 
      payment.status?.toUpperCase() === statusFilter.toUpperCase();
    
    return matchesSearch && matchesUser && matchesStatus;
  });

  // Get unique user IDs for filter
  const uniqueUserIds = [...new Set(payments.map(p => p.accountId))].filter(Boolean).sort((a, b) => a - b);

  // Calculate statistics
  const totalPayments = payments.length;
  const completedPayments = payments.filter(p => p.status === 'COMPLETED').length;
  const pendingPayments = payments.filter(p => p.status === 'PENDING').length;
  const totalAmount = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const completedAmount = payments
    .filter(p => p.status === 'COMPLETED')
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const getStatusColor = (status) => {
    const statusUpper = (status || '').toUpperCase();
    switch (statusUpper) {
      case 'COMPLETED': return 'green';
      case 'PENDING': return 'orange';
      case 'FAILED': return 'red';
      case 'EXPIRED': return 'volcano';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    const statusUpper = (status || '').toUpperCase();
    switch (statusUpper) {
      case 'COMPLETED': return 'Đã thanh toán';
      case 'PENDING': return 'Đang chờ';
      case 'FAILED': return 'Thất bại';
      case 'EXPIRED': return 'Hết hạn';
      default: return status;
    }
  };

  const formatCurrency = (value) => {
    if (typeof value !== 'number') return '--';
    return `${value.toLocaleString('vi-VN')}đ`;
  };

  const handleViewDetails = (payment) => {
    setSelectedPayment(payment);
    setModalVisible(true);
  };

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'orderId',
      key: 'orderId',
      width: 100,
      sorter: (a, b) => a.orderId - b.orderId,
      render: (orderId) => (
        <Tag color="blue">#{orderId}</Tag>
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
      title: 'Số tiền',
      dataIndex: 'amount',
      key: 'amount',
      width: 150,
      sorter: (a, b) => (a.amount || 0) - (b.amount || 0),
      render: (amount) => (
        <Text strong style={{ color: '#eda274', fontSize: '15px' }}>
          {formatCurrency(amount)}
        </Text>
      ),
    },
    {
      title: 'Ngân hàng',
      dataIndex: 'bankId',
      key: 'bankId',
      width: 120,
      render: (bankId) => bankId || '--',
    },
    {
      title: 'Số tài khoản',
      dataIndex: 'accountNo',
      key: 'accountNo',
      width: 150,
      render: (accountNo) => (
        <Text code>{accountNo || '--'}</Text>
      ),
    },
    {
      title: 'Tên tài khoản',
      dataIndex: 'accountName',
      key: 'accountName',
      width: 200,
      ellipsis: true,
    },
    {
      title: 'Nội dung',
      dataIndex: 'description',
      key: 'description',
      width: 200,
      ellipsis: true,
      render: (description) => description || '--',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      filters: [
        { text: 'Đã thanh toán', value: 'COMPLETED' },
        { text: 'Đang chờ', value: 'PENDING' },
        { text: 'Thất bại', value: 'FAILED' },
        { text: 'Hết hạn', value: 'EXPIRED' },
      ],
      onFilter: (value, record) => record.status?.toUpperCase() === value,
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: 'Trạng thái đơn',
      dataIndex: 'orderStatus',
      key: 'orderStatus',
      width: 120,
      render: (orderStatus) => {
        const colors = {
          'PENDING': 'orange',
          'PAID': 'blue',
          'SHIPPED': 'purple',
          'DELIVERED': 'green',
          'CANCELLED': 'red'
        };
        return (
          <Tag color={colors[orderStatus] || 'default'}>
            {orderStatus || '--'}
          </Tag>
        );
      },
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <Button 
          type="link" 
          icon={<EyeOutlined />}
          onClick={() => handleViewDetails(record)}
        >
          Chi tiết
        </Button>
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
          💳 Quản lý Thanh toán
        </Title>
        <Text type="secondary">
          Quản lý tất cả thông tin thanh toán trong hệ thống
        </Text>
      </div>

      {/* Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Tổng số thanh toán"
              value={totalPayments}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#eda274' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Đã thanh toán"
              value={completedPayments}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Đang chờ"
              value={pendingPayments}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Tổng giá trị"
              value={totalAmount}
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
              placeholder="Tìm kiếm Order ID, User ID, nội dung..."
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
              <Option value="COMPLETED">Đã thanh toán</Option>
              <Option value="PENDING">Đang chờ</Option>
              <Option value="FAILED">Thất bại</Option>
              <Option value="EXPIRED">Hết hạn</Option>
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

      {/* Payments Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredPayments}
          rowKey={(record) => `${record.orderId}-${record.accountId}`}
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} payments`,
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
          scroll={{ x: 'max-content' }}
        />
      </Card>

      {/* Payment Details Modal */}
      <Modal
        title="Chi tiết thanh toán"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>
            Đóng
          </Button>
        ]}
        width={700}
      >
        {selectedPayment && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Order ID">
              <Tag color="blue">#{selectedPayment.orderId}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="User ID">
              {selectedPayment.accountId ? (
                <Tag color="blue">User {selectedPayment.accountId}</Tag>
              ) : (
                <Tag color="orange">Guest</Tag>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Số tiền">
              <Text strong style={{ color: '#eda274', fontSize: '18px' }}>
                {formatCurrency(selectedPayment.amount)}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái thanh toán">
              <Tag color={getStatusColor(selectedPayment.status)}>
                {getStatusText(selectedPayment.status)}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái đơn hàng">
              <Tag color="blue">{selectedPayment.orderStatus}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Ngân hàng">
              {selectedPayment.bankId || '--'}
            </Descriptions.Item>
            <Descriptions.Item label="Số tài khoản">
              <Text code>{selectedPayment.accountNo || '--'}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Tên tài khoản">
              {selectedPayment.accountName || '--'}
            </Descriptions.Item>
            <Descriptions.Item label="Nội dung chuyển khoản">
              {selectedPayment.description || '--'}
            </Descriptions.Item>
            <Descriptions.Item label="QR Code URL">
              {selectedPayment.qrCodeUrl ? (
                <a href={selectedPayment.qrCodeUrl} target="_blank" rel="noopener noreferrer">
                  {selectedPayment.qrCodeUrl}
                </a>
              ) : (
                '--'
              )}
            </Descriptions.Item>
            {selectedPayment.message && (
              <Descriptions.Item label="Thông báo">
                {selectedPayment.message}
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}

