import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Input, 
  Select, 
  Tag, 
  Modal, 
  Form, 
  Input as AntInput,
  Space, 
  Popconfirm,
  DatePicker,
  message as antMessage,
  Drawer,
  Card,
  Row,
  Col,
  Spin,
} from 'antd';
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { toast } from 'react-toastify';
import { chatHistoryApi } from '../../services/chatHistory';
import { formatChatDate, getChatTypeDisplayName, getChatTypeBadgeColor } from '../../utils/chatUtils';
import dayjs from 'dayjs';
const { RangePicker } = DatePicker;
const { TextArea } = AntInput;
const { Option } = Select;

const ChatHistory = () => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [createDrawerVisible, setCreateDrawerVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [form] = Form.useForm();
  const [createForm] = Form.useForm();

  // Filters
  const [userIdFilter, setUserIdFilter] = useState('');
  const [chatTypeFilter, setChatTypeFilter] = useState('');
  const [dateRange, setDateRange] = useState(null);

  // Load all chats
  const loadChats = async () => {
    setLoading(true);
    try {
      const chats = await chatHistoryApi.getAll();
      setDataSource(chats || []);
      toast.success('Đã tải danh sách chat');
    } catch (error) {
      console.error('Error loading chats:', error);
      toast.error('Không thể tải danh sách chat');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChats();
  }, []);

  // Handle view
  const handleView = (record) => {
    setSelectedRecord(record);
    setViewModalVisible(true);
  };

  // Handle edit
  const handleEdit = (record) => {
    setSelectedRecord(record);
    form.setFieldsValue({
      userMessage: record.userMessage,
      aiResponse: record.aiResponse,
      chatType: record.chatType,
      contextData: JSON.stringify(record.contextData || {}, null, 2),
    });
    setEditModalVisible(true);
  };

  // Handle update
  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      
      const updateData = {
        userMessage: values.userMessage,
        aiResponse: values.aiResponse,
        chatType: values.chatType,
        contextData: values.contextData ? JSON.parse(values.contextData) : null,
      };

      await chatHistoryApi.updateById(selectedRecord.chatId, updateData);
      toast.success('Cập nhật thành công');
      setEditModalVisible(false);
      form.resetFields();
      loadChats();
    } catch (error) {
      console.error('Error updating chat:', error);
      toast.error('Cập nhật thất bại');
    }
  };

  // Handle delete
  const handleDelete = async (chatId) => {
    try {
      await chatHistoryApi.deleteById(chatId);
      toast.success('Xóa thành công');
      loadChats();
    } catch (error) {
      console.error('Error deleting chat:', error);
      toast.error('Xóa thất bại');
    }
  };

  // Handle create
  const handleCreate = async () => {
    try {
      const values = await createForm.validateFields();
      
      const newChat = {
        userId: values.userId,
        userMessage: values.userMessage,
        aiResponse: values.aiResponse,
        chatType: values.chatType,
        createdAt: values.createdAt ? values.createdAt.toISOString() : new Date().toISOString(),
        contextData: values.contextData ? JSON.parse(values.contextData) : null,
      };

      await chatHistoryApi.createManual(newChat);
      toast.success('Tạo thành công');
      setCreateDrawerVisible(false);
      createForm.resetFields();
      loadChats();
    } catch (error) {
      console.error('Error creating chat:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Tạo thất bại');
      }
    }
  };

  // Filter data
  const getFilteredData = () => {
    return dataSource.filter(record => {
      const matchUserId = !userIdFilter || 
        record.userId?.toString().includes(userIdFilter);
      
      const matchChatType = !chatTypeFilter || 
        record.chatType === chatTypeFilter;
      
      const matchDate = !dateRange || !record.createdAt || (() => {
        const recordDate = dayjs(record.createdAt);
        return recordDate.isAfter(dateRange[0]) && recordDate.isBefore(dateRange[1]);
      })();

      return matchUserId && matchChatType && matchDate;
    });
  };

  const columns = [
    {
      title: 'Chat ID',
      dataIndex: 'chatId',
      key: 'chatId',
      width: 80,
      fixed: 'left',
    },
    {
      title: 'User ID',
      dataIndex: 'userId',
      key: 'userId',
      width: 100,
    },
    {
      title: 'Type',
      dataIndex: 'chatType',
      key: 'chatType',
      width: 130,
      render: (type) => (
        <Tag color={getChatTypeBadgeColor(type)}>
          {getChatTypeDisplayName(type)}
        </Tag>
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
      render: (date) => formatChatDate(date),
    },
    {
      title: 'User Message',
      dataIndex: 'userMessage',
      key: 'userMessage',
      ellipsis: true,
      render: (text) => (
        <div className="max-w-xs truncate">{text}</div>
      ),
    },
    {
      title: 'AI Response',
      dataIndex: 'aiResponse',
      key: 'aiResponse',
      ellipsis: true,
      render: (text) => (
        <div className="max-w-xs truncate">{text}</div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 180,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
            size="small"
          >
            View
          </Button>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
            type="dashed"
          >
            Edit
          </Button>
          <Popconfirm
            title="Xác nhận xóa"
            description="Bạn có chắc muốn xóa chat này?"
            onConfirm={() => handleDelete(record.chatId)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button
              icon={<DeleteOutlined />}
              danger
              size="small"
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Chat History</h1>
          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={loadChats}
              loading={loading}
            >
              Reload
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setCreateDrawerVisible(true)}
            >
              Create Manual
            </Button>
          </Space>
        </div>

        {/* Filters */}
        <Card className="mb-4">
          <Row gutter={16}>
            <Col span={6}>
              <Input
                placeholder="Filter by User ID"
                prefix={<SearchOutlined />}
                value={userIdFilter}
                onChange={(e) => setUserIdFilter(e.target.value)}
                allowClear
              />
            </Col>
            <Col span={6}>
              <Select
                placeholder="Filter by Type"
                value={chatTypeFilter}
                onChange={setChatTypeFilter}
                allowClear
                className="w-full"
              >
                <Option value="general">General</Option>
                <Option value="product_inquiry">Product Inquiry</Option>
                <Option value="order_support">Order Support</Option>
              </Select>
            </Col>
            <Col span={8}>
              <RangePicker
                onChange={setDateRange}
                format="YYYY-MM-DD"
                className="w-full"
              />
            </Col>
            <Col span={4}>
              <Button
                className="w-full"
                onClick={() => {
                  setUserIdFilter('');
                  setChatTypeFilter('');
                  setDateRange(null);
                }}
              >
                Reset
              </Button>
            </Col>
          </Row>
        </Card>
      </div>

      <Table
        dataSource={getFilteredData()}
        columns={columns}
        loading={loading}
        rowKey="chatId"
        scroll={{ x: 1300 }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total: ${total}`,
        }}
      />

      {/* View Modal */}
      <Modal
        title="View Chat"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedRecord && (
          <div className="space-y-4">
            <Card size="small">
              <Row gutter={16}>
                <Col span={6}><strong>Chat ID:</strong></Col>
                <Col span={18}>{selectedRecord.chatId}</Col>
                <Col span={6}><strong>User ID:</strong></Col>
                <Col span={18}>{selectedRecord.userId}</Col>
                <Col span={6}><strong>Type:</strong></Col>
                <Col span={18}>
                  <Tag color={getChatTypeBadgeColor(selectedRecord.chatType)}>
                    {getChatTypeDisplayName(selectedRecord.chatType)}
                  </Tag>
                </Col>
                <Col span={6}><strong>Created At:</strong></Col>
                <Col span={18}>{formatChatDate(selectedRecord.createdAt)}</Col>
              </Row>
            </Card>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold mb-2">User Message</h3>
                <p className="text-sm whitespace-pre-wrap">{selectedRecord.userMessage}</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <h3 className="font-semibold mb-2">AI Response</h3>
                <p className="text-sm whitespace-pre-wrap">{selectedRecord.aiResponse}</p>
              </div>
            </div>

            {selectedRecord.contextData && (
              <Card size="small" title="Context Data">
                <pre className="text-xs overflow-auto max-h-40">
                  {JSON.stringify(selectedRecord.contextData, null, 2)}
                </pre>
              </Card>
            )}
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal
        title="Edit Chat"
        open={editModalVisible}
        onOk={handleUpdate}
        onCancel={() => {
          setEditModalVisible(false);
          form.resetFields();
        }}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="userMessage"
            label="User Message"
            rules={[{ required: true }]}
          >
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="aiResponse"
            label="AI Response"
            rules={[{ required: true }]}
          >
            <TextArea rows={6} />
          </Form.Item>
          <Form.Item
            name="chatType"
            label="Chat Type"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="general">General</Option>
              <Option value="product_inquiry">Product Inquiry</Option>
              <Option value="order_support">Order Support</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="contextData"
            label="Context Data (JSON)"
          >
            <TextArea rows={4} placeholder='{"key": "value"}' />
          </Form.Item>
        </Form>
      </Modal>

      {/* Create Drawer */}
      <Drawer
        title="Create Manual Chat"
        open={createDrawerVisible}
        onClose={() => {
          setCreateDrawerVisible(false);
          createForm.resetFields();
        }}
        width={600}
      >
        <Form
          form={createForm}
          layout="vertical"
          onFinish={handleCreate}
        >
          <Form.Item
            name="userId"
            label="User ID"
            rules={[{ required: true, type: 'number' }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="userMessage"
            label="User Message"
            rules={[{ required: true }]}
          >
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="aiResponse"
            label="AI Response"
            rules={[{ required: true }]}
          >
            <TextArea rows={6} />
          </Form.Item>
          <Form.Item
            name="chatType"
            label="Chat Type"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="general">General</Option>
              <Option value="product_inquiry">Product Inquiry</Option>
              <Option value="order_support">Order Support</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="contextData"
            label="Context Data (JSON)"
          >
            <TextArea rows={4} placeholder='{"key": "value"}' />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Create
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default ChatHistory;

