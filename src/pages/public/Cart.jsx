// src/pages/public/Cart.jsx
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  Row, 
  Col, 
  Button, 
  InputNumber, 
  Typography, 
  Divider,
  Empty,
  Space,
  Image
} from 'antd';
import { 
  ShoppingCartOutlined, 
  DeleteOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import { useCart } from '../../context/CartContext';
import { getFallbackImageByIndex } from '../../utils/imageUtils';

const { Title, Text } = Typography;

export default function Cart() {
  const navigate = useNavigate();
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    clearCart,
    getTotalItems,
    getTotalPrice,
    loading,
    error,
    loadCart
  } = useCart();

  // Guard để đảm bảo chỉ load cart một lần khi mount
  const hasLoadedRef = useRef(false);
  
  // Load cart khi vào trang Cart - chỉ load một lần khi mount
  useEffect(() => {
    // Nếu đã load rồi thì không load lại
    if (hasLoadedRef.current) {
      console.log('🛒 Cart Page: Skipping load - already loaded');
      return;
    }
    
    console.log('🛒 Cart Page: useEffect triggered, loading cart...');
    hasLoadedRef.current = true;
    loadCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Chỉ load 1 lần khi mount
  
  // Reset flag khi component unmount (để có thể load lại khi quay lại trang)
  useEffect(() => {
    return () => {
      hasLoadedRef.current = false;
      console.log('🛒 Cart Page: Component unmounted, reset load flag');
    };
  }, []);
  
  // Debug: Log khi component re-render (chỉ trong development)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🛒 Cart Page: Component re-rendered', {
        cartItemsCount: cartItems.length,
        loading,
        error,
        hasLoaded: hasLoadedRef.current
      });
    }
  });

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    navigate('/shop');
  };

  if (cartItems.length === 0) {
    return (
      <div style={{ padding: '20px' }}>
        <Card>
          <Empty
            image={<ShoppingCartOutlined style={{ fontSize: 64, color: '#d9d9d9' }} />}
            description="Giỏ hàng trống"
          >
            <Button type="primary" onClick={handleContinueShopping}>
              Tiếp tục mua sắm
            </Button>
          </Empty>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>
          🛒 Giỏ hàng ({getTotalItems()} sản phẩm)
        </Title>
      </div>

      <Row gutter={[24, 24]}>
        {/* Cart Items */}
        <Col xs={24} lg={16}>
          <Card>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              {cartItems.map((item) => {
                // BE có thể trả về id hoặc itemId
                const itemId = item.id || item.itemId;
                const productId = item.productId || item.product?.id || item.id;
                const product = item.product || {};
                const quantity = Number(item.quantity || 1);
                const price = Number(
                  item.price ?? product.price ?? item.unitPrice ?? item.productPrice ?? 0
                );
                const name = product.name || item.productName || item.name || 'Unknown Product';
                const categoryName = product.category?.name || item.categoryName || null;
                const imageUrl =
                  product.imageUrl || product.image || item.productImage || item.imageUrl || item.image || null;
                const itemTotal = Number(item.total ?? price * quantity);

                return (
                  <div key={itemId}>
                    <Row gutter={[16, 16]} align="middle">
                      <Col xs={24} sm={6}>
                        <Image
                          alt={name || 'Product'}
                          src={imageUrl || getFallbackImageByIndex(productId)}
                          style={{ width: '100%', maxWidth: 100 }}
                          fallback={getFallbackImageByIndex(productId)}
                          onError={(e) => {
                            e.target.src = getFallbackImageByIndex(productId);
                          }}
                        />
                      </Col>
                      <Col xs={24} sm={12}>
                        <div>
                          <Title level={5} style={{ margin: 0 }}>
                            {name}
                          </Title>
                          {categoryName && (
                            <Text type="secondary">{categoryName}</Text>
                          )}
                          <div style={{ marginTop: 4 }}>
                            <Text strong style={{ color: '#1890ff' }}>
                              {price.toLocaleString()}đ
                            </Text>
                          </div>
                        </div>
                      </Col>
                      <Col xs={12} sm={3}>
                        <div style={{ textAlign: 'center' }}>
                          <Text strong>
                            {itemTotal.toLocaleString()}đ
                          </Text>
                        </div>
                      </Col>
                      <Col xs={8} sm={2}>
                        <InputNumber
                          min={1}
                          max={product.stock || 999}
                          value={quantity}
                          onChange={(value) => updateQuantity(itemId, value)}
                          style={{ width: '100%' }}
                        />
                      </Col>
                      <Col xs={4} sm={1}>
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => removeFromCart(itemId)}
                          title="Xóa"
                          loading={loading}
                        />
                      </Col>
                    </Row>
                    <Divider />
                  </div>
                );
              })}
            </Space>
          </Card>
        </Col>

        {/* Order Summary */}
        <Col xs={24} lg={8}>
          <Card title="Tóm tắt đơn hàng">
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Row justify="space-between">
                <Text>Tạm tính:</Text>
                <Text>{getTotalPrice().toLocaleString()}đ</Text>
              </Row>
              <Row justify="space-between">
                <Text>Phí vận chuyển:</Text>
                <Text>Miễn phí</Text>
              </Row>
              <Divider />
              <Row justify="space-between">
                <Text strong>Tổng cộng:</Text>
                <Text strong style={{ fontSize: 18, color: '#1890ff' }}>
                  {getTotalPrice().toLocaleString()}đ
                </Text>
              </Row>
              
              <Space direction="vertical" style={{ width: '100%' }}>
                <Button
                  type="primary"
                  size="large"
                  block
                  onClick={handleCheckout}
                >
                  Thanh toán
                </Button>
                <Button
                  size="large"
                  block
                  onClick={handleContinueShopping}
                  icon={<ArrowLeftOutlined />}
                >
                  Tiếp tục mua sắm
                </Button>
                <Button
                  danger
                  block
                  onClick={clearCart}
                >
                  Xóa tất cả
                </Button>
              </Space>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
