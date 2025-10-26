// src/pages/staff/StaffCategoriesPage.jsx
import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
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
  Tag
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  ReloadOutlined,
  SearchOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { getAllCategories, createCategory, updateCategory, deleteCategory } from '../../services/categories';
import { dataManager } from '../../utils/dataManager';

const { Title, Text } = Typography;
const { Search } = AntInput;

export default function StaffCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [form] = Form.useForm();

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("📂 StaffCategoriesPage: Loading categories...");
      
      const data = await dataManager.get('categories', getAllCategories);
      
      console.log("📂 StaffCategoriesPage: Categories loaded", data);
      const categoriesData = Array.isArray(data) ? data : [];
      setCategories(categoriesData);
      setFilteredCategories(categoriesData);
    } catch (e) {
      console.error("📂 StaffCategoriesPage: Error loading categories", e);
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
    if (!searchTerm.trim()) {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter(category =>
        category.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCategories(filtered);
    }
  }, [searchTerm, categories]);

  const handleCreate = async (values) => {
    try {
      console.log("📂 StaffCategoriesPage: Creating category", values);
      const result = await createCategory(values);
      console.log("📂 StaffCategoriesPage: Category created", result);
      
      message.success('Tạo danh mục thành công!');
      form.resetFields();
      setIsModalOpen(false);
      
      // Refresh data
      await loadCategories();
    } catch (error) {
      console.error("📂 StaffCategoriesPage: Error creating category", error);
      message.error('Lỗi khi tạo danh mục: ' + (error?.message || 'Unknown error'));
    }
  };

  const handleUpdate = async (values) => {
    try {
      console.log("📂 StaffCategoriesPage: Updating category", { id: editingCategory.id, values });
      const result = await updateCategory(editingCategory.id, values);
      console.log("📂 StaffCategoriesPage: Category updated", result);
      
      message.success('Cập nhật danh mục thành công!');
      form.resetFields();
      setIsModalOpen(false);
      setEditingCategory(null);
      
      // Refresh data
      await loadCategories();
    } catch (error) {
      console.error("📂 StaffCategoriesPage: Error updating category", error);
      message.error('Lỗi khi cập nhật danh mục: ' + (error?.message || 'Unknown error'));
    }
  };

  const handleDelete = async (id) => {
    try {
      console.log("📂 StaffCategoriesPage: Deleting category", { id });
      const result = await deleteCategory(id);
      console.log("📂 StaffCategoriesPage: Category deleted", result);
      
      message.success('Xóa danh mục thành công!');
      
      // Refresh data
      await loadCategories();
    } catch (error) {
      console.error("📂 StaffCategoriesPage: Error deleting category", error);
      message.error('Lỗi khi xóa danh mục: ' + (error?.message || 'Unknown error'));
    }
  };

  const openCreateModal = () => {
    setEditingCategory(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    form.setFieldsValue({
      name: category.name,
      description: category.description
    });
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
      sorter: (a, b) => a.name?.localeCompare(b.name),
      render: (text) => (
        <Text strong style={{ color: 'var(--pv-text-heading, #2a1a10)' }}>
          {text}
        </Text>
      ),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (text) => (
        <Text style={{ color: 'var(--pv-text-muted, #7e5c48)' }}>
          {text || 'Không có mô tả'}
        </Text>
      ),
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (_, record) => (
        <Tag color="green">Hoạt động</Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
            style={{ color: 'var(--pv-primary, #eda274)' }}
            title="Chỉnh sửa"
          />
          <Popconfirm
            title="Xóa danh mục"
            description="Bạn có chắc chắn muốn xóa danh mục này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              title="Xóa"
            />
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
          Đang tải danh sách danh mục...
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
              📂 Quản lý danh mục
            </Title>
            <Text style={{ color: 'var(--pv-text-muted, #7e5c48)' }}>
              Xem, chỉnh sửa và xóa danh mục sản phẩm
            </Text>
          </Col>
          <Col>
            <Space>
              <Button 
                icon={<ReloadOutlined />} 
                onClick={loadCategories}
                style={{ borderRadius: '8px' }}
              >
                Làm mới
              </Button>
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={openCreateModal}
                style={{ 
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, var(--pv-primary, #eda274) 0%, var(--pv-accent, #ffb07c) 100%)',
                  border: 'none'
                }}
              >
                Thêm danh mục
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Search */}
      <Card style={{ marginBottom: '24px', borderRadius: '12px' }}>
        <Search
          placeholder="Tìm kiếm danh mục..."
          allowClear
          enterButton={<SearchOutlined />}
          size="large"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ maxWidth: 400 }}
        />
      </Card>

      {/* Table */}
      <Card 
        style={{ 
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #fff 0%, #ffeadd 100%)'
        }}
      >
        {filteredCategories.length === 0 ? (
          <Empty
            description="Không có danh mục nào"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
              Thêm danh mục đầu tiên
            </Button>
          </Empty>
        ) : (
          <Table
            columns={columns}
            dataSource={filteredCategories}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} của ${total} danh mục`,
            }}
            style={{ borderRadius: '8px' }}
          />
        )}
      </Card>

      {/* Modal */}
      <Modal
        title={editingCategory ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}
        width={600}
        style={{ borderRadius: '12px' }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={editingCategory ? handleUpdate : handleCreate}
          style={{ marginTop: '24px' }}
        >
          <Form.Item
            label="Tên danh mục"
            name="name"
            rules={[
              { required: true, message: 'Vui lòng nhập tên danh mục!' },
              { min: 2, message: 'Tên danh mục phải có ít nhất 2 ký tự!' }
            ]}
          >
            <Input 
              placeholder="Nhập tên danh mục..."
              size="large"
              style={{ borderRadius: '8px' }}
            />
          </Form.Item>

          <Form.Item
            label="Mô tả"
            name="description"
            rules={[
              { max: 500, message: 'Mô tả không được quá 500 ký tự!' }
            ]}
          >
            <Input.TextArea 
              placeholder="Nhập mô tả danh mục..."
              rows={4}
              style={{ borderRadius: '8px' }}
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
                {editingCategory ? 'Cập nhật' : 'Tạo mới'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
