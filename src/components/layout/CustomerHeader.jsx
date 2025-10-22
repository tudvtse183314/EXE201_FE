// src/components/layout/CustomerHeader.jsx
import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { User } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import SvgLogo from "../common/SvgLogo";
import Shuffle from "../effects/Shuffle";

// Nếu bạn có /customer/home thì giữ nguyên, nếu không có thì dùng "/customer"
const CUSTOMER_HOME = "/customer/home";

export default function CustomerHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Các item trong khu vực customer
  const items = [
    { label: "Home", path: CUSTOMER_HOME, requiresAuth: true },                     // Trang chính khu vực customer
    { label: "Orders", path: "/customer/orders", requiresAuth: true },
    { label: "My Pets", path: "/customer/my-pets", requiresAuth: true },            // hoặc /my-pets nếu bạn đã map sẵn
    { label: "Profile", path: "/customer/account-profile", requiresAuth: true },
    { label: "AI Analysis", path: "/customer/ai-analysis", requiresAuth: true },    // đổi path cho khớp router của bạn
    // Public (nếu muốn giữ ngay trong customer header)
    { label: "Shop", path: "/shop", requiresAuth: false },
    { label: "Contact", path: "/contact", requiresAuth: false },
  ];

  const goto = (item) => {
    if (item.requiresAuth && !user) {
      navigate("/login", { state: { from: location } });
      setMobileOpen(false);
      return;
    }
    navigate(item.path);
    setMobileOpen(false);
  };

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  const handleLogout = () => {
    logout();
    navigate("/"); // rời khu vực customer về trang chủ public
  };

  return (
    <header className="w-full bg-black text-white shadow relative">
      <nav className="bg-gray-900/70 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-16 flex items-center justify-between">
            {/* Logo & brand */}
            <div className="flex items-center gap-3">
              <SvgLogo
                size="medium"
                variant="white"
                onClick={() => goto({ path: CUSTOMER_HOME, requiresAuth: true })}
                className="cursor-pointer"
              />
              <button
                className="text-lg sm:text-xl font-semibold text-cyan-400"
                onClick={() => goto({ path: CUSTOMER_HOME, requiresAuth: true })}
              >
                Pawfect Match
              </button>

              {/* chào user */}
              <div className="hidden md:block ml-3 text-sm">
                <Shuffle
                  text={`Hi, ${(user?.fullName || user?.name || user?.email || "Pet Parent").split(" ")[0]}`}
                  shuffleDirection="left"
                  duration={0.4}
                  ease="power3.out"
                  stagger={0.03}
                  glowColor="#22d3ee"
                />
              </div>
            </div>

            {/* Desktop menu */}
            <div className="hidden md:flex items-center gap-2">
              {items.map((it) => (
                <motion.button
                  key={it.path}
                  whileHover={{ scale: 1.06, y: -1 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => goto(it)}
                  className={`px-3 py-2 text-sm rounded-lg transition ${
                    isActive(it.path)
                      ? "text-cyan-400 bg-cyan-400/20 border border-cyan-400"
                      : "text-gray-300 hover:text-white hover:bg-gray-700"
                  }`}
                  title={it.requiresAuth && !user ? "Bạn cần đăng nhập" : undefined}
                >
                  {it.label}
                </motion.button>
              ))}

              {/* user box */}
              <div className="flex items-center gap-2 ml-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 grid place-items-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm text-gray-300">
                  {user?.fullName || user?.name || user?.email || "User"}
                </span>
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: "#ef4444" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="ml-2 text-sm font-medium px-3 py-2 bg-gray-700 hover:bg-red-600 rounded-lg"
                >
                  Logout
                </motion.button>
              </div>
            </div>

            {/* Mobile button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileOpen((s) => !s)}
              aria-label="Toggle menu"
            >
              <div className="w-6 h-0.5 bg-cyan-400 mb-1" />
              <div className="w-6 h-0.5 bg-cyan-400 mb-1" />
              <div className="w-6 h-0.5 bg-cyan-400" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-gray-900/95 backdrop-blur">
          <div className="px-4 py-3 space-y-2">
            {items.map((it) => (
              <button
                key={it.path}
                onClick={() => goto(it)}
                className={`block w-full text-left px-3 py-2 text-sm rounded-lg ${
                  isActive(it.path)
                    ? "text-cyan-400 bg-cyan-400/20"
                    : "text-gray-300 hover:text-white hover:bg-gray-700"
                }`}
                title={it.requiresAuth && !user ? "Bạn cần đăng nhập" : undefined}
              >
                {it.label}
              </button>
            ))}

            <div className="pt-3 border-t border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 grid place-items-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm text-gray-300">
                  {user?.fullName || user?.name || user?.email || "User"}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="text-sm font-medium px-3 py-2 bg-gray-700 hover:bg-red-600 rounded-lg"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
