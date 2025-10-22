// src/pages/customer/MyPets.jsx
import React from 'react';
import { Card, Row, Col, Typography, Button, Empty, Space } from 'antd';
import { PlusOutlined, HeartOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

export default function MyPets() {
  // Mock data - replace with real data from API
  const pets = [];

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fff 0%, #ffeadd 100%)',
      fontFamily: 'Poppins, Arial, sans-serif'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '40px 20px'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '40px'
        }}>
          <div>
            <Title level={1} style={{ 
              fontSize: '36px', 
              fontWeight: '800',
              color: '#362319',
              margin: 0
            }}>
              🐾 Thú cưng của tôi
            </Title>
            <Text style={{ 
              fontSize: '18px', 
              color: '#553d2d'
            }}>
              Quản lý hồ sơ thú cưng yêu quý của bạn
            </Text>
          </div>
          
          <Button 
            type="primary" 
            size="large"
            icon={<PlusOutlined />}
            style={{
              background: '#eda274',
              borderColor: '#eda274',
              borderRadius: '12px',
              fontWeight: '600',
              height: '48px',
              paddingLeft: '24px',
              paddingRight: '24px'
            }}
          >
            Thêm thú cưng
          </Button>
        </div>

        {pets.length === 0 ? (
          <Card style={{
            borderRadius: '20px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            border: 'none',
            textAlign: 'center',
            padding: '60px 20px'
          }}>
            <Empty
              image={<HeartOutlined style={{ fontSize: 64, color: '#eda274' }} />}
              description={
                <div>
                  <Title level={3} style={{ color: '#362319', marginBottom: '16px' }}>
                    Chưa có thú cưng nào
                  </Title>
                  <Paragraph style={{ color: '#553d2d', fontSize: '16px' }}>
                    Hãy thêm thú cưng đầu tiên để bắt đầu hành trình chăm sóc
                  </Paragraph>
                </div>
              }
            >
              <Button 
                type="primary" 
                size="large"
                icon={<PlusOutlined />}
                style={{
                  background: '#eda274',
                  borderColor: '#eda274',
                  borderRadius: '12px',
                  fontWeight: '600',
                  height: '48px',
                  paddingLeft: '32px',
                  paddingRight: '32px'
                }}
              >
                Thêm thú cưng đầu tiên
              </Button>
            </Empty>
          </Card>
        ) : (
          <Row gutter={[24, 24]}>
            {pets.map((pet) => (
              <Col xs={24} sm={12} md={8} lg={6} key={pet.id}>
                <Card
                  hoverable
                  style={{
                    borderRadius: '20px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    border: 'none',
                    overflow: 'hidden'
                  }}
                  cover={
                    <div style={{ height: '200px', background: '#f0f0f0' }}>
                      {/* Pet image placeholder */}
                    </div>
                  }
                  actions={[
                    <Button 
                      type="text" 
                      icon={<EditOutlined />}
                      title="Chỉnh sửa"
                    />,
                    <Button 
                      type="text" 
                      danger 
                      icon={<DeleteOutlined />}
                      title="Xóa"
                    />
                  ]}
                >
                  <div style={{ textAlign: 'center' }}>
                    <Title level={4} style={{ 
                      color: '#362319', 
                      margin: '0 0 8px 0',
                      fontSize: '18px'
                    }}>
                      {pet.name}
                    </Title>
                    <Text style={{ color: '#553d2d', fontSize: '14px' }}>
                      {pet.breed} • {pet.age} tuổi
                    </Text>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {/* Quick Actions */}
        <Card style={{
          marginTop: '40px',
          borderRadius: '20px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: 'none'
        }}>
          <Title level={3} style={{ 
            color: '#362319', 
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            Hành động nhanh
          </Title>
          <Row gutter={[16, 16]} justify="center">
            <Col xs={24} sm={8}>
              <Button 
                block
                size="large"
                style={{
                  height: '60px',
                  borderRadius: '12px',
                  fontWeight: '600',
                  fontSize: '16px'
                }}
              >
                📊 Phân tích sức khỏe
              </Button>
            </Col>
            <Col xs={24} sm={8}>
              <Button 
                block
                size="large"
                style={{
                  height: '60px',
                  borderRadius: '12px',
                  fontWeight: '600',
                  fontSize: '16px'
                }}
              >
                🏥 Lịch khám bệnh
              </Button>
            </Col>
            <Col xs={24} sm={8}>
              <Button 
                block
                size="large"
                style={{
                  height: '60px',
                  borderRadius: '12px',
                  fontWeight: '600',
                  fontSize: '16px'
                }}
              >
                📝 Nhật ký hoạt động
              </Button>
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
}
