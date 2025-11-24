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
import { useToast } from '../../context/ToastContext';
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
  const { showError } = useToast();

  // Load cart khi vào trang Cart - chỉ load một lần khi mount
  // Không reset hasLoadedRef khi unmount vì CartContext đã quản lý việc này
  useEffect(() => {
    console.log('🛒 Cart Page: useEffect triggered, loading cart...');
    
    // Load cart và xử lý lỗi
    loadCart().catch((err) => {
      console.error('🛒 Cart Page: Error loading cart', err);
      // Nếu loadCart không tự hiển thị toast (ví dụ lỗi 400 đã được xử lý im lặng)
      // thì hiển thị toast ở đây
      if (err?.response?.status !== 400 && err?.response?.status !== 401 && err?.response?.status !== 403) {
        const errorMsg = err?.response?.data?.message || err?.message || 'Không thể tải giỏ hàng. Vui lòng thử lại.';
        showError(errorMsg);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Chỉ load 1 lần khi mount

  // Theo dõi error state từ context và hiển thị toast
  useEffect(() => {
    if (error) {
      console.error('🛒 Cart Page: Error state detected', error);
      showError(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);
  
  // Debug: Log khi component re-render (chỉ trong development)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🛒 Cart Page: Component re-rendered', {
        cartItemsCount: cartItems.length,
        loading,
        error
      });
    }
  });

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    navigate('/customer/checkout');
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
                
                // Sử dụng product từ CartContext (đã được hydrate trong loadCart)
                const product = item.product || {};
                
                const quantity = Number(item.quantity || 1);
                const price = Number(
                  product.price ?? item.price ?? item.unitPrice ?? item.productPrice ?? 0
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
                          {stock <= 10 && stock > 0 && (
                            <span style={{position:'absolute',left:2,bottom:6,background:'#ef4444',color:'#fff',fontWeight:500,fontSize:11,borderRadius:6,padding:'2px 5px'}}>
                              Còn {stock} sp!
                            </span>
                          )}
                          {stock === 0 && (
                            <span style={{position:'absolute',left:2,bottom:6,background:'#999',color:'#fff',fontWeight:500,fontSize:11,borderRadius:6,padding:'2px 5px'}}>
                              Hết hàng
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
                          max={stock || 999}
                          value={quantity}
                          onChange={(value) => {
                            if (value !== null && value !== undefined) {
                              updateQuantity(itemId, value);
                            }
                          }}
                          style={{ width: 64 }}
                          disabled={loading}
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
                          disabled={loading}
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
