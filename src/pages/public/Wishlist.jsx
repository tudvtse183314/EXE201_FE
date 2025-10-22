// src/pages/public/Wishlist.jsx
import React from 'react';
import { Card, Row, Col, Button, Empty, message } from 'antd';
import { HeartOutlined, ShoppingCartOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { getFallbackImageByIndex } from '../../utils/imageUtils';

export default function Wishlist() {
  const navigate = useNavigate();
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product, 1);
      message.success("Đã thêm vào giỏ hàng!");
    } catch (error) {
      message.error("Không thể thêm vào giỏ hàng. Vui lòng thử lại!");
    }
  };

  const handleRemoveFromWishlist = (product) => {
    removeFromWishlist(product.id);
    message.info("Đã xóa khỏi danh sách yêu thích!");
  };

  const handleViewProduct = (product) => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: '#fff',
      fontFamily: 'Poppins, Arial, sans-serif'
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
              fontFamily: 'Poppins, Arial, sans-serif'
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
        {wishlist.length === 0 ? (
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
              {wishlist.map((product) => (
                <Col xs={24} sm={12} md={8} lg={6} xl={4} xxl={4} key={product.id}>
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
                    bodyStyle={{ padding: '20px' }}
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
                        <img
                          alt={product.name}
                          src={product.image || getFallbackImageByIndex(product.id)}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.3s ease'
                          }}
                          loading="lazy"
                          onError={(e) => {
                            e.target.src = getFallbackImageByIndex(product.id);
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
                          opacity: 0,
                          transition: 'opacity 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.opacity = '1';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.opacity = '0';
                        }}
                        >
                          <Button
                            type="primary"
                            shape="circle"
                            icon={<HeartOutlined />}
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
                          fontFamily: 'Poppins, Arial, sans-serif',
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
                        fontFamily: 'Poppins, Arial, sans-serif'
                      }}>
                        {product.price ? `${product.price.toLocaleString()}đ` : 'Liên hệ'}
                      </div>
                      {product.stock !== undefined && (
                        <div style={{ 
                          fontSize: '12px', 
                          color: product.stock > 0 ? '#52c41a' : '#ff4d4f',
                          fontWeight: '600'
                        }}>
                          {product.stock > 0 ? `Còn ${product.stock}` : 'Hết hàng'}
                        </div>
                      )}
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </>
        )}
      </div>
    </div>
  );
}
