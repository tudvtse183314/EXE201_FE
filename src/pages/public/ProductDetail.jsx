// src/pages/public/ProductDetail.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Alert } from 'antd';
import { ArrowLeftOutlined, ClockCircleOutlined } from '@ant-design/icons';

export default function ProductDetail() {
  const navigate = useNavigate();

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fff 0%, #ffeadd 100%)',
      fontFamily: 'Poppins, Arial, sans-serif',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{ 
        maxWidth: '600px', 
        width: '100%',
        textAlign: 'center'
      }}>
        {/* Back button */}
        <div style={{ marginBottom: '40px', textAlign: 'left' }}>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate(-1)}
            style={{
              background: '#eda274',
              borderColor: '#eda274',
              color: '#fff',
              fontWeight: '600'
            }}
          >
            Quay lại
          </Button>
        </div>

        {/* Coming Soon Message */}
        <div style={{
          background: '#fff',
          borderRadius: '20px',
          padding: '60px 40px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        }}>
          <div style={{ 
            fontSize: '80px', 
            marginBottom: '24px' 
          }}>
            🛍️
          </div>
          
          <ClockCircleOutlined 
            style={{ 
              fontSize: '64px', 
              color: '#eda274',
              marginBottom: '24px'
            }} 
          />
          
          <h1 style={{
            fontSize: '32px',
            fontWeight: '800',
            color: '#362319',
            margin: '0 0 16px 0'
          }}>
            Sắp ra mắt
          </h1>
          
          <p style={{
            fontSize: '18px',
            color: '#553d2d',
            lineHeight: '1.6',
            margin: '0 0 32px 0'
          }}>
            Trang chi tiết sản phẩm đang được phát triển.<br />
            API mới sẽ được cung cấp trong thời gian sắp tới.
          </p>

          <Button 
            type="primary" 
            size="large"
            onClick={() => navigate('/shop')}
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
            Quay về cửa hàng
          </Button>
        </div>

        {/* Info Alert */}
          <Alert
          message="Tính năng đang phát triển"
          description="Trang chi tiết sản phẩm đang được hoàn thiện. Vui lòng quay lại sau!"
          type="info"
          showIcon
          style={{ marginTop: '24px' }}
        />
      </div>
    </div>
  );
}
