// src/constants/roles.js
export const ROLES = {
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
  STAFF: "STAFF",
  CUSTOMER: "CUSTOMER",
  DOCTOR: "DOCTOR",
};

// Dashboard paths theo role
export const dashboardPathByRole = {
  ADMIN: "/admin/dashboard", // 👈 ADMIN vào admin dashboard
  MANAGER: "/staff/dashboard", // MANAGER dùng chung layout staff hiện tại
  STAFF: "/staff/dashboard",
  DOCTOR: "/doctor/dashboard",
  CUSTOMER: "/", // CUSTOMER về homepage sau login
};

export function getDashboardPathByRole(role) {
  if (!role) return "/";
  const key = (typeof role === "string" ? role : String(role)).toUpperCase();
  return dashboardPathByRole[key] || "/";
}
