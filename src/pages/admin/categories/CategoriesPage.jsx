// src/pages/admin/categories/CategoriesPage.jsx
import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Space, 
  Popconfirm, 
  Card, 
  Typography, 
  Row, 
  Col,
  Input as AntInput,
  Spin,
  Alert,
  Empty
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  ReloadOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { getAllCategories, createCategory, updateCategory, deleteCategory } from '../../../services/categories';
import { dataManager } from '../../../utils/dataManager';
import { useToast } from '../../../context/ToastContext';

const { Title, Text } = Typography;
const { Search } = AntInput;

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [form] = Form.useForm();
  const { showSuccess, showError } = useToast();

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("📂 CategoriesPage: Loading categories...");
      
      const data = await dataManager.get('categories', getAllCategories);
      
      console.log("📂 CategoriesPage: Categories loaded", data);
      const categoriesData = Array.isArray(data) ? data : [];
      setCategories(categoriesData);
      setFilteredCategories(categoriesData);
    } catch (e) {
      console.error("📂 CategoriesPage: Error loading categories", e);
      setError(e?.message || "Không thể tải danh sách danh mục.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // Filter categories based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredCategories(filtered);
    }
  }, [searchTerm, categories]);

  const handleSubmit = async (values) => {
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, values);
        showSuccess('Đã cập nhật danh mục thành công!');
        console.log("📂 CategoriesPage: Category updated");
      } else {
        await createCategory(values);
        showSuccess('Đã thêm danh mục mới thành công!');
        console.log("📂 CategoriesPage: Category created");
      }
      
      // Refresh data
      dataManager.clear('categories');
      await loadCategories();
      
      setIsModalOpen(false);
      setEditingCategory(null);
      form.resetFields();
    } catch (error) {
      console.error("📂 CategoriesPage: Error saving category", error);
      showError(error?.message || "Không thể lưu danh mục.");
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    form.setFieldsValue({
      name: category.name,
      description: category.description || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (categoryId, categoryName) => {
    try {
      await deleteCategory(categoryId);
      showSuccess(`Đã xóa danh mục "${categoryName}" thành công!`);
      console.log("📂 CategoriesPage: Category deleted");
      
      // Refresh data
      dataManager.clear('categories');
      await loadCategories();
    } catch (error) {
      console.error("📂 CategoriesPage: Error deleting category", error);
      showError(error?.message || "Không thể xóa danh mục. Có thể danh mục này đang được sử dụng.");
    }
  };

  const openModal = () => {
    setEditingCategory(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    form.resetFields();
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Tên danh mục',
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
        <Text type="secondary" style={{ 
          maxWidth: 300,
          display: 'block',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {text || 'Không có mô tả'}
        </Text>
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
            title="Xóa danh mục"
            description={`Bạn có chắc chắn muốn xóa danh mục "${record.name}"?`}
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
          Đang tải danh mục...
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
          <Button size="small" danger onClick={loadCategories}>
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
              📂 Quản lý Danh mục
            </Title>
            <Text type="secondary">
              Quản lý các danh mục sản phẩm trong hệ thống
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
                Thêm danh mục
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={loadCategories}
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
        </Row>
      </Card>

      {/* Categories Table */}
      <Card style={{ borderRadius: '12px' }}>
        <Table
          columns={columns}
          dataSource={filteredCategories}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} của ${total} danh mục`,
            pageSizeOptions: ['10', '20', '50'],
          }}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Chưa có danh mục nào"
              >
                <Button type="primary" icon={<PlusOutlined />} onClick={openModal}>
                  Thêm danh mục đầu tiên
                </Button>
              </Empty>
            ),
          }}
          scroll={{ x: 'max-content' }}
        />
      </Card>

      {/* Modal */}
      <Modal
        title={editingCategory ? '✏️ Sửa danh mục' : '➕ Thêm danh mục mới'}
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}
        width={600}
        style={{ top: 20 }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            name: '',
            description: ''
          }}
        >
          <Form.Item
            name="name"
            label="Tên danh mục"
            rules={[
              { required: true, message: 'Vui lòng nhập tên danh mục!' },
              { min: 2, message: 'Tên danh mục phải có ít nhất 2 ký tự!' },
              { max: 100, message: 'Tên danh mục không được quá 100 ký tự!' }
            ]}
          >
            <Input 
              placeholder="Nhập tên danh mục..." 
              size="large"
            />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="Mô tả"
            rules={[
              { max: 500, message: 'Mô tả không được quá 500 ký tự!' }
            ]}
          >
            <Input.TextArea 
              rows={4}
              placeholder="Nhập mô tả danh mục..."
              showCount
              maxLength={500}
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
                {editingCategory ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
