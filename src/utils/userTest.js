// Utility để test user data trong localStorage
export const testUserData = () => {
  const token = localStorage.getItem("authToken");
  const user = localStorage.getItem("user");
  
  console.log("🔍 Testing User Data:");
  console.log("Token:", token ? "✅ Present" : "❌ Missing");
  console.log("User:", user ? "✅ Present" : "❌ Missing");
  
  if (user) {
    try {
      const userData = JSON.parse(user);
      console.log("User Data:", userData);
      console.log("Name:", userData.name || "❌ No name");
      console.log("Email:", userData.email || "❌ No email");
      console.log("Role:", userData.role || "❌ No role");
    } catch (error) {
      console.error("❌ Error parsing user data:", error);
    }
  }
  
  return { token, user };
};

// Test function để simulate login
export const simulateLogin = () => {
  const mockUserData = {
    name: "Test User",
    email: "test@example.com",
    role: "CUSTOMER",
    accountId: "12345",
    phone: "0123456789"
  };
  
  const mockToken = "mock-jwt-token-12345";
  
  localStorage.setItem("authToken", mockToken);
  localStorage.setItem("user", JSON.stringify(mockUserData));
  
  console.log("✅ Simulated login with mock data");
  return mockUserData;
};

// Clear user data
export const clearUserData = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");
  console.log("✅ Cleared user data");
};
