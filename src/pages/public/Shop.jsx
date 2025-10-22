// src/pages/public/Shop.jsx
import React, { useState, useEffect, useMemo } from "react";
import { Card, Row, Col, Button, Tag, Input, Select, Spin, Alert, Empty } from "antd";
import { SearchOutlined, ShoppingCartOutlined, EyeOutlined } from "@ant-design/icons";
import { getAllCategories } from "../../services/categories";
import { getAllProducts } from "../../services/products";
import { dataManager } from "../../utils/dataManager";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { getFallbackImageByIndex } from "../../utils/imageUtils";

const { Search } = Input;
const { Option } = Select;

export default function Shop() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
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

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    console.log("🛒 Add to cart:", product);
  };

  const handleViewProduct = (product) => {
    navigate(`/product/${product.id}`);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16, fontSize: 16, color: '#666' }}>
          Đang tải sản phẩm...
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
    <div style={{ padding: '20px' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700 }}>
          🛍️ Cửa hàng
        </h1>
        <p style={{ margin: '8px 0 0 0', color: '#666', fontSize: 16 }}>
          Khám phá các sản phẩm tuyệt vời cho thú cưng của bạn
        </p>
      </div>

      {/* Filters */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%' }}
              prefix={<SearchOutlined />}
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Select
              value={sortBy}
              onChange={setSortBy}
              style={{ width: '100%' }}
              placeholder="Sắp xếp theo"
            >
              <Option value="name">Tên A-Z</Option>
              <Option value="price-low">Giá thấp → cao</Option>
              <Option value="price-high">Giá cao → thấp</Option>
            </Select>
          </Col>
          <Col xs={24} sm={24} md={8}>
            <div style={{ textAlign: 'right' }}>
              <Tag color="blue">
                {visibleProducts.length} sản phẩm
              </Tag>
            </div>
          </Col>
        </Row>
      </Card>

      <Row gutter={[24, 24]}>
        {/* Categories Sidebar */}
        <Col xs={24} lg={6}>
          <Card title="📂 Danh mục" style={{ position: 'sticky', top: 20 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Button
                type={activeCatId === "all" ? "primary" : "text"}
                onClick={() => setActiveCatId("all")}
                style={{ textAlign: 'left', justifyContent: 'flex-start' }}
              >
                Tất cả ({allProducts.length})
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  type={activeCatId === String(category.id) ? "primary" : "text"}
                  onClick={() => setActiveCatId(String(category.id))}
                  style={{ textAlign: 'left', justifyContent: 'flex-start' }}
                >
                  {category.name} ({allProducts.filter(p => p?.category?.id === category.id).length})
                </Button>
              ))}
            </div>
          </Card>
        </Col>

        {/* Products Grid */}
        <Col xs={24} lg={18}>
          {visibleProducts.length === 0 ? (
            <Card>
              <Empty
                description="Không tìm thấy sản phẩm nào"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            </Card>
          ) : (
            <Row gutter={[16, 16]}>
              {visibleProducts.map((product) => (
                <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                  <Card
                    hoverable
                    cover={
                      <div style={{ height: 200, overflow: 'hidden' }}>
                        <img
                          alt={product.name}
                          src={product.image || getFallbackImageByIndex(product.id)}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                          onError={(e) => {
                            e.target.src = getFallbackImageByIndex(product.id);
                          }}
                        />
                      </div>
                    }
                    actions={[
                      <Button
                        type="text"
                        icon={<EyeOutlined />}
                        onClick={() => handleViewProduct(product)}
                        title="Xem chi tiết"
                      />,
                      <Button
                        type="text"
                        icon={<ShoppingCartOutlined />}
                        onClick={() => handleAddToCart(product)}
                        title="Thêm vào giỏ"
                      />
                    ]}
                  >
                    <Card.Meta
                      title={
                        <div style={{ fontSize: 14, fontWeight: 600 }}>
                          {product.name}
                        </div>
                      }
                      description={
                        <div>
                          <div style={{ color: '#666', fontSize: 12, marginBottom: 8 }}>
                            {product.category?.name}
                          </div>
                          <div style={{ fontSize: 16, fontWeight: 700, color: '#1890ff' }}>
                            {product.price ? `${product.price.toLocaleString()}đ` : 'Liên hệ'}
                          </div>
                          {product.stock !== undefined && (
                            <div style={{ fontSize: 12, color: product.stock > 0 ? '#52c41a' : '#ff4d4f' }}>
                              {product.stock > 0 ? `Còn ${product.stock} sản phẩm` : 'Hết hàng'}
                            </div>
                          )}
                        </div>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>
    </div>
  );
}