// src/components/layout/MainLayout.jsx
import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import AIChatFloatingBot from "../common/AIChatFloatingBot";
import "../../components/common/AIChatFloatingBot.css";

export default function MainLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow bg-gray-50">
        {children}
      </main>

      <Footer />
      
      {/* AI Chat Floating Bot */}
      <AIChatFloatingBot />
    </div>
  );
}
