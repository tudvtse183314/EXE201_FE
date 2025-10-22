// src/pages/public/Premium.jsx
import React from 'react';
import { Card, Row, Col, Typography, Button, Space } from 'antd';
import { CrownOutlined, StarOutlined, GiftOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

export default function Premium() {
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
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <Title level={1} style={{ 
            fontSize: '48px', 
            fontWeight: '800',
            color: '#362319',
            marginBottom: '20px'
          }}>
            <CrownOutlined style={{ color: '#eda274', marginRight: '16px' }} />
            Premium PetVibe
          </Title>
          <Paragraph style={{ 
            fontSize: '20px', 
            color: '#553d2d',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Nâng cấp trải nghiệm chăm sóc thú cưng của bạn với gói Premium
          </Paragraph>
        </div>

        <Row gutter={[32, 32]} justify="center">
          <Col xs={24} md={8}>
            <Card
              style={{
                borderRadius: '20px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                border: 'none',
                textAlign: 'center',
                height: '100%'
              }}
            >
              <StarOutlined style={{ 
                fontSize: '48px', 
                color: '#eda274',
                marginBottom: '20px'
              }} />
              <Title level={3} style={{ color: '#362319', marginBottom: '16px' }}>
                Tư vấn AI nâng cao
              </Title>
              <Paragraph style={{ color: '#553d2d', marginBottom: '24px' }}>
                Phân tích sâu hơn về sức khỏe và hành vi thú cưng với AI tiên tiến
              </Paragraph>
              <Button 
                type="primary" 
                size="large"
                style={{
                  background: '#eda274',
                  borderColor: '#eda274',
                  borderRadius: '12px',
                  fontWeight: '600'
                }}
              >
                Tìm hiểu thêm
              </Button>
            </Card>
          </Col>

          <Col xs={24} md={8}>
            <Card
              style={{
                borderRadius: '20px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                border: 'none',
                textAlign: 'center',
                height: '100%'
              }}
            >
              <GiftOutlined style={{ 
                fontSize: '48px', 
                color: '#eda274',
                marginBottom: '20px'
              }} />
              <Title level={3} style={{ color: '#362319', marginBottom: '16px' }}>
                Ưu đãi độc quyền
              </Title>
              <Paragraph style={{ color: '#553d2d', marginBottom: '24px' }}>
                Giảm giá đặc biệt cho sản phẩm cao cấp và dịch vụ chăm sóc
              </Paragraph>
              <Button 
                type="primary" 
                size="large"
                style={{
                  background: '#eda274',
                  borderColor: '#eda274',
                  borderRadius: '12px',
                  fontWeight: '600'
                }}
              >
                Xem ưu đãi
              </Button>
            </Card>
          </Col>

          <Col xs={24} md={8}>
            <Card
              style={{
                borderRadius: '20px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                border: 'none',
                textAlign: 'center',
                height: '100%'
              }}
            >
              <CrownOutlined style={{ 
                fontSize: '48px', 
                color: '#eda274',
                marginBottom: '20px'
              }} />
              <Title level={3} style={{ color: '#362319', marginBottom: '16px' }}>
                Hỗ trợ 24/7
              </Title>
              <Paragraph style={{ color: '#553d2d', marginBottom: '24px' }}>
                Đội ngũ chuyên gia sẵn sàng hỗ trợ bạn mọi lúc, mọi nơi
              </Paragraph>
              <Button 
                type="primary" 
                size="large"
                style={{
                  background: '#eda274',
                  borderColor: '#eda274',
                  borderRadius: '12px',
                  fontWeight: '600'
                }}
              >
                Liên hệ ngay
              </Button>
            </Card>
          </Col>
        </Row>

        <div style={{ 
          textAlign: 'center', 
          marginTop: '60px',
          padding: '40px',
          background: 'linear-gradient(135deg, #ffeadd 0%, #d5956d 100%)',
          borderRadius: '20px'
        }}>
          <Title level={2} style={{ color: '#fff', marginBottom: '16px' }}>
            Sẵn sàng nâng cấp?
          </Title>
          <Paragraph style={{ color: '#fff', fontSize: '18px', marginBottom: '24px' }}>
            Tham gia Premium ngay hôm nay và tận hưởng trải nghiệm tuyệt vời
          </Paragraph>
          <Space size="large">
            <Button 
              type="primary" 
              size="large"
              style={{
                background: '#fff',
                color: '#362319',
                borderColor: '#fff',
                borderRadius: '12px',
                fontWeight: '600',
                height: '48px',
                paddingLeft: '32px',
                paddingRight: '32px'
              }}
            >
              Đăng ký Premium
            </Button>
            <Button 
              size="large"
              style={{
                background: 'transparent',
                color: '#fff',
                borderColor: '#fff',
                borderRadius: '12px',
                fontWeight: '600',
                height: '48px',
                paddingLeft: '32px',
                paddingRight: '32px'
              }}
            >
              Tìm hiểu thêm
            </Button>
          </Space>
        </div>
      </div>
    </div>
  );
}
