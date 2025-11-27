import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Card,
  Typography,
  Space,
  Tag,
  Button,
  Steps,
  Row,
  Col,
  List,
  Divider,
  Spin,
  Alert,
  QRCode,
  Tooltip,
  Modal,
  Form,
  Rate,
  Input
} from 'antd';
import {
  ArrowLeftOutlined,
  ReloadOutlined,
  CheckOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  StarOutlined
} from '@ant-design/icons';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import {
  getOrderById,
  confirmPayment,
  cancelOrder,
  getPaymentQR,
  getStatusColor,
  getStatusText,
  getPaymentStatusColor,
  getPaymentStatusText,
  ORDER_STATUS_FLOW
} from '../../services/orders';
import { createReview, getReviewsByUserId } from '../../services/reviews';

const { Title, Text } = Typography;

const formatCurrency = (value) => {
  if (typeof value !== 'number') return '--';
  return `${value.toLocaleString('vi-VN')}đ`;
};

export default function OrderDetail() {
  const { id: orderId } = useParams(); // Route dùng :id nên cần extract id
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showSuccess, showError, showWarning } = useToast();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const [refreshingQR, setRefreshingQR] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [selectedProductForReview, setSelectedProductForReview] = useState(null);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewForm] = Form.useForm();
  const [userReviews, setUserReviews] = useState([]); // Lưu danh sách review của user
  const [loadingReviews, setLoadingReviews] = useState(false);
  const previousStatusRef = useRef(null); // Lưu status cũ để phát hiện thay đổi

  const loadOrder = useCallback(async (silent = false) => {
    // Validate orderId - có thể là string từ URL params
    const currentOrderId = orderId ? String(orderId).trim() : null;
    
    if (!currentOrderId || currentOrderId === 'undefined' || currentOrderId === 'null') {
      console.warn('📦 OrderDetail: No orderId provided', { orderId, currentOrderId });
      if (!silent) {
        setLoading(false);
        setError('Không tìm thấy ID đơn hàng.');
      }
      return;
    }

    try {
      if (!silent) {
        setLoading(true);
        setError(null);
      }
      
      console.log('📦 OrderDetail: Loading order', { orderId: currentOrderId, silent });
      const response = await getOrderById(currentOrderId);
      console.log('📦 OrderDetail: Order loaded successfully', { 
        orderId: response?.orderId,
        status: response?.status,
        hasItems: Array.isArray(response?.items),
        itemsCount: response?.items?.length
      });
      
      // Validate response
      if (!response) {
        throw new Error('Không nhận được dữ liệu từ server.');
      }
      
      // Phát hiện khi order bị cancel bởi admin
      if (!silent && previousStatusRef.current) {
        const oldStatus = (previousStatusRef.current || '').toUpperCase();
        const newStatus = (response.status || '').toUpperCase();
        
        // Nếu order chuyển từ PENDING sang CANCELLED/CANCEL
        if (oldStatus === 'PENDING' && (newStatus === 'CANCELLED' || newStatus === 'CANCEL')) {
          showWarning('Đơn hàng đã bị hủy bởi admin.');
        }
      }
      
      previousStatusRef.current = response.status;
      setOrder(response);
      
      if (!silent) {
        setLoading(false);
      }
    } catch (err) {
      console.error('📦 OrderDetail: Error fetching order', {
        orderId: currentOrderId,
        error: err,
        message: err?.message,
        response: err?.response?.data,
        status: err?.response?.status
      });
      
      const message = err?.response?.data?.message || err?.message || 'Không thể tải thông tin đơn hàng.';
      setError(message);
      
      if (!silent) {
        setLoading(false);
      }
    }
  }, [orderId, showWarning]);

  // Load reviews của user khi có user và order
  const loadUserReviews = useCallback(async () => {
    if (!user?.id && !user?.userId) return;
    
    try {
      setLoadingReviews(true);
      const userId = user.id || user.userId;
      const reviews = await getReviewsByUserId(userId);
      setUserReviews(reviews || []);
    } catch (err) {
      console.error('⭐ OrderDetail: Error loading user reviews', err);
      setUserReviews([]);
    } finally {
      setLoadingReviews(false);
    }
  }, [user]);

  useEffect(() => {
    // Chỉ load khi có orderId hợp lệ
    const validOrderId = orderId ? String(orderId).trim() : null;
    
    if (validOrderId && validOrderId !== 'undefined' && validOrderId !== 'null') {
      console.log('📦 OrderDetail: useEffect triggered', { orderId, validOrderId });
      loadOrder();
    } else {
      console.warn('📦 OrderDetail: Invalid orderId in useEffect', { orderId, validOrderId });
      setLoading(false);
      setError('Không tìm thấy ID đơn hàng. Vui lòng kiểm tra lại URL.');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]); // Chỉ phụ thuộc vào orderId

  // Load reviews khi có user và order đã DELIVERED
  useEffect(() => {
    if (user && order?.status?.toUpperCase() === 'DELIVERED') {
      loadUserReviews();
    }
  }, [user, order?.status, loadUserReviews]);

  // Auto-refresh mỗi 30 giây khi đang xem order detail
  useEffect(() => {
    if (!orderId) return;

    const intervalId = setInterval(() => {
      // Silent refresh - không hiển thị loading spinner
      loadOrder(true);
    }, 30000); // 30 giây

    return () => {
      clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const paymentInfo = order?.paymentInfo || {};

  const currentStep = useMemo(() => {
    if (!order?.status) return 0;
    const index = ORDER_STATUS_FLOW.indexOf(order.status.toUpperCase());
    if (index === -1) return 0;
    return index;
  }, [order?.status]);

  const isCancelled = order?.status?.toUpperCase() === 'CANCELLED' || order?.status?.toUpperCase() === 'CANCEL';
  // Đơn hàng đã thanh toán nếu: status là PAID/SHIPPED/DELIVERED hoặc paymentInfo.status là PAID
  const orderStatus = order?.status?.toUpperCase();
  const isPaid = orderStatus === 'PAID' || 
                 orderStatus === 'SHIPPED' || 
                 orderStatus === 'DELIVERED' || 
                 paymentInfo?.status?.toUpperCase() === 'PAID';
  const isDelivered = orderStatus === 'DELIVERED';
  const canConfirmPayment = !isPaid && orderStatus === 'PENDING' && paymentInfo?.status?.toUpperCase() !== 'PAID';
  const canCancelOrder = orderStatus === 'PENDING' && !isPaid && paymentInfo?.status?.toUpperCase() !== 'PAID';

  const handleConfirmPayment = async () => {
    if (!order?.orderId) return;
    try {
      setConfirming(true);
      const response = await confirmPayment(order.orderId);
      setOrder((prev) => ({
        ...(prev || {}),
        ...response,
        status: response?.status || prev?.status,
        paymentInfo: {
          ...(prev?.paymentInfo || {}),
          ...(response?.paymentInfo || {})
        }
      }));
      showSuccess('Thanh toán đã được xác nhận (DEMO).');
    } catch (err) {
      console.error('📦 Order Detail: Error confirming payment', err);
      const message = err?.response?.data?.message || err?.message || 'Không thể xác nhận thanh toán.';
      showError(message);
    } finally {
      setConfirming(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!order?.orderId) return;
    try {
      setCancelling(true);
      await cancelOrder(order.orderId);
      showSuccess('Đơn hàng đã được hủy.');
      loadOrder();
    } catch (err) {
      console.error('📦 Order Detail: Error cancelling order', err);
      const message = err?.response?.data?.message || err?.message || 'Không thể hủy đơn hàng.';
      showError(message);
    } finally {
      setCancelling(false);
    }
  };

  const handleRefreshQR = async () => {
    if (!order?.orderId) return;
    try {
      setRefreshingQR(true);
      const response = await getPaymentQR(order.orderId);
      const qrPayload = response?.paymentInfo || response;
      if (!qrPayload?.qrCodeUrl) {
        throw new Error('Không thể lấy lại mã QR.');
      }
      setOrder((prev) => ({
        ...(prev || {}),
        paymentInfo: {
          ...(prev?.paymentInfo || {}),
          ...qrPayload
        }
      }));
      showSuccess('Đã làm mới mã QR.');
    } catch (err) {
      console.error('📦 Order Detail: Error refreshing QR', err);
      const message = err?.response?.data?.message || err?.message || 'Không thể lấy lại mã QR.';
      showError(message);
    } finally {
      setRefreshingQR(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>Đang tải thông tin đơn hàng...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px' }}>
        <Alert
          message="Không thể tải đơn hàng"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/customer/orders')}>
          Quay lại danh sách đơn hàng
        </Button>
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ padding: '20px' }}>
        <Alert
          message="Không tìm thấy đơn hàng"
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
        />
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/customer/orders')}>
          Quay lại danh sách đơn hàng
        </Button>
      </div>
    );
  }

  const qrUrl = paymentInfo.qrCodeUrl || order.qrCodeUrl || '';

  return (
    <div style={{ padding: '20px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 16, alignItems: 'center' }}>
          <Space size="middle" wrap>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/customer/orders')}>
              Quay lại
            </Button>
            <Button icon={<ReloadOutlined />} onClick={loadOrder}>
              Làm mới
            </Button>
          </Space>
          <Space direction="vertical" size={4}>
            <Title level={3} style={{ margin: 0 }}>
              Đơn hàng {order.orderId}
            </Title>
            <Space size="small" wrap>
              <Tag color={getStatusColor(order.status)}>{getStatusText(order.status)}</Tag>
              {paymentInfo?.status && (
                <Tag color={getPaymentStatusColor(paymentInfo.status)}>{getPaymentStatusText(paymentInfo.status)}</Tag>
              )}
              <Tag color="blue">Tổng tiền: {formatCurrency(order.totalAmount)}</Tag>
            </Space>
          </Space>
        </div>

        {isCancelled ? (
          <Alert
            type="warning"
            showIcon
            message="Đơn hàng đã bị hủy"
            description="Nếu bạn cần hỗ trợ thêm, vui lòng liên hệ đội ngũ chăm sóc khách hàng."
          />
        ) : (
          <Card title="Tiến trình đơn hàng">
            <Steps
              size="small"
              current={currentStep}
              items={ORDER_STATUS_FLOW.map((status) => ({
                title: getStatusText(status),
                status: order.status?.toUpperCase() === status
                  ? 'process'
                  : ORDER_STATUS_FLOW.indexOf(status) < ORDER_STATUS_FLOW.indexOf(order.status?.toUpperCase() || '')
                    ? 'finish'
                    : 'wait'
              }))}
            />
          </Card>
        )}

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={12}>
            <Card
              title="Thông tin thanh toán"
              extra={
                !isPaid && (
                  <Space>
                    {canConfirmPayment && (
                      <Tooltip title="Nhấn khi bạn đã chuyển khoản thành công">
                        <Button
                          type="primary"
                          icon={<CheckOutlined />}
                          loading={confirming}
                          onClick={handleConfirmPayment}
                        >
                          Tôi đã chuyển khoản
                        </Button>
                      </Tooltip>
                    )}
                    <Button
                      icon={<ReloadOutlined />}
                      onClick={handleRefreshQR}
                      loading={refreshingQR}
                      disabled={!qrUrl}
                    >
                      Lấy lại mã QR
                    </Button>
                  </Space>
                )
              }
            >
              {isPaid ? (
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                  <Alert
                    type="success"
                    message="Đơn hàng đã thanh toán thành công"
                    description={`Đơn hàng #${order.orderId} đã được thanh toán vào ${order.updatedAt ? new Date(order.updatedAt).toLocaleString('vi-VN') : 'N/A'}. Cảm ơn bạn đã mua sắm tại PetVibe!`}
                    showIcon
                    icon={<CheckCircleOutlined />}
                  />
                  <div>
                    <Title level={5}>Thông tin thanh toán</Title>
                    <Space direction="vertical" size={4}>
                      <Text><Text strong>Tổng tiền đã thanh toán:</Text> {formatCurrency(order.totalAmount)}</Text>
                      <Text><Text strong>Trạng thái:</Text> <Tag color="green">Đã thanh toán</Tag></Text>
                      {paymentInfo.bankId && (
                        <Text><Text strong>Ngân hàng:</Text> {paymentInfo.bankId}</Text>
                      )}
                      {paymentInfo.accountNo && (
                        <Text><Text strong>Số tài khoản:</Text> {paymentInfo.accountNo}</Text>
                      )}
                      {paymentInfo.description && (
                        <Text><Text strong>Nội dung:</Text> {paymentInfo.description}</Text>
                      )}
                    </Space>
                  </div>
                </Space>
              ) : (
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                  <div style={{ textAlign: 'center' }}>
                    {qrUrl ? (
                      <QRCode value={qrUrl} size={220} />
                    ) : (
                      <Alert
                        type="info"
                        message="Mã QR chưa sẵn sàng"
                        description="Vui lòng làm mới để lấy mã QR thanh toán mới."
                        showIcon
                      />
                    )}
                    <div style={{ marginTop: 12 }}>
                      <Text type="secondary">
                        Quét mã bằng app ngân hàng để chuyển khoản chính xác.
                      </Text>
                    </div>
                  </div>

                  <div>
                    <Title level={5}>Chi tiết chuyển khoản</Title>
                    <Space direction="vertical" size={4}>
                      <Text><Text strong>Ngân hàng:</Text> {paymentInfo.bankId || '---'}</Text>
                      <Text><Text strong>Số tài khoản:</Text> {paymentInfo.accountNo || '---'}</Text>
                      <Text><Text strong>Tên tài khoản:</Text> {paymentInfo.accountName || '---'}</Text>
                      <Text><Text strong>Số tiền:</Text> {formatCurrency(paymentInfo.amount ?? order.totalAmount)}</Text>
                      <Text><Text strong>Nội dung:</Text> {paymentInfo.description || `Thanh toan don hang ${order.orderId}`}</Text>
                      {paymentInfo.message && (
                        <Text type="secondary">{paymentInfo.message}</Text>
                      )}
                    </Space>
                  </div>
                </Space>
              )}
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card title="Thông tin giao hàng" extra={<Tag color="geekblue">📞 {order.phoneContact}</Tag>}>
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <Text><Text strong>Địa chỉ:</Text> {order.shippingAddress}</Text>
                {order.note && <Text><Text strong>Ghi chú:</Text> {order.note}</Text>}
                <Divider style={{ margin: '12px 0' }} />
                <Text type="secondary">Tạo lúc: {order.createdAt ? new Date(order.createdAt).toLocaleString('vi-VN') : '--'}</Text>
                <Text type="secondary">Cập nhật: {order.updatedAt ? new Date(order.updatedAt).toLocaleString('vi-VN') : '--'}</Text>
              </Space>
            </Card>
          </Col>
        </Row>

        <Card title="Sản phẩm trong đơn">
          {order.items && order.items.length > 0 ? (
            <List
              dataSource={order.items}
              renderItem={(item) => {
                const productId = item.productId || item.product?.id;
                // Kiểm tra xem sản phẩm đã được review chưa
                const hasReviewed = userReviews.some(
                  review => review.productId === productId && !review.isDeleted
                );
                
                return (
                  <List.Item
                    actions={
                      isDelivered
                        ? hasReviewed
                          ? [
                              <Tag key="reviewed" color="green" icon={<CheckCircleOutlined />}>
                                Đã đánh giá
                              </Tag>
                            ]
                          : [
                              <Button
                                key="review"
                                type="link"
                                icon={<StarOutlined />}
                                onClick={() => {
                                  setSelectedProductForReview(item);
                                  setReviewModalVisible(true);
                                  reviewForm.resetFields();
                                }}
                                style={{ color: 'var(--pv-primary, #eda274)' }}
                              >
                                Đánh giá
                              </Button>
                            ]
                        : []
                    }
                >
                  <List.Item.Meta
                    title={
                      <Space size={12} wrap>
                        <Text strong>{item.productName || item.product?.name || `Sản phẩm ${item.productId}`}</Text>
                        <Tag>SL: {item.quantity}</Tag>
                      </Space>
                    }
                    description={
                      <Space direction="vertical" size={0}>
                        <Text>Đơn giá: {formatCurrency(item.price || item.product?.price)}</Text>
                        <Text type="secondary">Thành tiền: {formatCurrency((item.price || item.product?.price || 0) * (item.quantity || 0))}</Text>
                      </Space>
                    }
                  />
                </List.Item>
                );
              }}
            />
          ) : (
            <Alert type="info" message="Đơn hàng không có sản phẩm." showIcon />
          )}
        </Card>

        <Space size="middle" wrap>
          {canCancelOrder && (
            <Button
              danger
              icon={<CloseCircleOutlined />}
              onClick={handleCancelOrder}
              loading={cancelling}
            >
              Hủy đơn hàng
            </Button>
          )}
          {!canConfirmPayment && (
            <Tag color="green" icon={<CheckCircleOutlined />}>Đơn hàng đã thanh toán</Tag>
          )}
          {isDelivered && (
            <Tag color="blue" icon={<StarOutlined />}>Đơn hàng đã giao - Bạn có thể đánh giá sản phẩm</Tag>
          )}
        </Space>
      </Space>

      {/* Review Modal */}
      <Modal
        title={`Đánh giá sản phẩm: ${selectedProductForReview?.productName || selectedProductForReview?.product?.name || 'Sản phẩm'}`}
        open={reviewModalVisible}
        onCancel={() => {
          setReviewModalVisible(false);
          setSelectedProductForReview(null);
          reviewForm.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={reviewForm}
          layout="vertical"
          onFinish={async (values) => {
            if (!selectedProductForReview || !user) return;

            try {
              setSubmittingReview(true);
              const reviewData = {
                productId: selectedProductForReview.productId || selectedProductForReview.product?.id,
                rating: values.rating,
                comment: values.comment,
                userId: user.id || user.userId
              };
              
              await createReview(reviewData);
              showSuccess('Đánh giá của bạn đã được gửi thành công!');
              setReviewModalVisible(false);
              setSelectedProductForReview(null);
              reviewForm.resetFields();
              // Reload reviews để cập nhật UI
              await loadUserReviews();
            } catch (err) {
              console.error('⭐ OrderDetail: Error submitting review', err);
              const message = err?.response?.data?.message || err?.message || 'Không thể gửi đánh giá.';
              showError(message);
            } finally {
              setSubmittingReview(false);
            }
          }}
        >
          <Form.Item
            name="rating"
            label="Đánh giá của bạn (1-5 sao)"
            rules={[{ required: true, message: 'Vui lòng chọn số sao từ 1-5' }]}
          >
            <Rate allowClear />
          </Form.Item>
          <Form.Item
            name="comment"
            label="Nhận xét"
            rules={[
              { required: true, message: 'Vui lòng nhập nhận xét' },
              { min: 10, message: 'Nhận xét phải có ít nhất 10 ký tự' }
            ]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
              maxLength={500}
              showCount
            />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={submittingReview}
                icon={<StarOutlined />}
              >
                Gửi đánh giá
              </Button>
              <Button
                onClick={() => {
                  setReviewModalVisible(false);
                  setSelectedProductForReview(null);
                  reviewForm.resetFields();
                }}
              >
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}


