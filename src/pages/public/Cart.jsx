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
                const itemId = item.id || item.itemId;
                const productId = item.productId || item.product?.id || item.id;
                const product = item.product || {};
                const quantity = Number(item.quantity || 1);
                const price = Number(
                  item.price ?? product.price ?? item.unitPrice ?? item.productPrice ?? 0
                );
                const name = product.name || item.productName || item.name || 'Unknown Product';
                const categoryName = product.category?.name || item.categoryName || null;
                const imageUrl = product.imageUrl || product.image || item.productImage || item.imageUrl || item.image || null;
                const itemTotal = Number(item.total ?? price * quantity);
                const hasDiscount = product.salePrice && product.salePrice < price;
                const salePrice = Number(product.salePrice) || price;
                const stock = product.stock ?? 999;
                const badge = product.badge;
                const description = product.description || '';
                return (
                  <div key={itemId} style={{marginBottom: 32}}>
                    <Row gutter={[12, 12]} align="middle" wrap={true}>
                      {/* IMAGE with badge */}
                      <Col xs={24} sm={5} md={4} lg={3} style={{position:'relative'}}>
                        <div style={{position:'relative', width:'100%', maxWidth:90}}>
                          <Image
                            alt={name || 'Product'}
                            src={imageUrl || getFallbackImageByIndex(productId)}
                            style={{ width: '100%', maxWidth: 90, borderRadius: 8, objectFit: 'cover' }}
                            fallback={getFallbackImageByIndex(productId)}
                          />
                          {badge && (
                            <span style={{
                              position:'absolute', top:6, right:2, background:'#fff', color:'#c47256', fontWeight:600, fontSize:12, borderRadius: '8px', padding: '2px 6px', boxShadow:'0 2px 8px #0001'
                            }}>{badge}</span>
                          )}
                          {/* Stock Status */}
                          {stock <= 10 && (
                            <span style={{position:'absolute',left:2,bottom:6,background:'#ef4444',color:'#fff',fontWeight:500,fontSize:11,borderRadius:6,padding:'2px 5px'}}>
                              Còn {stock} sp!
                            </span>
                          )}
                        </div>
                      </Col>
                      <Col xs={24} sm={11} md={9} lg={8}>
                        <div style={{minHeight: 60}}>
                          <Title level={5} style={{ margin: 0 }}>{name}</Title>
                          {categoryName && <Text type="secondary" style={{marginRight:8}}>{categoryName}</Text>}
                          {description && <div style={{fontSize:13, color:'#888',marginTop:4,overflow:'hidden',whiteSpace:'nowrap',textOverflow:'ellipsis',maxWidth:200}}>{description}</div>}
                        </div>
                        {/* Giá sale và giá gốc nếu có */}
                        <div style={{marginTop:4, display:'flex', alignItems:'baseline', gap:12}}>
                          <Text strong style={{color:'#c47256', fontSize:16}}>
                            {salePrice.toLocaleString()}đ
                          </Text>
                          {hasDiscount && (
                            <Text delete style={{color:'#888', fontSize:12}}>{price.toLocaleString()}đ</Text>
                          )}
                        </div>
                      </Col>
                      <Col xs={12} sm={3} md={4} lg={3} style={{textAlign:'center'}}>
                        <InputNumber
                          min={1}
                          max={stock}
                          value={quantity}
                          onChange={(value) => updateQuantity(itemId, value)}
                          style={{ width: 64 }}
                        />
                      </Col>
                      <Col xs={12} sm={3} md={4} lg={3} style={{textAlign:'center'}}>
                        <Text strong style={{fontSize:14,color:'#1890ff'}}>
                          {itemTotal.toLocaleString()}đ
                        </Text>
                      </Col>
                      <Col xs={4} sm={2} md={3} lg={2} style={{textAlign:'center'}}>
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
                    <Divider/>
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
