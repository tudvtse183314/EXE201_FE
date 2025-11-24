// src/config/antdTheme.js
// Cấu hình theme cho Ant Design phù hợp với màu chủ đề #eda274

import { theme } from 'antd';

export const antdThemeConfig = {
  algorithm: theme.defaultAlgorithm,
  token: {
    // Primary color - màu chủ đề
    colorPrimary: '#eda274',
    colorPrimaryHover: '#d5956d',
    colorPrimaryActive: '#c47256',
    
    // Success colors
    colorSuccess: '#52c41a',
    colorSuccessHover: '#73d13d',
    colorSuccessActive: '#389e0d',
    
    // Warning colors
    colorWarning: '#faad14',
    colorWarningHover: '#ffc53d',
    colorWarningActive: '#d48806',
    
    // Error colors
    colorError: '#ff4d4f',
    colorErrorHover: '#ff7875',
    colorErrorActive: '#cf1322',
    
    // Info colors
    colorInfo: '#1890ff',
    colorInfoHover: '#40a9ff',
    colorInfoActive: '#096dd9',
    
    // Border radius
    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusSM: 4,
    
    // Font - Sans-serif for Vietnamese
    fontFamily: "'Inter', 'Noto Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    fontSize: 14,
    fontSizeLG: 16,
    fontSizeSM: 12,
    
    // Spacing
    padding: 16,
    paddingLG: 24,
    paddingSM: 12,
    paddingXS: 8,
    
    // Shadows
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    boxShadowSecondary: '0 4px 12px rgba(0, 0, 0, 0.15)',
    
    // Colors
    colorText: '#362319',
    colorTextSecondary: '#666666',
    colorTextTertiary: '#999999',
    colorTextQuaternary: '#bfbfbf',
    
    // Background
    colorBgContainer: '#ffffff',
    colorBgElevated: '#fafafa',
    colorBgLayout: '#f5f5f5',
    colorBgSpotlight: '#f0f0f0',
    
    // Border
    colorBorder: '#d9d9d9',
    colorBorderSecondary: '#f0f0f0',
  },
  components: {
    Button: {
      primaryColor: '#ffffff',
      borderRadius: 8,
      fontWeight: 600,
      controlHeight: 40,
      controlHeightLG: 48,
      controlHeightSM: 32,
    },
    Card: {
      borderRadius: 12,
      paddingLG: 24,
    },
    Input: {
      borderRadius: 8,
      controlHeight: 40,
      controlHeightLG: 48,
      controlHeightSM: 32,
    },
    Select: {
      borderRadius: 8,
      controlHeight: 40,
    },
    Tag: {
      borderRadius: 6,
    },
    Table: {
      borderRadius: 8,
    },
    Modal: {
      borderRadius: 12,
    },
    Drawer: {
      borderRadius: 12,
    },
    Alert: {
      borderRadius: 8,
    },
    Badge: {
      borderRadius: 10,
    },
    Pagination: {
      borderRadius: 6,
    },
  },
};

