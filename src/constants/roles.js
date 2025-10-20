export const ROLES = {
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
  STAFF: "STAFF",
  CUSTOMER: "CUSTOMER",
  DOCTOR: "DOCTOR",
};

export const dashboardPathByRole = {
  ADMIN: "/admin/dashboard",
  MANAGER: "/manager/dashboard",
  STAFF: "/staff/dashboard",
  CUSTOMER: "/customer/dashboard",
  DOCTOR: "/doctor/dashboard",
};

export function getDashboardPathByRole(role) {
  if (!role) return "/";
  const key = (typeof role === "string" ? role : String(role)).toUpperCase();
  return dashboardPathByRole[key] || "/";
}
