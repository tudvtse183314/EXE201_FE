// src/services/geminiDirect.js
// Service để gọi Google Gemini API trực tiếp từ frontend (không qua backend)

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

/**
 * Gọi Gemini API trực tiếp từ frontend
 * @param {string} message - Tin nhắn của user
 * @param {Array} history - Lịch sử chat (optional)
 * @param {Object} contextData - Dữ liệu context (optional)
 * @returns {Promise<string>} - Response text từ Gemini
 */
export const chatWithGemini = async (message, history = [], contextData = {}) => {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key chưa được cấu hình. Vui lòng thêm REACT_APP_GEMINI_API_KEY vào file .env');
  }

  try {
    // Chuẩn bị lịch sử chat cho Gemini
    const contents = [];
    
    // Thêm lịch sử chat nếu có (tối đa 10 tin nhắn gần nhất để tránh token limit)
    const recentHistory = history.slice(-10);
    recentHistory.forEach(msg => {
      if (msg.role === 'user' && msg.text) {
        contents.push({
          role: 'user',
          parts: [{ text: msg.text }]
        });
      } else if (msg.role === 'assistant' && msg.text) {
        contents.push({
          role: 'model',
          parts: [{ text: msg.text }]
        });
      }
    });

    // Thêm tin nhắn hiện tại
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    // System instruction với context
    const systemInstruction = `Bạn là một trợ lý AI thân thiện và hữu ích cho PetVibe - một cửa hàng thú cưng trực tuyến.
Hãy trả lời bằng tiếng Việt một cách tự nhiên và thân thiện.
Nếu được hỏi về sản phẩm, dịch vụ, hoặc thông tin về PetVibe, hãy cung cấp thông tin hữu ích.
${contextData.page ? `Người dùng đang ở trang: ${contextData.page}` : ''}`;

    const requestBody = {
      contents: contents,
      systemInstruction: {
        parts: [{ text: systemInstruction }]
      },
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    };

    console.log('🤖 Gemini Direct: Sending request', {
      messageLength: message.length,
      historyLength: history.length,
      contentsLength: contents.length
    });

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('🤖 Gemini Direct: API Error', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      
      if (response.status === 400) {
        throw new Error('Yêu cầu không hợp lệ. Vui lòng kiểm tra lại tin nhắn.');
      } else if (response.status === 401 || response.status === 403) {
        throw new Error('API key không hợp lệ hoặc không có quyền truy cập.');
      } else if (response.status === 429) {
        throw new Error('Đã vượt quá giới hạn API. Vui lòng thử lại sau.');
      } else {
        throw new Error(`Lỗi từ Gemini API: ${response.statusText}`);
      }
    }

    const data = await response.json();
    
    console.log('🤖 Gemini Direct: Response received', {
      hasCandidates: !!data.candidates,
      candidateCount: data.candidates?.length
    });

    // Lấy text từ response
    if (data.candidates && data.candidates.length > 0) {
      const candidate = data.candidates[0];
      if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
        const text = candidate.content.parts[0].text;
        return text;
      }
    }

    throw new Error('Không nhận được phản hồi từ Gemini API.');
  } catch (error) {
    console.error('🤖 Gemini Direct: Error', {
      message: error.message,
      stack: error.stack
    });
    
    // Nếu là lỗi network
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      throw new Error('Không thể kết nối đến Gemini API. Vui lòng kiểm tra kết nối mạng.');
    }
    
    throw error;
  }
};

/**
 * Chat với Gemini (streaming - không hỗ trợ trực tiếp từ frontend, cần dùng stream API)
 * Tạm thời không implement streaming vì Gemini API streaming cần backend proxy
 */
export const chatWithGeminiStream = async (message, history = [], contextData = {}, onChunk) => {
  // Streaming không được hỗ trợ trực tiếp từ frontend do CORS
  // Cần dùng non-streaming version
  const response = await chatWithGemini(message, history, contextData);
  onChunk?.(response);
  return response;
};

export default {
  chatWithGemini,
  chatWithGeminiStream,
};

