// src/pages/admin/accounts/AdminAccountsPage.jsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Table, 
  Button, 
  Card, 
  Typography, 
  Row, 
  Col,
  Input as AntInput,
  Alert,
  Empty,
  Tag,
  Select,
  Space,
  Modal,
  Descriptions,
  Tooltip,
  App,
  Form,
  Statistic
} from 'antd';
import { 
  ReloadOutlined,
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  RollbackOutlined,
  UserOutlined
} from '@ant-design/icons';
import { getAllAccounts, updateAccount, deleteAccount } from '../../../services/auth';
import { restoreAccount } from '../../../api/account';
import { useToast } from '../../../context/ToastContext';

const { Title, Text } = Typography;
const { Search } = AntInput;
const { Option } = Select;

// Helper functions
const getRoleColor = (role) => {
  const roleUpper = role?.toUpperCase();
  switch (roleUpper) {
    case 'ADMIN':
      return 'red';
    case 'MANAGER':
      return 'purple';
    case 'CUSTOMER':
      return 'blue';
    case 'DOCTOR':
      return 'green';
    default:
      return 'default';
  }
};

const getRoleText = (role) => {
  const roleUpper = role?.toUpperCase();
  switch (roleUpper) {
    case 'ADMIN':
      return 'Quản trị viên';
    case 'MANAGER':
      return 'Quản lý';
    case 'CUSTOMER':
      return 'Khách hàng';
    case 'DOCTOR':
      return 'Bác sĩ';
    default:
      return role || 'N/A';
  }
};

export default function AdminAccountsPage() {
  console.log('🔁 AdminAccountsPage render', new Date().toISOString());
  
  const { modal } = App.useApp();
  const { showSuccess, showError } = useToast();
  const [form] = Form.useForm();
  
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [showDeleted, setShowDeleted] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  
  const hasFetchedRef = useRef(false);

  // Load accounts
  useEffect(() => {
    if (hasFetchedRef.current) {
      console.log("👥 AdminAccountsPage: ⚠️ Already fetched, skipping duplicate call");
      return;
    }
    
    console.log("👥 AdminAccountsPage: 🚀 Starting initial fetch...");
    let cancelled = false;
    
    const fetchAccounts = async () => {
      hasFetchedRef.current = true;
      setLoading(true);
      setError(null);
      
      try {
        const data = await getAllAccounts();
        
        if (!cancelled) {
          const normalized = Array.isArray(data) ? data : [];
          setAccounts(normalized);
          setLoading(false);
          console.log("👥 AdminAccountsPage: ✅ Loading completed", { count: normalized.length });
        }
      } catch (err) {
        if (!cancelled) {
          const errorMessage = err?.message || "Không thể tải danh sách tài khoản.";
          setError(errorMessage);
          setAccounts([]);
          setLoading(false);
          console.error("👥 AdminAccountsPage: ❌ Error loading accounts", err);
        }
      }
    };
    
    fetchAccounts();
    
    return () => {
      cancelled = true;
    };
  }, []);

  const handleReload = () => {
    hasFetchedRef.current = false;
    setLoading(true);
    setError(null);
    
    getAllAccounts()
      .then(data => {
        const normalized = Array.isArray(data) ? data : [];
        setAccounts(normalized);
        setLoading(false);
        showSuccess('Đã tải lại danh sách tài khoản thành công!');
      })
      .catch(err => {
        const errorMessage = err?.message || "Không thể tải danh sách tài khoản.";
        setError(errorMessage);
        setAccounts([]);
        setLoading(false);
        showError(errorMessage);
      });
  };

  // Filter accounts
  const filteredAccounts = useMemo(() => {
    let filtered = [...accounts];

    // Filter by deleted status
    if (showDeleted) {
      filtered = filtered.filter(acc => acc.deleted === true);
    } else {
      filtered = filtered.filter(acc => !acc.deleted);
    }

    // Filter by role
    if (selectedRole) {
      filtered = filtered.filter(acc => 
        acc.role?.toUpperCase() === selectedRole.toUpperCase()
      );
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(acc =>
        acc.id?.toString().includes(term) ||
        acc.FullName?.toLowerCase().includes(term) ||
        acc.fullName?.toLowerCase().includes(term) ||
        acc.email?.toLowerCase().includes(term) ||
        acc.phone?.includes(term)
      );
    }

    return filtered;
  }, [accounts, searchTerm, selectedRole, showDeleted]);

  // Statistics
  const stats = useMemo(() => {
    const total = accounts.length;
    const active = accounts.filter(acc => !acc.deleted).length;
    const deleted = accounts.filter(acc => acc.deleted).length;
    const byRole = accounts.reduce((acc, account) => {
      const role = account.role?.toUpperCase() || 'UNKNOWN';
      acc[role] = (acc[role] || 0) + 1;
      return acc;
    }, {});
    
    return { total, active, deleted, byRole };
  }, [accounts]);

  // Handlers
  const showAccountDetail = (account) => {
    setSelectedAccount(account);
    setIsDetailModalOpen(true);
  };

  const handleEdit = (account) => {
    setSelectedAccount(account);
    form.setFieldsValue({
      fullName: account.FullName || account.fullName || '',
      email: account.email || '',
      phone: account.phone || ''
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateAccount = async () => {
    try {
      const values = await form.validateFields();
      setUpdating(true);
      
      await updateAccount(selectedAccount.id, values);
      await handleReload();
      
      showSuccess('Đã cập nhật thông tin tài khoản thành công!');
      setIsEditModalOpen(false);
      form.resetFields();
    } catch (error) {
      console.error("👥 AdminAccountsPage: Error updating account", error);
      const message = error?.message || error?.response?.data?.message || 'Không thể cập nhật tài khoản.';
      showError(message);
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteAccount = (accountId) => {
    modal.confirm({
      title: 'Xác nhận xóa tài khoản',
      content: `Bạn có chắc muốn xóa tài khoản #${accountId}? Tài khoản sẽ bị đánh dấu là đã xóa (soft delete).`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          setUpdating(true);
          await deleteAccount(accountId);
          await handleReload();
          showSuccess('Đã xóa tài khoản thành công!');
        } catch (error) {
          console.error("👥 AdminAccountsPage: Error deleting account", error);
          const message = error?.message || error?.response?.data?.message || 'Không thể xóa tài khoản.';
          showError(message);
        } finally {
          setUpdating(false);
        }
      }
    });
  };

  const handleRestoreAccount = (accountId) => {
    modal.confirm({
      title: 'Xác nhận khôi phục tài khoản',
      content: `Bạn có chắc muốn khôi phục tài khoản #${accountId}?`,
      okText: 'Khôi phục',
      okType: 'primary',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          setUpdating(true);
          await restoreAccount(accountId);
          await handleReload();
          showSuccess('Đã khôi phục tài khoản thành công!');
        } catch (error) {
          console.error("👥 AdminAccountsPage: Error restoring account", error);
          const message = error?.message || error?.response?.data?.message || 'Không thể khôi phục tài khoản.';
          showError(message);
        } finally {
          setUpdating(false);
        }
      }
    });
  };

  // Table columns
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Họ tên',
      dataIndex: 'FullName',
      key: 'fullName',
      render: (text, record) => text || record.fullName || 'N/A',
      sorter: (a, b) => {
        const nameA = (a.FullName || a.fullName || '').toLowerCase();
        const nameB = (b.FullName || b.fullName || '').toLowerCase();
        return nameA.localeCompare(nameB);
      },
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text) => text || 'N/A',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      render: (text) => text || 'N/A',
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={getRoleColor(role)}>
          {getRoleText(role)}
        </Tag>
      ),
      filters: [
        { text: 'Quản trị viên', value: 'ADMIN' },
        { text: 'Quản lý', value: 'MANAGER' },
        { text: 'Khách hàng', value: 'CUSTOMER' },
        { text: 'Bác sĩ', value: 'DOCTOR' },
      ],
      onFilter: (value, record) => record.role?.toUpperCase() === value,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'deleted',
      key: 'deleted',
      render: (deleted) => (
        <Tag color={deleted ? 'red' : 'green'}>
          {deleted ? 'Đã xóa' : 'Hoạt động'}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      fixed: 'right',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => showAccountDetail(record)}
              style={{ color: 'var(--pv-primary, #eda274)' }}
            />
          </Tooltip>
          
          {!record.deleted && (
            <Tooltip title="Chỉnh sửa">
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => handleEdit(record)}
                style={{ color: '#1890ff' }}
              />
            </Tooltip>
          )}
          
          {!record.deleted ? (
            <Tooltip title="Xóa">
              <Button
                type="text"
                icon={<DeleteOutlined />}
                onClick={() => handleDeleteAccount(record.id)}
                danger
              />
            </Tooltip>
          ) : (
            <Tooltip title="Khôi phục">
              <Button
                type="text"
                icon={<RollbackOutlined />}
                onClick={() => handleRestoreAccount(record.id)}
                style={{ color: '#52c41a' }}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
          <Col>
            <Title level={2} style={{ margin: 0 }}>
              <UserOutlined /> Quản lý tài khoản
            </Title>
          </Col>
          <Col>
            <Button
              icon={<ReloadOutlined />}
              onClick={handleReload}
              loading={loading}
            >
              Làm mới
            </Button>
          </Col>
        </Row>

        {/* Statistics */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="Tổng số tài khoản"
                value={stats.total}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Đang hoạt động"
                value={stats.active}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Đã xóa"
                value={stats.deleted}
                valueStyle={{ color: '#cf1322' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Khách hàng"
                value={stats.byRole.CUSTOMER || 0}
              />
            </Card>
          </Col>
        </Row>

        {/* Filters */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={8}>
            <Search
              placeholder="Tìm kiếm theo ID, tên, email, số điện thoại..."
              allowClear
              enterButton={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onSearch={(value) => setSearchTerm(value)}
            />
          </Col>
          <Col span={6}>
            <Select
              placeholder="Lọc theo vai trò"
              allowClear
              style={{ width: '100%' }}
              value={selectedRole}
              onChange={setSelectedRole}
            >
              <Option value="ADMIN">Quản trị viên</Option>
              <Option value="MANAGER">Quản lý</Option>
              <Option value="CUSTOMER">Khách hàng</Option>
              <Option value="DOCTOR">Bác sĩ</Option>
            </Select>
          </Col>
          <Col span={6}>
            <Select
              placeholder="Trạng thái"
              style={{ width: '100%' }}
              value={showDeleted ? 'deleted' : 'active'}
              onChange={(value) => setShowDeleted(value === 'deleted')}
            >
              <Option value="active">Đang hoạt động</Option>
              <Option value="deleted">Đã xóa</Option>
            </Select>
          </Col>
        </Row>

        {/* Error Alert */}
        {error && (
          <Alert
            message="Lỗi"
            description={error}
            type="error"
            showIcon
            closable
            onClose={() => setError(null)}
            style={{ marginBottom: 16 }}
          />
        )}

        {/* Table */}
        <Table
          columns={columns}
          dataSource={filteredAccounts}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} tài khoản`,
          }}
          scroll={{ x: 1200 }}
          locale={{
            emptyText: <Empty description="Không có tài khoản nào" />
          }}
        />
      </Card>

      {/* Detail Modal */}
      <Modal
        title="Chi tiết tài khoản"
        open={isDetailModalOpen}
        onCancel={() => setIsDetailModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsDetailModalOpen(false)}>
            Đóng
          </Button>
        ]}
        width={600}
      >
        {selectedAccount && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="ID">{selectedAccount.id}</Descriptions.Item>
            <Descriptions.Item label="Họ tên">
              {selectedAccount.FullName || selectedAccount.fullName || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {selectedAccount.email || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">
              {selectedAccount.phone || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Vai trò">
              <Tag color={getRoleColor(selectedAccount.role)}>
                {getRoleText(selectedAccount.role)}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color={selectedAccount.deleted ? 'red' : 'green'}>
                {selectedAccount.deleted ? 'Đã xóa' : 'Hoạt động'}
              </Tag>
            </Descriptions.Item>
            {selectedAccount.petIds && selectedAccount.petIds.length > 0 && (
              <>
                <Descriptions.Item label="Số thú cưng">
                  {selectedAccount.petIds.length}
                </Descriptions.Item>
                <Descriptions.Item label="Tên thú cưng">
                  {selectedAccount.petNames?.join(', ') || 'N/A'}
                </Descriptions.Item>
              </>
            )}
          </Descriptions>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal
        title="Chỉnh sửa tài khoản"
        open={isEditModalOpen}
        onOk={handleUpdateAccount}
        onCancel={() => {
          setIsEditModalOpen(false);
          form.resetFields();
        }}
        confirmLoading={updating}
        okText="Cập nhật"
        cancelText="Hủy"
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            label="Họ tên"
            name="fullName"
            rules={[
              { required: true, message: 'Vui lòng nhập họ tên' }
            ]}
          >
            <AntInput placeholder="Nhập họ tên" />
          </Form.Item>
          
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { type: 'email', message: 'Email không hợp lệ' }
            ]}
          >
            <AntInput placeholder="Nhập email" />
          </Form.Item>
          
          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại' },
              { pattern: /^(84|0[3|5|7|8|9])+(\d{8})$/, message: 'Số điện thoại không hợp lệ' }
            ]}
          >
            <AntInput placeholder="Nhập số điện thoại" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

