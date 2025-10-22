// src/pages/public/ProductCardDemo.jsx
import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Button } from 'antd';
import { getAllProducts } from '../../services/products';
import ProductCard from '../../components/common/ProductCard';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { message } from 'antd';

const { Title } = Typography;

export default function ProductCardDemo() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { toggleWishlist } = useWishlist();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getAllProducts();
      setProducts(data.slice(0, 6)); // Show first 6 products
    } catch (error) {
      console.error('Error loading products:', error);
      message.error('Không thể tải sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product, 1);
      message.success(`Đã thêm ${product.name} vào giỏ hàng!`);
    } catch (error) {
      message.error('Không thể thêm vào giỏ hàng');
    }
  };

  const handleAddToWishlist = (product) => {
    toggleWishlist(product);
    message.success(`Đã thêm ${product.name} vào wishlist!`);
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fff 0%, #ffeadd 100%)',
      fontFamily: 'Poppins, Arial, sans-serif',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Title level={1} style={{ 
          textAlign: 'center', 
          color: '#362319',
          marginBottom: '40px'
        }}>
          🛍️ Product Card Demo
        </Title>
        
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Button 
            type="primary" 
            onClick={loadProducts}
            loading={loading}
            style={{
              background: '#eda274',
              borderColor: '#eda274',
              borderRadius: '8px',
              fontWeight: '600'
            }}
          >
            Tải lại sản phẩm
          </Button>
        </div>

        <Row gutter={[24, 24]}>
          {products.map((product) => (
            <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
              <ProductCard 
                product={product}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
              />
            </Col>
          ))}
        </Row>

        {products.length === 0 && !loading && (
          <Card style={{ textAlign: 'center', padding: '60px 20px' }}>
            <Title level={3} style={{ color: '#553d2d' }}>
              Không có sản phẩm nào
            </Title>
            <p style={{ color: '#553d2d' }}>
              Nhấn nút "Tải lại sản phẩm" để load dữ liệu
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
