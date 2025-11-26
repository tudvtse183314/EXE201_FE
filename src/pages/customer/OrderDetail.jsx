import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
  Tooltip
} from 'antd';
import {
  ArrowLeftOutlined,
  ReloadOutlined,
  CheckOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { useToast } from '../../context/ToastContext';
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

const { Title, Text } = Typography;

const formatCurrency = (value) => {
  if (typeof value !== 'number') return '--';
  return `${value.toLocaleString('vi-VN')}đ`;
};

export default function OrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError, showWarning } = useToast();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const [refreshingQR, setRefreshingQR] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const loadOrder = useCallback(async () => {
    if (!orderId) return;

    try {
      setLoading(true);
      setError(null);
      const response = await getOrderById(orderId);
      setOrder(response);
    } catch (err) {
      console.error('📦 Order Detail: Error fetching order', err);
      const message = err?.response?.data?.message || err?.message || 'Không thể tải thông tin đơn hàng.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  const paymentInfo = order?.paymentInfo || {};

  const currentStep = useMemo(() => {
    if (!order?.status) return 0;
    const index = ORDER_STATUS_FLOW.indexOf(order.status.toUpperCase());
    if (index === -1) return 0;
    return index;
  }, [order?.status]);

  const isCancelled = order?.status?.toUpperCase() === 'CANCELLED' || order?.status?.toUpperCase() === 'CANCEL';
  const canConfirmPayment = paymentInfo?.status?.toUpperCase() !== 'PAID';
  const canCancelOrder = order?.status?.toUpperCase() === 'PENDING' && paymentInfo?.status?.toUpperCase() !== 'PAID';

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
              <Tag color={getPaymentStatusColor(paymentInfo.status)}>{getPaymentStatusText(paymentInfo.status)}</Tag>
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
              }
            >
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
              renderItem={(item) => (
                <List.Item>
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
              )}
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
        </Space>
      </Space>
    </div>
  );
}


