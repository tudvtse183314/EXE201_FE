// src/pages/admin/petProfiles/AdminPetProfilesPage.jsx
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Typography, 
  Row, 
  Col,
  Table,
  Tag,
  Input,
  Select,
  Space,
  Button,
  Alert,
  Empty,
  Image,
  Tooltip,
  Modal,
  Descriptions
} from 'antd';
import { 
  ReloadOutlined,
  SearchOutlined,
  EyeOutlined,
  HeartOutlined
} from '@ant-design/icons';
import { getAllPets } from '../../../services/petProfiles';
import { useToast } from '../../../context/ToastContext';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

export default function AdminPetProfilesPage() {
  const { showError, showSuccess } = useToast();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [selectedPet, setSelectedPet] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllPets();
      const normalized = Array.isArray(data) ? data : [];
      setPets(normalized);
    } catch (err) {
      const errorMessage = err?.message || "Không thể tải danh sách hồ sơ thú cưng.";
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const filteredPets = pets.filter(pet => {
    const matchesSearch = !searchTerm || 
      pet.petName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.breed?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.fullName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'ALL' || pet.petType?.toLowerCase() === typeFilter.toLowerCase();
    
    return matchesSearch && matchesType;
  });

  const columns = [
    {
      title: 'ID',
      dataIndex: 'petId',
      key: 'petId',
      width: 80,
      render: (id) => <Text strong>#{id}</Text>,
    },
    {
      title: 'Ảnh',
      key: 'image',
      width: 100,
      render: (_, record) => (
        <LazyLoadImage
          src={record.imageUrl || 'https://via.placeholder.com/60'}
          alt={record.petName}
          width={60}
          height={60}
          style={{
            objectFit: 'cover',
            borderRadius: '8px',
            border: '2px solid #f0f0f0'
          }}
          effect="blur"
          placeholderSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3C/svg%3E"
        />
      ),
    },
    {
      title: 'Tên thú cưng',
      dataIndex: 'petName',
      key: 'petName',
      render: (name) => <Text strong>{name}</Text>,
    },
    {
      title: 'Chủ sở hữu',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (name, record) => (
        <Space direction="vertical" size={0}>
          <Text>{name || 'N/A'}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            User ID: {record.userId}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Loại',
      dataIndex: 'petType',
      key: 'petType',
      render: (type) => (
        <Tag color={type?.toLowerCase() === 'dog' ? 'blue' : type?.toLowerCase() === 'cat' ? 'purple' : 'default'}>
          {type || 'N/A'}
        </Tag>
      ),
    },
    {
      title: 'Giống',
      dataIndex: 'breed',
      key: 'breed',
    },
    {
      title: 'Cân nặng',
      dataIndex: 'weight',
      key: 'weight',
      render: (weight) => weight ? `${weight} kg` : 'N/A',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => date ? new Date(date).toLocaleDateString('vi-VN') : 'N/A',
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Tooltip title="Xem chi tiết">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedPet(record);
              setIsDetailModalOpen(true);
            }}
            style={{ color: 'var(--pv-primary, #eda274)' }}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <div>
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
              🐾 Quản lý hồ sơ thú cưng
            </Title>
            <Text style={{ color: 'var(--pv-text-muted, #7e5c48)' }}>
              Xem và quản lý tất cả hồ sơ thú cưng của khách hàng
            </Text>
          </Col>
          <Col>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={fetchPets}
              loading={loading}
              style={{ borderRadius: '8px' }}
            >
              Làm mới
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Filters */}
      <Card style={{ marginBottom: '24px', borderRadius: '12px' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="Tìm kiếm theo tên, giống, chủ sở hữu..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Select
              placeholder="Lọc theo loại"
              allowClear
              size="large"
              style={{ width: '100%' }}
              value={typeFilter}
              onChange={setTypeFilter}
            >
              <Option value="ALL">Tất cả</Option>
              <Option value="dog">Chó</Option>
              <Option value="cat">Mèo</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Text style={{ color: 'var(--pv-text-muted, #7e5c48)' }}>
              Tổng: {pets.length} hồ sơ
              {filteredPets.length !== pets.length && (
                <span style={{ marginLeft: 8, color: 'var(--pv-primary, #eda274)' }}>
                  (Đang lọc: {filteredPets.length})
                </span>
              )}
            </Text>
          </Col>
        </Row>
      </Card>

      {/* Pets Table */}
      <Card style={{ borderRadius: '12px' }}>
        {error && (
          <Alert
            message="Lỗi tải dữ liệu"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}
        <Table
          columns={columns}
          dataSource={filteredPets}
          rowKey={(record) => record.petId || record.id}
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} hồ sơ`
          }}
          scroll={{ x: 'max-content' }}
          locale={{
            emptyText: loading ? <Empty description="Đang tải..." /> : <Empty description="Chưa có hồ sơ thú cưng nào" />
          }}
        />
      </Card>

      {/* Pet Detail Modal */}
      <Modal
        title={`Chi tiết hồ sơ thú cưng #${selectedPet?.petId}`}
        open={isDetailModalOpen}
        onCancel={() => setIsDetailModalOpen(false)}
        footer={null}
        width={700}
      >
        {selectedPet && (
          <div>
            <Row gutter={[24, 24]}>
              <Col span={24}>
                {selectedPet.imageUrl && (
                  <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <Image
                      src={selectedPet.imageUrl}
                      alt={selectedPet.petName}
                      style={{
                        maxWidth: '100%',
                        maxHeight: '300px',
                        borderRadius: '12px'
                      }}
                    />
                  </div>
                )}
              </Col>
              <Col span={24}>
                <Descriptions bordered column={2}>
                  <Descriptions.Item label="Tên thú cưng" span={2}>
                    <Text strong>{selectedPet.petName}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Chủ sở hữu">
                    {selectedPet.fullName || 'N/A'}
                  </Descriptions.Item>
                  <Descriptions.Item label="User ID">
                    {selectedPet.userId}
                  </Descriptions.Item>
                  <Descriptions.Item label="Loại">
                    <Tag color={selectedPet.petType?.toLowerCase() === 'dog' ? 'blue' : 'purple'}>
                      {selectedPet.petType || 'N/A'}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Giống">
                    {selectedPet.breed || 'N/A'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Ngày sinh">
                    {selectedPet.birthDate ? new Date(selectedPet.birthDate).toLocaleDateString('vi-VN') : 'N/A'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Cân nặng">
                    {selectedPet.weight ? `${selectedPet.weight} kg` : 'N/A'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Tuổi">
                    {selectedPet.petAge || 'N/A'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Kích thước">
                    {selectedPet.petSize || 'N/A'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Ghi chú sức khỏe" span={2}>
                    {selectedPet.healthNotes || 'Không có'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Ngày tạo" span={2}>
                    {selectedPet.createdAt ? new Date(selectedPet.createdAt).toLocaleString('vi-VN') : 'N/A'}
                  </Descriptions.Item>
                </Descriptions>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
}

