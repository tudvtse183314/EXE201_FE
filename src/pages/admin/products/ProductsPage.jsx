// src/pages/admin/products/ProductsPage.jsx
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
  message, 
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
  Tooltip
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  ReloadOutlined,
  SearchOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { getAllProducts, createProduct, updateProduct, deleteProduct } from '../../../services/products';
import { getAllCategories } from '../../../services/categories';
import { dataManager } from '../../../utils/dataManager';

const { Title, Text } = Typography;
const { Search } = AntInput;
const { Option } = Select;

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [form] = Form.useForm();

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("📦 ProductsPage: Loading data...");
      
      const [productsData, categoriesData] = await Promise.all([
        dataManager.get('products', getAllProducts),
        dataManager.get('categories', getAllCategories)
      ]);
      
      console.log("📦 ProductsPage: Data loaded", { 
        products: productsData?.length || 0, 
        categories: categoriesData?.length || 0 
      });
      
      const productsArray = Array.isArray(productsData) ? productsData : [];
      const categoriesArray = Array.isArray(categoriesData) ? categoriesData : [];
      
      setProducts(productsArray);
      setFilteredProducts(productsArray);
      setCategories(categoriesArray);
    } catch (e) {
      console.error("📦 ProductsPage: Error loading data", e);
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
        ...values,
        price: parseFloat(values.price),
        stock: parseInt(values.stock),
        categoryId: parseInt(values.categoryId)
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, submitData);
        message.success('Đã cập nhật sản phẩm thành công!');
        console.log("📦 ProductsPage: Product updated");
      } else {
        await createProduct(submitData);
        message.success('Đã thêm sản phẩm mới thành công!');
        console.log("📦 ProductsPage: Product created");
      }
      
      // Refresh data
      dataManager.clear('products');
      await loadData();
      
      setIsModalOpen(false);
      setEditingProduct(null);
      form.resetFields();
    } catch (error) {
      console.error("📦 ProductsPage: Error saving product", error);
      message.error(error?.message || "Không thể lưu sản phẩm.");
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    form.setFieldsValue({
      name: product.name,
      description: product.description || '',
      price: product.price,
      stock: product.stock,
      categoryId: product.category?.id,
      imageUrl: product.imageUrl || product.image || '',
      type: product.type || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (productId, productName) => {
    try {
      await deleteProduct(productId);
      message.success(`Đã xóa sản phẩm "${productName}" thành công!`);
      console.log("📦 ProductsPage: Product deleted");
      
      // Refresh data
      dataManager.clear('products');
      await loadData();
    } catch (error) {
      console.error("📦 ProductsPage: Error deleting product", error);
      message.error(error?.message || "Không thể xóa sản phẩm.");
    }
  };

  const openModal = () => {
    setEditingProduct(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    form.resetFields();
  };

  const columns = [
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      width: 100,
      render: (image, record) => {
        // Build image src giống logic ở ProductCard (Home/Shop)
        let src = record.imageUrl ?? record.image ?? image ?? null;
        if (!src || src === '' || src === 'null' || src === 'undefined') {
          // fallback assets (dựa vào id để đa dạng ảnh)
          const idx = record.id || 1;
          const fallback = `/static/media/pets/${(idx % 9) + 1}.jpg`;
          return (
            <Image
              width={60}
              height={60}
              src={fallback}
              alt={record.name}
              style={{ objectFit: 'cover', borderRadius: '8px' }}
            />
          );
        }
        if (src.startsWith('/api/uploads/')) {
          const base = (process.env.REACT_APP_API_BASE_URL || 'https://exe201-be-uhno.onrender.com/api').replace('/api','');
          src = base + src;
        }
        return (
          <Image
            width={60}
            height={60}
            src={src}
            alt={record.name}
            style={{ objectFit: 'cover', borderRadius: '8px' }}
            onError={(e) => {
              // Nếu lỗi → fallback ảnh placeholder
              e.target.src = '/logo192.png';
            }}
          />
        );
      },
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: {
        showTitle: false,
      },
      render: (text) => (
        <Tooltip title={text}>
          <Text type="secondary" style={{ 
            maxWidth: 200,
            display: 'block',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {text || 'Không có mô tả'}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      width: 120,
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
      width: 100,
      sorter: (a, b) => a.stock - b.stock,
      render: (stock) => (
        <Tag color={stock > 0 ? 'green' : 'red'}>
          {stock || 0}
        </Tag>
      ),
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type) => type ? <Tag color="blue">{type}</Tag> : '-',
    },
    {
      title: 'Danh mục',
      dataIndex: ['category', 'name'],
      key: 'category',
      width: 120,
      render: (categoryName) => (
        <Tag color="purple">{categoryName || 'Chưa phân loại'}</Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa sản phẩm"
            description={`Bạn có chắc chắn muốn xóa sản phẩm "${record.name}"?`}
            onConfirm={() => handleDelete(record.id, record.name)}
            okText="Xóa"
            cancelText="Hủy"
            okType="danger"
          >
            <Button
              danger
              size="small"
              icon={<DeleteOutlined />}
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px', fontSize: '16px', color: 'var(--pv-text-muted, #7e5c48)' }}>
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
      <Card style={{ marginBottom: '24px', borderRadius: '12px' }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2} style={{ margin: 0, color: 'var(--pv-text-heading, #2a1a10)' }}>
              📦 Quản lý Sản phẩm
            </Title>
            <Text type="secondary">
              Quản lý các sản phẩm trong hệ thống PetVibe
            </Text>
          </Col>
          <Col>
            <Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={openModal}
                style={{
                  background: 'var(--pv-primary, #eda274)',
                  borderColor: 'var(--pv-primary, #eda274)'
                }}
              >
                Thêm sản phẩm
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={loadData}
              >
                Làm mới
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Search and Filters */}
      <Card style={{ marginBottom: '24px', borderRadius: '12px' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="Tìm kiếm theo tên hoặc mô tả..."
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
                <Option key={category.id} value={category.id.toString()}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
      </Card>

      {/* Products Table */}
      <Card style={{ borderRadius: '12px' }}>
        <Table
          columns={columns}
          dataSource={filteredProducts}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} của ${total} sản phẩm`,
            pageSizeOptions: ['10', '20', '50'],
          }}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Chưa có sản phẩm nào"
              >
                <Button type="primary" icon={<PlusOutlined />} onClick={openModal}>
                  Thêm sản phẩm đầu tiên
                </Button>
              </Empty>
            ),
          }}
          scroll={{ x: 'max-content' }}
        />
      </Card>

      {/* Modal */}
      <Modal
        title={editingProduct ? '✏️ Sửa sản phẩm' : '➕ Thêm sản phẩm mới'}
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}
        width={800}
        style={{ top: 20 }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            name: '',
            description: '',
            price: 0,
            stock: 0,
            categoryId: undefined,
            imageUrl: '',
            type: ''
          }}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="name"
                label="Tên sản phẩm"
                rules={[
                  { required: true, message: 'Vui lòng nhập tên sản phẩm!' },
                  { min: 2, message: 'Tên sản phẩm phải có ít nhất 2 ký tự!' },
                  { max: 100, message: 'Tên sản phẩm không được quá 100 ký tự!' }
                ]}
              >
                <Input 
                  placeholder="Nhập tên sản phẩm..." 
                  size="large"
                />
              </Form.Item>
            </Col>
            
            <Col xs={24} sm={12}>
              <Form.Item
                name="categoryId"
                label="Danh mục"
                rules={[
                  { required: true, message: 'Vui lòng chọn danh mục!' }
                ]}
              >
                <Select 
                  placeholder="Chọn danh mục..." 
                  size="large"
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
            name="description"
            label="Mô tả"
            rules={[
              { max: 500, message: 'Mô tả không được quá 500 ký tự!' }
            ]}
          >
            <Input.TextArea 
              rows={3}
              placeholder="Nhập mô tả sản phẩm..."
              showCount
              maxLength={500}
            />
          </Form.Item>

          <Row gutter={[16, 16]}>
            <Col xs={24} sm={8}>
              <Form.Item
                name="price"
                label="Giá (VNĐ)"
                rules={[
                  { required: true, message: 'Vui lòng nhập giá sản phẩm!' },
                  { type: 'number', min: 0, message: 'Giá phải lớn hơn hoặc bằng 0!' }
                ]}
              >
                <InputNumber 
                  placeholder="0"
                  style={{ width: '100%' }}
                  size="large"
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
            
            <Col xs={24} sm={8}>
              <Form.Item
                name="stock"
                label="Tồn kho"
                rules={[
                  { required: true, message: 'Vui lòng nhập số lượng tồn kho!' },
                  { type: 'number', min: 0, message: 'Tồn kho phải lớn hơn hoặc bằng 0!' }
                ]}
              >
                <InputNumber 
                  placeholder="0"
                  style={{ width: '100%' }}
                  size="large"
                  min={0}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={8}>
              <Form.Item
                name="type"
                label="Loại sản phẩm"
              >
                <Input 
                  placeholder="Nhập loại sản phẩm..." 
                  size="large"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="imageUrl"
            label="URL hình ảnh"
            rules={[
              { type: 'url', message: 'Vui lòng nhập URL hợp lệ!' }
            ]}
          >
            <Input 
              placeholder="https://example.com/image.jpg" 
              size="large"
            />
          </Form.Item>
          
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={closeModal}>
                Hủy
              </Button>
              <Button 
                type="primary" 
                htmlType="submit"
                style={{
                  background: 'var(--pv-primary, #eda274)',
                  borderColor: 'var(--pv-primary, #eda274)'
                }}
              >
                {editingProduct ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
