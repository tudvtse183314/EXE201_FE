import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getMyOrders, getOrdersByAccount } from "../../services/orders";

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        setLoading(true);
        let data = [];
        // Ưu tiên endpoint /orders/my nếu BE có:
        try {
          data = await getMyOrders();
        } catch {
          // fallback nếu BE không có /orders/my
          if (user?.accountId) {
            data = await getOrdersByAccount(user.accountId);
          }
        }
        if (!ignore) setOrders(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!ignore) setErr(e);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, [user?.accountId]);

  if (loading) {
    return <div className="p-6">Đang tải đơn hàng của bạn…</div>;
  }
  if (err) {
    return <div className="p-6 text-red-600">Không tải được dữ liệu đơn hàng.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Xin chào, {user?.name || "bạn"}</h1>
      <p className="text-gray-600 mb-6">Đây là danh sách đơn hàng gần đây của bạn.</p>

      {orders.length === 0 ? (
        <div className="text-gray-500">Bạn chưa có đơn hàng nào.</div>
      ) : (
        <ul className="space-y-3">
          {orders.slice(0, 5).map((o) => (
            <li key={o.id} className="p-4 border rounded-lg">
              <div className="font-medium">Mã đơn: {o.code || o.id}</div>
              <div className="text-sm text-gray-600">Trạng thái: {o.status || "—"}</div>
              <div className="text-sm text-gray-600">Tổng: {o.totalPrice ?? o.total ?? 0}</div>
              <div className="text-xs text-gray-400">{new Date(o.createdAt || o.date || Date.now()).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
