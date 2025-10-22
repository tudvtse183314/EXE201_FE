// src/pages/admin/carts/CartsPage.jsx
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Space, 
  Typography, 
  Tag, 
  Input, 
  Select, 
  message,
  Popconfirm,
  Row,
  Col,
  Statistic,
  Alert
} from 'antd';
import { 
  ReloadOutlined, 
  DeleteOutlined, 
  SearchOutlined,
  ShoppingCartOutlined
} from '@ant-design/icons';
import { getAllCarts, deleteCartItem } from '../../../services/cart';
import { getAllProducts } from '../../../services/products';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

export default function CartsPage() {
  const [carts, setCarts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [userIdFilter, setUserIdFilter] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [cartsData, productsData] = await Promise.all([
        getAllCarts(),
        getAllProducts()
      ]);
      
      // Map products to carts for better display
      const cartsWithProducts = cartsData.map(cart => ({
        ...cart,
        product: productsData.find(p => p.id === cart.productId)
      }));
      
      setCarts(cartsWithProducts);
      setProducts(productsData);
    } catch (e) {
      console.error('Error loading carts data:', e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCart = async (cartId) => {
    try {
      setLoading(true);
      await deleteCartItem(cartId);
      setCarts(prev => prev.filter(cart => cart.id !== cartId));
      message.success('Đã xóa item khỏi giỏ hàng!');
    } catch (e) {
      console.error('Error deleting cart item:', e);
      message.error('Không thể xóa item. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  const handleClearAllCarts = async () => {
    try {
      setLoading(true);
      const deletePromises = carts.map(cart => deleteCartItem(cart.id));
      await Promise.all(deletePromises);
      setCarts([]);
      message.success('Đã xóa tất cả giỏ hàng!');
    } catch (e) {
      console.error('Error clearing all carts:', e);
      message.error('Không thể xóa tất cả giỏ hàng. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  // Filter carts
  const filteredCarts = carts.filter(cart => {
    const matchesSearch = !searchTerm || 
      cart.product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cart.productId?.toString().includes(searchTerm);
    
    const matchesUser = userIdFilter === 'all' || 
      cart.userId?.toString() === userIdFilter;
    
    return matchesSearch && matchesUser;
  });

  // Get unique user IDs for filter
  const uniqueUserIds = [...new Set(carts.map(cart => cart.userId))].sort((a, b) => a - b);

  // Calculate statistics
  const totalCarts = carts.length;
  const totalItems = carts.reduce((sum, cart) => sum + cart.quantity, 0);
  const totalValue = carts.reduce((sum, cart) => sum + (cart.total || 0), 0);
  const uniqueUsers = uniqueUserIds.length;

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'User ID',
      dataIndex: 'userId',
      key: 'userId',
      width: 100,
      sorter: (a, b) => a.userId - b.userId,
      render: (userId) => (
        <Tag color={userId === 0 ? 'orange' : 'blue'}>
          {userId === 0 ? 'Guest' : `User ${userId}`}
        </Tag>
      ),
    },
    {
      title: 'Sản phẩm',
      key: 'product',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: '600', marginBottom: '4px' }}>
            {record.product?.name || `Product ID: ${record.productId}`}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            ID: {record.productId}
          </div>
        </div>
      ),
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
      sorter: (a, b) => a.quantity - b.quantity,
      render: (quantity) => (
        <Tag color="green">{quantity}</Tag>
      ),
    },
    {
      title: 'Giá đơn vị',
      key: 'unitPrice',
      width: 120,
      render: (_, record) => {
        const unitPrice = record.product?.price || 0;
        return (
          <Text strong>
            {unitPrice ? `${unitPrice.toLocaleString()}đ` : 'N/A'}
          </Text>
        );
      },
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total',
      key: 'total',
      width: 120,
      sorter: (a, b) => (a.total || 0) - (b.total || 0),
      render: (total) => (
        <Text strong style={{ color: '#eda274' }}>
          {total ? `${total.toLocaleString()}đ` : 'N/A'}
        </Text>
      ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Popconfirm
            title="Xóa item này khỏi giỏ hàng?"
            description="Hành động này không thể hoàn tác."
            onConfirm={() => handleDeleteCart(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />}
              size="small"
              loading={loading}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

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
      <div style={{ marginBottom: '24px' }}>
        <Title level={2} style={{ margin: 0, color: '#362319' }}>
          🛒 Quản lý Giỏ hàng
        </Title>
        <Text type="secondary">
          Quản lý tất cả giỏ hàng của người dùng trong hệ thống
        </Text>
      </div>

      {/* Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Tổng số giỏ hàng"
              value={totalCarts}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: '#eda274' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Tổng số sản phẩm"
              value={totalItems}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Tổng giá trị"
              value={totalValue}
              formatter={(value) => `${value.toLocaleString()}đ`}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Số người dùng"
              value={uniqueUsers}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="Tìm kiếm theo tên sản phẩm hoặc ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%' }}
              prefix={<SearchOutlined />}
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Select
              value={userIdFilter}
              onChange={setUserIdFilter}
              style={{ width: '100%' }}
              placeholder="Lọc theo User ID"
            >
              <Option value="all">Tất cả người dùng</Option>
              {uniqueUserIds.map(userId => (
                <Option key={userId} value={userId.toString()}>
                  {userId === 0 ? 'Guest' : `User ${userId}`}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={24} md={8}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button 
                icon={<ReloadOutlined />} 
                onClick={loadData}
                loading={loading}
              >
                Làm mới
              </Button>
              {carts.length > 0 && (
                <Popconfirm
                  title="Xóa tất cả giỏ hàng?"
                  description="Hành động này sẽ xóa tất cả items trong giỏ hàng và không thể hoàn tác."
                  onConfirm={handleClearAllCarts}
                  okText="Xóa tất cả"
                  cancelText="Hủy"
                  okButtonProps={{ danger: true }}
                >
                  <Button danger>
                    Xóa tất cả
                  </Button>
                </Popconfirm>
              )}
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Cart Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredCarts}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} items`,
            pageSizeOptions: ['10', '20', '50'],
          }}
          scroll={{ x: 'max-content' }}
        />
      </Card>
    </div>
  );
}
