import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

// Debug: Log API key status (chỉ log trong development, không log key thật)
if (process.env.NODE_ENV === 'development') {
  console.log('🔑 Gemini SDK API Key Status:', {
    hasKey: !!API_KEY,
    keyLength: API_KEY ? API_KEY.length : 0,
    keyPrefix: API_KEY ? API_KEY.substring(0, 10) + '...' : 'N/A',
    envVar: process.env.REACT_APP_GEMINI_API_KEY ? 'Found' : 'Not found'
  });
}

if (!API_KEY) {
  console.error('❌ Gemini API Key Error:', {
    envVar: process.env.REACT_APP_GEMINI_API_KEY,
    allEnvKeys: Object.keys(process.env).filter(k => k.includes('GEMINI')),
    nodeEnv: process.env.NODE_ENV
  });
  throw new Error("Gemini API key chưa được cấu hình. Vui lòng thêm REACT_APP_GEMINI_API_KEY vào .env và RESTART dev server");
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function generateContent(prompt) {
  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    console.error("Gemini error:", err);
    
    // Xử lý lỗi API key expired/invalid
    const errorMessage = err?.message || '';
    const errorCode = err?.status || err?.code;
    
    if (errorMessage.includes('API key expired') || errorMessage.includes('API_KEY_INVALID') || errorCode === 400) {
      throw new Error('🔑 API key đã hết hạn hoặc không hợp lệ. Vui lòng:\n1. Kiểm tra API key trong file .env.local\n2. Tạo API key mới tại https://aistudio.google.com/apikey\n3. Cập nhật REACT_APP_GEMINI_API_KEY trong .env.local\n4. Restart dev server (npm start)');
    }
    
    if (errorMessage.includes('API key') || errorCode === 401 || errorCode === 403) {
      throw new Error('🔑 API key không hợp lệ. Vui lòng kiểm tra lại REACT_APP_GEMINI_API_KEY trong .env.local và restart dev server.');
    }
    
    throw err;
  }
}

