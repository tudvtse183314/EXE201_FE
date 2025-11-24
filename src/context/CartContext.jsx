// src/context/CartContext.jsx
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { 
  getMyCart, 
  addCartItem, 
  updateCartItemQuantity, 
  deleteCartItem 
} from '../services/cart';
import { getProductById } from '../services/products';
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
  const lastLoadTimeRef = useRef(0);
  const MIN_LOAD_INTERVAL = 1000; // Chỉ cho phép load lại sau 1 giây
  
  // Debounce timers cho quantity updates
  const quantityUpdateTimersRef = useRef({});

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
      // Clear tất cả quantity update timers khi logout
      const timers = quantityUpdateTimersRef.current;
      Object.values(timers).forEach(t => clearTimeout(t));
      quantityUpdateTimersRef.current = {};
    }
  }, [user]);

  // Cleanup timers khi unmount provider để tránh memory leak
  useEffect(() => {
    return () => {
      const timers = quantityUpdateTimersRef.current;
      Object.values(timers).forEach(t => clearTimeout(t));
      quantityUpdateTimersRef.current = {};
    };
  }, []);

  // Function để load cart manually (gọi từ Cart page hoặc khi cần)
  const loadCart = async (force = false) => {
    // Chỉ load khi user đã đăng nhập
    if (!isAuthenticated() || !user) {
      console.log('🛒 Cart Context: Skipping load - user not authenticated');
      return;
    }

    // Throttle: Chỉ cho phép load lại sau MIN_LOAD_INTERVAL (trừ khi force)
    const now = Date.now();
    if (!force) {
      // Kiểm tra nếu đang loading
      if (isLoadingRef.current) {
        console.log('🛒 Cart Context: Already loading, skipping duplicate request');
        return;
      }
      
      // Kiểm tra throttle interval
      if (now - lastLoadTimeRef.current < MIN_LOAD_INTERVAL) {
        console.log('🛒 Cart Context: Skipping load - too soon since last load', {
          timeSinceLastLoad: now - lastLoadTimeRef.current,
          minInterval: MIN_LOAD_INTERVAL
        });
        return;
      }
      
      // Kiểm tra nếu đã load và chưa cần reload
      if (hasLoadedRef.current && cartItems.length > 0) {
        console.log('🛒 Cart Context: Cart already loaded, skipping (use force=true to reload)');
        return;
      }
    }

    isLoadingRef.current = true;
    lastLoadTimeRef.current = now;
    setLoading(true);
    
    try {
      const stack = new Error().stack;
      const caller = stack?.split('\n')[2]?.trim() || 'unknown';
      console.log('🛒 Cart Context: loadCart() called', { force, caller });
      
      // Force reload (skip cache) nếu force = true
      const cartData = await getMyCart(force);
      
      // Normalize cart data từ BE
      const rawItems = Array.isArray(cartData) ? cartData : (cartData?.items || []);

      // Nếu BE không trả kèm thông tin product → hydrate bằng productId
      const uniqueIds = Array.from(new Set(
        rawItems.map(i => i.productId || i.product?.id).filter(Boolean)
      ));
      let productMap = {};
      if (uniqueIds.length > 0) {
        const results = await Promise.allSettled(uniqueIds.map(id => getProductById(id)));
        results.forEach((r, idx) => {
          const pid = uniqueIds[idx];
          if (r.status === 'fulfilled' && r.value) {
            productMap[pid] = r.value;
          }
        });
      }

      const items = rawItems.map(i => {
        const pid = i.productId || i.product?.id;
        const hydrated = productMap[pid];
        return hydrated ? { ...i, product: hydrated, price: i.price ?? hydrated.price } : i;
      });

      setCartItems(items || []);
      hasLoadedRef.current = true;
      console.log('🛒 Cart Context: Loaded cart successfully', { count: items.length });
    } catch (e) {
      console.error('🛒 Cart Context: Error loading cart', e);
      
      // Xử lý lỗi 400 (endpoint không tồn tại) - không hiển thị lỗi, chỉ set empty cart
      if (e?.response?.status === 400) {
        setCartItems([]);
        hasLoadedRef.current = true;
        setError(null); // Clear error cho 400
        return; // Không throw error cho 400
      }
      
      // Xử lý các lỗi khác
      const errorMessage = e?.response?.data?.message || e?.message || 'Không thể tải giỏ hàng';
      setError(errorMessage);
      
      // Hiển thị toast cho các lỗi (trừ 401/403 đã được interceptor xử lý)
      if (e?.response?.status !== 401 && e?.response?.status !== 403) {
        showError(errorMessage);
      }
      
      // Throw error để component có thể xử lý thêm nếu cần
      throw e;
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
      
      // Reload cart sau khi thêm - dùng loadCart(true) để tận dụng hydrate products và throttle
      // Không gọi getMyCart(true) trực tiếp để tránh hydrate products nhiều lần
      try {
        await loadCart(true); // Force reload với hydrate products
      } catch (reloadError) {
        // Nếu loadCart fail (400, 401, 403, ...), fallback về local state
        if (reloadError?.response?.status !== 400 && 
            reloadError?.response?.status !== 401 && 
            reloadError?.response?.status !== 403) {
          // Thêm item vào local state nếu không thể reload
          const newItem = {
            id: Date.now(),
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
          // Tìm item trong local state trước (tránh gọi API không cần thiết)
          let existingItem = cartItems.find(
            item => (item.productId || item.product?.id) === product.id
          );
          
          // Nếu không tìm thấy trong local state, reload cart để sync với BE
          if (!existingItem) {
            await loadCart(true); // Force reload với hydrate products
            existingItem = cartItems.find(
              item => (item.productId || item.product?.id) === product.id
            );
          }
          
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
            
            // Reload cart sau khi cập nhật - dùng loadCart(true) để hydrate products
            await loadCart(true);
            
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

  // Xóa item khỏi giỏ hàng - Optimistic update
  const removeFromCart = async (itemId) => {
    // Lưu item để có thể rollback nếu lỗi
    const itemToRemove = cartItems.find(item => (item.id || item.itemId) === itemId);
    
    // Optimistic update: Xóa ngay khỏi UI
    setCartItems(prevItems => 
      prevItems.filter(item => (item.id || item.itemId) !== itemId)
    );
    
    // Gọi API ở background (không chờ)
    deleteCartItem(itemId).catch((e) => {
      console.error('🛒 Cart: Error removing item from API', e);
      // Rollback nếu lỗi
      if (itemToRemove) {
        setCartItems(prevItems => [...prevItems, itemToRemove]);
        showError('Không thể xóa sản phẩm. Vui lòng thử lại.');
      }
    });
    
    showSuccess('Đã xóa sản phẩm khỏi giỏ hàng');
    console.log('🛒 Cart: Removed item (optimistic)');
  };

  // Hàm private để schedule quantity update với debounce
  const scheduleQuantityUpdate = (itemId, quantity, price, productId, oldQuantity) => {
    if (!itemId) return;

    // Clear timer cũ nếu có
    const timers = quantityUpdateTimersRef.current;
    if (timers[itemId]) {
      clearTimeout(timers[itemId]);
    }

    // Đặt timer mới (600ms debounce)
    timers[itemId] = setTimeout(async () => {
      try {
        console.log('🛒 Cart: Flushing quantity update to API', {
          itemId,
          quantity,
          price,
          productId,
        });
        await updateCartItemQuantity(itemId, quantity, price, productId);
        console.log('🛒 Cart: Quantity updated successfully (debounced)');
      } catch (e) {
        console.error('🛒 Cart: Error updating quantity in API (debounced)', e);
        // Rollback nếu lỗi
        setCartItems(prevItems => 
          prevItems.map(item => 
            (item.id || item.itemId) === itemId 
              ? { ...item, quantity: oldQuantity, total: price * oldQuantity }
              : item
          )
        );
        const errorMsg = e?.response?.data?.message || 'Không thể cập nhật số lượng. Có thể vượt quá số lượng tồn kho.';
        showError(errorMsg);
      } finally {
        // Xóa timer sau khi gọi xong
        delete timers[itemId];
      }
    }, 600); // debounce 600ms
  };

  // Cập nhật số lượng item - Optimistic update với debounce
  const updateQuantity = async (itemId, quantity) => {
    if (quantity <= 0) {
      // Clear timer nếu có
      const timers = quantityUpdateTimersRef.current;
      if (timers[itemId]) {
        clearTimeout(timers[itemId]);
        delete timers[itemId];
      }
      await removeFromCart(itemId);
      return;
    }

    // Tìm item trong cart để lấy price và productId
    const currentItem = cartItems.find(item => (item.id || item.itemId) === itemId);
    if (!currentItem) {
      console.warn('🛒 Cart: Item not found for update', { itemId });
      return;
    }

    const price = currentItem?.price || currentItem?.product?.price || 0;
    const productId = currentItem?.productId || currentItem?.product?.id || null;
    const oldQuantity = currentItem.quantity || 1;
    
    // ✅ Optimistic update UI - cập nhật ngay lập tức
    setCartItems(prevItems => 
      prevItems.map(item => 
        (item.id || item.itemId) === itemId 
          ? { ...item, quantity, total: price * quantity }
          : item
      )
    );
    
    console.log('🛒 Cart: Updated quantity (optimistic, debounced)', { itemId, quantity, price });
    
    // ✅ Debounce API call - chỉ gọi sau 600ms kể từ lần thay đổi cuối cùng
    scheduleQuantityUpdate(itemId, quantity, price, productId, oldQuantity);
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
    // Refresh cart manually (force reload)
    refreshCart: async () => {
      hasLoadedRef.current = false;
      await loadCart(true); // Force reload
    }
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
