// src/pages/admin/orders/AdminOrdersPage.jsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Table, 
  Button, 
  Card, 
  Typography, 
  Row, 
  Col,
  Input as AntInput,
  Alert,
  Empty,
  Tag,
  Select,
  Space,
  Modal,
  Descriptions,
  Badge,
  Tooltip,
  App
} from 'antd';
import { 
  ReloadOutlined,
  SearchOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  DollarOutlined,
  TruckOutlined,
  ShopOutlined
} from '@ant-design/icons';
import { 
  getAllOrders, 
  updateOrderStatus, 
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
const { Option } = Select;

export default function AdminOrdersPage() {
  console.log('🔁 AdminOrdersPage render', new Date().toISOString());
  
  const { modal } = App.useApp();
  const { showSuccess, showError } = useToast();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  
  // Ref để đảm bảo chỉ fetch 1 lần
  const hasFetchedRef = useRef(false);

  // Load orders - chỉ gọi 1 lần khi mount
  useEffect(() => {
    // ✅ Chặn fetch nếu đã fetch rồi
    if (hasFetchedRef.current) {
      console.log("📦 AdminOrdersPage: ⚠️ Already fetched, skipping duplicate call");
      return;
    }
    
    console.log("📦 AdminOrdersPage: 🚀 Starting initial fetch...");
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
  }, [error]); // Chỉ chạy khi error thay đổi

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

  // Filter orders
  const filteredOrders = useMemo(() => {
    if (!orders || !Array.isArray(orders) || orders.length === 0) {
      return [];
    }
    
    let filtered = [...orders];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.orderId?.toString().includes(searchTerm) ||
        order.shippingAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.phoneContact?.includes(searchTerm) ||
        order.accountName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (selectedStatus) {
      filtered = filtered.filter(order => order.status === selectedStatus);
    }

    return filtered;
  }, [orders, searchTerm, selectedStatus]);

  // Helper functions
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

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return '0 VNĐ';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getPaymentMethodText = (order) => {
    if (order.paymentInfo?.bankId) {
      const bankMap = {
        '970407': 'Vietcombank',
        '970415': 'Techcombank',
        '970422': 'BIDV',
        '970436': 'Vietinbank',
        '970418': 'ACB',
        '970405': 'TPBank',
      };
      return bankMap[order.paymentInfo.bankId] || `QR ${order.paymentInfo.bankId}`;
    }
    if (order.paymentInfo?.qrCodeUrl) {
      return 'QR BANK';
    }
    if (order.status === 'PENDING' && !order.paymentInfo) {
      return 'COD';
    }
    return 'N/A';
  };

  const getPaymentStatusTagColor = (paymentStatus) => {
    const normalized = (paymentStatus || "").toUpperCase();
    if (normalized === 'PENDING' || normalized === 'WAITING' || normalized === 'UNPAID') {
      return 'orange';
    }
    if (normalized === 'PAID' || normalized === 'COMPLETED') {
      return 'green';
    }
    if (normalized === 'FAILED' || normalized === 'EXPIRED') {
      return 'red';
    }
    return 'default';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'PENDING': <ClockCircleOutlined />,
      'PAID': <DollarOutlined />,
      'SHIPPED': <TruckOutlined />,
      'DELIVERED': <ShopOutlined />,
      'CANCELLED': <CloseCircleOutlined />
    };
    return icons[status] || <ClockCircleOutlined />;
  };

  // Handlers
  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setUpdatingStatus(true);
      await updateOrderStatus(orderId, newStatus);
      await handleReload();
      showSuccess(`Đã cập nhật trạng thái đơn hàng thành ${getStatusText(newStatus)}`);
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || 'Không thể cập nhật trạng thái đơn hàng.';
      showError(message);
    } finally {
      setUpdatingStatus(false);
    }
  };

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
      
      await confirmPayment(orderId);
      await handleReload();
      showSuccess('Đã xác nhận thanh toán thành công! Trạng thái đã chuyển từ PENDING sang PAID.');
    } catch (error) {
      console.error("📦 AdminOrdersPage: Error confirming payment", error);
      // Error message từ service đã được format sẵn
      const message = error?.message || error?.response?.data?.message || 'Không thể xác nhận thanh toán.';
      showError(message);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleRejectOrder = async (orderId) => {
    try {
      setUpdatingStatus(true);
      await cancelOrder(orderId);
      await handleReload();
      showSuccess('Đã từ chối đơn hàng. Trạng thái đã chuyển từ PENDING sang CANCELLED.');
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || 'Không thể từ chối đơn hàng.';
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
      setSelectedOrder(order);
      setIsDetailModalOpen(true);
    }
  };

  // Table columns
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
    },
    {
      title: 'Số điện thoại liên hệ',
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
        <Tooltip 
          title={address || '---'}
          overlayInnerStyle={{ color: '#000' }}
        >
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
      align: 'right',
      width: 150,
      render: (amount) => (
        <Text strong style={{ color: 'var(--pv-primary, #eda274)' }}>
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
      title: 'Trạng thái đơn hàng',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (status) => (
        <Tag 
          color={getStatusColor(status)} 
          icon={getStatusIcon(status)}
          style={{ borderRadius: '6px' }}
        >
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: 'Thời gian tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (date) => (
        <Text style={{ color: 'var(--pv-text-muted, #7e5c48)' }}>
          {formatDateTime(date)}
        </Text>
      ),
    },
    {
      title: 'Thời gian cập nhật',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 150,
      render: (date) => (
        <Text style={{ color: 'var(--pv-text-muted, #7e5c48)' }}>
          {formatDateTime(date)}
        </Text>
      ),
    },
    {
      title: 'Trạng thái thanh toán',
      key: 'paymentStatus',
      width: 160,
      render: (_, record) => {
        const paymentStatus = record.paymentInfo?.status;
        if (!paymentStatus) {
          return <Tag color="default">Chưa có thông tin</Tag>;
        }
        return (
          <Tag color={getPaymentStatusTagColor(paymentStatus)}>
            {getPaymentStatusText(paymentStatus)}
          </Tag>
        );
      },
    },
    {
      title: 'Phương thức thanh toán',
      key: 'paymentMethod',
      width: 160,
      render: (_, record) => {
        const method = getPaymentMethodText(record);
        return (
          <Text style={{ color: 'var(--pv-text-muted, #7e5c48)' }}>
            {method}
          </Text>
        );
      },
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 200,
      fixed: 'right',
      render: (_, record) => {
        const paymentStatus = record.paymentInfo?.status?.toUpperCase();
        const canConfirmPayment = record.status === 'PENDING' && 
          (paymentStatus === 'PENDING' || paymentStatus === 'WAITING' || !paymentStatus);
        const isPaid = record.status === 'PAID';
        const isShipped = record.status === 'SHIPPED';

        return (
          <Space size="small">
            <Tooltip 
              title="Xem chi tiết"
              overlayInnerStyle={{ color: '#000' }}
            >
              <Button
                type="text"
                icon={<EyeOutlined />}
                onClick={() => showOrderDetail(record)}
                style={{ color: 'var(--pv-primary, #eda274)' }}
              />
            </Tooltip>
            
            {canConfirmPayment && (
              <Tooltip 
                title="Xác nhận thanh toán"
                overlayInnerStyle={{ color: '#000' }}
              >
                <Button
                  type="text"
                  icon={<CheckCircleOutlined />}
                  onClick={() => {
                    modal.confirm({
                      title: 'Xác nhận thanh toán',
                      content: `Bạn có chắc muốn xác nhận thanh toán cho đơn hàng ORD-${record.orderId || record.id}? Trạng thái sẽ chuyển từ PENDING sang PAID.`,
                      onOk: () => handleConfirmPayment(record.orderId || record.id),
                    });
                  }}
                  style={{ color: '#52c41a' }}
                />
              </Tooltip>
            )}
            
            {isPaid && (
              <Tooltip 
                title="Bắt đầu giao hàng (PAID → SHIPPED)"
                overlayInnerStyle={{ color: '#000' }}
              >
                <Button
                  type="text"
                  icon={<TruckOutlined />}
                  onClick={() => {
                    modal.confirm({
                      title: 'Bắt đầu giao hàng',
                      content: `Bạn có chắc muốn chuyển trạng thái đơn hàng ORD-${record.orderId || record.id} từ PAID sang SHIPPED?`,
                      onOk: () => handleStatusUpdate(record.orderId || record.id, 'SHIPPED'),
                    });
                  }}
                  style={{ color: '#722ed1' }}
                  loading={updatingStatus}
                />
              </Tooltip>
            )}
            
            {isShipped && (
              <Tooltip 
                title="Hoàn thành giao hàng (SHIPPED → DELIVERED)"
                overlayInnerStyle={{ color: '#000' }}
              >
                <Button
                  type="text"
                  icon={<ShopOutlined />}
                  onClick={() => {
                    modal.confirm({
                      title: 'Hoàn thành giao hàng',
                      content: `Bạn có chắc muốn chuyển trạng thái đơn hàng ORD-${record.orderId || record.id} từ SHIPPED sang DELIVERED? Khách hàng sẽ có thể đánh giá sản phẩm sau khi đơn hàng được xác nhận đã giao.`,
                      onOk: () => handleStatusUpdate(record.orderId || record.id, 'DELIVERED'),
                    });
                  }}
                  style={{ color: '#52c41a' }}
                  loading={updatingStatus}
                />
              </Tooltip>
            )}
            
            {record.status === 'PENDING' && (
              <Tooltip 
                title="Hủy đơn hàng"
                overlayInnerStyle={{ color: '#000' }}
              >
                <Button
                  type="text"
                  icon={<CloseCircleOutlined />}
                  onClick={() => {
                    modal.confirm({
                      title: 'Hủy đơn hàng',
                      content: `Bạn có chắc muốn hủy đơn hàng ORD-${record.orderId || record.id}? Trạng thái sẽ chuyển từ PENDING sang CANCELLED.`,
                      okText: 'Hủy đơn',
                      cancelText: 'Đóng',
                      okType: 'danger',
                      onOk: () => handleRejectOrder(record.orderId || record.id),
                    });
                  }}
                  style={{ color: '#ff4d4f' }}
                />
              </Tooltip>
            )}
          </Space>
        );
      },
    },
  ];

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
              📦 Quản lý đơn hàng (Admin)
            </Title>
            <Text style={{ color: 'var(--pv-text-muted, #7e5c48)' }}>
              Xem và cập nhật trạng thái đơn hàng, thanh toán
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

      {/* Search and Filters */}
      <Card style={{ marginBottom: '24px', borderRadius: '12px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="Tìm kiếm đơn hàng..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Select
              placeholder="Lọc theo trạng thái"
              allowClear
              size="large"
              style={{ width: '100%' }}
              value={selectedStatus}
              onChange={setSelectedStatus}
            >
              <Option value="PENDING">Chờ thanh toán</Option>
              <Option value="PAID">Đã thanh toán</Option>
              <Option value="SHIPPED">Đang giao</Option>
              <Option value="DELIVERED">Đã giao</Option>
              <Option value="CANCELLED">Đã hủy</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Text style={{ color: 'var(--pv-text-muted, #7e5c48)' }}>
              Tổng: {orders.length} đơn hàng
              {filteredOrders.length !== orders.length && (
                <span style={{ marginLeft: 8, color: 'var(--pv-primary, #eda274)' }}>
                  (Đang lọc: {filteredOrders.length})
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
          dataSource={filteredOrders}
          rowKey={(record) => record.orderId || record.id || `order-${Math.random()}`}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} đơn hàng`,
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
                    : searchTerm || selectedStatus
                    ? "Không tìm thấy đơn hàng nào phù hợp với bộ lọc"
                    : loading
                    ? "Đang tải..."
                    : orders.length === 0
                    ? "Chưa có đơn hàng nào"
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
                <Text strong style={{ color: 'var(--pv-primary, #eda274)' }}>
                  {formatCurrency(selectedOrder.totalAmount)}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag 
                  color={getStatusColor(selectedOrder.status)} 
                  icon={getStatusIcon(selectedOrder.status)}
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
                  <Tag color="default">Chưa có thông tin</Tag>
                )}
              </Descriptions.Item>
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
                        <Tooltip 
                          title={productName}
                          overlayInnerStyle={{ color: '#000' }}
                        >
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
                {selectedOrder.status === 'PENDING' && (
                  <>
                    <Button 
                      type="primary"
                      icon={<CheckCircleOutlined />}
                      onClick={() => {
                        modal.confirm({
                          title: 'Xác nhận thanh toán',
                          content: `Bạn có chắc muốn xác nhận thanh toán cho đơn hàng ORD-${selectedOrder.orderId || selectedOrder.id}? Trạng thái sẽ chuyển từ PENDING sang PAID.`,
                          onOk: () => {
                            handleConfirmPayment(selectedOrder.orderId || selectedOrder.id);
                            setIsDetailModalOpen(false);
                          },
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
                            setIsDetailModalOpen(false);
                          },
                        });
                      }}
                      loading={updatingStatus}
                    >
                      Từ chối đơn hàng
                    </Button>
                  </>
                )}
                {selectedOrder.status === 'PAID' && (
                  <Button 
                    type="primary"
                    icon={<TruckOutlined />}
                    onClick={() => {
                      handleStatusUpdate(selectedOrder.orderId || selectedOrder.id, 'SHIPPED');
                      setIsDetailModalOpen(false);
                    }}
                    loading={updatingStatus}
                  >
                    Bắt đầu giao hàng
                  </Button>
                )}
                {selectedOrder.status === 'SHIPPED' && (
                  <Button 
                    type="primary"
                    icon={<ShopOutlined />}
                    onClick={() => {
                      handleStatusUpdate(selectedOrder.orderId || selectedOrder.id, 'DELIVERED');
                      setIsDetailModalOpen(false);
                    }}
                    loading={updatingStatus}
                  >
                    Hoàn thành giao hàng
                  </Button>
                )}
              </Space>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
