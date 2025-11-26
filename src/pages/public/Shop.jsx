// src/pages/public/Shop.jsx
import React, { useState, useEffect, useMemo } from "react";
import { Card, Row, Col, Button, Tag, Input, Select, Alert, Empty, Skeleton } from "antd";
import { SearchOutlined, ShoppingCartOutlined, HeartOutlined } from "@ant-design/icons";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { getAllCategories } from "../../services/categories";
import { getAllProducts } from "../../services/products";
import { dataManager } from "../../utils/dataManager";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useToast } from "../../context/ToastContext";
import { getFallbackImageByIndex } from "../../utils/imageUtils";
import GradientText from "../../components/effects/GradientText";

const { Search } = Input;
const { Option } = Select;

export default function Shop() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart, cartItems } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showSuccess, showError, showInfo } = useToast();
  
  // Helper function to check if product is in cart
  const isInCart = (productId) => {
    return cartItems.some(item => 
      (item.productId || item.product?.id) === productId
    );
  };
  const [categories, setCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCatId, setActiveCatId] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");

  // Reset state when location changes
  useEffect(() => {
    // Reset filters and state when navigating to shop
    if (location.pathname === '/shop') {
      setActiveCatId("all");
      setSearchTerm("");
      setSortBy("name");
    }
  }, [location.pathname]);

  // Load data - re-fetch when location changes
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("🛒 Shop: Loading data...", location.pathname);
        
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

    // Only load data if we're on the shop page
    if (location.pathname === '/shop') {
      loadData();
    }

    return () => {
      isMounted = false;
    };
  }, [location.pathname]);

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

  // Phân nhóm products theo type (string)
  const productsByType = useMemo(() => {
    const grouped = {};
    
    visibleProducts.forEach(product => {
      // Normalize type: trim, uppercase, và xử lý null/undefined
      let type = (product.type || '').toString().trim().toUpperCase();
      
      // Nếu type rỗng hoặc không hợp lệ, dùng 'OTHER'
      if (!type || type === 'NULL' || type === 'UNDEFINED') {
        type = 'OTHER';
      }
      
      if (!grouped[type]) {
        grouped[type] = [];
      }
      grouped[type].push(product);
    });

    // Sắp xếp các type theo thứ tự ưu tiên
    const typeOrder = ['FOOD', 'TOY', 'ACCESSORY', 'CARE', 'BED', 'CLOTHING', 'OTHER'];
    const sorted = {};
    
    // Thêm các type có trong typeOrder trước
    typeOrder.forEach(type => {
      if (grouped[type]) {
        sorted[type] = grouped[type];
      }
    });
    
    // Thêm các type khác (không có trong typeOrder)
    Object.keys(grouped).forEach(type => {
      if (!typeOrder.includes(type)) {
        sorted[type] = grouped[type];
      }
    });

    return sorted;
  }, [visibleProducts]);

  // Lấy gradient colors dựa trên type
  const getTypeGradient = (type) => {
    const normalizedType = (type || '').toString().trim().toUpperCase();
    
    // Gradient colors cho các type phổ biến
    const gradientMap = {
      'FOOD': ["#ff6b6b", "#ee5a6f", "#ff8787", "#ff6b6b", "#ee5a6f"],
      'TOY': ["#4ecdc4", "#44a08d", "#6bcfd4", "#4ecdc4", "#44a08d"],
      'TOYS': ["#4ecdc4", "#44a08d", "#6bcfd4", "#4ecdc4", "#44a08d"],
      'ACCESSORY': ["#feca57", "#ff9ff3", "#feca57", "#ff9ff3", "#feca57"],
      'ACCESSORIES': ["#feca57", "#ff9ff3", "#feca57", "#ff9ff3", "#feca57"],
      'CARE': ["#48dbfb", "#0abde3", "#6dd5ed", "#48dbfb", "#0abde3"],
      'BED': ["#ff9ff3", "#feca57", "#ffb3f5", "#ff9ff3", "#feca57"],
      'BEDS': ["#ff9ff3", "#feca57", "#ffb3f5", "#ff9ff3", "#feca57"],
      'CLOTHING': ["#a29bfe", "#6c5ce7", "#b8b3ff", "#a29bfe", "#6c5ce7"],
      'CLOTHES': ["#a29bfe", "#6c5ce7", "#b8b3ff", "#a29bfe", "#6c5ce7"],
    };
    
    return gradientMap[normalizedType] || ["#eda274", "#d5956d", "#f0b890", "#eda274", "#d5956d"];
  };

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product, 1);
      console.log("🛒 Add to cart:", product);
      showSuccess("Đã thêm vào giỏ hàng!");
    } catch (error) {
      console.error("🛒 Error adding to cart:", error);
      showError("Không thể thêm vào giỏ hàng. Vui lòng thử lại!");
    }
  };

  const handleViewProduct = (product) => {
    navigate(`/product/${product.id}`);
  };

  const handleWishlist = (product) => {
    toggleWishlist(product);
    const isAdded = isInWishlist(product.id);
    if (isAdded) {
      showSuccess("Đã thêm vào danh sách yêu thích!");
    } else {
      showInfo("Đã xóa khỏi danh sách yêu thích!");
    }
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh',
        background: '#fff',
        fontFamily: "'Inter', 'Noto Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif"
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
                  styles={{ body: { padding: '20px' } }}
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
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-10px) scale(1.1);
          }
        }
        
        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }
      `}</style>
      {/* Banner ảnh */}
      <div style={{ 
        position: 'relative',
        height: '300px',
        overflow: 'hidden',
        borderRadius: '0 0 24px 24px',
        marginBottom: '32px'
      }}>
        <LazyLoadImage
          src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="Pet Shop Banner"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(0.7)'
          }}
          effect="blur"
          placeholderSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3C/svg%3E"
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
            flexWrap: 'wrap',
            gap: '12px',
            paddingBottom: '8px',
            justifyContent: 'flex-start'
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

        {/* Products Grid - Grouped by Type with Sections */}
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
            <div>
              {Object.entries(productsByType).map(([type, products], sectionIndex) => {
                const gradientColors = getTypeGradient(type);
                const displayType = type || 'OTHER';
                
                return (
                  <div
                    key={type}
                    style={{
                      marginBottom: '64px',
                      animation: `fadeInUp 0.6s ease-out ${sectionIndex * 0.1}s both`
                    }}
                  >
                    {/* Section Header với GradientText */}
                    <div
                      style={{
                        position: 'relative',
                        marginBottom: '32px',
                        padding: '24px 32px',
                        background: 'linear-gradient(135deg, rgba(237, 162, 116, 0.1) 0%, rgba(213, 149, 109, 0.1) 100%)',
                        borderRadius: '20px',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                        border: '2px solid rgba(237, 162, 116, 0.2)',
                        overflow: 'hidden',
                        transform: 'translateY(0)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.12)';
                        e.currentTarget.style.borderColor = 'rgba(237, 162, 116, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)';
                        e.currentTarget.style.borderColor = 'rgba(237, 162, 116, 0.2)';
                      }}
                    >
                      {/* Decorative elements */}
                      <div
                        style={{
                          position: 'absolute',
                          top: '-50px',
                          right: '-50px',
                          width: '200px',
                          height: '200px',
                          background: 'rgba(237, 162, 116, 0.05)',
                          borderRadius: '50%',
                          filter: 'blur(40px)'
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          bottom: '-30px',
                          left: '-30px',
                          width: '150px',
                          height: '150px',
                          background: 'rgba(237, 162, 116, 0.05)',
                          borderRadius: '50%',
                          filter: 'blur(30px)'
                        }}
                      />
                      
                      <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                          <div>
                            <h2
                              style={{
                                margin: 0,
                                fontSize: '36px',
                                fontWeight: '800',
                                fontFamily: "'Inter', 'Noto Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif",
                                lineHeight: '1.2',
                                display: 'inline-block'
                              }}
                            >
                              <GradientText
                                colors={gradientColors}
                                animationSpeed={3}
                                size="text-4xl"
                                weight="font-extrabold"
                              >
                                {displayType}
                              </GradientText>
                            </h2>
                            <p
                              style={{
                                margin: '8px 0 0 0',
                                fontSize: '16px',
                                color: '#666',
                                fontWeight: '500'
                              }}
                            >
                              {products.length} sản phẩm
                            </p>
                          </div>
                        </div>
                        <Tag
                          style={{
                            fontSize: '16px',
                            fontWeight: '700',
                            padding: '8px 20px',
                            borderRadius: '20px',
                            background: 'rgba(237, 162, 116, 0.15)',
                            border: '2px solid rgba(237, 162, 116, 0.3)',
                            color: '#362319',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                          }}
                        >
                          {products.length} items
                        </Tag>
                      </div>
                    </div>

                    {/* Products Grid với stagger animation */}
                    <Row gutter={[20, 24]}>
                      {products.map((product, productIndex) => (
                <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6} key={product.id}>
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
                    styles={{ body: { padding: '20px' } }}
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
                        <LazyLoadImage
                          alt={product.name}
                          src={(() => {
                            // Sử dụng imageUrl (đã normalize từ getAllProducts)
                            let src = product.imageUrl ?? product.image_url ?? product.image ?? null;
                            
                            // Debug log cho tất cả products (tạm thời để debug)
                            console.log(`🖼️ Shop: Product ${product.id} (${product.name})`, {
                              imageUrl: product.imageUrl,
                              image_url: product.image_url,
                              image: product.image,
                              finalBeforeCheck: src,
                              isNull: src === null,
                              isEmpty: src === '',
                              type: typeof src
                            });
                            
                            // Nếu null hoặc empty string → dùng fallback
                            if (!src || src === '' || src === 'null' || src === 'undefined') {
                              const fallback = getFallbackImageByIndex(product.id);
                              console.log(`🖼️ Shop: Product ${product.id} using fallback`, fallback);
                              return fallback;
                            }
                            
                            // Nếu đã là full URL (http/https) → dùng trực tiếp
                            if (src.startsWith('http://') || src.startsWith('https://')) {
                              console.log(`🖼️ Shop: Product ${product.id} using external URL`, src);
                              return src;
                            }
                            
                            // Build full URL nếu là relative path từ BE
                            if (src.startsWith('/api/uploads/')) {
                              const baseURL = process.env.REACT_APP_API_BASE_URL || "https://exe201-be-uhno.onrender.com/api";
                              const fullUrl = baseURL.replace('/api', '') + src;
                              console.log(`🖼️ Shop: Product ${product.id} building BE URL`, { src, fullUrl });
                              return fullUrl;
                            }
                            
                            // Nếu không match pattern nào → dùng fallback
                            console.warn(`🖼️ Shop: Product ${product.id} unmatched URL pattern, using fallback`, src);
                            return getFallbackImageByIndex(product.id);
                          })()}
                          width="100%"
                          height="280px"
                          style={{
                            width: '100%',
                            height: '280px',
                            objectFit: 'cover',
                            display: 'block',
                            transition: 'transform 0.3s ease',
                            backgroundColor: '#f5f5f5' // Background để thấy khi loading
                          }}
                          effect="blur"
                          placeholderSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3C/svg%3E"
                          onError={(e) => {
                            console.error(`🖼️ Shop: Image load error for product ${product.id}`, {
                              attemptedSrc: e.target.src,
                              product: { id: product.id, name: product.name, imageUrl: product.imageUrl }
                            });
                            const fallback = getFallbackImageByIndex(product.id);
                            if (e.target.src !== fallback) {
                              console.log(`🖼️ Shop: Trying fallback for product ${product.id}`, fallback);
                              e.target.src = fallback;
                            } else {
                              console.error(`🖼️ Shop: Fallback also failed for product ${product.id}`);
                            }
                          }}
                          onLoad={() => {
                            console.log(`🖼️ Shop: Image loaded successfully for product ${product.id}`);
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = 'scale(1.03)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'scale(1)';
                          }}
                        />
                        {/* Action buttons overlay */}
                        <div                         style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          display: 'flex',
                          gap: '8px',
                          opacity: 1,
                          transition: 'opacity 0.3s ease'
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
                          fontSize: '15px', 
                          fontWeight: '600',
                          color: '#362319',
                          margin: '0 0 8px 0',
                          cursor: 'pointer',
                          fontFamily: "'Inter', 'Noto Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif",
                          lineHeight: '1.3',
                          height: '38px', // Fixed height for 2 lines (19px * 2)
                          overflow: 'hidden',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          textOverflow: 'ellipsis'
                        }}
                        onClick={() => handleViewProduct(product)}
                        title={product.name}
                      >
                        {product.name}
                      </h3>
                      <div style={{ 
                        color: '#553d2d', 
                        fontSize: '12px', 
                        marginBottom: '10px',
                        fontWeight: '500',
                        height: '18px',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis'
                      }}>
                        {product.category?.name}
                      </div>
                      <div style={{ 
                        fontSize: '20px', 
                        fontWeight: '700', 
                        color: '#eda274',
                        marginBottom: '10px',
                        fontFamily: "'Inter', 'Noto Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif",
                        height: '28px'
                      }}>
                        {product.price ? `${product.price.toLocaleString()}đ` : 'Liên hệ'}
                      </div>
                      {product.stock !== undefined && (
                        <Tag 
                          color={product.stock > 0 ? 'green' : 'red'}
                          style={{ 
                            fontSize: '11px',
                            fontWeight: '600',
                            padding: '3px 10px',
                            borderRadius: '10px',
                            marginBottom: '12px',
                            height: '22px',
                            display: 'inline-flex',
                            alignItems: 'center'
                          }}
                        >
                          {product.stock > 0 ? `Còn ${product.stock}` : 'Hết hàng'}
                        </Tag>
                      )}
                      
                      {/* Add to Cart Button */}
                      <Button
                        type="primary"
                        icon={<ShoppingCartOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                        disabled={product.stock === 0 || isInCart(product.id)}
                        style={{
                          width: '100%',
                          height: '40px',
                          background: product.stock === 0 
                            ? '#ccc' 
                            : isInCart(product.id)
                            ? '#8B4513' // Màu nâu đậm khi đã thêm vào giỏ
                            : '#eda274', // Màu nâu nhạt khi chưa thêm
                          borderColor: product.stock === 0 
                            ? '#ccc' 
                            : isInCart(product.id)
                            ? '#8B4513'
                            : '#eda274',
                          borderRadius: '8px',
                          fontWeight: '600',
                          fontSize: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          transition: 'all 0.2s ease',
                          cursor: (product.stock === 0 || isInCart(product.id)) ? 'not-allowed' : 'pointer'
                        }}
                        onMouseEnter={(e) => {
                          if (product.stock > 0 && !isInCart(product.id)) {
                            e.target.style.background = '#d5956d';
                            e.target.style.borderColor = '#d5956d';
                            e.target.style.transform = 'translateY(-1px)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (product.stock > 0 && !isInCart(product.id)) {
                            e.target.style.background = '#eda274';
                            e.target.style.borderColor = '#eda274';
                            e.target.style.transform = 'translateY(0)';
                          }
                        }}
                      >
                        {product.stock === 0 
                          ? 'Hết hàng' 
                          : isInCart(product.id)
                          ? 'Đã thêm vào giỏ'
                          : 'Thêm vào giỏ'}
                      </Button>
                    </div>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}