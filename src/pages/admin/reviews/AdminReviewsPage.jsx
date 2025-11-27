// src/pages/admin/reviews/AdminReviewsPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  Card,
  Table,
  Tag,
  Button,
  Typography,
  Space,
  Spin,
  Alert,
  Empty,
  Input,
  Select,
  Modal,
  Descriptions,
  Rate,
  Avatar,
  Popconfirm,
  Row,
  Col
} from 'antd';
import {
  ReloadOutlined,
  SearchOutlined,
  EyeOutlined,
  DeleteOutlined,
  EditOutlined,
  StarOutlined,
  UserOutlined,
  ShoppingOutlined
} from '@ant-design/icons';
import { getAllReviews, deleteReview, getReviewById, updateReview } from '../../../services/reviews';
import { useToast } from '../../../context/ToastContext';
import { Form, Input as AntInput } from 'antd';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;
const { TextArea } = AntInput;

const formatDate = (dateString) => {
  if (!dateString) return '--';
  return new Date(dateString).toLocaleString('vi-VN');
};

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('ALL');
  const [selectedReview, setSelectedReview] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [editForm] = Form.useForm();
  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState(false);
  const { showError, showSuccess } = useToast();

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllReviews();
      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('⭐ AdminReviewsPage: Error fetching reviews', err);
      const message = err?.response?.data?.message || err?.message || 'Không thể tải danh sách đánh giá.';
      setError(message);
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (reviewId) => {
    try {
      setDeleting(true);
      await deleteReview(reviewId);
      showSuccess('Đã xóa đánh giá thành công!');
      await fetchReviews();
    } catch (err) {
      console.error('⭐ AdminReviewsPage: Error deleting review', err);
      const message = err?.response?.data?.message || err?.message || 'Không thể xóa đánh giá.';
      showError(message);
    } finally {
      setDeleting(false);
    }
  };

  const handleViewDetail = async (review) => {
    try {
      const fullReview = await getReviewById(review.id);
      setSelectedReview(fullReview);
      setIsDetailModalOpen(true);
    } catch (err) {
      console.error('⭐ AdminReviewsPage: Error fetching review detail', err);
      setSelectedReview(review);
      setIsDetailModalOpen(true);
    }
  };

  const handleEdit = (review) => {
    setEditingReview(review);
    editForm.setFieldsValue({
      rating: review.rating,
      comment: review.comment || ''
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateReview = async (values) => {
    if (!editingReview) return;
    
    try {
      setUpdating(true);
      const updateData = {
        rating: values.rating,
        comment: values.comment || ''
      };
      
      await updateReview(editingReview.id, updateData);
      showSuccess('Đã cập nhật đánh giá thành công!');
      setIsEditModalOpen(false);
      setEditingReview(null);
      editForm.resetFields();
      await fetchReviews();
    } catch (err) {
      console.error('⭐ AdminReviewsPage: Error updating review', err);
      const message = err?.message || 'Không thể cập nhật đánh giá.';
      showError(message);
    } finally {
      setUpdating(false);
    }
  };

  const filteredReviews = useMemo(() => {
    let filtered = reviews;

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(review =>
        review.comment?.toLowerCase().includes(term) ||
        review.productName?.toLowerCase().includes(term) ||
        String(review.userId).includes(term) ||
        String(review.productId).includes(term)
      );
    }

    // Filter by rating
    if (ratingFilter !== 'ALL') {
      filtered = filtered.filter(review => review.rating === Number(ratingFilter));
    }

    return filtered;
  }, [reviews, searchTerm, ratingFilter]);

  const columns = [
    {
      title: 'STT',
      key: 'stt',
      width: 60,
      align: 'center',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      render: (id) => <Text strong>#{id}</Text>,
    },
    {
      title: 'Sản phẩm',
      key: 'product',
      width: 200,
      render: (_, record) => (
        <Space>
          <ShoppingOutlined style={{ color: 'var(--pv-primary, #eda274)' }} />
          <div>
            <Text strong>{record.productName || `SP #${record.productId}`}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: '12px' }}>ID: {record.productId}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Người đánh giá',
      key: 'user',
      width: 150,
      render: (_, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} size="small" />
          <Text>User #{record.userId}</Text>
        </Space>
      ),
    },
    {
      title: 'Đánh giá',
      dataIndex: 'rating',
      key: 'rating',
      width: 150,
      render: (rating) => (
        <Space>
          <Rate disabled value={rating} style={{ fontSize: '14px' }} />
          <Text strong>({rating}/5)</Text>
        </Space>
      ),
    },
    {
      title: 'Nhận xét',
      dataIndex: 'comment',
      key: 'comment',
      ellipsis: {
        showTitle: false,
      },
      render: (comment) => (
        <Text style={{ color: 'var(--pv-text-muted, #7e5c48)' }}>
          {comment || 'Không có nhận xét'}
        </Text>
      ),
    },
    {
      title: 'Xác thực mua hàng',
      dataIndex: 'isVerifiedPurchase',
      key: 'isVerifiedPurchase',
      width: 150,
      align: 'center',
      render: (isVerified) => (
        <Tag color={isVerified ? 'green' : 'default'}>
          {isVerified ? 'Đã xác thực' : 'Chưa xác thực'}
        </Tag>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (date) => formatDate(date),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
            style={{ color: 'var(--pv-primary, #eda274)' }}
            title="Xem chi tiết"
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{ color: 'var(--pv-primary, #eda274)' }}
            title="Chỉnh sửa"
          />
          <Popconfirm
            title="Xóa đánh giá"
            description="Bạn có chắc muốn xóa đánh giá này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okType="danger"
          >
            <Button
              type="text"
              icon={<DeleteOutlined />}
              danger
              loading={deleting}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

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
              ⭐ Quản lý đánh giá (Admin)
            </Title>
            <Text style={{ color: 'var(--pv-text-muted, #7e5c48)' }}>
              Xem và quản lý tất cả đánh giá sản phẩm từ khách hàng
            </Text>
          </Col>
          <Col>
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchReviews}
              loading={loading}
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
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="Tìm kiếm đánh giá..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Select
              placeholder="Lọc theo số sao"
              allowClear
              size="large"
              style={{ width: '100%' }}
              value={ratingFilter}
              onChange={setRatingFilter}
            >
              <Option value="ALL">Tất cả</Option>
              <Option value="5">5 sao</Option>
              <Option value="4">4 sao</Option>
              <Option value="3">3 sao</Option>
              <Option value="2">2 sao</Option>
              <Option value="1">1 sao</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Text style={{ color: 'var(--pv-text-muted, #7e5c48)' }}>
              Tổng: {reviews.length} đánh giá
              {filteredReviews.length !== reviews.length && (
                <span style={{ marginLeft: 8, color: 'var(--pv-primary, #eda274)' }}>
                  (Đang lọc: {filteredReviews.length})
                </span>
              )}
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
        {error && (
          <Alert
            message="Lỗi tải dữ liệu"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
            action={
              <Button size="small" danger onClick={fetchReviews}>
                Thử lại
              </Button>
            }
          />
        )}
        <Table
          columns={columns}
          dataSource={filteredReviews}
          rowKey={(record) => record.id || `review-${Math.random()}`}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} đánh giá`,
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
          scroll={{ x: 'max-content' }}
          loading={loading}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  error
                    ? `Lỗi: ${error}`
                    : searchTerm || ratingFilter !== 'ALL'
                    ? "Không tìm thấy đánh giá nào phù hợp với bộ lọc"
                    : loading
                    ? "Đang tải..."
                    : reviews.length === 0
                    ? "Chưa có đánh giá nào"
                    : "Không có dữ liệu để hiển thị"
                }
              />
            ),
          }}
          style={{ borderRadius: '8px' }}
          size="middle"
        />
      </Card>

      {/* Edit Review Modal */}
      <Modal
        title={`Chỉnh sửa đánh giá #${editingReview?.id}`}
        open={isEditModalOpen}
        onCancel={() => {
          setIsEditModalOpen(false);
          setEditingReview(null);
          editForm.resetFields();
        }}
        onOk={() => editForm.submit()}
        confirmLoading={updating}
        okText="Cập nhật"
        cancelText="Hủy"
        width={600}
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleUpdateReview}
        >
          <Form.Item
            label="Đánh giá (sao)"
            name="rating"
            rules={[
              { required: true, message: 'Vui lòng chọn số sao đánh giá' },
              { type: 'number', min: 1, max: 5, message: 'Số sao phải từ 1 đến 5' }
            ]}
          >
            <Rate />
          </Form.Item>
          <Form.Item
            label="Nhận xét"
            name="comment"
            rules={[
              { max: 1000, message: 'Nhận xét không được quá 1000 ký tự' }
            ]}
          >
            <TextArea
              rows={4}
              placeholder="Nhập nhận xét về sản phẩm..."
              showCount
              maxLength={1000}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Review Detail Modal */}
      <Modal
        title={`Chi tiết đánh giá #${selectedReview?.id}`}
        open={isDetailModalOpen}
        onCancel={() => {
          setIsDetailModalOpen(false);
          setSelectedReview(null);
        }}
        footer={null}
        width={700}
        style={{ borderRadius: '12px' }}
      >
        {selectedReview && (
          <div>
            <Descriptions bordered column={1} style={{ marginBottom: '24px' }}>
              <Descriptions.Item label="ID đánh giá">
                <Text strong>#{selectedReview.id}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Sản phẩm">
                <Space>
                  <ShoppingOutlined style={{ color: 'var(--pv-primary, #eda274)' }} />
                  <Text strong>{selectedReview.productName || `Sản phẩm #${selectedReview.productId}`}</Text>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Người đánh giá">
                <Space>
                  <Avatar icon={<UserOutlined />} />
                  <Text>User #{selectedReview.userId}</Text>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Đánh giá">
                <Space>
                  <Rate disabled value={selectedReview.rating} />
                  <Text strong>({selectedReview.rating}/5 sao)</Text>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Nhận xét" span={1}>
                <Text>{selectedReview.comment || 'Không có nhận xét'}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Xác thực mua hàng">
                <Tag color={selectedReview.isVerifiedPurchase ? 'green' : 'default'}>
                  {selectedReview.isVerifiedPurchase ? 'Đã xác thực' : 'Chưa xác thực'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tạo">
                {formatDate(selectedReview.createdAt)}
              </Descriptions.Item>
            </Descriptions>

            <div style={{ textAlign: 'right' }}>
              <Space>
                <Button onClick={() => {
                  setIsDetailModalOpen(false);
                  setSelectedReview(null);
                }}>
                  Đóng
                </Button>
                <Button
                  icon={<EditOutlined />}
                  onClick={() => {
                    setIsDetailModalOpen(false);
                    handleEdit(selectedReview);
                  }}
                  style={{ color: 'var(--pv-primary, #eda274)' }}
                >
                  Chỉnh sửa
                </Button>
                <Popconfirm
                  title="Xóa đánh giá"
                  description="Bạn có chắc muốn xóa đánh giá này?"
                  onConfirm={() => {
                    handleDelete(selectedReview.id);
                    setIsDetailModalOpen(false);
                    setSelectedReview(null);
                  }}
                  okText="Xóa"
                  cancelText="Hủy"
                  okType="danger"
                >
                  <Button danger icon={<DeleteOutlined />} loading={deleting}>
                    Xóa đánh giá
                  </Button>
                </Popconfirm>
              </Space>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

