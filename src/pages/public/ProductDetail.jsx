// src/pages/public/ProductDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  Row, 
  Col, 
  Button, 
  Tag, 
  Spin, 
  Alert, 
  Image, 
  Divider,
  Typography,
  Space,
  InputNumber
} from 'antd';
import { 
  ShoppingCartOutlined, 
  ArrowLeftOutlined,
  HeartOutlined,
  ShareAltOutlined
} from '@ant-design/icons';
import { getProductById } from '../../services/products';
import { useCart } from '../../context/CartContext';
import { getFallbackImageByIndex } from '../../utils/imageUtils';

const { Title, Paragraph, Text } = Typography;

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    let isMounted = true;

    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('📱 ProductDetail: Loading product', { id });
        
        const data = await getProductById(id);
        
        if (!isMounted) return;
        
        console.log('📱 ProductDetail: Product loaded', data);
        setProduct(data);
      } catch (e) {
        if (!isMounted) return;
        console.error('📱 ProductDetail: Error loading product', e);
        setError(e?.message || 'Không thể tải thông tin sản phẩm.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    console.log('🛒 Add to cart:', { product, quantity });
  };

  const handleBuyNow = () => {
    // TODO: Implement buy now functionality
    console.log('💳 Buy now:', { product, quantity });
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16, fontSize: 16, color: '#666' }}>
          Đang tải thông tin sản phẩm...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px' }}>
        <Alert
          message="Lỗi tải dữ liệu"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: 20 }}
        />
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/shop')}>
          Quay lại cửa hàng
        </Button>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ padding: '20px' }}>
        <Alert
          message="Không tìm thấy sản phẩm"
          description="Sản phẩm bạn tìm kiếm không tồn tại hoặc đã bị xóa."
          type="warning"
          showIcon
          style={{ marginBottom: 20 }}
        />
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/shop')}>
          Quay lại cửa hàng
        </Button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      {/* Back Button */}
      <Button 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate('/shop')}
        style={{ marginBottom: 20 }}
      >
        Quay lại cửa hàng
      </Button>

      <Row gutter={[24, 24]}>
        {/* Product Images */}
        <Col xs={24} lg={12}>
          <Card>
            <Image
              alt={product.name}
              src={product.image || getFallbackImageByIndex(product.id)}
              style={{ width: '100%' }}
              fallback={getFallbackImageByIndex(product.id)}
            />
          </Card>
        </Col>

        {/* Product Info */}
        <Col xs={24} lg={12}>
          <Card>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              {/* Category */}
              {product.category && (
                <Tag color="blue">{product.category.name}</Tag>
              )}

              {/* Product Name */}
              <Title level={2} style={{ margin: 0 }}>
                {product.name}
              </Title>

              {/* Price */}
              <div>
                <Text style={{ fontSize: 24, fontWeight: 700, color: '#1890ff' }}>
                  {product.price ? `${product.price.toLocaleString()}đ` : 'Liên hệ'}
                </Text>
              </div>

              {/* Stock Status */}
              {product.stock !== undefined && (
                <div>
                  <Tag color={product.stock > 0 ? 'green' : 'red'}>
                    {product.stock > 0 ? `Còn ${product.stock} sản phẩm` : 'Hết hàng'}
                  </Tag>
                </div>
              )}

              {/* Description */}
              {product.description && (
                <div>
                  <Title level={4}>Mô tả sản phẩm</Title>
                  <Paragraph>{product.description}</Paragraph>
                </div>
              )}

              <Divider />

              {/* Quantity & Actions */}
              <div>
                <Space size="large" align="center">
                  <div>
                    <Text strong>Số lượng:</Text>
                    <InputNumber
                      min={1}
                      max={product.stock || 999}
                      value={quantity}
                      onChange={setQuantity}
                      style={{ marginLeft: 8, width: 80 }}
                    />
                  </div>
                </Space>
              </div>

              <Space size="middle">
                <Button
                  type="primary"
                  size="large"
                  icon={<ShoppingCartOutlined />}
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  Thêm vào giỏ
                </Button>
                <Button
                  type="primary"
                  size="large"
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                >
                  Mua ngay
                </Button>
              </Space>

              {/* Additional Actions */}
              <Space>
                <Button icon={<HeartOutlined />} type="text">
                  Yêu thích
                </Button>
                <Button icon={<ShareAltOutlined />} type="text">
                  Chia sẻ
                </Button>
              </Space>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Product Details */}
      {product.details && (
        <Card title="Chi tiết sản phẩm" style={{ marginTop: 24 }}>
          <Paragraph>{product.details}</Paragraph>
        </Card>
      )}
    </div>
  );
}
