// src/pages/public/ProductDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Button, Tag, Spin, Alert, InputNumber, message, Image } from 'antd';
import { ShoppingCartOutlined, HeartOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { getProductById, getAllProducts } from '../../services/products';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { getFallbackImageByIndex } from '../../utils/imageUtils';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("📦 ProductDetail: Loading product", { id });
        
        const data = await getProductById(id);
        console.log("📦 ProductDetail: Product loaded", data);
        
        setProduct(data);
        
        // Load related products
        const allProducts = await getAllProducts();
        const related = allProducts
          .filter(p => p.category?.id === data.category?.id && p.id !== data.id)
          .slice(0, 4);
        setRelatedProducts(related);
      } catch (e) {
        console.error("📦 ProductDetail: Error loading product", e);
        setError(e?.message || "Không thể tải thông tin sản phẩm.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      message.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
    }
  };

  const handleWishlist = () => {
    if (product) {
      toggleWishlist(product);
      const isAdded = isInWishlist(product.id);
      if (isAdded) {
        message.success("Đã thêm vào danh sách yêu thích!");
      } else {
        message.info("Đã xóa khỏi danh sách yêu thích!");
      }
    }
  };

  if (loading) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '100px 20px',
        background: 'linear-gradient(135deg, #fff 0%, #ffeadd 100%)',
        minHeight: '100vh'
      }}>
        <Spin size="large" />
        <div style={{ marginTop: 16, fontSize: 16, color: '#553d2d' }}>
          Đang tải thông tin sản phẩm...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        padding: '100px 20px',
        background: 'linear-gradient(135deg, #fff 0%, #ffeadd 100%)',
        minHeight: '100vh'
      }}>
        <Alert
          message="Lỗi tải dữ liệu"
          description={error}
          type="error"
          showIcon
          style={{ margin: '0 auto', maxWidth: '600px' }}
        />
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ 
        padding: '100px 20px',
        background: 'linear-gradient(135deg, #fff 0%, #ffeadd 100%)',
        minHeight: '100vh'
      }}>
        <Alert
          message="Không tìm thấy sản phẩm"
          description="Sản phẩm bạn tìm kiếm không tồn tại hoặc đã bị xóa."
          type="warning"
          showIcon
          style={{ margin: '0 auto', maxWidth: '600px' }}
        />
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fff 0%, #ffeadd 100%)',
      fontFamily: 'Poppins, Arial, sans-serif'
    }}>
      {/* Container chính giữa */}
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '20px'
      }}>
        {/* Back button */}
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate(-1)}
          style={{
            marginBottom: '24px',
            background: '#eda274',
            borderColor: '#eda274',
            color: '#fff',
            fontWeight: '600'
          }}
        >
          Quay lại
        </Button>

        <Row gutter={[48, 48]}>
          {/* Product Image */}
          <Col xs={24} lg={12}>
            <Card
              style={{
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                border: 'none'
              }}
              bodyStyle={{ padding: 0 }}
            >
              <div style={{ height: '500px', overflow: 'hidden' }}>
                <img
                  alt={product.name}
                  src={product.image || getFallbackImageByIndex(product.id)}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                  onError={(e) => {
                    e.target.src = getFallbackImageByIndex(product.id);
                  }}
                />
              </div>
            </Card>
          </Col>

          {/* Product Info */}
          <Col xs={24} lg={12}>
            <div style={{ padding: '20px 0' }}>
              <Tag 
                color="#eda274"
                style={{ 
                  fontSize: '14px',
                  fontWeight: '600',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  marginBottom: '16px'
                }}
              >
                {product.category?.name || 'Sản phẩm'}
              </Tag>

              <h1 style={{
                fontSize: '32px',
                fontWeight: '800',
                color: '#362319',
                margin: '0 0 16px 0',
                lineHeight: '1.2'
              }}>
                {product.name}
              </h1>

              <div style={{
                fontSize: '28px',
                fontWeight: '800',
                color: '#eda274',
                marginBottom: '24px',
                fontFamily: 'Poppins, Arial, sans-serif'
              }}>
                {product.price ? `${product.price.toLocaleString()}đ` : 'Liên hệ'}
              </div>

              {product.description && (
                <div style={{
                  fontSize: '16px',
                  color: '#553d2d',
                  lineHeight: '1.6',
                  marginBottom: '24px'
                }}>
                  {product.description}
                </div>
              )}

              {product.stock !== undefined && (
                <div style={{ marginBottom: '24px' }}>
                  <Tag 
                    color={product.stock > 0 ? 'green' : 'red'}
                    style={{ 
                      fontSize: '14px',
                      fontWeight: '600',
                      padding: '8px 16px',
                      borderRadius: '20px'
                    }}
                  >
                    {product.stock > 0 ? `Còn ${product.stock} sản phẩm` : 'Hết hàng'}
                  </Tag>
                </div>
              )}

              {/* Quantity and Actions */}
              <div style={{ marginBottom: '32px' }}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '16px', 
                    fontWeight: '600',
                    color: '#362319',
                    marginBottom: '8px'
                  }}>
                    Số lượng:
                  </label>
                  <InputNumber
                    min={1}
                    max={product.stock || 999}
                    value={quantity}
                    onChange={setQuantity}
                    style={{ width: '120px' }}
                    size="large"
                  />
                </div>

                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12}>
                    <Button
                      type="primary"
                      icon={<ShoppingCartOutlined />}
                      onClick={handleAddToCart}
                      disabled={!product.stock || product.stock <= 0}
                      size="large"
                      style={{
                        width: '100%',
                        height: '48px',
                        background: '#eda274',
                        borderColor: '#eda274',
                        fontSize: '16px',
                        fontWeight: '600',
                        borderRadius: '12px'
                      }}
                    >
                      Thêm vào giỏ hàng
                    </Button>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Button
                      icon={<HeartOutlined />}
                      onClick={handleWishlist}
                      size="large"
                      style={{
                        width: '100%',
                        height: '48px',
                        borderColor: '#eda274',
                        color: isInWishlist(product?.id) ? '#ff4d4f' : '#eda274',
                        fontSize: '16px',
                        fontWeight: '600',
                        borderRadius: '12px',
                        background: isInWishlist(product?.id) ? '#ffeadd' : 'transparent'
                      }}
                    >
                      {isInWishlist(product?.id) ? 'Đã yêu thích' : 'Yêu thích'}
                    </Button>
                  </Col>
                </Row>
              </div>

              {/* Product Details */}
              <Card
                title="Thông tin sản phẩm"
                style={{
                  borderRadius: '12px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                  border: 'none'
                }}
              >
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <div style={{ fontSize: '14px', color: '#553d2d' }}>Mã sản phẩm:</div>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#362319' }}>
                      #{product.id}
                    </div>
                  </Col>
                  <Col span={12}>
                    <div style={{ fontSize: '14px', color: '#553d2d' }}>Danh mục:</div>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#362319' }}>
                      {product.category?.name || 'N/A'}
                    </div>
                  </Col>
                  {product.type && (
                    <Col span={12}>
                      <div style={{ fontSize: '14px', color: '#553d2d' }}>Loại:</div>
                      <div style={{ fontSize: '16px', fontWeight: '600', color: '#362319' }}>
                        {product.type}
                      </div>
                    </Col>
                  )}
                  <Col span={12}>
                    <div style={{ fontSize: '14px', color: '#553d2d' }}>Tình trạng:</div>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#362319' }}>
                      {product.stock > 0 ? 'Còn hàng' : 'Hết hàng'}
                    </div>
                  </Col>
                </Row>
              </Card>
            </div>
          </Col>
        </Row>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div style={{ marginTop: '80px' }}>
            <h2 style={{
              fontSize: '28px',
              fontWeight: '800',
              color: '#362319',
              marginBottom: '32px',
              textAlign: 'center',
              fontFamily: 'Poppins, Arial, sans-serif'
            }}>
              Sản phẩm liên quan
            </h2>
            <Row gutter={[24, 24]}>
              {relatedProducts.map((relatedProduct) => (
                <Col xs={24} sm={12} md={8} lg={6} key={relatedProduct.id}>
                  <Card
                    hoverable
                    style={{
                      borderRadius: '16px',
                      overflow: 'hidden',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                      border: 'none',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                    bodyStyle={{ padding: '16px' }}
                    cover={
                      <div 
                        style={{ 
                          height: '200px', 
                          overflow: 'hidden'
                        }}
                        onClick={() => navigate(`/product/${relatedProduct.id}`)}
                      >
                        <img
                          alt={relatedProduct.name}
                          src={relatedProduct.image || getFallbackImageByIndex(relatedProduct.id)}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.3s ease'
                          }}
                          loading="lazy"
                          onError={(e) => {
                            e.target.src = getFallbackImageByIndex(relatedProduct.id);
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = 'scale(1.05)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'scale(1)';
                          }}
                        />
                      </div>
                    }
                    onClick={() => navigate(`/product/${relatedProduct.id}`)}
                  >
                    <div style={{ textAlign: 'center' }}>
                      <h4 style={{ 
                        fontSize: '16px', 
                        fontWeight: '700',
                        color: '#362319',
                        margin: '0 0 8px 0',
                        fontFamily: 'Poppins, Arial, sans-serif'
                      }}>
                        {relatedProduct.name}
                      </h4>
                      <div style={{ 
                        fontSize: '18px', 
                        fontWeight: '800', 
                        color: '#eda274',
                        fontFamily: 'Poppins, Arial, sans-serif'
                      }}>
                        {relatedProduct.price ? `${relatedProduct.price.toLocaleString()}đ` : 'Liên hệ'}
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )}
      </div>
    </div>
  );
}