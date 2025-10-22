// // src/pages/public/Shop.jsx
// import React, { useEffect, useMemo, useRef, useState } from 'react';
// import { Spin, Alert } from 'antd';
// import { getAllCategories } from '../../services/categories';
// import { getAllProducts } from '../../services/products';

// export default function Shop() {
//   const [categories, setCategories] = useState([]);
//   const [activeCatId, setActiveCatId] = useState('all'); // 'all' | number
//   const [allProducts, setAllProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState(null);

//   // ✅ Chặn double-call do React 18 StrictMode (mount -> unmount -> mount)
//   const fetchedRef = useRef(false);
//   const aliveRef = useRef(true);

//   useEffect(() => {
//     aliveRef.current = true;

//     if (fetchedRef.current) return; // đã fetch rồi thì thôi
//     fetchedRef.current = true;

//     (async () => {
//       try {
//         setLoading(true);
//         setErr(null);

//         // gọi song song
//         const [cats, prods] = await Promise.all([
//           getAllCategories(), // GET /categories/getAll (đã sửa trong services)
//           getAllProducts(),   // GET /products/getAll
//         ]);

//         if (!aliveRef.current) return;
//         setCategories(Array.isArray(cats) ? cats : []);
//         setAllProducts(Array.isArray(prods) ? prods : []);
//       } catch (e) {
//         if (!aliveRef.current) return;
//         setErr(e?.message || 'Không thể tải dữ liệu. Vui lòng thử lại.');
//       } finally {
//         if (aliveRef.current) setLoading(false);
//       }
//     })();

//     return () => {
//       aliveRef.current = false;
//     };
//   }, []);

//   // ✅ Lọc theo danh mục
//   const visibleProducts = useMemo(() => {
//     if (activeCatId === 'all') return allProducts;
//     const idNum = Number(activeCatId); // đề phòng so sánh string/number
//     return allProducts.filter((p) => p?.category?.id === idNum);
//   }, [activeCatId, allProducts]);

//   if (loading) {
//     return (
//       <div className="min-h-[50vh] flex items-center justify-center">
//         <Spin size="large" />
//       </div>
//     );
//   }

//   if (err) {
//     return (
//       <div className="max-w-5xl mx-auto p-4">
//         <Alert
//           type="error"
//           message="Lỗi tải dữ liệu"
//           description={err}
//           showIcon
//         />
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto p-4">
//       <div className="grid grid-cols-12 gap-6">
//         {/* Sidebar categories */}
//         <aside className="col-span-12 md:col-span-3">
//           <div className="bg-white rounded-xl shadow p-3">
//             <button
//               onClick={() => setActiveCatId('all')}
//               className={`w-full text-left px-3 py-2 rounded-md mb-1 transition ${
//                 activeCatId === 'all'
//                   ? 'bg-amber-200 font-semibold'
//                   : 'hover:bg-gray-50'
//               }`}
//             >
//               Tất cả
//             </button>

//             {categories.map((cat) => (
//               <button
//                 key={cat.id}
//                 onClick={() => setActiveCatId(cat.id)}
//                 className={`w-full text-left px-3 py-2 rounded-md mb-1 transition ${
//                   activeCatId === cat.id
//                     ? 'bg-amber-200 font-semibold'
//                     : 'hover:bg-gray-50'
//                 }`}
//                 title={cat.description || cat.name}
//               >
//                 {cat.name}
//               </button>
//             ))}
//           </div>
//         </aside>

//         {/* Products grid */}
//         <main className="col-span-12 md:col-span-9">
//           {visibleProducts.length === 0 ? (
//             <div className="text-gray-500">Không có sản phẩm trong danh mục này.</div>
//           ) : (
//             <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
//               {visibleProducts.map((p) => (
//                 <div key={p.id} className="bg-white rounded-xl shadow p-3">
//                   <div className="aspect-square w-full bg-gray-100 rounded-lg overflow-hidden">
//                     <img
//                       src={p.imageUrl || '/placeholder.png'}
//                       alt={p.name}
//                       className="w-full h-full object-cover"
//                       loading="lazy"
//                     />
//                   </div>
//                   <div className="mt-2">
//                     <div className="font-medium line-clamp-2" title={p.name}>
//                       {p.name}
//                     </div>
//                     <div className="text-amber-700 font-semibold mt-1">
//                       {Number(p.price || 0).toLocaleString('vi-VN')}₫
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </main>
//       </div>
//     </div>
//   );
// }



// src/pages/public/Shop.jsx
import React, { useMemo, useState, useEffect } from "react";
import { getAllCategories } from "../../services/categories";
import { getAllProducts } from "../../services/products";
import { Spin, Alert } from "antd";
import { dataManager } from "../../utils/dataManager";

export default function Shop() {
  const [activeCatId, setActiveCatId] = useState("all");
  const [categories, setCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const visibleProducts = useMemo(() => {
    console.log("🛒 Shop: visibleProducts useMemo triggered", { 
      activeCatId, 
      allProductsLength: allProducts.length,
      allProducts: allProducts 
    });
    
    if (activeCatId === "all") {
      console.log("🛒 Shop: Showing all products", { count: allProducts.length });
      return allProducts;
    }
    // Convert activeCatId to number for comparison since category.id is a number
    const categoryId = Number(activeCatId);
    const filtered = allProducts.filter((p) => p?.category?.id === categoryId);
    console.log("🛒 Shop: Filtering by category", { 
      categoryId, 
      totalProducts: allProducts.length, 
      filteredCount: filtered.length 
    });
    return filtered;
  }, [activeCatId, allProducts]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md mx-4">
          <div className="flex flex-col items-center space-y-4">
            <Spin size="large" />
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Đang tải sản phẩm...
              </h3>
              <p className="text-sm text-gray-500">
                Vui lòng đợi trong giây lát
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto p-4">
        <Alert type="error" message="Lỗi" description={error} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar categories */}
        <aside className="col-span-12 md:col-span-3">
          <div className="bg-white rounded-xl shadow p-3">
            <button
              onClick={() => setActiveCatId("all")}
              className={`w-full text-left px-3 py-2 rounded-md mb-1 ${
                activeCatId === "all"
                  ? "bg-amber-200 font-semibold"
                  : "hover:bg-gray-50"
              }`}
            >
              Tất cả
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCatId(cat.id)}
                className={`w-full text-left px-3 py-2 rounded-md mb-1 transition-colors ${
                  activeCatId === cat.id
                    ? "bg-amber-200 font-semibold"
                    : "hover:bg-gray-50"
                }`}
                title={cat.description || cat.name}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </aside>

        {/* Products */}
        <main className="col-span-12 md:col-span-9">
          {/* Filter Summary */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">
                {activeCatId === "all" 
                  ? `Tất cả sản phẩm (${visibleProducts.length})` 
                  : `Danh mục: ${categories.find(c => c.id === Number(activeCatId))?.name || "Không xác định"} (${visibleProducts.length})`
                }
              </h3>
              <button
                onClick={() => setActiveCatId("all")}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Xem tất cả
              </button>
            </div>
          </div>

          {visibleProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-2">
                Không có sản phẩm trong danh mục này
              </div>
              <div className="text-gray-400 text-sm">
                Hãy thử chọn danh mục khác hoặc xem tất cả sản phẩm
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {visibleProducts.map((p) => (
                <div key={p.id} className="bg-white rounded-xl shadow p-3 hover:shadow-lg transition-shadow">
                  <div className="aspect-square w-full bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={p.imageUrl || "/placeholder.png"}
                      alt={p.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="mt-2">
                    <div className="font-medium line-clamp-2" title={p.name}>
                      {p.name}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {p.category?.name || "Không có danh mục"}
                    </div>
                    <div className="text-amber-700 font-semibold mt-1">
                      {Number(p.price || 0).toLocaleString("vi-VN")}₫
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Còn lại: {p.stock || 0} sản phẩm
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
