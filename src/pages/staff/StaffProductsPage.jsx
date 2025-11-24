// src/pages/staff/StaffProductsPage.jsx
import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Select, 
  InputNumber,
  Space, 
  Popconfirm, 
  Card, 
  Typography, 
  Row, 
  Col,
  Input as AntInput,
  Spin,
  Alert,
  Empty,
  Image,
  Tag,
  Tooltip,
  Upload
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  ReloadOutlined,
  SearchOutlined,
  EyeOutlined,
  UploadOutlined,
  InboxOutlined
} from '@ant-design/icons';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { getAllProducts, createProduct, updateProduct, deleteProduct } from '../../services/products';
import { getAllCategories } from '../../services/categories';
import { useToast } from '../../context/ToastContext';
import { dataManager } from '../../utils/dataManager';
import { getFallbackImageByIndex } from '../../utils/imageUtils';

const { Title, Text } = Typography;
const { Search } = AntInput;
const { Option } = Select;

export default function StaffProductsPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const { showSuccess, showError } = useToast();
  const [form] = Form.useForm();

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("📦 StaffProductsPage: Loading data...");
      
      const [productsData, categoriesData] = await Promise.all([
        dataManager.get('products', getAllProducts),
        dataManager.get('categories', getAllCategories)
      ]);
      
      console.log("📦 StaffProductsPage: Data loaded", { 
        products: productsData?.length || 0, 
        categories: categoriesData?.length || 0 
      });
      
      const productsArray = Array.isArray(productsData) ? productsData : [];
      const categoriesArray = Array.isArray(categoriesData) ? categoriesData : [];
      
      setProducts(productsArray);
      setFilteredProducts(productsArray);
      setCategories(categoriesArray);
    } catch (e) {
      console.error("📦 StaffProductsPage: Error loading data", e);
      setError(e?.message || "Không thể tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter products based on search term and category
  useEffect(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(product => 
        product.category?.id === parseInt(selectedCategory)
      );
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, products]);

  const handleSubmit = async (values) => {
    try {
      const submitData = {
        name: values.name,
        description: values.description,
        price: parseFloat(values.price),
        stock: parseInt(values.stock),
        categoryId: parseInt(values.categoryId),
        imageUrl: values.imageUrl || uploadedImage || uploadedImageUrl,
        type: values.type
      };

      console.log("📦 StaffProductsPage: Submitting product", submitData);

      if (editingProduct) {
        await updateProduct(editingProduct.id, submitData);
        showSuccess('Đã cập nhật sản phẩm thành công!');
        console.log("📦 StaffProductsPage: Product updated");
      } else {
        await createProduct(submitData);
        showSuccess('Đã thêm sản phẩm mới thành công!');
        console.log("📦 StaffProductsPage: Product created");
      }
      
      // Refresh data
      dataManager.clear('products');
      await loadData();
      
      setIsModalOpen(false);
      setEditingProduct(null);
      setUploadedImage(null);
      setUploadedImageUrl(null);
      form.resetFields();
    } catch (error) {
      console.error("📦 StaffProductsPage: Error saving product", error);
      showError(error?.message || "Không thể lưu sản phẩm.");
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    const imageUrl = product.imageUrl || product.image || '';
    setUploadedImageUrl(imageUrl);
    setUploadedImage(null);
    form.setFieldsValue({
      name: product.name,
      description: product.description || '',
      price: product.price,
      stock: product.stock,
      categoryId: product.category?.id,
      imageUrl: imageUrl,
      type: product.type || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (productId, productName) => {
    try {
      await deleteProduct(productId);
      showSuccess(`Đã xóa sản phẩm "${productName}" thành công!`);
      console.log("📦 StaffProductsPage: Product deleted");
      
      // Refresh data
      dataManager.clear('products');
      await loadData();
    } catch (error) {
      console.error("📦 StaffProductsPage: Error deleting product", error);
      showError(error?.message || "Không thể xóa sản phẩm.");
    }
  };

  const openModal = () => {
    setEditingProduct(null);
    setUploadedImage(null);
    setUploadedImageUrl(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setUploadedImage(null);
    setUploadedImageUrl(null);
    form.resetFields();
  };

  // Handle file upload
  const handleImageUpload = (file) => {
    // Check file type
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      showError('Chỉ chấp nhận file ảnh!');
      return Upload.LIST_IGNORE;
    }

    // Check file size (5MB)
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      showError('Kích thước ảnh không được vượt quá 5MB!');
      return Upload.LIST_IGNORE;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64String = e.target.result;
      setUploadedImage(base64String);
      setUploadedImageUrl(base64String);
      form.setFieldsValue({ imageUrl: base64String });
    };
    reader.onerror = () => {
      showError('Lỗi khi đọc file ảnh');
    };
    reader.readAsDataURL(file);

    // Return false to prevent auto upload
    return false;
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    setUploadedImageUrl(null);
    form.setFieldsValue({ imageUrl: '' });
  };

  const columns = [
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      width: 100,
      render: (imageUrl, record) => {
        const productImage = imageUrl || record.imageUrl || record.image || '';
        const fallbackImage = getFallbackImageByIndex(record.id);
        
        return (
          <LazyLoadImage
            src={productImage || fallbackImage}
            alt={record.name}
            effect="blur"
            placeholderSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3C/svg%3E"
            style={{ 
              width: 60, 
              height: 60, 
              objectFit: 'cover', 
              borderRadius: '8px' 
            }}
            onError={(e) => {
              e.target.src = fallbackImage;
            }}
          />
        );
      },
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name?.localeCompare(b.name),
      render: (text) => (
        <Text strong style={{ color: 'var(--pv-text-heading, #2a1a10)' }}>
          {text}
        </Text>
      ),
    },
    {
      title: 'Danh mục',
      dataIndex: ['category', 'name'],
      key: 'category',
      render: (categoryName) => (
        <Tag color="blue">{categoryName || 'Chưa phân loại'}</Tag>
      ),
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      sorter: (a, b) => a.price - b.price,
      render: (price) => (
        <Text strong style={{ color: 'var(--pv-primary, #eda274)' }}>
          {price?.toLocaleString('vi-VN')} VNĐ
        </Text>
      ),
    },
    {
      title: 'Tồn kho',
      dataIndex: 'stock',
      key: 'stock',
      sorter: (a, b) => a.stock - b.stock,
      render: (stock) => (
        <Tag color={stock > 10 ? 'green' : stock > 0 ? 'orange' : 'red'}>
          {stock} sản phẩm
        </Tag>
      ),
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag color="purple">{type || 'Không xác định'}</Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              style={{ color: 'var(--pv-primary, #eda274)' }}
            />
          </Tooltip>
          <Popconfirm
            title="Xóa sản phẩm"
            description={`Bạn có chắc chắn muốn xóa sản phẩm "${record.name}"?`}
            onConfirm={() => handleDelete(record.id, record.name)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Xóa">
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px', fontSize: '16px', color: '#666' }}>
          Đang tải sản phẩm...
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
          <Button size="small" danger onClick={loadData}>
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
              📦 Quản lý sản phẩm
            </Title>
            <Text style={{ color: 'var(--pv-text-muted, #7e5c48)' }}>
              Xem, chỉnh sửa và xóa sản phẩm trong hệ thống PetVibe
            </Text>
          </Col>
          <Col>
            <Space>
              <Button 
                icon={<ReloadOutlined />} 
                onClick={loadData}
                style={{ borderRadius: '8px' }}
              >
                Làm mới
              </Button>
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={openModal}
                style={{ 
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, var(--pv-primary, #eda274) 0%, var(--pv-accent, #ffb07c) 100%)',
                  border: 'none'
                }}
              >
                Thêm sản phẩm
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Search and Filters */}
      <Card style={{ marginBottom: '24px', borderRadius: '12px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="Tìm kiếm sản phẩm..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Select
              placeholder="Lọc theo danh mục"
              allowClear
              size="large"
              style={{ width: '100%' }}
              value={selectedCategory}
              onChange={setSelectedCategory}
            >
              {categories.map(category => (
                <Option key={category.id} value={category.id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Text style={{ color: 'var(--pv-text-muted, #7e5c48)' }}>
              Hiển thị {filteredProducts.length} sản phẩm
            </Text>
          </Col>
        </Row>
      </Card>

      {/* Products Table */}
      <Card 
        style={{ 
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #fff 0%, #ffeadd 100%)'
        }}
      >
        {filteredProducts.length === 0 ? (
          <Empty
            description="Không có sản phẩm nào"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button type="primary" icon={<PlusOutlined />} onClick={openModal}>
              Thêm sản phẩm đầu tiên
            </Button>
          </Empty>
        ) : (
          <Table
            columns={columns}
            dataSource={filteredProducts}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} của ${total} sản phẩm`,
              pageSizeOptions: ['10', '20', '50'],
            }}
            scroll={{ x: 'max-content' }}
            style={{ borderRadius: '8px' }}
          />
        )}
      </Card>

      {/* Modal */}
      <Modal
        title={editingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}
        width={800}
        style={{ borderRadius: '12px' }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{ marginTop: '24px' }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Tên sản phẩm"
                name="name"
                rules={[
                  { required: true, message: 'Vui lòng nhập tên sản phẩm!' },
                  { min: 2, message: 'Tên sản phẩm phải có ít nhất 2 ký tự!' }
                ]}
              >
                <Input 
                  placeholder="Nhập tên sản phẩm..."
                  size="large"
                  style={{ borderRadius: '8px' }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Danh mục"
                name="categoryId"
                rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
              >
                <Select 
                  placeholder="Chọn danh mục..."
                  size="large"
                  style={{ borderRadius: '8px' }}
                >
                  {categories.map(category => (
                    <Option key={category.id} value={category.id}>
                      {category.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Mô tả"
            name="description"
            rules={[
              { max: 500, message: 'Mô tả không được quá 500 ký tự!' }
            ]}
          >
            <Input.TextArea 
              placeholder="Nhập mô tả sản phẩm..."
              rows={3}
              style={{ borderRadius: '8px' }}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Giá (VNĐ)"
                name="price"
                rules={[
                  { required: true, message: 'Vui lòng nhập giá!' },
                  { type: 'number', min: 0, message: 'Giá phải lớn hơn 0!' }
                ]}
              >
                <InputNumber 
                  placeholder="Nhập giá..."
                  size="large"
                  style={{ width: '100%', borderRadius: '8px' }}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Số lượng tồn kho"
                name="stock"
                rules={[
                  { required: true, message: 'Vui lòng nhập số lượng!' },
                  { type: 'number', min: 0, message: 'Số lượng phải lớn hơn hoặc bằng 0!' }
                ]}
              >
                <InputNumber 
                  placeholder="Nhập số lượng..."
                  size="large"
                  style={{ width: '100%', borderRadius: '8px' }}
                  min={0}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Loại sản phẩm"
                name="type"
              >
                <Input 
                  placeholder="Nhập loại sản phẩm..."
                  size="large"
                  style={{ borderRadius: '8px' }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Hình ảnh sản phẩm"
            name="imageUrl"
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <Upload
                beforeUpload={handleImageUpload}
                maxCount={1}
                accept="image/*"
                listType="picture-card"
                onRemove={handleRemoveImage}
                showUploadList={{
                  showPreviewIcon: false,
                  showRemoveIcon: true
                }}
              >
                {uploadedImageUrl || uploadedImage ? null : (
                  <div>
                    <InboxOutlined style={{ fontSize: '32px', color: '#eda274' }} />
                    <div style={{ marginTop: 8, color: '#666' }}>
                      Click để upload
                    </div>
                    <div style={{ fontSize: '12px', color: '#999' }}>
                      (Max 5MB)
                    </div>
                  </div>
                )}
              </Upload>
              {(uploadedImageUrl || uploadedImage) && (
                <div style={{ marginTop: 8 }}>
                  <LazyLoadImage
                    src={uploadedImage || uploadedImageUrl}
                    alt="Preview"
                    style={{ 
                      width: '100%', 
                      maxHeight: '200px', 
                      objectFit: 'contain',
                      borderRadius: '8px',
                      border: '1px solid #ddd'
                    }}
                    effect="blur"
                    placeholderSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3C/svg%3E"
                  />
                </div>
              )}
            </Space>
          </Form.Item>
          
          {/* Option to use URL if prefer */}
          <Form.Item
            label="Hoặc nhập URL hình ảnh"
          >
            <Input 
              placeholder="Nhập URL hình ảnh (tùy chọn)..."
              size="large"
              style={{ borderRadius: '8px' }}
              onChange={(e) => {
                if (e.target.value) {
                  setUploadedImageUrl(e.target.value);
                  form.setFieldsValue({ imageUrl: e.target.value });
                }
              }}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={closeModal} size="large" style={{ borderRadius: '8px' }}>
                Hủy
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                size="large"
                style={{ 
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, var(--pv-primary, #eda274) 0%, var(--pv-accent, #ffb07c) 100%)',
                  border: 'none'
                }}
              >
                {editingProduct ? 'Cập nhật' : 'Tạo mới'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
