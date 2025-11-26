// src/pages/staff/StaffOrdersPage.jsx
import React, { useState, useEffect } from 'react';
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
  Select,
  Space,
  Modal,
  Descriptions,
  Badge,
  Tooltip
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
import { getAllOrders, updateOrderStatus, updatePaymentStatus, confirmPayment, getStatusText, getStatusColor, getPaymentStatusText, getPaymentStatusColor, getOrderById } from '../../services/orders';
import { useToast } from '../../context/ToastContext';
import { App } from 'antd';
import { dataManager } from '../../utils/dataManager';
import { useSearchParams } from 'react-router-dom';

const { Title, Text } = Typography;
const { Search } = AntInput;
const { Option } = Select;

export default function StaffOrdersPage() {
  const { modal } = App.useApp();
  const { showSuccess, showError } = useToast();
  
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("📦 StaffOrdersPage: Loading orders...");
      
      const data = await dataManager.get('orders', getAllOrders);
      
      console.log("📦 StaffOrdersPage: Orders loaded", data);
      const ordersArray = Array.isArray(data) ? data : [];
      setOrders(ordersArray);
      setFilteredOrders(ordersArray);
    } catch (e) {
      console.error("📦 StaffOrdersPage: Error loading orders", e);
      setError(e?.message || "Không thể tải danh sách đơn hàng.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    
    // Check for status filter from URL params
    const statusParam = searchParams.get('status');
    if (statusParam) {
      setSelectedStatus(statusParam);
    }
  }, []);

  // Filter orders based on search term and status
  useEffect(() => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.id?.toString().includes(searchTerm) ||
        order.shippingAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.phoneContact?.includes(searchTerm)
      );
    }

    if (selectedStatus) {
      filtered = filtered.filter(order => order.status === selectedStatus);
    }

    setFilteredOrders(filtered);
  }, [searchTerm, selectedStatus, orders]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      console.log("📦 StaffOrdersPage: Updating order status", { orderId, newStatus });
      await updateOrderStatus(orderId, newStatus);
      
      // Refresh data
      dataManager.clear('orders');
      await loadOrders();
      
      showSuccess(`Đã cập nhật trạng thái đơn hàng thành ${getStatusText(newStatus)}`);
      console.log("📦 StaffOrdersPage: Order status updated");
    } catch (error) {
      console.error("📦 StaffOrdersPage: Error updating order status", error);
      const message = error?.response?.data?.message || error?.message || 'Không thể cập nhật trạng thái đơn hàng.';
      showError(message);
    }
  };

  const handlePaymentStatusUpdate = async (orderId, paymentStatus) => {
    try {
      console.log("📦 StaffOrdersPage: Updating payment status", { orderId, paymentStatus });
      await updatePaymentStatus(orderId, paymentStatus);
      
      // Refresh data
      dataManager.clear('orders');
      await loadOrders();
      
      showSuccess(`Đã cập nhật trạng thái thanh toán thành ${getPaymentStatusText(paymentStatus)}`);
      console.log("📦 StaffOrdersPage: Payment status updated");
    } catch (error) {
      console.error("📦 StaffOrdersPage: Error updating payment status", error);
      const message = error?.response?.data?.message || error?.message || 'Không thể cập nhật trạng thái thanh toán.';
      showError(message);
    }
  };

  // Xác nhận thanh toán (dùng confirmPayment API)
  const handleConfirmPayment = async (orderId) => {
    try {
      console.log("📦 StaffOrdersPage: Confirming payment", { orderId });
      await confirmPayment(orderId);
      
      // Refresh data
      dataManager.clear('orders');
      await loadOrders();
      
      showSuccess('Đã xác nhận thanh toán thành công!');
      console.log("📦 StaffOrdersPage: Payment confirmed");
    } catch (error) {
      console.error("📦 StaffOrdersPage: Error confirming payment", error);
      const message = error?.response?.data?.message || error?.message || 'Không thể xác nhận thanh toán.';
      showError(message);
    }
  };

  const showOrderDetail = async (order) => {
    try {
      // Load full order details with payment info
      const fullOrder = await getOrderById(order.orderId || order.id);
      setSelectedOrder(fullOrder);
      setIsDetailModalOpen(true);
    } catch (err) {
      console.error("📦 StaffOrdersPage: Error loading order details", err);
      // Fallback to basic order info
      setSelectedOrder(order);
      setIsDetailModalOpen(true);
    }
  };

  const getStatusIcon = (status) => {
    const icons = {
      'PENDING': <ClockCircleOutlined />,
      'PAID': <DollarOutlined />,
      'PROCESSING': <ClockCircleOutlined />,
      'COMPLETED': <CheckCircleOutlined />,
      'CANCELLED': <CloseCircleOutlined />
    };
    return icons[status] || <ClockCircleOutlined />;
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      sorter: (a, b) => a.id - b.id,
      render: (id) => (
        <Text strong style={{ color: 'var(--pv-primary, #eda274)' }}>
          #{id}
        </Text>
      ),
    },
    {
      title: 'Địa chỉ giao hàng',
      dataIndex: 'shippingAddress',
      key: 'shippingAddress',
      ellipsis: true,
      render: (address) => (
        <Tooltip title={address}>
          <Text style={{ color: 'var(--pv-text-heading, #2a1a10)' }}>
            {address}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phoneContact',
      key: 'phoneContact',
      render: (phone) => (
        <Text style={{ color: 'var(--pv-text-muted, #7e5c48)' }}>
          {phone}
        </Text>
      ),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      sorter: (a, b) => a.totalAmount - b.totalAmount,
      render: (amount) => (
        <Text strong style={{ color: 'var(--pv-primary, #eda274)' }}>
          {amount?.toLocaleString('vi-VN')} VNĐ
        </Text>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
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
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      render: (date) => (
        <Text style={{ color: 'var(--pv-text-muted, #7e5c48)' }}>
          {new Date(date).toLocaleDateString('vi-VN')}
        </Text>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => showOrderDetail(record)}
              style={{ color: 'var(--pv-primary, #eda274)' }}
            />
          </Tooltip>
          
          {record.status === 'PENDING' && (
            <Tooltip title="Xác nhận thanh toán">
              <Button
                type="text"
                icon={<CheckCircleOutlined />}
                onClick={() => {
                  modal.confirm({
                    title: 'Xác nhận thanh toán',
                    content: `Bạn có chắc muốn xác nhận thanh toán cho đơn hàng #${record.id}?`,
                    onOk: () => handleConfirmPayment(record.id),
                  });
                }}
                style={{ color: '#52c41a' }}
              />
            </Tooltip>
          )}
          
          {record.status === 'PAID' && (
            <Tooltip title="Bắt đầu xử lý">
              <Button
                type="text"
                icon={<ClockCircleOutlined />}
                onClick={() => handleStatusUpdate(record.id, 'PROCESSING')}
                style={{ color: '#1890ff' }}
              />
            </Tooltip>
          )}
          
          {record.status === 'PROCESSING' && (
            <Tooltip title="Hoàn thành">
              <Button
                type="text"
                icon={<CheckCircleOutlined />}
                onClick={() => handleStatusUpdate(record.id, 'COMPLETED')}
                style={{ color: '#52c41a' }}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px', fontSize: '16px', color: '#666' }}>
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
        action={
          <Button size="small" danger onClick={loadOrders}>
            Thử lại
          </Button>
        }
      />
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
              📦 Quản lý đơn hàng
            </Title>
            <Text style={{ color: 'var(--pv-text-muted, #7e5c48)' }}>
              Xem và cập nhật trạng thái đơn hàng, thanh toán
            </Text>
          </Col>
          <Col>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={loadOrders}
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
              <Option value="PROCESSING">Đang xử lý</Option>
              <Option value="COMPLETED">Hoàn thành</Option>
              <Option value="CANCELLED">Đã hủy</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Text style={{ color: 'var(--pv-text-muted, #7e5c48)' }}>
              Hiển thị {filteredOrders.length} đơn hàng
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
        {filteredOrders.length === 0 ? (
          <Empty
            description="Không có đơn hàng nào"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <Table
            columns={columns}
            dataSource={filteredOrders}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} của ${total} đơn hàng`,
              pageSizeOptions: ['10', '20', '50'],
            }}
            scroll={{ x: 'max-content' }}
            style={{ borderRadius: '8px' }}
          />
        )}
      </Card>

      {/* Order Detail Modal */}
      <Modal
        title={`Chi tiết đơn hàng #${selectedOrder?.id}`}
        open={isDetailModalOpen}
        onCancel={() => setIsDetailModalOpen(false)}
        footer={null}
        width={800}
        style={{ borderRadius: '12px' }}
      >
        {selectedOrder && (
          <div>
            <Descriptions bordered column={2} style={{ marginBottom: '24px' }}>
              <Descriptions.Item label="ID đơn hàng" span={2}>
                <Text strong>#{selectedOrder.id}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ giao hàng" span={2}>
                {selectedOrder.shippingAddress}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                {selectedOrder.phoneContact}
              </Descriptions.Item>
              <Descriptions.Item label="Tổng tiền">
                <Text strong style={{ color: 'var(--pv-primary, #eda274)' }}>
                  {selectedOrder.totalAmount?.toLocaleString('vi-VN')} VNĐ
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
              <Descriptions.Item label="Ngày tạo">
                {new Date(selectedOrder.createdAt).toLocaleString('vi-VN')}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày cập nhật">
                {new Date(selectedOrder.updatedAt).toLocaleString('vi-VN')}
              </Descriptions.Item>
            </Descriptions>

            {/* Order Items */}
            <Card title="Sản phẩm trong đơn hàng" style={{ marginBottom: '24px' }}>
              {selectedOrder.items && selectedOrder.items.length > 0 ? (
                <Table
                  dataSource={selectedOrder.items}
                  columns={[
                    {
                      title: 'Sản phẩm',
                      dataIndex: 'productName',
                      key: 'productName',
                    },
                    {
                      title: 'Số lượng',
                      dataIndex: 'quantity',
                      key: 'quantity',
                      render: (quantity) => (
                        <Badge count={quantity} style={{ backgroundColor: 'var(--pv-primary, #eda274)' }} />
                      ),
                    },
                    {
                      title: 'Giá',
                      dataIndex: 'price',
                      key: 'price',
                      render: (price) => (
                        <Text strong>{price?.toLocaleString('vi-VN')} VNĐ</Text>
                      ),
                    },
                    {
                      title: 'Thành tiền',
                      key: 'total',
                      render: (_, record) => (
                        <Text strong style={{ color: 'var(--pv-primary, #eda274)' }}>
                          {(record.price * record.quantity)?.toLocaleString('vi-VN')} VNĐ
                        </Text>
                      ),
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
                  <Button 
                    type="primary"
                    icon={<CheckCircleOutlined />}
                    onClick={() => {
                      handleConfirmPayment(selectedOrder.id);
                      setIsDetailModalOpen(false);
                    }}
                    style={{ 
                      background: 'linear-gradient(135deg, var(--pv-primary, #eda274) 0%, var(--pv-accent, #ffb07c) 100%)',
                      border: 'none'
                    }}
                  >
                    Xác nhận thanh toán
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
