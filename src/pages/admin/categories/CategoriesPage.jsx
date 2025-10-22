// src/pages/admin/categories/CategoriesPage.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { Button, Table, Space, Modal, Form, Input, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import { getAllCategories, createCategory, updateCategory, deleteCategory } from '../../../services/categories';

export default function CategoriesPage() {
  const [data, setData] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null); // category đang edit
  const [form] = Form.useForm();

  const loadData = async () => {
    try {
      setFetching(true);
      const res = await getAllCategories(); // phải trả về [{id, name, description}]
      setData(Array.isArray(res) ? res : []);
    } catch (e) {
      message.error(e?.message || 'Tải danh mục thất bại');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const columns = useMemo(() => [
    { title: 'ID', dataIndex: 'id', width: 80 },
    { title: 'Name', dataIndex: 'name' },
    { title: 'Description', dataIndex: 'description' },
    {
      title: 'Actions',
      width: 160,
      render: (_, record) => (
        <Space>
          {/* Nếu BE chưa hỗ trợ PUT, bạn có thể ẩn nút Edit: */}
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => {
              setEditing(record);
              form.setFieldsValue({ name: record.name, description: record.description });
              setModalOpen(true);
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Xoá danh mục?"
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
      await deleteCategory(id);
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
      if (editing) {
        // UPDATE
        await updateCategory(editing.id, {
          name: values.name,
          description: values.description || ''
        });
        message.success('Đã cập nhật');
      } else {
        // CREATE
        await createCategory({
          name: values.name,
          description: values.description || ''
        });
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
          New Category
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
        pagination={{ pageSize: 10, showSizeChanger: false }}
      />

      <Modal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSubmit}
        title={editing ? 'Edit Category' : 'New Category'}
        okText={editing ? 'Save' : 'Create'}
        destroyOnClose
      >
        <Form form={form} layout="vertical" preserve={false}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên danh mục' }]}
          >
            <Input placeholder="Tên danh mục" />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input.TextArea placeholder="Mô tả" autoSize={{ minRows: 2, maxRows: 4 }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
