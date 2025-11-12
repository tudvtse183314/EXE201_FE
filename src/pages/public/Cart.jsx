// src/pages/public/Cart.jsx
import React, { useEffect, useRef, useState, useMemo } from 'react';
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
  Image,
  Skeleton
} from 'antd';
import { 
  ShoppingCartOutlined, 
  DeleteOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import { useCart } from '../../context/CartContext';
import { getFallbackImageByIndex } from '../../utils/imageUtils';
import { getProductById } from '../../services/products';

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
  
  // Tính stable key từ cartItems để dùng trong dependency
  // FIX: Đơn giản hóa dependency để tránh re-compute không cần thiết
  const cartItemsKey = useMemo(() => {
    return cartItems
      .map(item => `${item.id || item.itemId}-${item.quantity}-${item.total || item.price || 0}`)
      .join(',');
  }, [cartItems]); // Depend on toàn bộ cartItems array
  
  // Memoize total price để tránh tính lại nhiều lần
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const totalPrice = useMemo(() => getTotalPrice(), [cartItemsKey]);

  // State để lưu product details
  const [productsMap, setProductsMap] = useState({});
  const [loadingProducts, setLoadingProducts] = useState(false);
  
  // Ref để track productIds đã load để tránh duplicate calls
  const loadedProductIdsRef = useRef(new Set());

  // Guard để đảm bảo chỉ load cart một lần khi mount
  const hasLoadedRef = useRef(false);
  
  // Ref để track productIds key cuối cùng để tránh re-render loop
  const lastProductIdsKeyRef = useRef('');
  
  // Tính productIdsKey từ cartItems để dùng trong dependency (memoize để tránh re-render)
  // FIX: Đơn giản hóa logic và dependencies
  const productIdsKey = useMemo(() => {
    const productIds = cartItems
      .map(item => item.productId || item.product?.id)
      .filter(Boolean)
      .filter((id, index, self) => self.indexOf(id) === index) // Remove duplicates
      .map(Number)
      .sort((a, b) => a - b);
    return productIds.join(',');
  }, [cartItems]); // Depend on toàn bộ cartItems array
  
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

  // Load product details cho các items chỉ có productId
  useEffect(() => {
    if (!cartItems.length) {
      // Clear loaded refs khi cart rỗng
      // NHƯNG giữ lại productsMap để cache (tránh load lại khi add sản phẩm cũ)
      // Và không reset lastProductIdsKeyRef để tránh trigger load lại
      loadedProductIdsRef.current.clear();
      // lastProductIdsKeyRef.current = ''; // Không reset để tránh trigger load lại
      // setProductsMap({}); // Không clear productsMap để giữ cache
      return;
    }

    // Parse productIds từ productIdsKey
    const currentProductIds = productIdsKey ? productIdsKey.split(',').filter(Boolean).map(Number) : [];

    // Skip nếu productIds không thay đổi
    if (productIdsKey === lastProductIdsKeyRef.current) {
      console.log('🛒 Cart: ProductIds unchanged, skipping load', { productIdsKey });
      return;
    }
    
    console.log('🛒 Cart: ProductIds changed', { 
      old: lastProductIdsKeyRef.current, 
      new: productIdsKey 
    });
    
    // Cleanup: Xóa những productId không còn trong productIds khỏi loadedProductIdsRef và productsMap
    const currentProductIdsSet = new Set(currentProductIds);
    loadedProductIdsRef.current.forEach(loadedId => {
      if (!currentProductIdsSet.has(loadedId)) {
        loadedProductIdsRef.current.delete(loadedId);
        console.log('🛒 Cart: Removed productId from loaded ref', { loadedId });
      }
    });
    
    // Cleanup productsMap - chỉ giữ những productId còn trong cart
    setProductsMap(prevMap => {
      const newMap = {};
      currentProductIds.forEach(id => {
        if (prevMap[id]) {
          newMap[id] = prevMap[id];
        }
      });
      return newMap;
    });
    
    lastProductIdsKeyRef.current = productIdsKey;

    const loadProducts = async () => {
      // Bước 1: Sync productsMap với items có sẵn product (từ CartContext hydration)
      // Kiểm tra xem có product nào đã có trong productsMap chưa
      const existingProducts = {};
      currentProductIds.forEach(productId => {
        // Kiểm tra xem item có product chưa (từ CartContext hydration)
        const item = cartItems.find(item => (item.productId || item.product?.id) === productId);
        if (item?.product) {
          existingProducts[productId] = item.product;
          loadedProductIdsRef.current.add(productId);
        } else if (productsMap[productId]) {
          // Đã có trong productsMap từ lần trước
          existingProducts[productId] = productsMap[productId];
          loadedProductIdsRef.current.add(productId);
        }
      });
      
      // Sync một lần nếu có products mới
      if (Object.keys(existingProducts).length > 0) {
        setProductsMap(prevMap => {
          const newMap = { ...prevMap };
          let hasChanges = false;
          Object.keys(existingProducts).forEach(pid => {
            if (!newMap[pid]) {
              newMap[pid] = existingProducts[pid];
              hasChanges = true;
            }
          });
          return hasChanges ? newMap : prevMap;
        });
      }
      
      // Bước 2: Lọc productIds cần load (chưa có product và chưa load)
      // FIX: Loại bỏ setTimeout, xử lý trực tiếp
      const productIdsToLoad = currentProductIds.filter(productId => {
        // Đã có trong productsMap hoặc đã load → skip
        if (existingProducts[productId] || loadedProductIdsRef.current.has(productId)) {
          return false;
        }
        // Chỉ load nếu chưa có gì cả
        return true;
      });
      
      // Load products nếu có
      if (productIdsToLoad.length > 0) {
        console.log('🛒 Cart: Loading product details', { productIdsToLoad });
        
        // Đánh dấu đang load để tránh duplicate calls
        productIdsToLoad.forEach(id => loadedProductIdsRef.current.add(id));
        setLoadingProducts(true);
        
        // Load products async
        Promise.all(
          productIdsToLoad.map(id => getProductById(id).catch(err => {
            console.error(`🛒 Cart: Error loading product ${id}`, err);
            // Remove from loaded set nếu lỗi để có thể retry
            loadedProductIdsRef.current.delete(id);
            return null;
          }))
        ).then(products => {
          setProductsMap(prev => {
            const newMap = { ...prev };
            products.forEach((product) => {
              if (product && product.id) {
                newMap[product.id] = product;
              }
            });
            return newMap;
          });
          setLoadingProducts(false);
        }).catch(error => {
          console.error('🛒 Cart: Error loading products', error);
          // Remove from loaded set nếu lỗi để có thể retry
          productIdsToLoad.forEach(id => loadedProductIdsRef.current.delete(id));
          setLoadingProducts(false);
        });
      }
    };

    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productIdsKey]); // Chỉ depend on productIdsKey (đã được memoize từ cartItems)
  
  // Reset flag khi component unmount (để có thể load lại khi quay lại trang)
  // NHƯNG không reset lastProductIdsKeyRef để tránh load lại products đã có
  useEffect(() => {
    return () => {
      hasLoadedRef.current = false;
      console.log('🛒 Cart Page: Component unmounted, reset load flag');
      // KHÔNG reset lastProductIdsKeyRef để giữ cache và tránh load lại
      // lastProductIdsKeyRef.current = ''; // Không reset
    };
  }, []);
  
  // Debug: Log khi component re-render (chỉ trong development)
  // FIX: Thêm dependency array để tránh chạy mỗi lần render
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🛒 Cart Page: Component re-rendered', {
        cartItemsCount: cartItems.length,
        loading,
        error,
        hasLoaded: hasLoadedRef.current
      });
    }
  }, [cartItems.length, loading, error]); // Chỉ log khi các giá trị này thay đổi

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
                // Ưu tiên: item.product > productsMap[productId] > {}
                const product = item.product || productsMap[productId] || {};
                const quantity = Number(item.quantity || 1);
                const price = Number(
                  item.price ?? product.price ?? item.unitPrice ?? item.productPrice ?? 0
                );
                const name = product.name || item.productName || item.name || 'Unknown Product';
                const categoryName = product.category?.name || item.categoryName || null;
                const imageUrl = product.imageUrl || product.image || item.productImage || item.imageUrl || item.image || null;
                // Tính itemTotal: ưu tiên item.total, nếu không có thì tính từ salePrice * quantity
                // salePrice có thể là giá giảm, nếu không có thì dùng price
                const salePrice = Number(product.salePrice) || price;
                const hasDiscount = product.salePrice && product.salePrice < price;
                const itemTotal = Number(item.total ?? salePrice * quantity);
                const stock = product.stock ?? 999;
                const badge = product.badge;
                const description = product.description || '';
                const isLoadingProduct = productId && !product.name && loadingProducts;
                
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
                          {isLoadingProduct ? (
                            <Skeleton active paragraph={{ rows: 2 }} />
                          ) : (
                            <>
                              <Title level={5} style={{ margin: 0 }}>{name}</Title>
                              {categoryName && <Text type="secondary" style={{marginRight:8}}>{categoryName}</Text>}
                              {description && <div style={{fontSize:13, color:'#888',marginTop:4,overflow:'hidden',whiteSpace:'nowrap',textOverflow:'ellipsis',maxWidth:200}}>{description}</div>}
                            </>
                          )}
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
                <Text>{totalPrice.toLocaleString()}đ</Text>
              </Row>
              <Row justify="space-between">
                <Text>Phí vận chuyển:</Text>
                <Text>Miễn phí</Text>
              </Row>
              <Divider />
              <Row justify="space-between">
                <Text strong>Tổng cộng:</Text>
                <Text strong style={{ fontSize: 18, color: '#1890ff' }}>
                  {totalPrice.toLocaleString()}đ
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
