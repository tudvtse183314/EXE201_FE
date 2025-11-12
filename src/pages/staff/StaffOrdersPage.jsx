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
  Tooltip,
  Divider
} from 'antd';
import { 
  ReloadOutlined,
  SearchOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  DollarOutlined
} from '@ant-design/icons';
import { 
  getAllOrders, 
  updateOrderStatus, 
  updatePaymentStatus,
  getStatusText, 
  getStatusColor,
  getPaymentStatusText,
  getPaymentStatusColor,
  ORDER_NEXT_STATUS,
  PAYMENT_STATUS_OPTIONS,
  ORDER_STATUS_OPTIONS
} from '../../services/orders';
import { useToast } from '../../context/ToastContext';
import { dataManager } from '../../utils/dataManager';
import { useSearchParams } from 'react-router-dom';

const { Title, Text } = Typography;
const { Search } = AntInput;
const { Option } = Select;

export default function StaffOrdersPage() {
  const { showSuccess, showError } = useToast();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(null);
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
      setUpdatingStatus(orderId);
      console.log("📦 StaffOrdersPage: Updating order status", { orderId, newStatus });
      await updateOrderStatus(orderId, newStatus);
      
      // Refresh data
      dataManager.clear('orders');
      await loadOrders();
      
      showSuccess(`Đã cập nhật trạng thái đơn hàng thành ${getStatusText(newStatus)}`);
      console.log("📦 StaffOrdersPage: Order status updated");
    } catch (error) {
      console.error("📦 StaffOrdersPage: Error updating order status", error);
      
      // Xử lý lỗi theo từng loại
      let message = 'Không thể cập nhật trạng thái đơn hàng.';
      
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        message = 'Bạn cần đăng nhập hoặc không đủ quyền.';
      } else if (error?.response?.status === 400) {
        const errorData = error?.response?.data;
        if (errorData?.message?.toLowerCase().includes('không thể nhảy') || errorData?.message?.toLowerCase().includes('invalid')) {
          message = 'Không thể nhảy trạng thái. Vui lòng chuyển trạng thái tuần tự.';
        } else {
          message = errorData?.message || 'Dữ liệu không hợp lệ.';
        }
      } else if (error?.response?.status >= 500) {
        message = 'Đã có lỗi hệ thống. Vui lòng thử lại sau.';
      } else {
        message = error?.response?.data?.message || error?.message || message;
      }
      
      showError(message);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handlePaymentStatusUpdate = async (orderId, newPaymentStatus) => {
    try {
      setUpdatingStatus(orderId);
      console.log("📦 StaffOrdersPage: Updating payment status", { orderId, newPaymentStatus });
      await updatePaymentStatus(orderId, newPaymentStatus);
      
      // Refresh data
      dataManager.clear('orders');
      await loadOrders();
      
      showSuccess(`Đã cập nhật trạng thái thanh toán thành ${getPaymentStatusText(newPaymentStatus)}`);
      console.log("📦 StaffOrdersPage: Payment status updated");
    } catch (error) {
      console.error("📦 StaffOrdersPage: Error updating payment status", error);
      
      // Xử lý lỗi theo từng loại
      let message = 'Không thể cập nhật trạng thái thanh toán.';
      
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        message = 'Bạn cần đăng nhập hoặc không đủ quyền.';
      } else if (error?.response?.status === 400) {
        const errorData = error?.response?.data;
        if (errorData?.message?.toLowerCase().includes('invalid') || errorData?.message?.toLowerCase().includes('giá trị')) {
          message = 'Giá trị hợp lệ: PENDING, COMPLETED, FAILED, EXPIRED.';
        } else {
          message = errorData?.message || 'Dữ liệu không hợp lệ.';
        }
      } else if (error?.response?.status >= 500) {
        message = 'Đã có lỗi hệ thống. Vui lòng thử lại sau.';
      } else {
        message = error?.response?.data?.message || error?.message || message;
      }
      
      showError(message);
    } finally {
      setUpdatingStatus(null);
    }
  };
  
  // Lấy các trạng thái tiếp theo hợp lệ cho một đơn hàng
  const getNextStatuses = (currentStatus) => {
    const normalized = (currentStatus || '').toUpperCase();
    return ORDER_NEXT_STATUS[normalized] || [];
  };

  const showOrderDetail = (order) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
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
      title: 'Trạng thái đơn',
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
      title: 'Trạng thái thanh toán',
      dataIndex: ['paymentInfo', 'status'],
      key: 'paymentStatus',
      render: (_, record) => {
        const paymentStatus = record?.paymentInfo?.status;
        return (
          <Tag 
            color={getPaymentStatusColor(paymentStatus)}
            style={{ borderRadius: '6px' }}
          >
            {getPaymentStatusText(paymentStatus)}
          </Tag>
        );
      },
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
      width: 300,
      render: (_, record) => {
        const nextStatuses = getNextStatuses(record.status);
        const isUpdating = updatingStatus === record.id;
        
        return (
          <Space size="small" wrap>
            <Tooltip title="Xem chi tiết">
              <Button
                type="text"
                icon={<EyeOutlined />}
                onClick={() => showOrderDetail(record)}
                style={{ color: 'var(--pv-primary, #eda274)' }}
              />
            </Tooltip>
            
            {/* Hiển thị các nút chuyển trạng thái tuần tự */}
            {nextStatuses.map((nextStatus) => (
              <Tooltip key={nextStatus} title={`Chuyển sang ${getStatusText(nextStatus)}`}>
                <Button
                  type="text"
                  size="small"
                  loading={isUpdating}
                  onClick={() => handleStatusUpdate(record.id, nextStatus)}
                  style={{ 
                    color: nextStatus === 'CANCELLED' ? '#ff4d4f' : '#52c41a',
                    fontSize: '12px'
                  }}
                >
                  {getStatusText(nextStatus)}
                </Button>
              </Tooltip>
            ))}
          </Space>
        );
      },
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
              <Option value="SHIPPED">Đang giao</Option>
              <Option value="DELIVERED">Đã giao</Option>
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
              <Descriptions.Item label="Trạng thái đơn">
                <Tag 
                  color={getStatusColor(selectedOrder.status)} 
                  icon={getStatusIcon(selectedOrder.status)}
                >
                  {getStatusText(selectedOrder.status)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái thanh toán">
                <Tag 
                  color={getPaymentStatusColor(selectedOrder?.paymentInfo?.status)}
                >
                  {getPaymentStatusText(selectedOrder?.paymentInfo?.status)}
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
            <div style={{ marginTop: '24px' }}>
              <Card title="Cập nhật trạng thái" size="small">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div>
                    <Text strong>Trạng thái đơn hàng:</Text>
                    <Space wrap style={{ marginTop: '8px' }}>
                      {getNextStatuses(selectedOrder.status).map((nextStatus) => (
                        <Button
                          key={nextStatus}
                          size="small"
                          loading={updatingStatus === selectedOrder.id}
                          onClick={() => {
                            handleStatusUpdate(selectedOrder.id, nextStatus);
                            setIsDetailModalOpen(false);
                          }}
                          danger={nextStatus === 'CANCELLED'}
                        >
                          {getStatusText(nextStatus)}
                        </Button>
                      ))}
                      {getNextStatuses(selectedOrder.status).length === 0 && (
                        <Text type="secondary">Không có trạng thái tiếp theo</Text>
                      )}
                    </Space>
                  </div>
                  <Divider style={{ margin: '12px 0' }} />
                  <div>
                    <Text strong>Trạng thái thanh toán:</Text>
                    <Space wrap style={{ marginTop: '8px' }}>
                      {PAYMENT_STATUS_OPTIONS.map((paymentStatus) => (
                        <Button
                          key={paymentStatus}
                          size="small"
                          loading={updatingStatus === selectedOrder.id}
                          onClick={() => {
                            handlePaymentStatusUpdate(selectedOrder.id, paymentStatus);
                            setIsDetailModalOpen(false);
                          }}
                          type={selectedOrder?.paymentInfo?.status === paymentStatus ? 'primary' : 'default'}
                        >
                          {getPaymentStatusText(paymentStatus)}
                        </Button>
                      ))}
                    </Space>
                  </div>
                </Space>
              </Card>
              <div style={{ textAlign: 'right', marginTop: '16px' }}>
                <Button onClick={() => setIsDetailModalOpen(false)}>
                  Đóng
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
