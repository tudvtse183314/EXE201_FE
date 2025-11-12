// src/pages/public/Checkout.jsx
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Row,
  Col,
  Button,
  Form,
  Input,
  Typography,
  Divider,
  Space,
  Alert,
  Tag,
  Spin
} from 'antd';
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  createOrder,
  confirmPayment as confirmPaymentApi,
  getPaymentQR,
  getOrderById,
  getStatusColor,
  getStatusText,
  getPaymentStatusColor,
  getPaymentStatusText
} from '../../services/orders';

const { Title, Text } = Typography;
const { TextArea } = Input;

const formatCurrency = (value) => {
  if (typeof value !== 'number') return '--';
  return `${value.toLocaleString('vi-VN')}đ`;
};

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { showSuccess, showError, showWarning } = useToast();
  const [form] = Form.useForm();

  const [submitting, setSubmitting] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [refreshingQR, setRefreshingQR] = useState(false);
  const [order, setOrder] = useState(null);
  const [polling, setPolling] = useState(false);
  const [qrImageError, setQrImageError] = useState(false);
  
  const pollingIntervalRef = useRef(null);
  const isMountedRef = useRef(true);
    // FIX: Dùng ref để persist order state khi component remount
    const orderRef = useRef(null);

  const totalPrice = useMemo(() => getTotalPrice(), [cartItems, getTotalPrice]);
  
  // Polling để tự động kiểm tra trạng thái thanh toán mỗi 5s
  useEffect(() => {
    if (!order?.orderId || !polling) {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      return;
    }

    const paymentStatus = order?.paymentInfo?.status || order?.status;
    const orderStatus = order?.status;
    
    // Dừng polling nếu đã thanh toán thành công
    if (paymentStatus === 'COMPLETED' || orderStatus === 'PAID') {
      setPolling(false);
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      return;
    }

    // Bắt đầu polling
    pollingIntervalRef.current = setInterval(async () => {
      if (!isMountedRef.current) return;
      
      try {
        console.log('💳 Checkout: Polling order status', order.orderId);
        const updatedOrder = await getOrderById(order.orderId);
        
        if (!isMountedRef.current) return;
        
        const updatedPaymentStatus = updatedOrder?.paymentInfo?.status;
        const updatedOrderStatus = updatedOrder?.status;
        
        setOrder(updatedOrder);
        
        // Nếu thanh toán thành công, dừng polling và xóa cart
        if (updatedPaymentStatus === 'COMPLETED' || updatedOrderStatus === 'PAID') {
          setPolling(false);
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
          }
          
          showSuccess('Thanh toán thành công! Đơn hàng của bạn đã được xác nhận.');
          
          // Xóa cart sau khi thanh toán thành công
          try {
            console.log('💳 Checkout: Payment completed, clearing cart...');
            await clearCart();
            console.log('💳 Checkout: Cart cleared successfully after payment confirmation');
            // FIX: Clear localStorage sau khi thanh toán thành công
            try {
              localStorage.removeItem('lastOrder');
            } catch (e) {
              console.warn('💳 Checkout: Cannot clear localStorage', e);
            }
          } catch (clearError) {
            console.warn('💳 Checkout: Không thể làm trống giỏ hàng sau khi thanh toán', clearError);
          }
        }
      } catch (err) {
        console.error('💳 Checkout: Error polling order status', err);
        // Không hiển thị lỗi cho user khi polling để tránh spam
      }
    }, 5000); // Poll mỗi 5 giây

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [order?.orderId, polling, order?.paymentInfo?.status, order?.status, clearCart, showSuccess]);
  
  // Cleanup khi component unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, []);
  
  // FIX: Hydrate order từ localStorage khi component mount (nếu có)
  useEffect(() => {
    // Chỉ hydrate nếu chưa có order và chưa có orderRef
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (!orderRef.current) {
      try {
        const savedOrder = localStorage.getItem('lastOrder');
        if (savedOrder) {
          const parsedOrder = JSON.parse(savedOrder);
          // Chỉ restore nếu order còn hợp lệ (có orderId)
          if (parsedOrder?.orderId) {
            console.log('💳 Checkout: Hydrating order from localStorage', {
              orderId: parsedOrder.orderId
            });
            orderRef.current = parsedOrder;
            setOrder(parsedOrder);
          }
        }
      } catch (e) {
        console.warn('💳 Checkout: Cannot parse saved order from localStorage', e);
      }
    }
  }, []); // Chỉ chạy 1 lần khi mount

  // Debug: Log khi order state thay đổi và sync với ref + localStorage
  useEffect(() => {
    if (order) {
      // Sync với ref và localStorage để persist khi component remount
      orderRef.current = order;
      try {
        localStorage.setItem('lastOrder', JSON.stringify(order));
      } catch (e) {
        console.warn('💳 Checkout: Cannot save order to localStorage', e);
      }
      console.log('💳 Checkout: Order state changed', {
        orderId: order.orderId,
        hasPaymentInfo: !!order.paymentInfo,
        qrCodeUrl: order.paymentInfo?.qrCodeUrl,
        paymentInfo: order.paymentInfo
      });
    } else {
      // FIX: Nếu order state bị reset nhưng ref vẫn có, restore từ ref
      if (orderRef.current && !order) {
        console.warn('💳 Checkout: Order state was reset, restoring from ref', {
          orderId: orderRef.current.orderId
        });
        // Restore state ngay lập tức (dùng setTimeout để tránh update trong render)
        setTimeout(() => {
          setOrder(orderRef.current);
        }, 0);
        return;
      }
      console.log('💳 Checkout: Order state is null');
    }
  }, [order]);

  // FIX: useEffect riêng để scroll đến QR code sau khi order được set/restore
  useEffect(() => {
    if (order?.orderId) {
      // Delay để đảm bảo DOM đã render
      const timer = setTimeout(() => {
        const qrContainer = document.getElementById('qr-code-container');
        if (qrContainer) {
          qrContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
          console.log('💳 Checkout: Scrolled to QR code container');
        } else {
          // Retry nếu chưa tìm thấy container
          setTimeout(() => {
            const retryContainer = document.getElementById('qr-code-container');
            if (retryContainer) {
              retryContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
              console.log('💳 Checkout: Scrolled to QR code container (retry)');
            }
          }, 500);
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [order?.orderId]);

  const buildOrderPayload = (values) => {
    const items = cartItems
      .map((item) => {
        const productId = item.productId || item.product?.id || item.id;
        if (!productId) return null;
        // Backend tự tính price từ Product entity, không cần gửi price
        return {
          productId,
          quantity: item.quantity
        };
      })
      .filter(Boolean);

    // NOTE: Backend hiện tại yêu cầu accountId trong request body
    // TODO: Sửa backend để lấy accountId từ JWT token (SecurityContext) thay vì request body
    // Tạm thời: Gửi accountId từ FE nhưng validate từ user context để đảm bảo security
    // Backend sẽ validate accountId từ JWT token trong tương lai
    return {
      accountId: user?.id, // TODO: Remove khi backend sửa để lấy từ JWT
      shippingAddress: values.address?.trim(),
      phoneContact: values.phone?.trim(),
      note: values.note?.trim(),
      items
    };
  };

  const handleSubmit = async (values) => {
    // FIX: Prevent double submit
    if (submitting) {
      console.warn('💳 Checkout: Submit already in progress, ignoring duplicate submit');
      return;
    }

    if (!user?.id) {
      showWarning('Vui lòng đăng nhập trước khi đặt hàng.');
      navigate('/login');
      return;
    }

    if (!cartItems.length) {
      showWarning('Giỏ hàng của bạn đang trống.');
      return;
    }

    const payload = buildOrderPayload(values);
    if (!payload.items.length) {
      showError('Không thể xác định sản phẩm trong giỏ hàng.');
      return;
    }

    try {
      setSubmitting(true);
      console.log('💳 Checkout: Creating order', payload);
      const response = await createOrder(payload);
      
      // ĐÚNG: response đã là data (không phải response.data)
      // Service đã unwrap response.data rồi
      const createdOrder = response;

      if (!createdOrder?.orderId) {
        throw new Error('Dữ liệu đơn hàng trả về không hợp lệ.');
      }

      // Debug: Kiểm tra paymentInfo và qrCodeUrl
      console.log('💳 Checkout: Order created - FULL RESPONSE', {
        orderId: createdOrder.orderId,
        hasPaymentInfo: !!createdOrder.paymentInfo,
        paymentInfo: createdOrder.paymentInfo,
        qrCodeUrl: createdOrder.paymentInfo?.qrCodeUrl,
        qrCodeUrlType: typeof createdOrder.paymentInfo?.qrCodeUrl,
        qrCodeUrlLength: createdOrder.paymentInfo?.qrCodeUrl?.length,
        allPaymentInfoKeys: createdOrder.paymentInfo ? Object.keys(createdOrder.paymentInfo) : []
      });

      // FIX: Cải thiện error handling cho paymentInfo null
      if (!createdOrder.paymentInfo) {
        const errorMsg = 'Không thể tạo thông tin thanh toán. Vui lòng thử lại sau.';
        console.error('💳 Checkout: Order created but no paymentInfo', createdOrder);
        showError(errorMsg);
        // Vẫn set order để user có thể thấy order đã tạo, nhưng không có QR code
        // User có thể refresh QR sau
      } else if (!createdOrder.paymentInfo?.qrCodeUrl) {
        const errorMsg = 'Không thể tạo mã QR thanh toán. Vui lòng thử lại sau.';
        console.error('💳 Checkout: Order created but no qrCodeUrl in paymentInfo', {
          paymentInfo: createdOrder.paymentInfo,
          allKeys: createdOrder.paymentInfo ? Object.keys(createdOrder.paymentInfo) : []
        });
        showError(errorMsg);
        // Vẫn set order, user có thể dùng "Lấy lại mã QR"
      }

      // ĐÚNG: setOrder với response trực tiếp (không phải response.data)
      // FIX: Set vào ref TRƯỚC để persist khi component remount
      // Đảm bảo ref được set trước để render condition có thể check ngay
      orderRef.current = createdOrder;
      
      // FIX: Backup vào localStorage để sống sót qua remount
      try {
        localStorage.setItem('lastOrder', JSON.stringify(createdOrder));
      } catch (e) {
        console.warn('💳 Checkout: Cannot save order to localStorage', e);
      }
      
      console.log('💳 Checkout: Order ref set', {
        orderId: orderRef.current.orderId,
        hasPaymentInfo: !!orderRef.current.paymentInfo,
        qrCodeUrl: orderRef.current.paymentInfo?.qrCodeUrl
      });
      
      // Set state sau khi ref đã được set
      // FIX: Dùng functional update để đảm bảo state được set đúng
      setOrder(() => createdOrder);
      // Reset QR image error khi có order mới
      setQrImageError(false);
      
      console.log('💳 Checkout: Order state set, component should re-render', {
        orderId: createdOrder.orderId,
        orderStateSet: true,
        orderRefSet: !!orderRef.current,
        hasPaymentInfo: !!createdOrder.paymentInfo,
        qrCodeUrl: createdOrder.paymentInfo?.qrCodeUrl
      });
      
      // FIX: Delay showSuccess một chút để đảm bảo state đã được set và component đã re-render
      setTimeout(() => {
        showSuccess('Đặt hàng thành công. Vui lòng quét mã QR và hoàn tất thanh toán.');
      }, 100);
      
      // Scroll sẽ được handle bởi useEffect riêng khi order.orderId thay đổi
      
      // Bắt đầu polling để tự động kiểm tra trạng thái thanh toán
      setPolling(true);
      
      // KHÔNG xóa cart ở đây - chỉ xóa sau khi thanh toán thành công
      // Cart sẽ được xóa trong handleConfirmPayment hoặc khi polling phát hiện thanh toán thành công
    } catch (error) {
      console.error('💳 Checkout: Error creating order', error);
      
      // Xử lý lỗi theo từng loại
      let message = 'Không thể tạo đơn hàng.';
      
      // Kiểm tra CORS/Network errors
      if (error?.code === 'ERR_NETWORK' || error?.message === 'Network Error') {
        if (error?.message?.includes('CORS') || error?.response === undefined) {
          message = 'Lỗi kết nối: Server không phản hồi hoặc có vấn đề về CORS. Vui lòng thử lại sau hoặc liên hệ admin.';
          console.error('💳 Checkout: CORS/Network error', {
            code: error?.code,
            message: error?.message,
            response: error?.response
          });
        } else {
          message = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng và thử lại.';
        }
      } else if (error?.response?.status === 0 || error?.response?.status === undefined) {
        // Request bị block hoặc server không phản hồi
        message = 'Server không phản hồi. Có thể server đang bảo trì hoặc có vấn đề kết nối. Vui lòng thử lại sau.';
      } else if (error?.response?.status === 401 || error?.response?.status === 403) {
        message = 'Bạn cần đăng nhập hoặc không đủ quyền.';
        navigate('/login');
      } else if (error?.response?.status === 400) {
        const errorData = error?.response?.data;
        if (errorData?.message?.toLowerCase().includes('stock') || errorData?.message?.toLowerCase().includes('số lượng')) {
          message = 'Số lượng sản phẩm vượt quá tồn kho. Vui lòng kiểm tra lại giỏ hàng.';
        } else {
          message = errorData?.message || 'Dữ liệu đơn hàng không hợp lệ.';
        }
      } else if (error?.response?.status === 409) {
        message = 'Số lượng sản phẩm không đủ trong kho.';
      } else if (error?.response?.status === 520) {
        message = 'Server đang gặp sự cố (520). Vui lòng thử lại sau vài phút.';
      } else if (error?.response?.status >= 500) {
        message = 'Đã có lỗi hệ thống. Vui lòng thử lại sau.';
      } else {
        message = error?.response?.data?.message || error?.message || message;
      }
      
      showError(message);
      // FIX: Clear localStorage nếu có lỗi để tránh stale data
      try {
        localStorage.removeItem('lastOrder');
      } catch (e) {
        console.warn('💳 Checkout: Cannot clear localStorage', e);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!order?.orderId) return;

    try {
      setConfirming(true);
      console.log('💳 Checkout: Confirming payment for order', order.orderId);
      const response = await confirmPaymentApi(order.orderId);
      console.log('💳 Checkout: Payment confirmed', response);
      
      // Cập nhật order với response mới (status: PAID, paymentInfo.status: COMPLETED)
      const updatedOrder = {
        ...order,
        ...response,
        status: response?.status || order.status,
        paymentInfo: {
          ...(order.paymentInfo || {}),
          ...(response?.paymentInfo || {}),
          status: response?.paymentInfo?.status || 'COMPLETED'
        }
      };
      
      setOrder(updatedOrder);
      
      // Dừng polling vì đã xác nhận thanh toán
      setPolling(false);
      
      showSuccess('Thanh toán thành công! Đơn hàng của bạn đã được xác nhận.');
      
      // Chỉ xóa cart sau khi thanh toán thành công (paymentInfo.status = COMPLETED)
      const paymentStatus = updatedOrder.paymentInfo?.status || response?.paymentInfo?.status;
      if (paymentStatus === 'COMPLETED') {
        try {
          console.log('💳 Checkout: Payment completed, clearing cart...');
          await clearCart();
          console.log('💳 Checkout: Cart cleared successfully after payment confirmation');
          // FIX: Clear localStorage sau khi thanh toán thành công
          try {
            localStorage.removeItem('lastOrder');
          } catch (e) {
            console.warn('💳 Checkout: Cannot clear localStorage', e);
          }
        } catch (clearError) {
          console.warn('💳 Checkout: Không thể làm trống giỏ hàng sau khi thanh toán', clearError);
          // Không throw error vì order đã được confirm thành công
        }
      }
    } catch (error) {
      console.error('💳 Checkout: Error confirming payment', error);
      
      // Xử lý lỗi theo từng loại
      let message = 'Không thể xác nhận thanh toán.';
      
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        message = 'Bạn cần đăng nhập hoặc không đủ quyền.';
      } else if (error?.response?.status === 400) {
        message = error?.response?.data?.message || 'Dữ liệu không hợp lệ.';
      } else if (error?.response?.status >= 500) {
        message = 'Đã có lỗi hệ thống. Vui lòng thử lại sau.';
      } else {
        message = error?.response?.data?.message || error?.message || message;
      }
      
      showError(message);
    } finally {
      setConfirming(false);
    }
  };

  const handleRefreshQR = async () => {
    if (!order?.orderId) return;
    try {
      setRefreshingQR(true);
      const response = await getPaymentQR(order.orderId);
      const qrPayload = response?.paymentInfo || response;
      if (!qrPayload?.qrCodeUrl) {
        throw new Error('Không lấy được mã QR mới.');
      }
      // FIX: Cập nhật cả state và ref để đảm bảo QR code mới được render
      setOrder((prev) => {
        const updated = {
          ...(prev || {}),
          paymentInfo: {
            ...(prev?.paymentInfo || {}),
            ...qrPayload
          }
        };
        // Sync với ref để persist khi component remount
        orderRef.current = updated;
        return updated;
      });
      showSuccess('Đã làm mới mã QR thành công.');
    } catch (error) {
      console.error('💳 Checkout: Error refreshing QR', error);
      const message = error?.response?.data?.message || error?.message || 'Không thể lấy lại mã QR.';
      showError(message);
    } finally {
      setRefreshingQR(false);
    }
  };

  const renderOrderSuccess = (currentOrder = null) => {
    // FIX: Sử dụng currentOrder được truyền vào (có thể từ ref) thay vì chỉ order state
    const orderToRender = currentOrder || order || orderRef.current;
    const paymentInfo = orderToRender?.paymentInfo || {};
    // FIX: Chỉ đọc qrCodeUrl từ paymentInfo (theo API response)
    const qrUrl = paymentInfo.qrCodeUrl || '';
    const paymentStatus = paymentInfo.status || 'PENDING';
    const orderStatus = orderToRender?.status || 'PENDING';
    const isPaymentCompleted = paymentStatus === 'COMPLETED';
    const isOrderPaid = orderStatus === 'PAID';
    
    // Debug: Log QR URL để kiểm tra
    console.log('💳 Checkout: Rendering QR code', {
      orderId: orderToRender?.orderId,
      hasPaymentInfo: !!paymentInfo,
      qrCodeUrl: paymentInfo.qrCodeUrl, // <-- Đọc trực tiếp từ paymentInfo
      qrUrl: qrUrl,
      willRenderQR: !!(qrUrl && qrUrl.trim())
    });

    return (
      <div style={{ padding: '20px' }}>
        <Card>
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            {isPaymentCompleted && isOrderPaid ? (
              <>
                <CheckCircleOutlined style={{ fontSize: 64, color: '#52c41a', marginBottom: 16 }} />
                <Title level={2} style={{ color: '#52c41a' }}>
                  Thanh toán thành công!
                </Title>
                <Text style={{ fontSize: 16, color: '#666' }}>
                  Đơn hàng của bạn đã được thanh toán thành công. Chúng tôi sẽ xử lý và giao hàng sớm nhất.
                </Text>
              </>
            ) : (
              <>
                <CheckCircleOutlined style={{ fontSize: 64, color: '#1890ff', marginBottom: 16 }} />
                <Title level={2} style={{ color: '#1890ff' }}>
                  Đặt hàng thành công!
                </Title>
                <Text style={{ fontSize: 16, color: '#666' }}>
                  Vui lòng quét mã QR bên dưới và chuyển khoản đúng số tiền, nội dung.
                </Text>
              </>
            )}

            <div style={{ marginTop: 24 }}>
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div>
                  <Text strong>Mã đơn hàng:</Text> <Text code>{orderToRender.orderId}</Text>
                </div>
                <div>
                  <Text strong>Trạng thái đơn:</Text>{' '}
                  <Tag color={getStatusColor(orderToRender.status)}>{getStatusText(orderToRender.status)}</Tag>
                </div>
                <div>
                  <Text strong>Trạng thái thanh toán:</Text>{' '}
                  <Tag color={getPaymentStatusColor(paymentInfo.status)}>
                    {getPaymentStatusText(paymentInfo.status)}
                  </Tag>
                </div>
              </Space>
            </div>

            <div style={{ marginTop: 32, scrollMarginTop: '20px' }}>
              <Title level={4} style={{ marginBottom: '16px' }}>Mã QR thanh toán</Title>
              <div
                id="qr-code-container"
                style={{
                  background: '#f9f9f9',
                  padding: '20px',
                  borderRadius: '12px',
                  margin: '16px auto',
                  maxWidth: 400,
                  minHeight: '300px',
                  border: '2px solid #e8e8e8'
                }}
              >
                {(() => {
                  // Đọc qrCodeUrl từ paymentInfo và render ảnh trực tiếp từ URL
                  const trimmedUrl = qrUrl?.trim();
                  const hasUrl = !!(trimmedUrl && trimmedUrl.length > 0);
                  
                  console.log('💳 Checkout: QR URL check in render', {
                    qrCodeUrl: paymentInfo.qrCodeUrl,
                    trimmedUrl,
                    hasUrl
                  });
                  
                  if (!hasUrl) {
                    return (
                      <div style={{ padding: '40px 0', textAlign: 'center' }}>
                        <Spin size="large" />
                        <div style={{ marginTop: '16px' }}>
                          <Text type="secondary">Đang tải mã QR...</Text>
                          {orderToRender?.orderId && (
                            <div style={{ marginTop: '12px' }}>
                              <Button
                                type="primary"
                                size="small"
                                onClick={handleRefreshQR}
                                loading={refreshingQR}
                              >
                                Lấy lại mã QR
                              </Button>
                            </div>
                          )}
                        </div>
                        {process.env.NODE_ENV === 'development' && (
                          <div style={{ marginTop: '16px', fontSize: '11px', color: '#999' }}>
                            <div>Order ID: {orderToRender?.orderId || 'N/A'}</div>
                            <div>Has paymentInfo: {orderToRender?.paymentInfo ? 'Yes' : 'No'}</div>
                            <div>qrCodeUrl: {orderToRender?.paymentInfo?.qrCodeUrl || 'N/A'}</div>
                          </div>
                        )}
                      </div>
                    );
                  }
                  
                  return (
                    <>
                      {/* Hiển thị QR code từ image URL trực tiếp */}
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center',
                        marginBottom: '16px',
                        minHeight: '250px'
                      }}>
                        {!qrImageError ? (
                          <div style={{ 
                            position: 'relative',
                            display: 'inline-block'
                          }}>
                            {/* CHECKLIST: Debug output ngay trên img */}
                            {process.env.NODE_ENV === 'development' && (
                              <pre style={{ 
                                fontSize: '10px', 
                                color: '#666', 
                                background: '#f0f0f0',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                marginBottom: '8px',
                                wordBreak: 'break-all',
                                maxWidth: '250px',
                                overflow: 'auto'
                              }}>
                                {trimmedUrl || 'NO URL'}
                              </pre>
                            )}
                            <img
                              key={`${orderToRender?.orderId}-${qrUrl}`} // FIX: Force re-render khi orderId hoặc qrCodeUrl thay đổi
                              src={trimmedUrl || ''}
                              alt="QR Code thanh toán"
                              style={{
                                width: '250px',
                                height: '250px',
                                border: '2px solid #e8e8e8',
                                borderRadius: '12px',
                                backgroundColor: '#fff',
                                padding: '12px',
                                objectFit: 'contain',
                                display: 'block',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                              }}
                              onError={(e) => {
                                console.error('💳 Checkout: Error loading QR image', {
                                  src: e.target.src,
                                  naturalWidth: e.target.naturalWidth,
                                  naturalHeight: e.target.naturalHeight,
                                  complete: e.target.complete,
                                  error: e,
                                  attemptedUrl: trimmedUrl
                                });
                                setQrImageError(true);
                              }}
                              onLoad={(e) => {
                                console.log('💳 Checkout: QR image loaded successfully', {
                                  src: e.target.src,
                                  naturalWidth: e.target.naturalWidth,
                                  naturalHeight: e.target.naturalHeight,
                                  complete: e.target.complete,
                                  width: '250px',
                                  height: '250px'
                                });
                                setQrImageError(false);
                              }}
                            />
                            {process.env.NODE_ENV === 'development' && (
                              <div style={{
                                position: 'absolute',
                                bottom: '-20px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                fontSize: '10px',
                                color: '#999',
                                whiteSpace: 'nowrap'
                              }}>
                                ✅ Image loaded
                              </div>
                            )}
                          </div>
                        ) : (
                          <div style={{ 
                            width: '250px', 
                            height: '250px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            border: '2px solid #ffccc7',
                            borderRadius: '12px',
                            backgroundColor: '#fff1f0',
                            padding: '16px'
                          }}>
                            <Alert
                              type="warning"
                              message="Không thể tải QR code"
                              description={
                                <div>
                                  <p>Vui lòng nhấn nút bên dưới để mở QR code</p>
                                  <p style={{ fontSize: '10px', marginTop: '8px', color: '#999' }}>
                                    URL: {trimmedUrl.substring(0, 80)}...
                                  </p>
                                </div>
                              }
                              showIcon
                              style={{ fontSize: '12px' }}
                            />
                          </div>
                        )}
                      </div>
                      {/* Nút mở QR code trong tab mới */}
                      <div style={{ marginTop: '16px', textAlign: 'center' }}>
                        <Button
                          type="primary"
                          size="small"
                          onClick={() => {
                            console.log('💳 Checkout: Opening QR code in new tab', trimmedUrl);
                            window.open(trimmedUrl, '_blank', 'noopener,noreferrer');
                          }}
                          style={{ fontSize: '13px' }}
                        >
                          🔗 Mở QR code trong tab mới
                        </Button>
                      </div>
                      {/* Debug info - chỉ hiển thị trong development */}
                      {process.env.NODE_ENV === 'development' && (
                        <div style={{ 
                          marginTop: '12px', 
                          padding: '8px',
                          backgroundColor: '#f0f0f0',
                          borderRadius: '4px',
                          fontSize: '10px', 
                          color: '#666', 
                          wordBreak: 'break-all' 
                        }}>
                          <div><strong>URL length:</strong> {trimmedUrl?.length || 0}</div>
                          <div><strong>URL:</strong> {trimmedUrl || 'N/A'}</div>
                          <div><strong>Has paymentInfo:</strong> {!!paymentInfo ? 'Yes' : 'No'}</div>
                          <div><strong>qrCodeUrl:</strong> {paymentInfo.qrCodeUrl || 'N/A'}</div>
                          <div><strong>qrImageError:</strong> {qrImageError ? 'Yes' : 'No'}</div>
                          <div><strong>Image src:</strong> {trimmedUrl || 'N/A'}</div>
                        </div>
                      )}
                    </>
                  );
                })()}
                <div style={{ marginTop: '16px', textAlign: 'center' }}>
                  <Text strong style={{ display: 'block', marginBottom: '8px', color: '#eda274' }}>
                    Số tiền: {formatCurrency(paymentInfo.amount ?? orderToRender.totalAmount)}
                  </Text>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    Quét bằng ứng dụng ngân hàng để thanh toán tự động chính xác.
                  </Text>
                </div>
              </div>

              <div
                style={{
                  background: '#fff7e6',
                  padding: '16px',
                  borderRadius: '8px',
                  marginTop: '16px',
                  border: '1px solid #ffd591',
                  textAlign: 'left'
                }}
              >
                <Title level={5} style={{ margin: '0 0 12px 0' }}>Thông tin chuyển khoản</Title>
                <div style={{ fontSize: '14px' }}>
                  <div><Text strong>Ngân hàng:</Text> {paymentInfo.bankId || '---'}</div>
                  <div><Text strong>Số tài khoản:</Text> {paymentInfo.accountNo || '---'}</div>
                  <div><Text strong>Tên tài khoản:</Text> {paymentInfo.accountName || '---'}</div>
                  <div><Text strong>Số tiền:</Text> {formatCurrency(paymentInfo.amount ?? orderToRender.totalAmount)}</div>
                  <div><Text strong>Nội dung:</Text> {paymentInfo.description || `Thanh toan don hang ${orderToRender.orderId}`}</div>
                  {paymentInfo.message && (
                    <div style={{ marginTop: 8 }}>
                      <Text type="secondary">{paymentInfo.message}</Text>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div style={{ marginTop: 32 }}>
              {polling && (
                <Alert
                  type="info"
                  message="Đang tự động kiểm tra trạng thái thanh toán..."
                  description="Hệ thống đang kiểm tra mỗi 5 giây. Bạn có thể đóng trang này và quay lại sau."
                  showIcon
                  style={{ marginBottom: 16 }}
                />
              )}
              <Space wrap size="middle" align="center" style={{ justifyContent: 'center' }}>
                {paymentStatus !== 'COMPLETED' && paymentStatus !== 'FAILED' && paymentStatus !== 'EXPIRED' && (
                  <Button
                    type="primary"
                    loading={confirming}
                    onClick={handleConfirmPayment}
                  >
                    Tôi đã chuyển khoản
                  </Button>
                )}
                {(paymentStatus === 'FAILED' || paymentStatus === 'EXPIRED') && (
                  <Button
                    type="primary"
                    icon={<ReloadOutlined />}
                    loading={refreshingQR}
                    onClick={handleRefreshQR}
                  >
                    Nhận QR mới
                  </Button>
                )}
                {paymentStatus !== 'FAILED' && paymentStatus !== 'EXPIRED' && (
                  <Button
                    icon={<ReloadOutlined />}
                    loading={refreshingQR}
                    onClick={handleRefreshQR}
                  >
                    Lấy lại mã QR
                  </Button>
                )}
                <Button type="default" onClick={() => navigate(`/customer/orders/${orderToRender.orderId}`)}>
                  Xem chi tiết đơn hàng
                </Button>
                <Button onClick={() => navigate('/shop')}>
                  Tiếp tục mua sắm
                </Button>
              </Space>
            </div>
          </div>
        </Card>
      </div>
    );
  };
  // Render order success page nếu có order (check cả state, ref và localStorage)
  // FIX: Ưu tiên check ref trước để đảm bảo render ngay cả khi state bị reset
  // FIX: Fallback to localStorage nếu cả state và ref đều null
  let currentOrder = orderRef.current || order;
  
  // Nếu vẫn không có, thử hydrate từ localStorage
  if (!currentOrder) {
    try {
      const savedOrder = localStorage.getItem('lastOrder');
      if (savedOrder) {
        const parsedOrder = JSON.parse(savedOrder);
        if (parsedOrder?.orderId) {
          console.log('💳 Checkout: Using order from localStorage', {
            orderId: parsedOrder.orderId
          });
          currentOrder = parsedOrder;
          // Restore vào ref và state
          orderRef.current = parsedOrder;
          setTimeout(() => setOrder(parsedOrder), 0);
        }
      }
    } catch (e) {
      console.warn('💳 Checkout: Cannot parse saved order from localStorage', e);
    }
  }
  
  if (currentOrder && currentOrder.orderId) {
    console.log('💳 Checkout: Rendering order success page', {
      orderId: currentOrder.orderId,
      hasPaymentInfo: !!currentOrder.paymentInfo,
      qrCodeUrl: currentOrder.paymentInfo?.qrCodeUrl,
      fromRef: !order && !!orderRef.current,
      fromLocalStorage: !order && !orderRef.current && !!currentOrder,
      orderState: !!order,
      orderRefState: !!orderRef.current
    });
    // Nếu order state bị reset nhưng ref vẫn có, restore state
    // Note: Restore được handle trong useEffect để tránh update trong render
    if (!order && orderRef.current) {
      // Trigger restore trong useEffect
      console.warn('💳 Checkout: Using order from ref, will restore in useEffect');
    }
    return renderOrderSuccess(currentOrder);
  }

  if (cartItems.length === 0) {
    return (
      <div style={{ padding: '20px' }}>
        <Alert
          message="Giỏ hàng trống"
          description="Bạn cần có sản phẩm trong giỏ hàng để thanh toán."
          type="warning"
          showIcon
          style={{ marginBottom: 20 }}
        />
        <Button onClick={() => navigate('/shop')}>
          Tiếp tục mua sắm
        </Button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: 24 }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/customer/cart')}
          style={{ marginBottom: 16 }}
        >
          Quay lại giỏ hàng
        </Button>
        <Title level={2} style={{ margin: 0 }}>
          💳 Thanh toán
        </Title>
      </div>

      <Row gutter={[24, 24]} align="stretch">
        <Col xs={24} lg={16}>
          <Card title="Thông tin giao hàng">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={{
                name: user?.name || '',
                phone: user?.phone || '',
                email: user?.email || '',
                address: user?.address || ''
              }}
            >
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Họ và tên"
                    name="name"
                    rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                  >
                    <Input placeholder="Nhập họ và tên" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Số điện thoại"
                    name="phone"
                    rules={[
                      { required: true, message: 'Vui lòng nhập số điện thoại' },
                      {
                        pattern: /^(\+84|84|0)[1-9][0-9]{8,9}$/,
                        message: 'Số điện thoại không hợp lệ'
                      }
                    ]}
                  >
                    <Input placeholder="Nhập số điện thoại" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label="Email"
                name="email"
                rules={[{ type: 'email', message: 'Email không hợp lệ' }]}
              >
                <Input placeholder="Nhập email (tùy chọn)" />
              </Form.Item>

              <Form.Item
                label="Địa chỉ giao hàng"
                name="address"
                rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
              >
                <TextArea rows={3} placeholder="Nhập địa chỉ chi tiết" />
              </Form.Item>

              <Form.Item label="Ghi chú" name="note">
                <TextArea rows={2} placeholder="Ghi chú cho đơn hàng (tùy chọn)" />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  size="large"
                  htmlType="submit"
                  loading={submitting}
                  disabled={submitting}
                >
                  Đặt hàng
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Tóm tắt đơn hàng">
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              {cartItems.map((item) => {
                const productName = item.product?.name || item.name || 'Sản phẩm';
                const quantity = item.quantity || 0;
                const lineTotal = item.total || (item.price || item.product?.price || 0) * quantity;
                return (
                  <div key={item.id || item.itemId || `${productName}-${quantity}`}>
                    <Row justify="space-between" align="middle">
                      <Col>
                        <Text>{productName}</Text>
                        <br />
                        <Text type="secondary">x{quantity}</Text>
                      </Col>
                      <Col>
                        <Text strong>{formatCurrency(lineTotal)}</Text>
                      </Col>
                    </Row>
                  </div>
                );
              })}

              <Divider />

              <Row justify="space-between">
                <Text>Tạm tính:</Text>
                <Text>{formatCurrency(totalPrice)}</Text>
              </Row>
              <Row justify="space-between">
                <Text>Phí vận chuyển:</Text>
                <Text>Miễn phí</Text>
              </Row>
              <Divider />
              <Row justify="space-between">
                <Text strong>Tổng cộng:</Text>
                <Text strong style={{ fontSize: 18, color: '#1890ff' }}>
                  {formatCurrency(totalPrice)}
                </Text>
              </Row>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
