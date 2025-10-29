// src/pages/public/Cart.jsx
import React, { useEffect } from 'react';
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

  // Load cart khi vào trang Cart (nếu endpoint tồn tại)
  useEffect(() => {
    loadCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Chỉ load 1 lần khi mount

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
                const productId = item.productId || item.product?.id;
                const product = item.product || {};
                const quantity = item.quantity || 1;
                const price = item.price || product.price || 0;
                const itemTotal = item.total || (price * quantity);

                return (
                  <div key={itemId}>
                    <Row gutter={[16, 16]} align="middle">
                      <Col xs={24} sm={6}>
                        <Image
                          alt={product.name || 'Product'}
                          src={product.imageUrl || product.image || getFallbackImageByIndex(productId)}
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
                            {product.name || 'Unknown Product'}
                          </Title>
                          {product.category && (
                            <Text type="secondary">{product.category.name}</Text>
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
                          loading={loading}
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
