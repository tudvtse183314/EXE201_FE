// src/pages/admin/products/ProductsPage.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { Button, Table, Space, Modal, Form, Input, InputNumber, Select, message, Popconfirm, Image } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined, EyeOutlined } from '@ant-design/icons';
import { getAllProducts, createProduct, updateProduct, deleteProduct } from '../../../services/products';
import { getAllCategories } from '../../../services/categories';

export default function ProductsPage() {
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  const loadData = async () => {
    try {
      setFetching(true);
      const [productsRes, categoriesRes] = await Promise.all([
        getAllProducts(),
        getAllCategories()
      ]);
      setData(Array.isArray(productsRes) ? productsRes : []);
      setCategories(Array.isArray(categoriesRes) ? categoriesRes : []);
    } catch (e) {
      message.error(e?.message || 'Tải dữ liệu thất bại');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const columns = useMemo(() => [
    { 
      title: 'ID', 
      dataIndex: 'id', 
      width: 80 
    },
    {
      title: 'Image',
      dataIndex: 'imageUrl',
      width: 100,
      render: (imageUrl) => (
        <Image
          width={60}
          height={60}
          src={imageUrl || '/placeholder.png'}
          alt="Product"
          style={{ objectFit: 'cover', borderRadius: 4 }}
          fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
        />
      )
    },
    { 
      title: 'Name', 
      dataIndex: 'name',
      ellipsis: true
    },
    { 
      title: 'Price', 
      dataIndex: 'price',
      width: 120,
      render: (price) => `${Number(price || 0).toLocaleString('vi-VN')}₫`
    },
    { 
      title: 'Stock', 
      dataIndex: 'stock',
      width: 80
    },
    {
      title: 'Category',
      dataIndex: ['category', 'name'],
      width: 120,
      ellipsis: true
    },
    {
      title: 'Type',
      dataIndex: 'type',
      width: 100,
      ellipsis: true
    },
    {
      title: 'Actions',
      width: 180,
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => {
              setEditing(record);
              form.setFieldsValue({
                name: record.name,
                description: record.description,
                price: record.price,
                stock: record.stock,
                imageUrl: record.imageUrl,
                type: record.type,
                categoryId: record.category?.id
              });
              setModalOpen(true);
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Xoá sản phẩm?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xoá"
            cancelText="Huỷ"
          >
            <Button size="small" danger icon={<DeleteOutlined />}>Delete</Button>
          </Popconfirm>
        </Space>
      )
    }
  ], [form]);

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      message.success('Đã xoá');
      loadData();
    } catch (e) {
      message.error(e?.message || 'Xoá thất bại');
    }
  };

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        name: values.name,
        description: values.description || '',
        price: Number(values.price),
        stock: Number(values.stock),
        imageUrl: values.imageUrl || '',
        type: values.type || '',
        categoryId: Number(values.categoryId)
      };

      if (editing) {
        await updateProduct(editing.id, payload);
        message.success('Đã cập nhật');
      } else {
        await createProduct(payload);
        message.success('Đã tạo');
      }
      setModalOpen(false);
      loadData();
    } catch (e) {
      if (e?.errorFields) return; // lỗi form
      message.error(e?.message || 'Lưu thất bại');
    }
  };

  return (
    <div>
      <Space style={{ marginBottom: 12 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          New Product
        </Button>
        <Button icon={<ReloadOutlined />} onClick={loadData} loading={fetching}>
          Refresh
        </Button>
      </Space>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        loading={fetching}
        pagination={{ pageSize: 10, showSizeChanger: true }}
        scroll={{ x: 1000 }}
      />

      <Modal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSubmit}
        title={editing ? 'Edit Product' : 'New Product'}
        okText={editing ? 'Save' : 'Create'}
        destroyOnClose
        width={600}
      >
        <Form form={form} layout="vertical" preserve={false}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
          >
            <Input placeholder="Tên sản phẩm" />
          </Form.Item>
          
          <Form.Item label="Description" name="description">
            <Input.TextArea placeholder="Mô tả sản phẩm" autoSize={{ minRows: 2, maxRows: 4 }} />
          </Form.Item>

          <Form.Item
            label="Price"
            name="price"
            rules={[{ required: true, message: 'Vui lòng nhập giá' }]}
          >
            <InputNumber
              placeholder="Giá sản phẩm"
              style={{ width: '100%' }}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>

          <Form.Item
            label="Stock"
            name="stock"
            rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}
          >
            <InputNumber
              placeholder="Số lượng tồn kho"
              style={{ width: '100%' }}
              min={0}
            />
          </Form.Item>

          <Form.Item
            label="Category"
            name="categoryId"
            rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
          >
            <Select placeholder="Chọn danh mục">
              {categories.map(cat => (
                <Select.Option key={cat.id} value={cat.id}>
                  {cat.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Type" name="type">
            <Input placeholder="Loại sản phẩm" />
          </Form.Item>

          <Form.Item label="Image URL" name="imageUrl">
            <Input placeholder="URL hình ảnh" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
