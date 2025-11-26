// src/constants/roles.js
export const ROLES = {
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
  CUSTOMER: "CUSTOMER",
  DOCTOR: "DOCTOR",
};

// Dashboard paths theo role
export const dashboardPathByRole = {
  ADMIN: "/admin/dashboard", // 👈 ADMIN vào admin dashboard
  MANAGER: "/admin/dashboard", // MANAGER dùng chung admin dashboard
  DOCTOR: "/doctor/dashboard",
  CUSTOMER: "/", // CUSTOMER về homepage sau login
};

export function getDashboardPathByRole(role) {
  if (!role) return "/";
  const key = (typeof role === "string" ? role : String(role)).toUpperCase();
  return dashboardPathByRole[key] || "/";
}
