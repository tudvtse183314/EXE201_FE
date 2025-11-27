// src/pages/admin/revenue/AdminRevenuePage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Card, 
  Typography, 
  Row, 
  Col,
  Statistic,
  Table,
  Tag,
  DatePicker,
  Select,
  Space,
  Alert,
  Spin
} from 'antd';
import { 
  DollarOutlined,
  ShoppingOutlined,
  RiseOutlined,
  FallOutlined
} from '@ant-design/icons';
import { getAllOrders } from '../../../services/orders';
import { useToast } from '../../../context/ToastContext';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

export default function AdminRevenuePage() {
  const { showError } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllOrders();
      const normalized = Array.isArray(data) ? data : [];
      setOrders(normalized);
    } catch (err) {
      const errorMessage = err?.message || "Không thể tải dữ liệu đơn hàng.";
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Tính toán doanh thu
  const revenueData = useMemo(() => {
    let filteredOrders = [...orders];

    // Filter theo date range
    if (dateRange && dateRange.length === 2) {
      const [start, end] = dateRange;
      filteredOrders = filteredOrders.filter(order => {
        const orderDate = dayjs(order.createdAt);
        return orderDate.isAfter(start.subtract(1, 'day')) && orderDate.isBefore(end.add(1, 'day'));
      });
    }

    // Filter theo status
    if (statusFilter !== 'ALL') {
      filteredOrders = filteredOrders.filter(order => order.status === statusFilter);
    }

    // Chỉ tính các đơn đã thanh toán hoặc đã giao (PAID, SHIPPED, DELIVERED)
    // Loại bỏ PENDING và CANCELLED/CANCEL
    const paidOrders = filteredOrders.filter(order => {
      const status = (order.status || '').toUpperCase();
      // Chỉ tính các order có status là PAID, SHIPPED, hoặc DELIVERED
      return status === 'PAID' || status === 'SHIPPED' || status === 'DELIVERED';
    });

    const totalRevenue = paidOrders.reduce((sum, order) => {
      const amount = order.totalAmount || order.total_amount || 0;
      return sum + (typeof amount === 'number' ? amount : 0);
    }, 0);
    const totalOrders = filteredOrders.length;
    const paidOrdersCount = paidOrders.length;
    const cancelledOrders = filteredOrders.filter(order => 
      order.status === 'CANCELLED' || order.status === 'CANCEL'
    ).length;
    const averageOrderValue = paidOrdersCount > 0 ? totalRevenue / paidOrdersCount : 0;

    return {
      totalRevenue,
      totalOrders,
      paidOrdersCount,
      cancelledOrders,
      averageOrderValue,
      filteredOrders
    };
  }, [orders, dateRange, statusFilter]);

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return '0 VNĐ';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const columns = [
    {
      title: 'Mã đơn',
      dataIndex: 'orderId',
      key: 'orderId',
      render: (id) => <Text strong>ORD-{id}</Text>,
    },
    {
      title: 'Khách hàng',
      dataIndex: 'accountName',
      key: 'accountName',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const colors = {
          PENDING: 'orange',
          PAID: 'blue',
          SHIPPED: 'purple',
          DELIVERED: 'green',
          CANCELLED: 'red',
          CANCEL: 'red'
        };
        const texts = {
          PENDING: 'Chờ thanh toán',
          PAID: 'Đã thanh toán',
          SHIPPED: 'Đang giao',
          DELIVERED: 'Đã giao',
          CANCELLED: 'Đã hủy',
          CANCEL: 'Đã hủy'
        };
        return <Tag color={colors[status] || 'default'}>{texts[status] || status}</Tag>;
      }
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      align: 'right',
      render: (amount) => <Text strong style={{ color: '#1890ff' }}>{formatCurrency(amount)}</Text>,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => dayjs(date).format('DD/MM/YYYY HH:mm'),
    },
  ];

  return (
    <div>
      <Card 
        style={{ 
          marginBottom: '24px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #fff 0%, #ffeadd 100%)'
        }}
      >
        <Title level={3} style={{ margin: 0, color: 'var(--pv-text-heading, #2a1a10)' }}>
          💰 Tổng doanh thu
        </Title>
        <Text style={{ color: 'var(--pv-text-muted, #7e5c48)' }}>
          Xem và phân tích doanh thu theo thời gian và trạng thái đơn hàng
        </Text>
      </Card>

      {/* Filters */}
      <Card style={{ marginBottom: '24px', borderRadius: '12px' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text strong>Khoảng thời gian:</Text>
              <RangePicker
                style={{ width: '100%' }}
                onChange={setDateRange}
                format="DD/MM/YYYY"
                placeholder={['Từ ngày', 'Đến ngày']}
              />
            </Space>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text strong>Trạng thái:</Text>
              <Select
                style={{ width: '100%' }}
                value={statusFilter}
                onChange={setStatusFilter}
                placeholder="Lọc theo trạng thái"
              >
                <Option value="ALL">Tất cả</Option>
                <Option value="PENDING">Chờ thanh toán</Option>
                <Option value="PAID">Đã thanh toán</Option>
                <Option value="SHIPPED">Đang giao</Option>
                <Option value="DELIVERED">Đã giao</Option>
                <Option value="CANCELLED">Đã hủy</Option>
              </Select>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng doanh thu"
              value={revenueData.totalRevenue}
              prefix={<DollarOutlined />}
              suffix="VNĐ"
              valueStyle={{ color: '#3f8600' }}
              formatter={(value) => formatCurrency(value)}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng đơn hàng"
              value={revenueData.totalOrders}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Đơn đã thanh toán"
              value={revenueData.paidOrdersCount}
              prefix={<RiseOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Giá trị trung bình"
              value={revenueData.averageOrderValue}
              prefix={<DollarOutlined />}
              suffix="VNĐ"
              valueStyle={{ color: '#722ed1' }}
              formatter={(value) => formatCurrency(value)}
            />
          </Card>
        </Col>
      </Row>

      {/* Orders Table */}
      <Card style={{ borderRadius: '12px' }}>
        {error && (
          <Alert
            message="Lỗi tải dữ liệu"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}
        <Table
          columns={columns}
          dataSource={revenueData.filteredOrders}
          rowKey={(record) => record.orderId || record.id}
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} đơn hàng`
          }}
          scroll={{ x: 'max-content' }}
        />
      </Card>
    </div>
  );
}

