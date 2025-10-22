// src/constants/roles.js
export const ROLES = {
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
  STAFF: "STAFF",
  CUSTOMER: "CUSTOMER",
  DOCTOR: "DOCTOR",
};

// Chỉ role quản lý mới vào dashboard; CUSTOMER về trang chủ "/"
export const dashboardPathByRole = {
  ADMIN: "/admin", // 👈 ADMIN và MANAGER vào admin panel
  MANAGER: "/admin", // 👈 ADMIN và MANAGER vào admin panel
  STAFF: "/staff/dashboard",
  DOCTOR: "/doctor/dashboard",
  CUSTOMER: "/", // 👈 khách quay về Home
};

export function getDashboardPathByRole(role) {
  if (!role) return "/";
  const key = (typeof role === "string" ? role : String(role)).toUpperCase();
  return dashboardPathByRole[key] || "/";
}
