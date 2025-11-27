// src/pages/public/Wishlist.jsx
import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Empty, Spin } from 'antd';
import { CloseOutlined, ShoppingCartOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { getFallbackImageByIndex } from '../../utils/imageUtils';
import { getProductById } from '../../services/products';

export default function Wishlist() {
  const navigate = useNavigate();
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart, cartItems } = useCart();
  const { showSuccess, showError, showInfo } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const baseURL = process.env.REACT_APP_API_BASE_URL || "https://exe201-be-uhno.onrender.com/api";

  // Helper function to check if product is in cart
  const isInCart = (productId) => {
    return cartItems.some(item => 
      (item.productId || item.product?.id) === productId
    );
  };

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product, 1);
      // Xóa khỏi wishlist sau khi thêm vào giỏ hàng thành công
      removeFromWishlist(product.id);
      showSuccess("Đã thêm vào giỏ hàng!");
    } catch (error) {
      showError("Không thể thêm vào giỏ hàng. Vui lòng thử lại!");
    }
  };

  const handleRemoveFromWishlist = (product) => {
    removeFromWishlist(product.id);
    showInfo("Đã xóa khỏi danh sách yêu thích!");
  };

  const handleViewProduct = (product) => {
    navigate(`/product/${product.id}`);
  };

  // Fetch product details từ API cho mỗi product trong wishlist
  useEffect(() => {
    const fetchProducts = async () => {
      if (wishlist.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const productPromises = wishlist.map(async (item) => {
          try {
            // Nếu item đã có đầy đủ thông tin (imageUrl, price, etc.) thì dùng luôn
            if (item.imageUrl || item.image || item.image_url) {
              return item;
            }
            // Nếu không, gọi API để lấy thông tin đầy đủ
            const productData = await getProductById(item.id);
            return productData;
          } catch (error) {
            console.error(`Error fetching product ${item.id}:`, error);
            // Nếu lỗi, vẫn trả về item gốc
            return item;
          }
        });

        const fetchedProducts = await Promise.all(productPromises);
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        // Nếu lỗi, dùng wishlist gốc
        setProducts(wishlist);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [wishlist]);

  return (
    <div style={{ 
      minHeight: '100vh',
      background: '#fff',
      fontFamily: "'Inter', 'Noto Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif"
    }}>
      {/* Container */}
      <div style={{ 
        maxWidth: '1440px', 
        margin: '0 auto', 
        padding: '20px'
      }}>
        {/* Header */}
        <div style={{ 
          marginBottom: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Button 
              icon={<ArrowLeftOutlined />} 
              onClick={() => navigate(-1)}
              style={{
                background: '#eda274',
                borderColor: '#eda274',
                color: '#fff',
                fontWeight: '600'
              }}
            >
              Quay lại
            </Button>
            <h1 style={{
              margin: 0,
              fontSize: '32px',
              fontWeight: '800',
              color: '#362319',
              fontFamily: "'Inter', 'Noto Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif"
            }}>
              ❤️ Danh sách yêu thích
            </h1>
          </div>
          
          {wishlist.length > 0 && (
            <Button 
              danger
              onClick={clearWishlist}
              style={{
                fontWeight: '600'
              }}
            >
              Xóa tất cả
            </Button>
          )}
        </div>

        {/* Wishlist Content */}
        {wishlist.length === 0 && !loading ? (
          <Card style={{ 
            borderRadius: '16px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
            border: 'none',
            textAlign: 'center',
            padding: '60px 20px'
          }}>
            <Empty
              description="Danh sách yêu thích trống"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              <Button 
                type="primary" 
                onClick={() => navigate('/shop')}
                style={{
                  background: '#eda274',
                  borderColor: '#eda274',
                  borderRadius: '8px',
                  fontWeight: '600'
                }}
              >
                Khám phá sản phẩm
              </Button>
            </Empty>
          </Card>
        ) : (
          <>
            <div style={{ 
              marginBottom: '24px',
              padding: '16px',
              background: '#ffeadd',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <p style={{ 
                margin: 0, 
                fontSize: '16px', 
                color: '#362319',
                fontWeight: '600'
              }}>
                Bạn có {wishlist.length} sản phẩm trong danh sách yêu thích
              </p>
            </div>

            <Row gutter={[20, 24]}>
              {loading ? (
                <Col span={24} style={{ textAlign: 'center', padding: '60px 0' }}>
                  <Spin size="large" />
                </Col>
              ) : (
                products.map((product) => (
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6} key={product.id}>
                  <Card
                    hoverable
                    style={{
                      borderRadius: '20px',
                      overflow: 'hidden',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                      border: 'none',
                      transition: 'all 0.3s ease',
                      background: '#fff',
                      height: '100%'
                    }}
                    styles={{ body: { padding: '20px' } }}
                    cover={
                      <div 
                        style={{ 
                          height: '280px', 
                          overflow: 'hidden',
                          position: 'relative',
                          cursor: 'pointer'
                        }}
                        onClick={() => handleViewProduct(product)}
                      >
                        <LazyLoadImage
                          alt={product.name}
                          src={(() => {
                            // Sử dụng imageUrl (đã normalize từ getProductById)
                            let src = product.imageUrl ?? product.image_url ?? product.image ?? null;
                            
                            // Nếu null hoặc empty string → dùng fallback
                            if (!src || src === '' || src === 'null' || src === 'undefined') {
                              return getFallbackImageByIndex(product.id);
                            }
                            
                            // Nếu đã là full URL (http/https) → dùng trực tiếp
                            if (src.startsWith('http://') || src.startsWith('https://')) {
                              return src;
                            }
                            
                            // Build full URL nếu là relative path từ BE
                            if (src.startsWith('/api/uploads/')) {
                              const fullUrl = baseURL.replace('/api', '') + src;
                              return fullUrl;
                            }
                            
                            // Nếu không match pattern nào → dùng fallback
                            return getFallbackImageByIndex(product.id);
                          })()}
                          width="100%"
                          height="280px"
                          style={{
                            width: '100%',
                            height: '280px',
                            objectFit: 'cover',
                            display: 'block',
                            transition: 'transform 0.3s ease',
                            backgroundColor: '#f5f5f5'
                          }}
                          effect="blur"
                          placeholderSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3C/svg%3E"
                          onError={(e) => {
                            const fallback = getFallbackImageByIndex(product.id);
                            if (e.target.src !== fallback) {
                              e.target.src = fallback;
                            }
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = 'scale(1.03)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'scale(1)';
                          }}
                        />
                        {/* Action buttons overlay */}
                        <div style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          display: 'flex',
                          gap: '8px',
                          opacity: 1,
                          transition: 'opacity 0.3s ease'
                        }}
                        >
                          <Button
                            type="primary"
                            shape="circle"
                            icon={<CloseOutlined />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveFromWishlist(product);
                            }}
                            style={{
                              background: 'rgba(255, 77, 79, 1)',
                              borderColor: 'rgba(255, 77, 79, 1)',
                              width: '36px',
                              height: '36px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: '0 2px 8px rgba(255, 77, 79, 0.3)',
                              backdropFilter: 'blur(4px)'
                            }}
                            title="Xóa khỏi danh sách yêu thích"
                          />
                          <Button
                            type="primary"
                            shape="circle"
                            icon={<ShoppingCartOutlined />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(product);
                            }}
                            style={{
                              background: 'rgba(237, 162, 116, 0.9)',
                              borderColor: 'rgba(237, 162, 116, 0.9)',
                              width: '36px',
                              height: '36px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: '0 2px 8px rgba(237, 162, 116, 0.3)',
                              backdropFilter: 'blur(4px)'
                            }}
                            title="Thêm vào giỏ hàng"
                          />
                        </div>
                      </div>
                    }
                  >
                    <div style={{ textAlign: 'center' }}>
                      <h3 
                        style={{ 
                          fontSize: '18px', 
                          fontWeight: '700',
                          color: '#362319',
                          margin: '0 0 8px 0',
                          cursor: 'pointer',
                          fontFamily: "'Inter', 'Noto Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif",
                          lineHeight: '1.3'
                        }}
                        onClick={() => handleViewProduct(product)}
                      >
                        {product.name}
                      </h3>
                      <div style={{ 
                        color: '#553d2d', 
                        fontSize: '13px', 
                        marginBottom: '12px',
                        fontWeight: '500'
                      }}>
                        {product.category?.name}
                      </div>
                      <div style={{ 
                        fontSize: '22px', 
                        fontWeight: '800', 
                        color: '#eda274',
                        marginBottom: '12px',
                        fontFamily: "'Inter', 'Noto Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif"
                      }}>
                        {product.price ? `${product.price.toLocaleString()}đ` : 'Liên hệ'}
                      </div>
                      {/* Add to Cart Button */}
                      <Button
                        type="primary"
                        icon={<ShoppingCartOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                        disabled={product.stock === 0 || isInCart(product.id)}
                        style={{
                          width: '100%',
                          height: '40px',
                          background: product.stock === 0 
                            ? '#ccc' 
                            : isInCart(product.id)
                            ? '#8B4513' // Màu nâu đậm khi đã thêm vào giỏ
                            : '#eda274', // Màu nâu nhạt khi chưa thêm
                          borderColor: product.stock === 0 
                            ? '#ccc' 
                            : isInCart(product.id)
                            ? '#8B4513'
                            : '#eda274',
                          borderRadius: '8px',
                          fontWeight: '600',
                          fontSize: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: (product.stock === 0 || isInCart(product.id)) ? 'not-allowed' : 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          if (product.stock > 0 && !isInCart(product.id)) {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(237, 162, 116, 0.4)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (product.stock > 0 && !isInCart(product.id)) {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                          }
                        }}
                      >
                        {product.stock === 0 
                          ? 'Hết hàng'
                          : isInCart(product.id)
                          ? 'Đã thêm vào giỏ'
                          : 'Thêm vào giỏ'}
                      </Button>
                    </div>
                  </Card>
                </Col>
              ))
              )}
            </Row>
          </>
        )}
      </div>
    </div>
  );
}
