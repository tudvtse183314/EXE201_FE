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
      // Xử lý lỗi 400 (endpoint không tồn tại) đã được getMyCart xử lý, không cần log thêm
      if (e?.response?.status !== 400) {
        console.error('🛒 Cart Context: Error loading cart', e);
        setError(e?.message || 'Không thể tải giỏ hàng');
        
        // Các lỗi khác (trừ 401/403 đã được interceptor xử lý)
        if (e?.response?.status !== 401 && e?.response?.status !== 403) {
          showError('Không thể tải giỏ hàng. Vui lòng thử lại.');
        }
      } else {
        // 400 đã được getMyCart xử lý, chỉ set empty cart
        setCartItems([]);
        hasLoadedRef.current = true;
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
      const addResult = await addCartItem(product.id, quantity, productPrice);
      console.log('🛒 Cart: addCartItem result', addResult);
      
      // Reload cart sau khi thêm - xử lý lỗi 400 gracefully
      // Force reload để có data mới nhất
      try {
        const updatedCart = await getMyCart(true); // Force reload
        const items = Array.isArray(updatedCart) ? updatedCart : (updatedCart?.items || []);
        console.log('🛒 Cart: getMyCart result', { items, itemsLength: items.length, cartItemsLength: cartItems.length });
        
        // Nếu API trả về items, dùng items từ API
        if (items.length > 0) {
          setCartItems(items);
        } else {
          // Nếu API trả về empty (endpoint không tồn tại hoặc có vấn đề)
          // Thêm item vào local state vì addCartItem đã thành công
          const newItem = {
            id: addResult?.id || addResult?.data?.id || Date.now(), // Dùng ID từ response nếu có
            productId: product.id,
            quantity: quantity,
            total: productPrice * quantity,
            price: productPrice,
            product: product
          };
          
          // Kiểm tra xem item đã tồn tại chưa (tránh duplicate)
          setCartItems(prevItems => {
            const existingIndex = prevItems.findIndex(
              item => (item.productId || item.product?.id) === product.id
            );
            
            if (existingIndex >= 0) {
              // Item đã tồn tại, cập nhật quantity
              const updated = [...prevItems];
              updated[existingIndex] = {
                ...updated[existingIndex],
                quantity: updated[existingIndex].quantity + quantity,
                total: (updated[existingIndex].quantity + quantity) * productPrice
              };
              return updated;
            } else {
              // Item mới, thêm vào
              return [...prevItems, newItem];
            }
          });
        }
      } catch (reloadError) {
        // Các lỗi khác (401, 403, 500, ...) - fallback về local state
        if (reloadError?.response?.status !== 401 && reloadError?.response?.status !== 403) {
          console.log('🛒 Cart: getMyCart error, adding to local state', reloadError);
          const newItem = {
            id: addResult?.id || addResult?.data?.id || Date.now(),
            productId: product.id,
            quantity: quantity,
            total: productPrice * quantity,
            price: productPrice,
            product: product
          };
          
          // Kiểm tra xem item đã tồn tại chưa (tránh duplicate)
          setCartItems(prevItems => {
            const existingIndex = prevItems.findIndex(
              item => (item.productId || item.product?.id) === product.id
            );
            
            if (existingIndex >= 0) {
              // Item đã tồn tại, cập nhật quantity
              const updated = [...prevItems];
              updated[existingIndex] = {
                ...updated[existingIndex],
                quantity: updated[existingIndex].quantity + quantity,
                total: (updated[existingIndex].quantity + quantity) * productPrice
              };
              return updated;
            } else {
              // Item mới, thêm vào
              return [...prevItems, newItem];
            }
          });
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
          // Reload cart để lấy item hiện tại - force reload
          const currentCart = await getMyCart(true); // Force reload
          const currentItems = Array.isArray(currentCart) ? currentCart : (currentCart?.items || []);
          
          // Nếu endpoint không tồn tại, tìm trong local state
          let existingItem = null;
          if (currentItems.length === 0 && cartItems.length > 0) {
            // Endpoint không tồn tại, tìm trong local state
            existingItem = cartItems.find(
              item => (item.productId || item.product?.id) === product.id
            );
          } else {
            // Endpoint tồn tại, tìm trong response
            existingItem = currentItems.find(
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
            
            // Reload cart sau khi cập nhật - force reload
            const updatedCart = await getMyCart(true); // Force reload
            const items = Array.isArray(updatedCart) ? updatedCart : (updatedCart?.items || []);
            // Nếu endpoint không tồn tại, update local state
            if (items.length === 0 && cartItems.length > 0) {
              setCartItems(prevItems => 
                prevItems.map(item => 
                  (item.id || item.itemId) === itemId 
                    ? { ...item, quantity: newQuantity, total: price * newQuantity }
                    : item
                )
              );
            } else {
              setCartItems(items || []);
            }
            
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
      // Force reload để có data mới nhất
      try {
        const updatedCart = await getMyCart(true); // Force reload
        const items = Array.isArray(updatedCart) ? updatedCart : (updatedCart?.items || []);
        // Nếu endpoint không tồn tại, update local state
        if (items.length === 0 && cartItems.length > 0) {
          // Endpoint không tồn tại, xóa từ local state
          setCartItems(prevItems => 
            prevItems.filter(item => (item.id || item.itemId) !== itemId)
          );
        } else {
          setCartItems(items || []);
        }
      } catch (reloadError) {
        // Các lỗi khác - fallback về local state
        if (reloadError?.response?.status !== 401 && reloadError?.response?.status !== 403) {
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
      // Force reload để có data mới nhất
      try {
        const updatedCart = await getMyCart(true); // Force reload
        const items = Array.isArray(updatedCart) ? updatedCart : (updatedCart?.items || []);
        // Nếu endpoint không tồn tại, update local state
        if (items.length === 0 && cartItems.length > 0) {
          // Endpoint không tồn tại, update local state
          setCartItems(prevItems => 
            prevItems.map(item => 
              (item.id || item.itemId) === itemId 
                ? { ...item, quantity, total: price * quantity }
                : item
            )
          );
          console.log('🛒 Cart: Updated quantity in local state');
        } else {
          setCartItems(items || []);
          console.log('🛒 Cart: Updated quantity successfully');
        }
      } catch (reloadError) {
        // Các lỗi khác - fallback về local state
        if (reloadError?.response?.status !== 401 && reloadError?.response?.status !== 403) {
          setCartItems(prevItems => 
            prevItems.map(item => 
              (item.id || item.itemId) === itemId 
                ? { ...item, quantity, total: price * quantity }
                : item
            )
          );
          console.log('🛒 Cart: Updated quantity in local state (error fallback)');
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
      // Tính từ item.total (ưu tiên) hoặc item.price * quantity
      // Nếu có product.salePrice thì dùng salePrice thay vì price
      const quantity = Number(item.quantity || 0);
      if (item.total) {
        return total + Number(item.total);
      }
      
      // Tính từ price và quantity
      const price = item.price || item.product?.price || item.product?.salePrice || 0;
      const itemTotal = Number(price) * quantity;
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
