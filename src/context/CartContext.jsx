// src/context/CartContext.jsx
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { 
  getMyCart, 
  addCartItem, 
  updateCartItemQuantity, 
  deleteCartItem 
} from '../services/cart';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, isAuthenticated } = useAuth();
  const { showSuccess, showError } = useToast();
  
  // Guards để tránh spam API calls
  const hasLoadedRef = useRef(false);
  const isLoadingRef = useRef(false);

  // Load cart from API khi user đăng nhập
  // Lưu ý: Không load tự động khi mount vì endpoint có thể chưa tồn tại
  // Chỉ load khi user thực hiện action (thêm item vào cart) hoặc vào trang cart
  useEffect(() => {
    // Không auto-load cart khi mount vì endpoint /api/cart/my có thể chưa tồn tại
    // Cart sẽ được load khi:
    // 1. User thêm item vào cart (trong addToCart function)
    // 2. User vào trang Cart (trong Cart page component)
    // 3. User thực hiện action update/delete (sẽ reload cart)
    
    // Chỉ clear cart khi logout
    if (!user) {
      setCartItems([]);
      hasLoadedRef.current = false;
    }
  }, [user]);

  // Function để load cart manually (gọi từ Cart page hoặc khi cần)
  const loadCart = async () => {
    // Chỉ load khi user đã đăng nhập và chưa đang load
    if (!isAuthenticated() || !user || isLoadingRef.current) {
      return;
    }

    isLoadingRef.current = true;
    setLoading(true);
    try {
      console.log('🛒 Cart: Loading cart from API for user');
      const cartData = await getMyCart();
      
      // Normalize cart data từ BE
      const items = Array.isArray(cartData) ? cartData : (cartData?.items || []);
      
      setCartItems(items || []);
      hasLoadedRef.current = true;
      console.log('🛒 Cart: Loaded cart successfully', { count: items.length });
    } catch (e) {
      console.error('🛒 Cart: Error loading cart', e);
      setError(e?.message || 'Không thể tải giỏ hàng');
      
      // Xử lý lỗi 400 (endpoint không tồn tại) một cách graceful
      if (e?.response?.status === 400) {
        // Endpoint chưa tồn tại - không hiển thị lỗi, chỉ log
        console.warn('🛒 Cart: Endpoint /cart/my may not exist yet. Cart will be loaded on first action.');
        setCartItems([]); // Set empty cart
        hasLoadedRef.current = true; // Mark as loaded để không retry
      } else if (e?.response?.status !== 401 && e?.response?.status !== 403) {
        // Các lỗi khác (trừ 401/403 đã được interceptor xử lý)
        showError('Không thể tải giỏ hàng. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  };

  // Thêm item vào giỏ hàng
  const addToCart = async (product, quantity = 1) => {
    if (!isAuthenticated()) {
      showError('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
      return;
    }

    setLoading(true);
    try {
      const productPrice = product.price || 0;
      console.log('🛒 Cart: Adding item to cart', { 
        productId: product.id, 
        quantity, 
        price: productPrice 
      });
      
      // Truyền price để tính total
      await addCartItem(product.id, quantity, productPrice);
      
      // Reload cart sau khi thêm - xử lý lỗi 400 gracefully
      try {
        const updatedCart = await getMyCart();
        const items = Array.isArray(updatedCart) ? updatedCart : (updatedCart?.items || []);
        setCartItems(items || []);
      } catch (reloadError) {
        // Nếu endpoint không tồn tại, thêm item vào local state
        if (reloadError?.response?.status === 400) {
          const newItem = {
            id: Date.now(), // Temporary ID
            productId: product.id,
            quantity: quantity,
            total: productPrice * quantity,
            price: productPrice,
            product: product
          };
          setCartItems(prevItems => [...prevItems, newItem]);
        } else {
          throw reloadError;
        }
      }
      
      showSuccess(`Đã thêm ${product.name} vào giỏ hàng`);
      console.log('🛒 Cart: Added item successfully');
    } catch (e) {
      console.error('🛒 Cart: Error adding item', e);
      
      // Kiểm tra xem có phải lỗi "item already exists" không
      const errorData = e?.response?.data;
      const errorMessage = typeof errorData === 'string' 
        ? errorData 
        : (errorData?.message || errorData?.error || '');
      
      const isAlreadyExists = errorMessage.toLowerCase().includes('already exists') ||
                              errorMessage.toLowerCase().includes('đã tồn tại');
      
      if (isAlreadyExists) {
        // Item đã tồn tại → Tự động cập nhật số lượng
        console.log('🛒 Cart: Item already exists, updating quantity instead');
        
        try {
          // Reload cart để lấy item hiện tại
          const currentCart = await getMyCart();
          const currentItems = Array.isArray(currentCart) ? currentCart : (currentCart?.items || []);
          
          // Tìm item có cùng productId
          const existingItem = currentItems.find(
            item => (item.productId || item.product?.id) === product.id
          );
          
          if (existingItem) {
            const itemId = existingItem.id || existingItem.itemId;
            const currentQuantity = existingItem.quantity || 0;
            const newQuantity = currentQuantity + quantity;
            const price = existingItem.price || existingItem.product?.price || product.price || 0;
            const productIdForUpdate = existingItem.productId || existingItem.product?.id || product.id;
            
            console.log('🛒 Cart: Updating existing item', {
              itemId,
              currentQuantity,
              newQuantity,
              price
            });
            
            // Cập nhật số lượng
            await updateCartItemQuantity(itemId, newQuantity, price, productIdForUpdate);
            
            // Reload cart sau khi cập nhật
            const updatedCart = await getMyCart();
            const items = Array.isArray(updatedCart) ? updatedCart : (updatedCart?.items || []);
            setCartItems(items || []);
            
            showSuccess(`Đã cập nhật số lượng ${product.name} trong giỏ hàng`);
            console.log('🛒 Cart: Updated existing item successfully');
          } else {
            // Item không tìm thấy trong cart (có thể đã bị xóa)
            showError('Không tìm thấy sản phẩm trong giỏ hàng. Vui lòng thử lại.');
          }
        } catch (updateError) {
          console.error('🛒 Cart: Error updating existing item', updateError);
          const updateErrorMsg = updateError?.response?.data?.message || 
                                'Không thể cập nhật số lượng sản phẩm';
          showError(updateErrorMsg);
        }
      } else {
        // Lỗi khác → Hiển thị thông báo lỗi
        const errorMsg = errorMessage || 'Không thể thêm sản phẩm vào giỏ hàng';
        console.error('🛒 Cart: Full error response:', {
          status: e?.response?.status,
          data: e?.response?.data,
          message: errorMsg
        });
        showError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  // Xóa item khỏi giỏ hàng
  const removeFromCart = async (itemId) => {
    setLoading(true);
    try {
      console.log('🛒 Cart: Removing item from cart', { itemId });
      await deleteCartItem(itemId);
      
      // Reload cart sau khi xóa - xử lý lỗi 400 gracefully
      try {
        const updatedCart = await getMyCart();
        const items = Array.isArray(updatedCart) ? updatedCart : (updatedCart?.items || []);
        setCartItems(items || []);
      } catch (reloadError) {
        // Nếu endpoint không tồn tại, update local state
        if (reloadError?.response?.status === 400) {
          setCartItems(prevItems => 
            prevItems.filter(item => (item.id || item.itemId) !== itemId)
          );
        } else {
          throw reloadError;
        }
      }
      
      showSuccess('Đã xóa sản phẩm khỏi giỏ hàng');
      console.log('🛒 Cart: Removed item successfully');
    } catch (e) {
      console.error('🛒 Cart: Error removing item', e);
      const errorMsg = e?.response?.data?.message || 'Không thể xóa sản phẩm';
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Cập nhật số lượng item
  const updateQuantity = async (itemId, quantity) => {
    if (quantity <= 0) {
      await removeFromCart(itemId);
      return;
    }

    setLoading(true);
    try {
      // Tìm item trong cart để lấy price và productId
      const currentItem = cartItems.find(item => (item.id || item.itemId) === itemId);
      const price = currentItem?.price || currentItem?.product?.price || 0;
      const productId = currentItem?.productId || currentItem?.product?.id || null;
      
      console.log('🛒 Cart: Updating item quantity', { itemId, quantity, price, productId });
      await updateCartItemQuantity(itemId, quantity, price, productId);
      
      // Reload cart sau khi cập nhật - xử lý lỗi 400 gracefully
      try {
        const updatedCart = await getMyCart();
        const items = Array.isArray(updatedCart) ? updatedCart : (updatedCart?.items || []);
        setCartItems(items || []);
        console.log('🛒 Cart: Updated quantity successfully');
      } catch (reloadError) {
        // Nếu endpoint không tồn tại, update local state từ current item
        if (reloadError?.response?.status === 400) {
          setCartItems(prevItems => 
            prevItems.map(item => 
              (item.id || item.itemId) === itemId 
                ? { ...item, quantity, total: price * quantity }
                : item
            )
          );
          console.log('🛒 Cart: Updated quantity in local state');
        } else {
          throw reloadError;
        }
      }
    } catch (e) {
      console.error('🛒 Cart: Error updating quantity', e);
      const errorMsg = e?.response?.data?.message || 'Không thể cập nhật số lượng. Có thể vượt quá số lượng tồn kho.';
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Xóa tất cả items trong giỏ hàng
  const clearCart = async () => {
    setLoading(true);
    try {
      // Xóa từng item (hoặc gọi API xóa tất cả nếu BE có)
      const deletePromises = cartItems.map(item => deleteCartItem(item.id || item.itemId));
      await Promise.all(deletePromises);
      
      setCartItems([]);
      showSuccess('Đã xóa tất cả sản phẩm khỏi giỏ hàng');
      console.log('🛒 Cart: Cleared cart successfully');
    } catch (e) {
      console.error('🛒 Cart: Error clearing cart', e);
      showError('Không thể xóa giỏ hàng');
    } finally {
      setLoading(false);
    }
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      // Tính từ item.price * quantity hoặc item.total
      const itemTotal = item.total || (item.price || 0) * (item.quantity || 0);
      return total + itemTotal;
    }, 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    loading,
    error,
    // Load cart manually (gọi từ Cart page)
    loadCart,
    // Refresh cart manually
    refreshCart: async () => {
      hasLoadedRef.current = false;
      await loadCart();
    }
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
