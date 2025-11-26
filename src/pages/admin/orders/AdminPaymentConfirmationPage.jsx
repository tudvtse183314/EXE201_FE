// src/pages/admin/orders/AdminPaymentConfirmationPage.jsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Table, 
  Button, 
  Card, 
  Typography, 
  Row, 
  Col,
  Input as AntInput,
  Spin,
  Alert,
  Empty,
  Tag,
  Space,
  Modal,
  Descriptions,
  Badge,
  Tooltip,
  App,
  Statistic
} from 'antd';
import { 
  ReloadOutlined,
  SearchOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  CheckOutlined
} from '@ant-design/icons';
import { 
  getAllOrders, 
  confirmPayment,
  cancelOrder,
  getStatusText, 
  getStatusColor, 
  getPaymentStatusText, 
  getPaymentStatusColor,
  getOrderById
} from '../../../services/orders';
import { useToast } from '../../../context/ToastContext';

const { Title, Text } = Typography;
const { Search } = AntInput;

export default function AdminPaymentConfirmationPage() {
  console.log('🔁 AdminPaymentConfirmationPage render', new Date().toISOString());
  
  const { modal } = App.useApp();
  const { showSuccess, showError } = useToast();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  
  // Ref để đảm bảo chỉ fetch 1 lần
  const hasFetchedRef = useRef(false);
  
  // Load orders - chỉ gọi 1 lần khi mount
  useEffect(() => {
    // ✅ Chặn fetch nếu đã fetch rồi
    if (hasFetchedRef.current) {
      console.log("💳 AdminPaymentConfirmationPage: ⚠️ Already fetched, skipping duplicate call");
      return;
    }
    
    console.log("💳 AdminPaymentConfirmationPage: 🚀 Starting initial fetch...");
    let cancelled = false;
    
    const fetchOrders = async () => {
      hasFetchedRef.current = true;
      setLoading(true);
      setError(null);
      
      try {
        const data = await getAllOrders();
        
        if (!cancelled) {
          const normalized = Array.isArray(data) ? data : [];
          setOrders(normalized);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          const errorMessage = err?.message || "Không thể tải danh sách đơn hàng.";
          setError(errorMessage);
          setOrders([]);
          setLoading(false);
        }
      }
    };
    
    fetchOrders();
    
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Chỉ chạy 1 lần khi mount

  // Show error toast khi có error
  useEffect(() => {
    if (error) {
      showError(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  // Reload orders manually
  const handleReload = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getAllOrders();
      const normalized = Array.isArray(data) ? data : [];
      setOrders(normalized);
      setLoading(false);
    } catch (err) {
      const errorMessage = err?.message || "Không thể tải danh sách đơn hàng.";
      setError(errorMessage);
      setOrders([]);
      setLoading(false);
      showError(errorMessage);
    } finally {
      // Reset flag để có thể fetch lại nếu cần
      hasFetchedRef.current = false;
    }
  };

  // Filter orders: chỉ hiển thị PENDING orders chờ xác nhận thanh toán
  const pendingOrders = useMemo(() => {
    if (!orders || !Array.isArray(orders) || orders.length === 0) {
      return [];
    }
    
    // Lọc orders có status = PENDING và paymentStatus = PENDING (hoặc chưa có paymentInfo)
    // Lưu ý: Backend có thể trả về paymentInfo: null cho các đơn chưa có thông tin thanh toán
    let filtered = orders.filter(order => {
      const isPending = order.status === 'PENDING';
      
      // Xử lý paymentInfo: null hoặc chưa có status
      const paymentInfo = order.paymentInfo;
      const paymentStatus = paymentInfo?.status ? String(paymentInfo.status).toUpperCase() : null;
      
      // Đơn chờ xác nhận nếu:
      // - paymentInfo = null (chưa có thông tin thanh toán)
      // - paymentStatus = PENDING/WAITING/UNPAID
      const isPaymentPending = !paymentInfo || 
                              !paymentStatus || 
                              paymentStatus === 'PENDING' || 
                              paymentStatus === 'WAITING' || 
                              paymentStatus === 'UNPAID';
      
      return isPending && isPaymentPending;
    });

    console.log("💳 AdminPaymentConfirmationPage: Filtered pending orders", {
      totalOrders: orders.length,
      pendingOrdersCount: filtered.length,
      sampleFiltered: filtered.length > 0 ? {
        orderId: filtered[0].orderId,
        status: filtered[0].status,
        paymentInfo: filtered[0].paymentInfo
      } : null
    });

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.orderId?.toString().includes(searchTerm) ||
        order.shippingAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.phoneContact?.includes(searchTerm) ||
        order.accountName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [orders, searchTerm]);

  // Statistics
  const stats = useMemo(() => {
    const totalPending = pendingOrders.length;
    const totalAmount = pendingOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    return { totalPending, totalAmount };
  }, [pendingOrders]);


  // Xác nhận thanh toán
  const handleConfirmPayment = async (orderId) => {
    try {
      setUpdatingStatus(true);
      
      // ✅ Validate trước khi gọi API
      const order = orders.find(o => (o.orderId || o.id) === orderId);
      if (order && order.status !== 'PENDING') {
        showError(`Đơn hàng ORD-${orderId} không ở trạng thái PENDING. Trạng thái hiện tại: ${getStatusText(order.status)}`);
        setUpdatingStatus(false);
        return;
      }
      
      // Log token để debug
      const token = localStorage.getItem('accessToken');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      console.log("💳 AdminPaymentConfirmationPage: Attempting to confirm payment", {
        orderId,
        hasToken: !!token,
        tokenLength: token?.length,
        userRole: user?.role,
        orderStatus: order?.status
      });
      
      await confirmPayment(orderId);
      await handleReload();
      
      showSuccess('Đã xác nhận thanh toán thành công! Trạng thái đã chuyển từ PENDING sang PAID.');
      setIsDetailModalOpen(false);
    } catch (error) {
      console.error("💳 AdminPaymentConfirmationPage: Error confirming payment", {
        error,
        message: error?.message,
        status: error?.response?.status,
        responseData: error?.response?.data,
        stack: error?.stack
      });
      
      // Error message từ service đã được format sẵn
      let message = error?.message || error?.response?.data?.message || 'Không thể xác nhận thanh toán.';
      
      // Nếu là lỗi "Access Denied", thêm thông tin chi tiết
      if (message.includes('Access Denied') || error?.response?.status === 403) {
        const token = localStorage.getItem('accessToken');
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        message = `Không có quyền xác nhận thanh toán. Vui lòng kiểm tra:\n- Bạn đang đăng nhập với tài khoản ${user?.role || 'N/A'}\n- Token: ${token ? 'Có' : 'Không có'}\n- Yêu cầu quyền: ADMIN`;
      }
      
      showError(message);
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Từ chối đơn hàng
  const handleRejectOrder = async (orderId) => {
    try {
      setUpdatingStatus(true);
      
      // Log token để debug
      const token = localStorage.getItem('accessToken');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      console.log("💳 AdminPaymentConfirmationPage: Attempting to reject order", {
        orderId,
        hasToken: !!token,
        tokenLength: token?.length,
        userRole: user?.role
      });
      
      await cancelOrder(orderId);
      await handleReload();
      
      showSuccess('Đã từ chối đơn hàng. Trạng thái đã chuyển từ PENDING sang CANCELLED.');
      setIsDetailModalOpen(false);
    } catch (error) {
      console.error("💳 AdminPaymentConfirmationPage: Error rejecting order", {
        error,
        message: error?.message,
        status: error?.response?.status,
        responseData: error?.response?.data,
        stack: error?.stack
      });
      
      let message = error?.response?.data?.message || error?.message || 'Không thể từ chối đơn hàng.';
      
      // Xử lý lỗi CORS
      if (message.includes('CORS') || message.includes('blocked') || !error?.response) {
        message = 'Lỗi kết nối: Không thể kết nối đến server. Vui lòng kiểm tra:\n- Kết nối mạng\n- Cấu hình CORS trên backend\n- Backend có đang chạy không';
      }
      
      // Nếu là lỗi 403
      if (error?.response?.status === 403) {
        const token = localStorage.getItem('accessToken');
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        message = `Không có quyền từ chối đơn hàng. Vui lòng kiểm tra:\n- Bạn đang đăng nhập với tài khoản ${user?.role || 'N/A'}\n- Token: ${token ? 'Có' : 'Không có'}`;
      }
      
      showError(message);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const showOrderDetail = async (order) => {
    try {
      const fullOrder = await getOrderById(order.orderId);
      setSelectedOrder(fullOrder);
      setIsDetailModalOpen(true);
    } catch (err) {
      console.error("💳 AdminPaymentConfirmationPage: Error loading order details", err);
      setSelectedOrder(order);
      setIsDetailModalOpen(true);
    }
  };

  // Helper function to format date as DD/MM/YYYY HH:mm
  const formatDateTime = (date) => {
    if (!date) return '---';
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  // Helper function to format currency
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
      title: 'STT',
      key: 'stt',
      width: 60,
      align: 'center',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Mã đơn hàng',
      dataIndex: 'orderId',
      key: 'orderId',
      width: 150,
      sorter: true,
      render: (orderId, record) => {
        const formattedOrderId = orderId ? `ORD-${orderId}` : 'N/A';
        return (
          <Text 
            strong 
            style={{ 
              color: 'var(--pv-primary, #eda274)',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
            onClick={() => showOrderDetail(record)}
          >
            {formattedOrderId}
          </Text>
        );
      },
    },
    {
      title: 'Khách hàng',
      dataIndex: 'accountName',
      key: 'accountName',
      render: (name) => (
        <Text style={{ color: 'var(--pv-text-heading, #2a1a10)' }}>
          {name || '---'}
        </Text>
      ),
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phoneContact',
      key: 'phoneContact',
      width: 130,
    },
    {
      title: 'Địa chỉ giao hàng',
      dataIndex: 'shippingAddress',
      key: 'shippingAddress',
      ellipsis: {
        showTitle: false,
      },
      width: 200,
      render: (address) => (
        <Tooltip title={address || '---'}>
          <Text style={{ color: 'var(--pv-text-muted, #7e5c48)' }}>
            {address || '---'}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      sorter: true,
      align: 'right',
      width: 150,
      render: (amount) => (
        <Text strong style={{ color: 'var(--pv-primary, #eda274)', fontSize: '16px' }}>
          {formatCurrency(amount)}
        </Text>
      ),
    },
    {
      title: 'Số lượng sản phẩm',
      key: 'itemsCount',
      width: 130,
      align: 'center',
      render: (_, record) => {
        const itemsCount = Array.isArray(record.items) ? record.items.length : 0;
        return (
          <Tag color="blue">
            {itemsCount} sản phẩm
          </Tag>
        );
      },
    },
    {
      title: 'Thời gian tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: true,
      width: 150,
      render: (date) => (
        <Text style={{ color: 'var(--pv-text-muted, #7e5c48)' }}>
          {formatDateTime(date)}
        </Text>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 250,
      fixed: 'right',
      render: (_, record) => {
        return (
          <Space size="small">
            <Tooltip title="Xem chi tiết">
              <Button
                type="text"
                icon={<EyeOutlined />}
                onClick={() => showOrderDetail(record)}
                style={{ color: 'var(--pv-primary, #eda274)' }}
              />
            </Tooltip>
            
            <Tooltip title="Xác nhận thanh toán">
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={() => {
                  modal.confirm({
                    title: 'Xác nhận thanh toán',
                    content: `Bạn có chắc muốn xác nhận thanh toán cho đơn hàng ORD-${record.orderId || record.id}? Trạng thái sẽ chuyển từ PENDING sang PAID.`,
                    okText: 'Xác nhận',
                    cancelText: 'Hủy',
                    onOk: () => handleConfirmPayment(record.orderId || record.id),
                  });
                }}
                style={{ 
                  background: '#52c41a',
                  borderColor: '#52c41a'
                }}
                loading={updatingStatus}
              >
                Xác nhận
              </Button>
            </Tooltip>
            
            <Tooltip title="Từ chối đơn hàng">
              <Button
                danger
                icon={<CloseCircleOutlined />}
                onClick={() => {
                  modal.confirm({
                    title: 'Từ chối đơn hàng',
                    content: `Bạn có chắc muốn từ chối đơn hàng ORD-${record.orderId || record.id}? Trạng thái sẽ chuyển từ PENDING sang CANCELLED.`,
                    okText: 'Từ chối',
                    cancelText: 'Hủy',
                    okType: 'danger',
                    onOk: () => handleRejectOrder(record.orderId || record.id),
                  });
                }}
                loading={updatingStatus}
              >
                Từ chối
              </Button>
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  if (loading && orders.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px', fontSize: '16px', color: '#666' }}>
          Đang tải danh sách đơn hàng chờ xác nhận...
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <Card 
        style={{ 
          marginBottom: '24px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #fff 0%, #ffeadd 100%)'
        }}
      >
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={3} style={{ margin: 0, color: 'var(--pv-text-heading, #2a1a10)' }}>
              💳 Xác nhận thanh toán đơn hàng
            </Title>
            <Text style={{ color: 'var(--pv-text-muted, #7e5c48)' }}>
              Quản lý và xác nhận các đơn hàng chờ thanh toán
            </Text>
          </Col>
          <Col>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={handleReload}
              loading={loading}
              style={{ borderRadius: '8px' }}
            >
              Làm mới
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Statistics */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Tổng đơn chờ xác nhận"
              value={stats.totalPending}
              prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Tổng giá trị"
              value={stats.totalAmount}
              prefix={<DollarOutlined style={{ color: '#52c41a' }} />}
              formatter={(value) => formatCurrency(value)}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Trung bình/đơn"
              value={stats.totalPending > 0 ? Math.round(stats.totalAmount / stats.totalPending) : 0}
              prefix={<CheckOutlined style={{ color: '#1890ff' }} />}
              formatter={(value) => formatCurrency(value)}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Search */}
      <Card style={{ marginBottom: '24px', borderRadius: '12px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="Tìm kiếm theo mã đơn, tên KH, SĐT, địa chỉ..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>
          <Col xs={24} sm={12} md={16}>
            <Text style={{ color: 'var(--pv-text-muted, #7e5c48)' }}>
              Hiển thị: {pendingOrders.length} đơn hàng chờ xác nhận
              {searchTerm && (
                <span style={{ marginLeft: 8, color: 'var(--pv-primary, #eda274)' }}>
                  (đang lọc)
                </span>
              )}
            </Text>
          </Col>
        </Row>
      </Card>

      {/* Orders Table */}
      <Card 
        style={{ 
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #fff 0%, #ffeadd 100%)'
        }}
      >
        {error && (
          <Alert
            message="Lỗi tải dữ liệu"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
            action={
              <Button size="small" danger onClick={handleReload}>
                Thử lại
              </Button>
            }
          />
        )}
        <Table
          columns={columns}
          dataSource={pendingOrders}
          rowKey={(record) => {
            const key = record.orderId || record.id || `order-${Math.random()}`;
            return key;
          }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} đơn hàng chờ xác nhận`,
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
          scroll={{ x: 'max-content' }}
          loading={loading}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  error 
                    ? `Lỗi: ${error}`
                    : searchTerm
                    ? "Không tìm thấy đơn hàng nào phù hợp với bộ lọc"
                    : loading
                    ? "Đang tải..."
                    : pendingOrders.length === 0
                    ? "Không có đơn hàng nào chờ xác nhận thanh toán"
                    : "Không có dữ liệu để hiển thị"
                }
              />
            ),
          }}
          style={{ borderRadius: '8px' }}
          size="middle"
        />
      </Card>

      {/* Order Detail Modal */}
      <Modal
        title={`Chi tiết đơn hàng ORD-${selectedOrder?.orderId || selectedOrder?.id}`}
        open={isDetailModalOpen}
        onCancel={() => setIsDetailModalOpen(false)}
        footer={null}
        width={900}
        style={{ borderRadius: '12px' }}
      >
        {selectedOrder && (
          <div>
            <Descriptions bordered column={2} style={{ marginBottom: '24px' }}>
              <Descriptions.Item label="Mã đơn hàng" span={2}>
                <Text strong>ORD-{selectedOrder.orderId || selectedOrder.id}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Khách hàng" span={2}>
                {selectedOrder.accountName || '---'}
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ giao hàng" span={2}>
                {selectedOrder.shippingAddress}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                {selectedOrder.phoneContact}
              </Descriptions.Item>
              <Descriptions.Item label="Tổng tiền">
                <Text strong style={{ color: 'var(--pv-primary, #eda274)', fontSize: '18px' }}>
                  {formatCurrency(selectedOrder.totalAmount)}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag 
                  color={getStatusColor(selectedOrder.status)} 
                  icon={<ClockCircleOutlined />}
                >
                  {getStatusText(selectedOrder.status)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái thanh toán">
                {selectedOrder.paymentInfo?.status ? (
                  <Tag color={getPaymentStatusColor(selectedOrder.paymentInfo.status)}>
                    {getPaymentStatusText(selectedOrder.paymentInfo.status)}
                  </Tag>
                ) : (
                  <Tag color="orange">Chờ xác nhận</Tag>
                )}
              </Descriptions.Item>
              {selectedOrder.paymentInfo && (
                <>
                  {selectedOrder.paymentInfo.bankId && (
                    <Descriptions.Item label="Ngân hàng">
                      {selectedOrder.paymentInfo.bankId}
                    </Descriptions.Item>
                  )}
                  {selectedOrder.paymentInfo.accountNo && (
                    <Descriptions.Item label="Số tài khoản">
                      {selectedOrder.paymentInfo.accountNo}
                    </Descriptions.Item>
                  )}
                </>
              )}
              <Descriptions.Item label="Ngày tạo">
                {formatDateTime(selectedOrder.createdAt)}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày cập nhật">
                {formatDateTime(selectedOrder.updatedAt)}
              </Descriptions.Item>
            </Descriptions>

            {/* Order Items */}
            <Card title={`Sản phẩm trong đơn hàng (${selectedOrder.items?.length || 0} loại)`} style={{ marginBottom: '24px' }}>
              {selectedOrder.items && Array.isArray(selectedOrder.items) && selectedOrder.items.length > 0 ? (
                <Table
                  dataSource={selectedOrder.items}
                  rowKey={(record, index) => record.productId || index}
                  columns={[
                    {
                      title: 'Mã SP',
                      dataIndex: 'productId',
                      key: 'productId',
                      width: 100,
                      render: (productId) => (
                        <Text type="secondary">#{productId}</Text>
                      ),
                    },
                    {
                      title: 'Tên sản phẩm',
                      dataIndex: 'productName',
                      key: 'productName',
                      ellipsis: true,
                      render: (productName) => (
                        <Tooltip title={productName}>
                          <Text strong>{productName || '---'}</Text>
                        </Tooltip>
                      ),
                    },
                    {
                      title: 'Số lượng',
                      dataIndex: 'quantity',
                      key: 'quantity',
                      width: 100,
                      align: 'center',
                      render: (quantity) => (
                        <Badge count={quantity} style={{ backgroundColor: 'var(--pv-primary, #eda274)' }} />
                      ),
                    },
                    {
                      title: 'Đơn giá',
                      dataIndex: 'price',
                      key: 'price',
                      width: 150,
                      align: 'right',
                      render: (price) => (
                        <Text>{formatCurrency(price)}</Text>
                      ),
                    },
                    {
                      title: 'Thành tiền',
                      key: 'total',
                      width: 150,
                      align: 'right',
                      render: (_, record) => {
                        const total = (record.price || 0) * (record.quantity || 0);
                        return (
                          <Text strong style={{ color: 'var(--pv-primary, #eda274)' }}>
                            {formatCurrency(total)}
                          </Text>
                        );
                      },
                    },
                  ]}
                  pagination={false}
                  size="small"
                />
              ) : (
                <Empty description="Không có sản phẩm nào" />
              )}
            </Card>

            {/* Action Buttons */}
            <div style={{ textAlign: 'right' }}>
              <Space>
                <Button onClick={() => setIsDetailModalOpen(false)}>
                  Đóng
                </Button>
                <Button 
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  onClick={() => {
                    modal.confirm({
                      title: 'Xác nhận thanh toán',
                      content: `Bạn có chắc muốn xác nhận thanh toán cho đơn hàng ORD-${selectedOrder.orderId || selectedOrder.id}? Trạng thái sẽ chuyển từ PENDING sang PAID.`,
                      okText: 'Xác nhận',
                      cancelText: 'Hủy',
                      onOk: () => handleConfirmPayment(selectedOrder.orderId || selectedOrder.id),
                    });
                  }}
                  loading={updatingStatus}
                  style={{ 
                    background: '#52c41a',
                    borderColor: '#52c41a'
                  }}
                >
                  Xác nhận thanh toán
                </Button>
                <Button 
                  danger
                  icon={<CloseCircleOutlined />}
                  onClick={() => {
                    modal.confirm({
                      title: 'Từ chối đơn hàng',
                      content: `Bạn có chắc muốn từ chối đơn hàng ORD-${selectedOrder.orderId || selectedOrder.id}? Trạng thái sẽ chuyển từ PENDING sang CANCELLED.`,
                      okText: 'Từ chối',
                      cancelText: 'Hủy',
                      okType: 'danger',
                      onOk: () => {
                        handleRejectOrder(selectedOrder.orderId || selectedOrder.id);
                      },
                    });
                  }}
                  loading={updatingStatus}
                >
                  Từ chối đơn hàng
                </Button>
              </Space>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

