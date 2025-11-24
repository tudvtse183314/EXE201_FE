// src/pages/public/ProductDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Row,
  Col,
  Button,
  InputNumber,
  Typography,
  Space,
  Spin,
  Alert,
  Image,
  Tag,
  Divider,
  Breadcrumb,
  List,
  Rate,
  Form,
  Input,
  Empty,
  Avatar
} from 'antd';
import {
  ArrowLeftOutlined,
  ShoppingCartOutlined,
  HeartOutlined,
  CheckCircleOutlined,
  StarOutlined,
  UserOutlined,
  SendOutlined
} from '@ant-design/icons';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useWishlist } from '../../context/WishlistContext';
import { getProductById } from '../../services/products';
import { getReviewsByProductId, createReview } from '../../services/reviews';
import { getFallbackImageByIndex } from '../../utils/imageUtils';
import { THEME } from '../../constants/theme';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const formatCurrency = (value) => {
  if (typeof value !== 'number') return '--';
  return `${value.toLocaleString('vi-VN')}đ`;
};

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { showSuccess, showError, showWarning } = useToast();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewForm] = Form.useForm();

  useEffect(() => {
    loadProduct();
    loadReviews();
  }, [id]);

  const loadProduct = async () => {
    if (!id) {
      setError('Không tìm thấy ID sản phẩm');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const productData = await getProductById(id);
      setProduct(productData);
    } catch (err) {
      console.error('📦 ProductDetail: Error loading product', err);
      const message = err?.response?.data?.message || err?.message || 'Không thể tải thông tin sản phẩm.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    if (!id) return;

    try {
      setLoadingReviews(true);
      const reviewsData = await getReviewsByProductId(id);
      setReviews(Array.isArray(reviewsData) ? reviewsData : []);
    } catch (err) {
      console.error('⭐ ProductDetail: Error loading reviews', err);
      // Don't show error, just set empty array
      setReviews([]);
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleSubmitReview = async (values) => {
    if (!user) {
      showWarning('Vui lòng đăng nhập để đánh giá sản phẩm');
      navigate('/login', { state: { from: `/product/${id}` } });
      return;
    }

    if (!product) return;

    try {
      setSubmittingReview(true);
      const reviewData = {
        productId: product.id,
        rating: values.rating,
        comment: values.comment,
        userId: user.id
      };
      await createReview(reviewData);
      showSuccess('Đánh giá của bạn đã được gửi thành công!');
      reviewForm.resetFields();
      await loadReviews(); // Reload reviews
    } catch (err) {
      console.error('⭐ ProductDetail: Error submitting review', err);
      const message = err?.response?.data?.message || err?.message || 'Không thể gửi đánh giá.';
      showError(message);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      showWarning('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
      navigate('/login', { state: { from: `/product/${id}` } });
      return;
    }

    if (!product) return;

    if (product.stock <= 0) {
      showError('Sản phẩm đã hết hàng');
      return;
    }

    if (quantity > product.stock) {
      showError(`Chỉ còn ${product.stock} sản phẩm trong kho`);
      return;
    }

    try {
      setAddingToCart(true);
      await addToCart(product, quantity);
      showSuccess(`Đã thêm ${quantity} ${product.name} vào giỏ hàng`);
    } catch (err) {
      console.error('📦 ProductDetail: Error adding to cart', err);
      const message = err?.response?.data?.message || err?.message || 'Không thể thêm sản phẩm vào giỏ hàng';
      showError(message);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    if (user) {
      navigate('/customer/checkout');
    }
  };

  const handleWishlistToggle = () => {
    if (!user) {
      showWarning('Vui lòng đăng nhập để thêm vào yêu thích');
      navigate('/login', { state: { from: `/product/${id}` } });
      return;
    }

    if (product) {
      toggleWishlist(product);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', minHeight: '60vh' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>Đang tải thông tin sản phẩm...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px' }}>
        <Alert
          message="Không thể tải sản phẩm"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
            Quay lại
          </Button>
          <Button type="primary" onClick={() => navigate('/shop')}>
            Đến cửa hàng
          </Button>
        </Space>
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
          style={{ marginBottom: 16 }}
        />
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/shop')}>
          Quay về cửa hàng
        </Button>
      </div>
    );
  }

  const imageUrl = product.imageUrl || getFallbackImageByIndex(product.id);
  const isOutOfStock = product.stock <= 0;
  const maxQuantity = Math.min(product.stock || 999, 999);
  const isInWishlistState = isInWishlist(product.id);

  return (
    <div style={{ padding: '20px', minHeight: '100vh', background: '#f5f5f5' }}>
      <Breadcrumb
        style={{ marginBottom: 16 }}
        items={[
          { title: <a onClick={() => navigate('/')}>Trang chủ</a> },
          { title: <a onClick={() => navigate('/shop')}>Cửa hàng</a> },
          { title: product.name }
        ]}
      />

      <Card>
        <Row gutter={[32, 32]}>
          {/* Product Image */}
          <Col xs={24} md={12} lg={10}>
            <div style={{ textAlign: 'center' }}>
              <Image
                src={imageUrl}
                alt={product.name}
                fallback={getFallbackImageByIndex(product.id)}
                style={{
                  width: '100%',
                  maxWidth: 500,
                  borderRadius: 12,
                  objectFit: 'cover'
                }}
                preview={{
                  mask: 'Xem ảnh lớn'
                }}
              />
              {product.badge && (
                <Tag
                  color="red"
                  style={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    fontSize: 14,
                    padding: '4px 12px'
                  }}
                >
                  {product.badge}
                </Tag>
              )}
            </div>
          </Col>

          {/* Product Info */}
          <Col xs={24} md={12} lg={14}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              {/* Title and Category */}
              <div>
                {product.category && (
                  <Tag color="blue" style={{ marginBottom: 8 }}>
                    {product.category.name || product.category}
                  </Tag>
                )}
                <Title level={2} style={{ margin: 0 }}>
                  {product.name}
                </Title>
                {product.type && (
                  <Text type="secondary">Loại: {product.type}</Text>
                )}
              </div>

              <Divider style={{ margin: '16px 0' }} />

              {/* Price */}
              <div>
                <Space size="large" align="baseline">
                  <Text strong style={{ fontSize: 32, color: '#eda274' }}>
                    {formatCurrency(product.price)}
                  </Text>
                  {product.salePrice && product.salePrice < product.price && (
                    <Text delete type="secondary" style={{ fontSize: 20 }}>
                      {formatCurrency(product.salePrice)}
                    </Text>
                  )}
                </Space>
              </div>

              {/* Stock Status */}
              <div>
                {isOutOfStock ? (
                  <Alert
                    message="Hết hàng"
                    description="Sản phẩm hiện đang hết hàng. Vui lòng quay lại sau."
                    type="warning"
                    showIcon
                  />
                ) : (
                  <Space>
                    <Text strong>Tình trạng:</Text>
                    <Tag color="green" icon={<CheckCircleOutlined />}>
                      Còn hàng ({product.stock} sản phẩm)
                    </Tag>
                  </Space>
                )}
              </div>

              <Divider style={{ margin: '16px 0' }} />

              {/* Quantity Selector */}
              {!isOutOfStock && (
                <div>
                  <Space size="middle" align="center">
                    <Text strong>Số lượng:</Text>
                    <InputNumber
                      min={1}
                      max={maxQuantity}
                      value={quantity}
                      onChange={(value) => setQuantity(value || 1)}
                      style={{ width: 100 }}
                    />
                    <Text type="secondary">(Tối đa: {maxQuantity})</Text>
                  </Space>
                </div>
              )}

              {/* Description */}
              {product.description && (
                <div>
                  <Title level={5}>Mô tả sản phẩm</Title>
                  <Text>{product.description}</Text>
                </div>
              )}

              <Divider style={{ margin: '16px 0' }} />

              {/* Action Buttons */}
              <Space size="middle" wrap style={{ width: '100%' }}>
                <Button
                  type="primary"
                  size="large"
                  icon={<ShoppingCartOutlined />}
                  onClick={handleAddToCart}
                  loading={addingToCart}
                  disabled={isOutOfStock}
                  style={{
                    flex: 1,
                    minWidth: 200,
                    background: '#eda274',
                    borderColor: '#eda274',
                    height: 48
                  }}
                >
                  Thêm vào giỏ hàng
                </Button>
                <Button
                  size="large"
                  icon={<ShoppingCartOutlined />}
                  onClick={handleBuyNow}
                  loading={addingToCart}
                  disabled={isOutOfStock}
                  style={{
                    flex: 1,
                    minWidth: 200,
                    height: 48
                  }}
                >
                  Mua ngay
                </Button>
                <Button
                  size="large"
                  icon={<HeartOutlined />}
                  onClick={handleWishlistToggle}
                  danger={isInWishlistState}
                  style={{
                    height: 48,
                    width: 48
                  }}
                >
                  {isInWishlistState ? 'Đã yêu thích' : 'Yêu thích'}
                </Button>
              </Space>

              {/* Additional Info */}
              <div style={{ marginTop: 24 }}>
                <Space direction="vertical" size="small">
                  <Text type="secondary">
                    <strong>Mã sản phẩm:</strong> #{product.id}
                  </Text>
                  {product.type && (
                    <Text type="secondary">
                      <strong>Loại:</strong> {product.type}
                    </Text>
                  )}
                </Space>
              </div>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Reviews Section */}
      <div style={{ marginTop: 32 }}>
        <Card>
          <Title level={4}>
            <StarOutlined style={{ color: THEME.colors.warning, marginRight: 8 }} />
            Đánh giá sản phẩm ({reviews.length})
          </Title>

          {/* Review Form */}
          {user && (
            <Card
              type="inner"
              style={{
                marginBottom: 24,
                background: THEME.colors.backgroundLight,
                borderRadius: THEME.borderRadius.medium
              }}
            >
              <Form
                form={reviewForm}
                layout="vertical"
                onFinish={handleSubmitReview}
              >
                <Form.Item
                  name="rating"
                  label="Đánh giá của bạn"
                  rules={[{ required: true, message: 'Vui lòng chọn số sao' }]}
                >
                  <Rate />
                </Form.Item>
                <Form.Item
                  name="comment"
                  label="Nhận xét"
                  rules={[
                    { required: true, message: 'Vui lòng nhập nhận xét' },
                    { min: 10, message: 'Nhận xét phải có ít nhất 10 ký tự' }
                  ]}
                >
                  <TextArea
                    rows={4}
                    placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                    maxLength={500}
                    showCount
                  />
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={submittingReview}
                    icon={<SendOutlined />}
                    style={{
                      background: THEME.colors.primary,
                      borderColor: THEME.colors.primary
                    }}
                  >
                    Gửi đánh giá
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          )}

          {/* Reviews List */}
          {loadingReviews ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <Spin />
            </div>
          ) : reviews.length === 0 ? (
            <Empty
              description="Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá sản phẩm này!"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ) : (
            <List
              dataSource={reviews}
              renderItem={(review) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        icon={<UserOutlined />}
                        style={{ background: THEME.colors.primary }}
                      />
                    }
                    title={
                      <Space>
                        <Text strong>{review.user?.fullName || review.account?.fullName || 'Khách hàng'}</Text>
                        <Rate
                          disabled
                          value={review.rating || 0}
                          style={{ fontSize: 14 }}
                        />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {review.createdAt
                            ? new Date(review.createdAt).toLocaleDateString('vi-VN')
                            : ''}
                        </Text>
                      </Space>
                    }
                    description={
                      <Paragraph style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                        {review.comment || review.content || 'Không có nhận xét'}
                      </Paragraph>
                    }
                  />
                </List.Item>
              )}
            />
          )}
        </Card>
      </div>

      {/* Additional Info Section */}
      <div style={{ marginTop: 32 }}>
        <Card>
          <Title level={4}>Thông tin bổ sung</Title>
          <Space direction="vertical" size="middle">
            <Text>
              <strong>Chính sách giao hàng:</strong> Miễn phí vận chuyển cho đơn hàng trên 500.000đ
            </Text>
            <Text>
              <strong>Chính sách đổi trả:</strong> Đổi trả trong vòng 7 ngày nếu sản phẩm lỗi
            </Text>
            <Text>
              <strong>Hỗ trợ:</strong> Liên hệ hotline 1900-xxxx để được tư vấn
            </Text>
          </Space>
        </Card>
      </div>
    </div>
  );
}
