import React from "react";
import { logo } from "../../assets/images"; // ✅ Import từ index.js

const SvgLogo = ({
  size = "medium", // "small", "medium", "large", hoặc số cụ thể
  className = "",
  onClick = null,
  variant = "default", // default, white, dark
}) => {
  // Định nghĩa kích thước phù hợp với header
  const sizeClasses = {
    small: 36,    // 36px - Nhỏ
    medium: 48,   // 48px - Vừa phải cho header (80px)
    large: 56,    // 56px - Lớn
    xlarge: 64,   // 64px - Rất lớn
  };

  // Lấy kích thước thực tế
  const actualSize = typeof size === 'string' ? sizeClasses[size] || 48 : size;

  const variantClasses = {
    default: "border border-gray-200 shadow-sm",
    white: "border border-white shadow-md",
    dark: "border border-gray-800 shadow-md",
  };

  return (
    <div
      className={`
        rounded-full overflow-hidden cursor-pointer 
        transition-all duration-300 hover:scale-105 hover:shadow-lg
        ${variantClasses[variant]} ${className}
      `}
      style={{ width: actualSize, height: actualSize }}
      onClick={onClick}
    >
      <img
        src={logo}
        alt="Pawfect Match Logo"
        className="w-full h-full object-cover"
        onLoad={() => console.log('Logo JPG loaded successfully:', logo)}
      />
    </div>
  );
};

export default SvgLogo;
