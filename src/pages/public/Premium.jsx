// src/pages/public/Premium.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, Row, Col, Typography, Button, Space } from 'antd';
import { CheckOutlined, CrownOutlined, StarOutlined, TeamOutlined, RocketOutlined, GiftOutlined, CalendarOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { PremiumGradient, AIGradient, HotGradient } from '../../components/effects/GradientText';
import ShinyText from '../../components/effects/ShinyText';

const { Title, Text, Paragraph } = Typography;

export default function Premium() {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: '39.000',
      period: 'tháng',
      icon: <StarOutlined />,
      gradient: ['#fbbf24', '#f59e0b'],
      badge: null,
      features: [
        'Gợi ý sản phẩm cơ bản',
        'Tạo hồ sơ 1 thú cưng',
        'Truy cập AI Chat cơ bản',
        'Hỗ trợ email',
        'Không giới hạn tìm kiếm'
      ],
      popular: false
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '79.000',
      period: 'tháng',
      icon: <CrownOutlined />,
      gradient: ['#f59e0b', '#d97706', '#fbbf24'],
      badge: 'PHỔ BIẾN',
      features: [
        'Đề xuất nâng cao với AI',
        'Nhắc nhở grooming tự động',
        'Gợi ý seasonal items',
        'Tạo hồ sơ không giới hạn',
        'Hỗ trợ ưu tiên 24/7',
        'Báo cáo sức khỏe định kỳ',
        'Ưu đãi đặc biệt 10%'
      ],
      popular: true
    },
    {
      id: 'family',
      name: 'Family Pack',
      price: '129.000',
      period: 'tháng',
      icon: <TeamOutlined />,
      gradient: ['#d97706', '#92400e', '#f59e0b'],
      badge: 'TỐT NHẤT',
      features: [
        'Tất cả tính năng Premium',
        'Dành cho hộ nuôi 2-4 thú cưng',
        'Quản lý đa hồ sơ thú cưng',
        'So sánh sức khỏe giữa các pet',
        'Gợi ý sản phẩm cho cả gia đình',
        'Ưu đãi đặc biệt 15%',
        'Hỗ trợ ưu tiên cao nhất',
        'Tích hợp lịch khám bệnh'
      ],
      popular: false
    }
  ];

  const handleSubscribe = (planId) => {
    setSelectedPlan(planId);
    // TODO: Implement subscription logic
    console.log('Subscribing to:', planId);
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: '#fff',
      fontFamily: 'Poppins, Arial, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background */}
      <motion.div
        className="absolute inset-0 -z-10"
        style={{
          background: 'linear-gradient(135deg, #ffeadd 0%, #fff5eb 50%, #ffeadd 100%)',
          backgroundSize: '200% 200%',
          animation: 'gradientShift 8s ease infinite',
        }}
      >
        <style>{`
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}</style>
      </motion.div>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          textAlign: 'center',
          padding: '80px 20px 60px',
          position: 'relative',
          zIndex: 1
        }}
      >
        <motion.div
          animate={{ 
            scale: [1, 1.05, 1],
            rotate: [0, 2, -2, 0]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            repeatType: 'reverse'
          }}
          style={{ display: 'inline-block', marginBottom: '20px' }}
        >
          <CrownOutlined style={{ fontSize: '64px', color: '#f59e0b' }} />
        </motion.div>

        <ShinyText 
          text="Freemium + Subscription" 
          speed={2.5}
          size="text-4xl"
          weight="font-extrabold"
          className="block mb-4"
        />

        <Title level={1} style={{ 
          fontSize: '48px', 
          fontWeight: '900',
          color: '#362319',
          marginBottom: '20px',
          marginTop: '16px'
        }}>
          Chọn Gói Phù Hợp Với Bạn
        </Title>

        <Paragraph style={{ 
          fontSize: '20px', 
          color: '#553d2d',
          maxWidth: '700px',
          margin: '0 auto 40px'
        }}>
          Nâng cấp trải nghiệm chăm sóc thú cưng với các gói Premium đặc biệt. 
          Từ gợi ý AI thông minh đến quản lý đa thú cưng cho gia đình.
        </Paragraph>
      </motion.div>

      {/* Pricing Cards */}
      <div style={{ 
        maxWidth: '1400px', 
        margin: '0 auto', 
        padding: '0 20px 80px'
      }}>
        <Row gutter={[32, 32]} justify="center" align="stretch">
          {plans.map((plan, index) => (
            <Col xs={24} md={12} lg={8} key={plan.id}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.6,
                  delay: index * 0.2
                }}
                whileHover={{ 
                  y: -10,
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
              >
                <Card
                  data-plan={plan.id}
                  hoverable
                  style={{
                    borderRadius: '24px',
                    boxShadow: plan.popular 
                      ? '0 12px 48px rgba(217, 119, 6, 0.3)' 
                      : '0 8px 32px rgba(0,0,0,0.1)',
                    border: plan.popular ? '3px solid #f59e0b' : 'none',
                    textAlign: 'center',
                    height: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                    background: plan.popular
                      ? 'linear-gradient(135deg, #fff 0%, #fffef5 100%)'
                      : '#fff',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {/* Badge */}
                  {plan.badge && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.2 }}
                      style={{
                        position: 'absolute',
                        top: '20px',
                        right: '20px',
                        background: `linear-gradient(135deg, ${plan.gradient[0]}, ${plan.gradient[1]})`,
                        color: '#fff',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '700',
                        boxShadow: '0 4px 12px rgba(217, 119, 6, 0.4)',
                        zIndex: 10
                      }}
                    >
                      {plan.badge}
                    </motion.div>
                  )}

                  {/* Icon */}
                  <motion.div
                    whileHover={{ 
                      rotate: [0, -10, 10, 0],
                      scale: 1.1
                    }}
                    transition={{ duration: 0.5 }}
                    style={{
                      fontSize: '56px',
                      marginBottom: '20px',
                      background: `linear-gradient(135deg, ${plan.gradient.join(', ')})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    {plan.icon}
                  </motion.div>

                  {/* Plan Name */}
                  <Title level={2} style={{ 
                    color: '#362319', 
                    marginBottom: '16px',
                    fontSize: '32px',
                    fontWeight: '800'
                  }}>
                    {plan.name}
                  </Title>

                  {/* Price */}
                  <div style={{ marginBottom: '32px' }}>
                    <PremiumGradient size="text-5xl" weight="font-black" className="block">
                      {plan.price}đ
                    </PremiumGradient>
                    <Text style={{ 
                      fontSize: '16px', 
                      color: '#553d2d',
                      display: 'block',
                      marginTop: '8px'
                    }}>
                      /{plan.period}
                    </Text>
                  </div>

                  {/* Features List */}
                  <div style={{ 
                    textAlign: 'left',
                    marginBottom: '32px',
                    minHeight: '280px'
                  }}>
                    {plan.features.map((feature, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + index * 0.2 + idx * 0.05 }}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          marginBottom: '16px',
                          padding: '8px',
                          borderRadius: '8px',
                          background: 'rgba(237, 162, 116, 0.05)'
                        }}
                      >
                        <CheckOutlined style={{ 
                          color: '#f59e0b', 
                          fontSize: '18px',
                          marginRight: '12px',
                          marginTop: '2px',
                          flexShrink: 0
                        }} />
                        <Text style={{ 
                          color: '#362319',
                          fontSize: '15px',
                          lineHeight: '1.5'
                        }}>
                          {feature}
                        </Text>
                      </motion.div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <div style={{ width: '100%', marginTop: 'auto' }}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        type="primary"
                        size="large"
                        block
                        onClick={() => handleSubscribe(plan.id)}
                        style={{
                          height: '52px',
                          fontSize: '16px',
                          fontWeight: '700',
                          borderRadius: '16px',
                          background: plan.popular
                            ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                            : 'linear-gradient(135deg, #eda274 0%, #d5956d 100%)',
                          borderColor: plan.popular ? '#f59e0b' : '#eda274',
                          boxShadow: plan.popular
                            ? '0 4px 16px rgba(245, 158, 11, 0.4)'
                            : '0 4px 12px rgba(237, 162, 116, 0.3)',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {plan.popular ? (
                          <Space>
                            <RocketOutlined />
                            <span>Đăng ký ngay</span>
                          </Space>
                        ) : (
                          'Chọn gói này'
                        )}
                      </Button>
                    </motion.div>
                  </div>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      </div>

      {/* Feature Comparison Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        style={{
          maxWidth: '1200px',
          margin: '0 auto 80px',
          padding: '0 20px'
        }}
      >
        <Card style={{
          borderRadius: '24px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          border: 'none',
          background: 'linear-gradient(135deg, #ffeadd 0%, #fff 100%)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <Title level={2} style={{ 
              color: '#362319',
              fontSize: '36px',
              fontWeight: '800',
              marginBottom: '16px'
            }}>
              <GiftOutlined style={{ color: '#f59e0b', marginRight: '12px' }} />
              So Sánh Các Gói
            </Title>
          </div>

          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                style={{
                  padding: '24px',
                  background: 'rgba(255,255,255,0.8)',
                  borderRadius: '16px',
                  textAlign: 'center'
                }}
              >
                <ThunderboltOutlined style={{ fontSize: '40px', color: '#fbbf24', marginBottom: '12px' }} />
                <Text strong style={{ fontSize: '18px', color: '#362319', display: 'block', marginBottom: '8px' }}>
                  AI Thông Minh
                </Text>
                <Text style={{ color: '#553d2d', fontSize: '14px' }}>
                  Gợi ý sản phẩm cá nhân hóa dựa trên hồ sơ thú cưng của bạn
                </Text>
              </motion.div>
            </Col>
            
            <Col xs={24} md={8}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                style={{
                  padding: '24px',
                  background: 'rgba(255,255,255,0.8)',
                  borderRadius: '16px',
                  textAlign: 'center'
                }}
              >
                <CalendarOutlined style={{ fontSize: '40px', color: '#f59e0b', marginBottom: '12px' }} />
                <Text strong style={{ fontSize: '18px', color: '#362319', display: 'block', marginBottom: '8px' }}>
                  Nhắc Nhở Tự Động
                </Text>
                <Text style={{ color: '#553d2d', fontSize: '14px' }}>
                  Nhắc grooming, tiêm phòng và chăm sóc định kỳ
                </Text>
              </motion.div>
            </Col>

            <Col xs={24} md={8}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                style={{
                  padding: '24px',
                  background: 'rgba(255,255,255,0.8)',
                  borderRadius: '16px',
                  textAlign: 'center'
                }}
              >
                <TeamOutlined style={{ fontSize: '40px', color: '#d97706', marginBottom: '12px' }} />
                <Text strong style={{ fontSize: '18px', color: '#362319', display: 'block', marginBottom: '8px' }}>
                  Quản Lý Đa Pet
                </Text>
                <Text style={{ color: '#553d2d', fontSize: '14px' }}>
                  Chăm sóc nhiều thú cưng trong một tài khoản duy nhất
                </Text>
              </motion.div>
            </Col>
          </Row>
        </Card>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        style={{
          maxWidth: '1200px',
          margin: '0 auto 80px',
          padding: '0 20px'
        }}
      >
        <Card style={{
          borderRadius: '24px',
          border: 'none',
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          boxShadow: '0 12px 48px rgba(217, 119, 6, 0.4)'
        }}>
          <div style={{ 
            textAlign: 'center',
            padding: '40px 20px'
          }}>
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: 'reverse'
              }}
            >
              <CrownOutlined style={{ 
                fontSize: '64px', 
                color: '#fff',
                marginBottom: '24px',
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
              }} />
            </motion.div>

            <Title level={2} style={{ 
              color: '#fff',
              fontSize: '40px',
              fontWeight: '800',
              marginBottom: '16px',
              textShadow: '0 2px 8px rgba(0,0,0,0.2)'
            }}>
              Sẵn sàng bắt đầu?
            </Title>

            <Paragraph style={{ 
              color: '#fff',
              fontSize: '20px',
              marginBottom: '32px',
              opacity: 0.95
            }}>
              Chọn gói phù hợp và bắt đầu hành trình chăm sóc thú cưng tốt hơn
            </Paragraph>

            <Space size="large">
              <Button
                size="large"
                onClick={() => {
                  const premiumCard = document.querySelector('[data-plan="premium"]');
                  premiumCard?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
                style={{
                  height: '56px',
                  paddingLeft: '40px',
                  paddingRight: '40px',
                  fontSize: '18px',
                  fontWeight: '700',
                  background: '#fff',
                  color: '#362319',
                  borderColor: '#fff',
                  borderRadius: '16px'
                }}
              >
                Xem các gói
              </Button>

              <Button
                size="large"
                style={{
                  height: '56px',
                  paddingLeft: '40px',
                  paddingRight: '40px',
                  fontSize: '18px',
                  fontWeight: '700',
                  background: 'transparent',
                  color: '#fff',
                  borderColor: '#fff',
                  borderRadius: '16px'
                }}
              >
                Liên hệ tư vấn
              </Button>
            </Space>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
