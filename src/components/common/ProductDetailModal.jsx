// src/components/common/ProductDetailModal.jsx
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Modal, Card, Tag, Skeleton, Alert, Row, Col, message, InputNumber, Space, Button } from 'antd';
import { ShoppingCartOutlined, HeartOutlined, HeartFilled, CloseOutlined } from '@ant-design/icons';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { getProductById } from '../../services/products';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { getFallbackImageByIndex } from '../../utils/imageUtils';

export default function ProductDetailModal({ productId, open, onClose }) {
  const { user } = useAuth();
  const { addToCart, loading: cartLoading } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [togglingWishlist, setTogglingWishlist] = useState(false);
  
  // Refs để tránh duplicate API calls
  const loadingRef = useRef(false);
  const lastLoadedIdRef = useRef(null);
  const mountedRef = useRef(true);

  // Load product data khi modal mở
  useEffect(() => {
    if (!open || !productId) {
      setProduct(null);
      setQuantity(1);
      setError(null);
      loadingRef.current = false;
      lastLoadedIdRef.current = null;
      return;
    }

    // Convert id to number để so sánh chính xác
    const id = productId ? Number(productId) : null;
    
    if (!id || isNaN(id)) {
      setError('ID sản phẩm không hợp lệ');
      setLoading(false);
      return;
    }

    // Skip nếu đã load cùng ID (không cần check product vì có thể thay đổi reference)
    if (lastLoadedIdRef.current === id) {
      console.log('🛍️ ProductDetailModal: Product already loaded for this ID, skipping...', { id });
      return;
    }

    // Prevent duplicate calls
    if (loadingRef.current) {
      console.log('🛍️ ProductDetailModal: Already loading, skipping...', { id });
      return;
    }
    
    mountedRef.current = true;
    loadingRef.current = true;
    lastLoadedIdRef.current = id;
    
    const loadProduct = async () => {
      try {
        if (mountedRef.current) {
          setLoading(true);
          setError(null);
        }
        
        console.log('🛍️ ProductDetailModal: Loading product', { id });
        const productData = await getProductById(id);
        console.log('🛍️ ProductDetailModal: Product loaded', productData);
        
        if (mountedRef.current) {
          if (productData && productData.id) {
            setProduct(productData);
            setQuantity(1); // Reset quantity khi load product mới
            setLoading(false);
          } else {
            throw new Error('Product data không hợp lệ');
          }
        }
      } catch (e) {
        console.error('🛍️ ProductDetailModal: Error loading product', e);
        if (mountedRef.current) {
          setError(e?.message || 'Không thể tải thông tin sản phẩm');
          setLoading(false);
          lastLoadedIdRef.current = null; // Reset để có thể retry
        }
      } finally {
        if (mountedRef.current) {
          loadingRef.current = false;
        }
      }
    };

    loadProduct();
    
    return () => {
      mountedRef.current = false;
    };
  }, [open, productId]); // Depend on open và productId

  // Memoized values
  const imageUrl = useMemo(() => {
    if (!product) return null;
    
    let src = product.imageUrl ?? product.image_url ?? product.image ?? null;
    
    if (!src || src === '' || src === 'null' || src === 'undefined') {
      return getFallbackImageByIndex(product.id);
    }
    
    if (src.startsWith('http://') || src.startsWith('https://')) {
      return src;
    }
    
    if (src.startsWith('/api/uploads/')) {
      const baseURL = process.env.REACT_APP_API_BASE_URL || "https://exe201-be-uhno.onrender.com/api";
      return baseURL.replace('/api', '') + src;
    }
    
    return getFallbackImageByIndex(product.id);
  }, [product]);

  // Check wishlist status
  const inWishlist = useMemo(() => {
    if (!product?.id) return false;
    return isInWishlist(product.id);
  }, [product?.id]);

  // Handlers
  const handleAddToCart = async () => {
    if (!product) {
      message.warning('Sản phẩm không tồn tại');
      return;
    }

    // Kiểm tra đăng nhập
    if (!user) {
      message.warning('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
      onClose();
      return;
    }

    // Kiểm tra role CUSTOMER
    const userRole = (user.role || "").toUpperCase();
    if (userRole !== 'CUSTOMER') {
      message.warning('Chỉ khách hàng mới có thể thêm sản phẩm vào giỏ hàng');
      return;
    }

    // Kiểm tra tồn kho
    if (product.stock === 0) {
      message.warning('Sản phẩm đã hết hàng');
      return;
    }

    // Kiểm tra số lượng
    if (quantity <= 0) {
      message.warning('Số lượng phải lớn hơn 0');
      return;
    }

    if (quantity > product.stock) {
      message.warning(`Chỉ còn ${product.stock} sản phẩm trong kho`);
      setQuantity(product.stock);
      return;
    }

    setAddingToCart(true);
    try {
      console.log('🛒 ProductDetailModal: Adding to cart', { productId: product.id, quantity });
      await addToCart(product, quantity);
      message.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
      // Có thể đóng modal sau khi thêm vào giỏ hàng (tùy chọn)
      // onClose();
    } catch (error) {
      console.error('🛒 ProductDetailModal: Error adding to cart', error);
      const errorMsg = error?.response?.data?.message || error?.message || 'Không thể thêm vào giỏ hàng';
      message.error(errorMsg);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleWishlist = async () => {
    if (!product) {
      message.warning('Sản phẩm không tồn tại');
      return;
    }

    setTogglingWishlist(true);
    try {
      // Toggle wishlist (không cần đăng nhập, lưu trong localStorage)
      toggleWishlist(product);
      
      // Đợi một chút để state update
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const isAdded = isInWishlist(product.id);
      if (isAdded) {
        message.success('Đã thêm vào danh sách yêu thích! ❤️');
      } else {
        message.info('Đã xóa khỏi danh sách yêu thích');
      }
    } catch (error) {
      console.error('❤️ ProductDetailModal: Error toggling wishlist', error);
      message.error('Không thể cập nhật danh sách yêu thích');
    } finally {
      setTogglingWishlist(false);
    }
  };

  const handleQuantityChange = (value) => {
    if (!product) return;
    
    if (value <= 0) {
      setQuantity(1);
      return;
    }
    
    if (value > product.stock) {
      message.warning(`Chỉ còn ${product.stock} sản phẩm trong kho`);
      setQuantity(product.stock);
      return;
    }
    
    setQuantity(value);
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={900}
      closeIcon={<CloseOutlined style={{ fontSize: '20px', color: '#362319' }} />}
      styles={{
        body: {
          padding: '24px',
          maxHeight: '90vh',
          overflowY: 'auto'
        }
      }}
    >
      {loading ? (
        <div style={{ padding: '20px' }}>
          <Row gutter={[32, 32]}>
            <Col xs={24} md={12}>
              <Skeleton.Image style={{ width: '100%', height: '400px', borderRadius: '20px' }} />
            </Col>
            <Col xs={24} md={12}>
              <Skeleton active paragraph={{ rows: 8 }} />
            </Col>
          </Row>
        </div>
      ) : error || !product ? (
        <Alert
          message="Không tìm thấy sản phẩm"
          description={error || 'Sản phẩm không tồn tại hoặc đã bị xóa.'}
          type="error"
          showIcon
        />
      ) : (
        <Row gutter={[32, 32]}>
          {/* Product Image */}
          <Col xs={24} md={12}>
            <Card
              style={{
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                border: 'none'
              }}
              bodyStyle={{ padding: 0 }}
            >
              <div style={{ position: 'relative', width: '100%', paddingTop: '100%' }}>
                <LazyLoadImage
                  alt={product.name}
                  src={imageUrl}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '20px'
                  }}
                  effect="blur"
                  placeholderSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3C/svg%3E"
                  onError={(e) => {
                    const fallback = getFallbackImageByIndex(product.id);
                    if (e.target.src !== fallback) {
                      e.target.src = fallback;
                    }
                  }}
                />
              </div>
            </Card>
          </Col>

          {/* Product Info */}
          <Col xs={24} md={12}>
            <Card
              style={{
                borderRadius: '20px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                border: 'none',
                height: '100%'
              }}
            >
              {/* Category */}
              {product.category && (
                <Tag 
                  style={{ 
                    marginBottom: '16px',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: '600',
                    background: '#ffeadd',
                    color: '#362319',
                    border: 'none'
                  }}
                >
                  {product.category.name}
                </Tag>
              )}

              {/* Product Name */}
              <h1 style={{
                fontSize: '28px',
                fontWeight: '800',
                color: '#362319',
                margin: '0 0 16px 0',
                lineHeight: '1.2'
              }}>
                {product.name}
              </h1>

              {/* Price */}
              <div style={{
                fontSize: '28px',
                fontWeight: '700',
                color: '#eda274',
                marginBottom: '24px'
              }}>
                {product.price ? `${product.price.toLocaleString()}đ` : 'Liên hệ'}
              </div>

              {/* Stock Status */}
              {product.stock !== undefined && (
                <Tag 
                  color={product.stock > 0 ? 'green' : 'red'}
                  style={{ 
                    fontSize: '14px',
                    fontWeight: '600',
                    padding: '6px 16px',
                    borderRadius: '12px',
                    marginBottom: '24px',
                    height: 'auto'
                  }}
                >
                  {product.stock > 0 ? `Còn ${product.stock} sản phẩm` : 'Hết hàng'}
                </Tag>
              )}

              {/* Quantity Selector */}
              {product.stock > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <Space align="center">
                    <span style={{ 
                      fontSize: '16px', 
                      color: '#553d2d', 
                      fontWeight: '600',
                      marginRight: '12px'
                    }}>
                      Số lượng:
                    </span>
                    <InputNumber
                      min={1}
                      max={product.stock}
                      value={quantity}
                      onChange={handleQuantityChange}
                      size="large"
                      style={{
                        width: '120px',
                        borderRadius: '8px'
                      }}
                    />
                    <span style={{ 
                      fontSize: '14px', 
                      color: '#888',
                      marginLeft: '8px'
                    }}>
                      (Tối đa: {product.stock})
                    </span>
                  </Space>
                </div>
              )}

              {/* Description */}
              {product.description && (
                <div style={{
                  marginBottom: '24px',
                  padding: '16px',
                  background: '#fff',
                  borderRadius: '12px',
                  border: '1px solid #f0f0f0',
                  maxHeight: '150px',
                  overflowY: 'auto'
                }}>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#362319',
                    marginBottom: '8px'
                  }}>
                    Mô tả sản phẩm
                  </h3>
                  <p style={{
                    fontSize: '14px',
                    color: '#553d2d',
                    lineHeight: '1.6',
                    margin: 0,
                    whiteSpace: 'pre-wrap'
                  }}>
                    {product.description}
                  </p>
                </div>
              )}

              {/* Type */}
              {product.type && (
                <div style={{ marginBottom: '24px' }}>
                  <span style={{ 
                    fontSize: '14px', 
                    color: '#553d2d', 
                    fontWeight: '600',
                    marginRight: '8px'
                  }}>
                    Loại:
                  </span>
                  <Tag style={{
                    fontSize: '14px',
                    padding: '4px 12px',
                    borderRadius: '8px',
                    background: '#ffeadd',
                    color: '#362319',
                    border: 'none'
                  }}>
                    {product.type}
                  </Tag>
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
                <Button
                  type="primary"
                  icon={<ShoppingCartOutlined />}
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || addingToCart || cartLoading}
                  loading={addingToCart}
                  size="large"
                  style={{
                    flex: 1,
                    minWidth: '200px',
                    height: '50px',
                    background: product.stock > 0 ? '#eda274' : '#ccc',
                    borderColor: product.stock > 0 ? '#eda274' : '#ccc',
                    borderRadius: '12px',
                    fontWeight: '600',
                    fontSize: '16px'
                  }}
                >
                  {addingToCart 
                    ? 'Đang thêm...' 
                    : product.stock > 0 
                      ? 'Thêm vào giỏ hàng' 
                      : 'Hết hàng'
                  }
                </Button>
                
                <Button
                  icon={inWishlist ? <HeartFilled /> : <HeartOutlined />}
                  onClick={handleWishlist}
                  disabled={togglingWishlist}
                  loading={togglingWishlist}
                  size="large"
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '12px',
                    background: inWishlist ? 'rgba(255, 77, 79, 0.1)' : '#fff',
                    borderColor: inWishlist ? '#ff4d4f' : '#d9d9d9',
                    color: inWishlist ? '#ff4d4f' : '#362319',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease'
                  }}
                />
              </div>

              {/* Total Price */}
              {product.stock > 0 && quantity > 0 && (
                <div style={{
                  padding: '16px',
                  background: '#ffeadd',
                  borderRadius: '12px',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '14px',
                    color: '#553d2d',
                    marginBottom: '8px',
                    fontWeight: '600'
                  }}>
                    Thành tiền:
                  </div>
                  <div style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    color: '#eda274'
                  }}>
                    {(product.price * quantity).toLocaleString()}đ
                  </div>
                </div>
              )}
            </Card>
          </Col>
        </Row>
      )}
    </Modal>
  );
}

