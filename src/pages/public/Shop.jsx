// src/pages/public/Shop.jsx
import React, { useState, useEffect, useMemo } from "react";
import { Card, Row, Col, Button, Tag, Input, Select, Alert, Empty, Skeleton } from "antd";
import { SearchOutlined, ShoppingCartOutlined, HeartOutlined } from "@ant-design/icons";
import { getAllCategories } from "../../services/categories";
import { getAllProducts } from "../../services/products";
import { dataManager } from "../../utils/dataManager";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { getFallbackImageByIndex } from "../../utils/imageUtils";
import { message } from "antd";

const { Search } = Input;
const { Option } = Select;

export default function Shop() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [categories, setCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCatId, setActiveCatId] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");

  // Load data
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("🛒 Shop: Loading data...");
        
        const [cats, prods] = await Promise.all([
          dataManager.get('categories', getAllCategories),
          dataManager.get('products', getAllProducts)
        ]);
        
        if (!isMounted) return;
        
        console.log("🛒 Shop: Data loaded successfully", { 
          categories: cats?.length || 0, 
          products: prods?.length || 0 
        });
        
        setCategories(Array.isArray(cats) ? cats : []);
        setAllProducts(Array.isArray(prods) ? prods : []);
      } catch (e) {
        if (!isMounted) return;
        console.error("🛒 Shop: Error loading data", e);
        setError(e?.message || "Không thể tải dữ liệu.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter and sort products
  const visibleProducts = useMemo(() => {
    let filtered = allProducts;

    // Filter by category
    if (activeCatId !== "all") {
      const categoryId = Number(activeCatId);
      filtered = filtered.filter((p) => p?.category?.id === categoryId);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((p) =>
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name?.localeCompare(b.name) || 0;
        case "price-low":
          return (a.price || 0) - (b.price || 0);
        case "price-high":
          return (b.price || 0) - (a.price || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [allProducts, activeCatId, searchTerm, sortBy]);

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product, 1);
      console.log("🛒 Add to cart:", product);
      message.success("Đã thêm vào giỏ hàng!");
    } catch (error) {
      console.error("🛒 Error adding to cart:", error);
      message.error("Không thể thêm vào giỏ hàng. Vui lòng thử lại!");
    }
  };

  const handleViewProduct = (product) => {
    navigate(`/product/${product.id}`);
  };

  const handleWishlist = (product) => {
    toggleWishlist(product);
    const isAdded = isInWishlist(product.id);
    if (isAdded) {
      message.success("Đã thêm vào danh sách yêu thích!");
    } else {
      message.info("Đã xóa khỏi danh sách yêu thích!");
    }
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh',
        background: '#fff',
        fontFamily: 'Poppins, Arial, sans-serif'
      }}>
        {/* Banner Skeleton */}
        <div style={{ 
          position: 'relative',
          height: '300px',
          overflow: 'hidden',
          borderRadius: '0 0 24px 24px',
          marginBottom: '32px',
          background: '#f0f0f0'
        }}>
          <Skeleton.Image style={{ width: '100%', height: '100%' }} />
        </div>

        {/* Container */}
        <div style={{ 
          maxWidth: '1440px', 
          margin: '0 auto', 
          padding: '0 20px'
        }}>
          {/* Toolbar Skeleton */}
          <div style={{ 
            marginBottom: '24px',
            padding: '20px',
            background: '#fff',
            borderRadius: '16px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            border: '1px solid #f0f0f0'
          }}>
            <Skeleton.Input style={{ width: '100%', height: '40px' }} />
          </div>

          {/* Category Nav Skeleton */}
          <div style={{
            marginBottom: '32px',
            padding: '16px 0'
          }}>
            <Skeleton.Button style={{ width: '120px', height: '40px', marginRight: '12px' }} />
            <Skeleton.Button style={{ width: '120px', height: '40px', marginRight: '12px' }} />
            <Skeleton.Button style={{ width: '120px', height: '40px', marginRight: '12px' }} />
          </div>

          {/* Products Grid Skeleton */}
          <Row gutter={[24, 32]}>
            {[...Array(8)].map((_, index) => (
              <Col xs={24} sm={12} md={8} lg={6} xl={4} key={index}>
                <Card
                  style={{
                    borderRadius: '20px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    border: 'none'
                  }}
                  bodyStyle={{ padding: '20px' }}
                  cover={
                    <Skeleton.Image style={{ width: '100%', height: '280px' }} />
                  }
                >
                  <Skeleton active paragraph={{ rows: 3 }} />
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Lỗi tải dữ liệu"
        description={error}
        type="error"
        showIcon
        style={{ margin: 20 }}
      />
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      background: '#fff',
      fontFamily: 'Poppins, Arial, sans-serif'
    }}>
      {/* Banner ảnh */}
      <div style={{ 
        position: 'relative',
        height: '300px',
        overflow: 'hidden',
        borderRadius: '0 0 24px 24px',
        marginBottom: '32px'
      }}>
        <img
          src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="Pet Shop Banner"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(0.7)'
          }}
          loading="lazy"
        />
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(237, 162, 116, 0.8) 0%, rgba(213, 149, 109, 0.9) 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          padding: '40px'
        }}>
          <h1 style={{ 
            margin: 0, 
            fontSize: '48px', 
            fontWeight: '900',
            color: '#fff',
            textShadow: '2px 2px 8px rgba(0,0,0,0.3)',
            marginBottom: '16px'
          }}>
            🛍️ GO SHOPPING
          </h1>
          <p style={{ 
            margin: 0, 
            color: '#fff', 
            fontSize: '20px',
            fontWeight: '600',
            textShadow: '1px 1px 4px rgba(0,0,0,0.3)',
            opacity: 0.95
          }}>
            Khám phá các sản phẩm tuyệt vời cho thú cưng của bạn
          </p>
        </div>
      </div>

      {/* Container full-width */}
      <div style={{ 
        maxWidth: '1440px', 
        margin: '0 auto', 
        padding: '0 20px'
      }}>

        {/* Toolbar */}
        <div style={{ 
          marginBottom: '24px',
          padding: '20px',
          background: '#fff',
          borderRadius: '16px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          border: '1px solid #f0f0f0'
        }}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={8}>
              <Search
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%' }}
                prefix={<SearchOutlined style={{ color: '#eda274' }} />}
                size="large"
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Select
                value={sortBy}
                onChange={setSortBy}
                style={{ width: '100%' }}
                placeholder="Sắp xếp theo"
                size="large"
              >
                <Option value="name">Tên A-Z</Option>
                <Option value="price-low">Giá thấp → cao</Option>
                <Option value="price-high">Giá cao → thấp</Option>
              </Select>
            </Col>
            <Col xs={24} sm={24} md={8}>
              <div style={{ textAlign: 'right' }}>
                <Tag 
                  style={{ 
                    fontSize: '16px',
                    fontWeight: '600',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    background: '#eda274',
                    color: '#fff',
                    border: 'none'
                  }}
                >
                  {visibleProducts.length} sản phẩm
                </Tag>
              </div>
            </Col>
          </Row>
        </div>

        {/* Category Navigation - Sticky */}
        <div style={{
          position: 'sticky',
          top: '0',
          zIndex: 100,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          padding: '16px 0',
          marginBottom: '32px',
          borderBottom: '1px solid #f0f0f0'
        }}>
          <div style={{
            display: 'flex',
            gap: '12px',
            overflowX: 'auto',
            paddingBottom: '8px',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitScrollbar: { display: 'none' }
          }}>
            <Button
              type={activeCatId === "all" ? "primary" : "default"}
              onClick={() => setActiveCatId("all")}
              style={{
                minWidth: '120px',
                height: '40px',
                borderRadius: '20px',
                fontWeight: '600',
                fontSize: '14px',
                background: activeCatId === "all" ? '#d5956d' : '#ffeadd',
                borderColor: activeCatId === "all" ? '#d5956d' : '#ffeadd',
                color: activeCatId === "all" ? '#fff' : '#362319',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
            >
              Tất cả ({allProducts.length})
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                type={activeCatId === String(category.id) ? "primary" : "default"}
                onClick={() => setActiveCatId(String(category.id))}
                style={{
                  minWidth: '120px',
                  height: '40px',
                  borderRadius: '20px',
                  fontWeight: '600',
                  fontSize: '14px',
                  background: activeCatId === String(category.id) ? '#d5956d' : '#ffeadd',
                  borderColor: activeCatId === String(category.id) ? '#d5956d' : '#ffeadd',
                  color: activeCatId === String(category.id) ? '#fff' : '#362319',
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}
              >
                {category.name} ({allProducts.filter(p => p?.category?.id === category.id).length})
              </Button>
            ))}
          </div>
        </div>

        {/* Products Grid - Full Width */}
        <div>
          {visibleProducts.length === 0 ? (
            <Card style={{ 
              borderRadius: '16px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
              border: 'none',
              textAlign: 'center',
              padding: '60px 20px'
            }}>
              <Empty
                description="Không tìm thấy sản phẩm nào"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              >
                <Button 
                  type="primary" 
                  onClick={() => {
                    setActiveCatId("all");
                    setSearchTerm("");
                  }}
                  style={{
                    background: '#eda274',
                    borderColor: '#eda274',
                    borderRadius: '8px',
                    fontWeight: '600'
                  }}
                >
                  Về cửa hàng
                </Button>
              </Empty>
            </Card>
          ) : (
            <Row gutter={[20, 24]}>
              {visibleProducts.map((product) => (
                <Col xs={24} sm={12} md={8} lg={6} xl={4} xxl={4} key={product.id}>
                  <Card
                    hoverable
                    style={{
                      borderRadius: '20px',
                      overflow: 'hidden',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                      border: 'none',
                      transition: 'all 0.3s ease',
                      background: '#fff',
                      height: '100%'
                    }}
                    bodyStyle={{ padding: '20px' }}
                    cover={
                      <div 
                        style={{ 
                          height: '280px', 
                          overflow: 'hidden',
                          position: 'relative',
                          cursor: 'pointer'
                        }}
                        onClick={() => handleViewProduct(product)}
                      >
                        <img
                          alt={product.name}
                          src={product.image || getFallbackImageByIndex(product.id)}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.3s ease'
                          }}
                          loading="lazy"
                          onError={(e) => {
                            e.target.src = getFallbackImageByIndex(product.id);
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = 'scale(1.03)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'scale(1)';
                          }}
                        />
                        {/* Action buttons overlay */}
                        <div style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          display: 'flex',
                          gap: '8px',
                          opacity: 0,
                          transition: 'opacity 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.opacity = '1';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.opacity = '0';
                        }}
                        >
                          <Button
                            type="primary"
                            shape="circle"
                            icon={<HeartOutlined />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleWishlist(product);
                            }}
                            style={{
                              background: isInWishlist(product.id) 
                                ? 'rgba(255, 77, 79, 1)' 
                                : 'rgba(255, 77, 79, 0.9)',
                              borderColor: isInWishlist(product.id) 
                                ? 'rgba(255, 77, 79, 1)' 
                                : 'rgba(255, 77, 79, 0.9)',
                              width: '36px',
                              height: '36px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: '0 2px 8px rgba(255, 77, 79, 0.3)',
                              backdropFilter: 'blur(4px)',
                              transform: isInWishlist(product.id) ? 'scale(1.1)' : 'scale(1)',
                              transition: 'all 0.2s ease'
                            }}
                          />
                          <Button
                            type="primary"
                            shape="circle"
                            icon={<ShoppingCartOutlined />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(product);
                            }}
                            style={{
                              background: 'rgba(237, 162, 116, 0.9)',
                              borderColor: 'rgba(237, 162, 116, 0.9)',
                              width: '36px',
                              height: '36px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: '0 2px 8px rgba(237, 162, 116, 0.3)',
                              backdropFilter: 'blur(4px)'
                            }}
                          />
                        </div>
                      </div>
                    }
                  >
                    <div style={{ textAlign: 'center' }}>
                      <h3 
                        style={{ 
                          fontSize: '18px', 
                          fontWeight: '700',
                          color: '#362319',
                          margin: '0 0 8px 0',
                          cursor: 'pointer',
                          fontFamily: 'Poppins, Arial, sans-serif',
                          lineHeight: '1.3'
                        }}
                        onClick={() => handleViewProduct(product)}
                      >
                        {product.name}
                      </h3>
                      <div style={{ 
                        color: '#553d2d', 
                        fontSize: '13px', 
                        marginBottom: '12px',
                        fontWeight: '500'
                      }}>
                        {product.category?.name}
                      </div>
                      <div style={{ 
                        fontSize: '22px', 
                        fontWeight: '800', 
                        color: '#eda274',
                        marginBottom: '12px',
                        fontFamily: 'Poppins, Arial, sans-serif'
                      }}>
                        {product.price ? `${product.price.toLocaleString()}đ` : 'Liên hệ'}
                      </div>
                      {product.stock !== undefined && (
                        <Tag 
                          color={product.stock > 0 ? 'green' : 'red'}
                          style={{ 
                            fontSize: '12px',
                            fontWeight: '600',
                            padding: '4px 12px',
                            borderRadius: '12px'
                          }}
                        >
                          {product.stock > 0 ? `Còn ${product.stock}` : 'Hết hàng'}
                        </Tag>
                      )}
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </div>
      </div>
    </div>
  );
}