// src/pages/staff/StaffReviewsPage.jsx
import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Card, 
  Typography, 
  Row, 
  Col,
  Input as AntInput,
  Spin,
  Alert,
  Empty,
  Tag,
  Select,
  Space,
  Modal,
  Rate,
  Avatar,
  Tooltip,
  Badge
} from 'antd';
import { 
  ReloadOutlined,
  SearchOutlined,
  EyeOutlined,
  StarOutlined,
  UserOutlined,
  MessageOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Search } = AntInput;
const { Option } = Select;

// Mock reviews data - sẽ được thay thế bằng API thực tế
const mockReviews = [
  {
    id: 1,
    productId: 1,
    productName: 'Premium Dog Collar',
    customerName: 'Nguyễn Văn A',
    customerEmail: 'nguyenvana@email.com',
    rating: 5,
    comment: 'Sản phẩm rất tốt, chất lượng cao. Chó của tôi rất thích!',
    createdAt: '2024-01-15T10:30:00Z',
    status: 'APPROVED',
    helpful: 12
  },
  {
    id: 2,
    productId: 2,
    productName: 'Interactive Dog Toy',
    customerName: 'Trần Thị B',
    customerEmail: 'tranthib@email.com',
    rating: 4,
    comment: 'Đồ chơi hay, chó chơi rất vui. Nhưng giá hơi cao.',
    createdAt: '2024-01-14T15:20:00Z',
    status: 'PENDING',
    helpful: 8
  },
  {
    id: 3,
    productId: 3,
    productName: 'Dog Food Bowl Set',
    customerName: 'Lê Văn C',
    customerEmail: 'levanc@email.com',
    rating: 5,
    comment: 'Bát ăn rất đẹp và chất lượng tốt. Dễ vệ sinh.',
    createdAt: '2024-01-13T09:15:00Z',
    status: 'APPROVED',
    helpful: 15
  },
  {
    id: 4,
    productId: 4,
    productName: 'Cozy Dog Bed',
    customerName: 'Phạm Thị D',
    customerEmail: 'phamthid@email.com',
    rating: 3,
    comment: 'Giường đẹp nhưng kích thước hơi nhỏ so với chó của tôi.',
    createdAt: '2024-01-12T14:45:00Z',
    status: 'REJECTED',
    helpful: 3
  },
  {
    id: 5,
    productId: 5,
    productName: 'Dog Leash',
    customerName: 'Hoàng Văn E',
    customerEmail: 'hoangvane@email.com',
    rating: 4,
    comment: 'Dây dắt chắc chắn, giá hợp lý.',
    createdAt: '2024-01-11T11:30:00Z',
    status: 'APPROVED',
    helpful: 6
  }
];

export default function StaffReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const [selectedReview, setSelectedReview] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const loadReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("⭐ StaffReviewsPage: Loading reviews...");
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("⭐ StaffReviewsPage: Reviews loaded", mockReviews);
      setReviews(mockReviews);
      setFilteredReviews(mockReviews);
    } catch (e) {
      console.error("⭐ StaffReviewsPage: Error loading reviews", e);
      setError(e?.message || "Không thể tải danh sách đánh giá.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  // Filter reviews based on search term, status, and rating
  useEffect(() => {
    let filtered = reviews;

    if (searchTerm) {
      filtered = filtered.filter(review =>
        review.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.comment?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedStatus) {
      filtered = filtered.filter(review => review.status === selectedStatus);
    }

    if (selectedRating) {
      filtered = filtered.filter(review => review.rating === parseInt(selectedRating));
    }

    setFilteredReviews(filtered);
  }, [searchTerm, selectedStatus, selectedRating, reviews]);

  const handleStatusUpdate = async (reviewId, newStatus) => {
    try {
      console.log("⭐ StaffReviewsPage: Updating review status", { reviewId, newStatus });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setReviews(prev => prev.map(review => 
        review.id === reviewId ? { ...review, status: newStatus } : review
      ));
      
      console.log("⭐ StaffReviewsPage: Review status updated");
    } catch (error) {
      console.error("⭐ StaffReviewsPage: Error updating review status", error);
    }
  };

  const showReviewDetail = (review) => {
    setSelectedReview(review);
    setIsDetailModalOpen(true);
  };

  const getStatusColor = (status) => {
    const colors = {
      'PENDING': 'orange',
      'APPROVED': 'green',
      'REJECTED': 'red'
    };
    return colors[status] || 'default';
  };

  const getStatusText = (status) => {
    const texts = {
      'PENDING': 'Chờ duyệt',
      'APPROVED': 'Đã duyệt',
      'REJECTED': 'Từ chối'
    };
    return texts[status] || status;
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      sorter: (a, b) => a.id - b.id,
      render: (id) => (
        <Text strong style={{ color: 'var(--pv-primary, #eda274)' }}>
          #{id}
        </Text>
      ),
    },
    {
      title: 'Sản phẩm',
      dataIndex: 'productName',
      key: 'productName',
      render: (productName) => (
        <Text strong style={{ color: 'var(--pv-text-heading, #2a1a10)' }}>
          {productName}
        </Text>
      ),
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
      render: (name, record) => (
        <Space>
          <Avatar size="small" icon={<UserOutlined />} />
          <div>
            <Text strong>{name}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {record.customerEmail}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Đánh giá',
      dataIndex: 'rating',
      key: 'rating',
      sorter: (a, b) => a.rating - b.rating,
      render: (rating) => (
        <Rate 
          disabled 
          value={rating} 
          style={{ fontSize: '16px' }}
        />
      ),
    },
    {
      title: 'Bình luận',
      dataIndex: 'comment',
      key: 'comment',
      ellipsis: true,
      render: (comment) => (
        <Tooltip title={comment}>
          <Text style={{ color: 'var(--pv-text-muted, #7e5c48)' }}>
            {comment?.substring(0, 50)}...
          </Text>
        </Tooltip>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag 
          color={getStatusColor(status)}
          style={{ borderRadius: '6px' }}
        >
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: 'Hữu ích',
      dataIndex: 'helpful',
      key: 'helpful',
      sorter: (a, b) => a.helpful - b.helpful,
      render: (helpful) => (
        <Badge 
          count={helpful} 
          style={{ backgroundColor: 'var(--pv-primary, #eda274)' }}
        />
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      render: (date) => (
        <Text style={{ color: 'var(--pv-text-muted, #7e5c48)' }}>
          {new Date(date).toLocaleDateString('vi-VN')}
        </Text>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => showReviewDetail(record)}
              style={{ color: 'var(--pv-primary, #eda274)' }}
            />
          </Tooltip>
          
          {record.status === 'PENDING' && (
            <>
              <Tooltip title="Duyệt">
                <Button
                  type="text"
                  icon={<StarOutlined />}
                  onClick={() => handleStatusUpdate(record.id, 'APPROVED')}
                  style={{ color: '#52c41a' }}
                />
              </Tooltip>
              <Tooltip title="Từ chối">
                <Button
                  type="text"
                  icon={<MessageOutlined />}
                  onClick={() => handleStatusUpdate(record.id, 'REJECTED')}
                  style={{ color: '#ff4d4f' }}
                />
              </Tooltip>
            </>
          )}
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px', fontSize: '16px', color: '#666' }}>
          Đang tải danh sách đánh giá...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Lỗi tải dữ liệu"
        description={error}
        type="error"
        showIcon
        action={
          <Button size="small" danger onClick={loadReviews}>
            Thử lại
          </Button>
        }
      />
    );
  }

  return (
    <div>
      {/* Header */}
      <Card 
        style={{ 
          marginBottom: '24px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #fff 0%, #ffeadd 100%)'
        }}
      >
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={3} style={{ margin: 0, color: 'var(--pv-text-heading, #2a1a10)' }}>
              ⭐ Quản lý đánh giá
            </Title>
            <Text style={{ color: 'var(--pv-text-muted, #7e5c48)' }}>
              Xem và duyệt đánh giá sản phẩm từ khách hàng
            </Text>
          </Col>
          <Col>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={loadReviews}
              style={{ borderRadius: '8px' }}
            >
              Làm mới
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Search and Filters */}
      <Card style={{ marginBottom: '24px', borderRadius: '12px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={6}>
            <Search
              placeholder="Tìm kiếm đánh giá..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="Lọc theo trạng thái"
              allowClear
              size="large"
              style={{ width: '100%' }}
              value={selectedStatus}
              onChange={setSelectedStatus}
            >
              <Option value="PENDING">Chờ duyệt</Option>
              <Option value="APPROVED">Đã duyệt</Option>
              <Option value="REJECTED">Từ chối</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="Lọc theo điểm"
              allowClear
              size="large"
              style={{ width: '100%' }}
              value={selectedRating}
              onChange={setSelectedRating}
            >
              <Option value="5">5 sao</Option>
              <Option value="4">4 sao</Option>
              <Option value="3">3 sao</Option>
              <Option value="2">2 sao</Option>
              <Option value="1">1 sao</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Text style={{ color: 'var(--pv-text-muted, #7e5c48)' }}>
              Hiển thị {filteredReviews.length} đánh giá
            </Text>
          </Col>
        </Row>
      </Card>

      {/* Reviews Table */}
      <Card 
        style={{ 
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #fff 0%, #ffeadd 100%)'
        }}
      >
        {filteredReviews.length === 0 ? (
          <Empty
            description="Không có đánh giá nào"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <Table
            columns={columns}
            dataSource={filteredReviews}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} của ${total} đánh giá`,
              pageSizeOptions: ['10', '20', '50'],
            }}
            scroll={{ x: 'max-content' }}
            style={{ borderRadius: '8px' }}
          />
        )}
      </Card>

      {/* Review Detail Modal */}
      <Modal
        title={`Chi tiết đánh giá #${selectedReview?.id}`}
        open={isDetailModalOpen}
        onCancel={() => setIsDetailModalOpen(false)}
        footer={null}
        width={700}
        style={{ borderRadius: '12px' }}
      >
        {selectedReview && (
          <div>
            <Card style={{ marginBottom: '24px' }}>
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Space align="start" size="large">
                    <Avatar size={64} icon={<UserOutlined />} />
                    <div>
                      <Title level={4} style={{ margin: 0 }}>
                        {selectedReview.customerName}
                      </Title>
                      <Text type="secondary">{selectedReview.customerEmail}</Text>
                      <br />
                      <Rate 
                        disabled 
                        value={selectedReview.rating} 
                        style={{ fontSize: '18px', marginTop: '8px' }}
                      />
                    </div>
                  </Space>
                </Col>
              </Row>
            </Card>

            <Card title="Thông tin đánh giá" style={{ marginBottom: '24px' }}>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Text strong>Sản phẩm:</Text>
                  <br />
                  <Text>{selectedReview.productName}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>Trạng thái:</Text>
                  <br />
                  <Tag 
                    color={getStatusColor(selectedReview.status)}
                    style={{ borderRadius: '6px' }}
                  >
                    {getStatusText(selectedReview.status)}
                  </Tag>
                </Col>
                <Col span={12}>
                  <Text strong>Ngày tạo:</Text>
                  <br />
                  <Text>{new Date(selectedReview.createdAt).toLocaleString('vi-VN')}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>Số lượt hữu ích:</Text>
                  <br />
                  <Badge 
                    count={selectedReview.helpful} 
                    style={{ backgroundColor: 'var(--pv-primary, #eda274)' }}
                  />
                </Col>
              </Row>
            </Card>

            <Card title="Bình luận">
              <Text>{selectedReview.comment}</Text>
            </Card>

            {/* Action Buttons */}
            <div style={{ textAlign: 'right', marginTop: '24px' }}>
              <Space>
                <Button onClick={() => setIsDetailModalOpen(false)}>
                  Đóng
                </Button>
                {selectedReview.status === 'PENDING' && (
                  <>
                    <Button 
                      type="primary"
                      icon={<StarOutlined />}
                      onClick={() => {
                        handleStatusUpdate(selectedReview.id, 'APPROVED');
                        setIsDetailModalOpen(false);
                      }}
                      style={{ 
                        background: 'linear-gradient(135deg, var(--pv-primary, #eda274) 0%, var(--pv-accent, #ffb07c) 100%)',
                        border: 'none'
                      }}
                    >
                      Duyệt đánh giá
                    </Button>
                    <Button 
                      danger
                      icon={<MessageOutlined />}
                      onClick={() => {
                        handleStatusUpdate(selectedReview.id, 'REJECTED');
                        setIsDetailModalOpen(false);
                      }}
                    >
                      Từ chối
                    </Button>
                  </>
                )}
              </Space>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
