import React, { useState, useRef, useEffect } from 'react';
import { Upload, Send } from 'lucide-react';

const PetAIAssistant = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      text: 'Xin chào! Tôi là trợ lý AI chăm sóc thú cưng. Tôi có thể giúp bạn về dinh dưỡng, sức khỏe và chăm sóc Nora! 🐕'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const petData = {
    petName: "Nora",
    species: "dog",
    breed: "Husky",
    weightKg: 22,
    ageStage: "growing",
    ageYears: 1.2,
    sex: "female",
    measurements: {
      waistCm: 54,
      legCm: 28
    },
    habits: [
      { icon: "🌅", text: "hoạt động buổi sáng" },
      { icon: "🔇", text: "nhạy cảm tiếng ồn" }
    ],
    dietPreferences: [
      { icon: "🦴", text: "ưa xương bò" },
      { icon: "🍗", text: "ưa vị gà" },
      { icon: "🚫", text: "không ngũ cốc" }
    ],
    allergies: [
      { icon: "⚠️", text: "bò sữa" }
    ],
    playStyle: [
      { icon: "🎾", text: "kéo co" },
      { icon: "⭐", text: "đuổi bắt" }
    ],
    goals: [
      { icon: "✨", text: "lông mượt", color: "cyan" },
      { icon: "💪", text: "tăng cơ nhẹ", color: "orange" }
    ]
  };

  const aiResponses = [
    "Với Nora là Husky, tôi khuyên bạn nên tập thể dục ít nhất 2 giờ mỗi ngày!",
    "Vì Nora dị ứng bò sữa, hãy tránh các sản phẩm có chứa whey và casein.",
    "Để lông mượt hơn, bổ sung Omega-3 từ dầu cá sẽ rất tốt cho Nora!",
    "Husky cần nhiều hoạt động! Hãy đưa Nora đi dạo vào buổi sáng mát mẻ.",
    "Với mục tiêu tăng cơ, protein từ gà và cá hồi là lựa chọn tuyệt vời!",
    "Nora nhạy cảm với tiếng ồn, hãy tạo môi trường yên tĩnh khi nghỉ ngơi.",
    "Xương bò là món ưa thích, nhưng nhớ chọn xương lớn để tránh nguy hiểm!",
    "Chơi kéo co và đuổi bắt giúp Nora phát triển cơ bắp rất tốt đấy!"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    const newMessage = {
      id: messages.length + 1,
      type: 'user',
      text: inputValue
    };

    setMessages([...messages, newMessage]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const aiResponse = {
        id: messages.length + 2,
        type: 'ai',
        text: aiResponses[Math.floor(Math.random() * aiResponses.length)]
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1500 + Math.random() * 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageMessage = {
          id: messages.length + 1,
          type: 'user',
          image: event.target.result
        };
        setMessages([...messages, imageMessage]);
        
        setTimeout(() => {
          const aiResponse = {
            id: messages.length + 2,
            type: 'ai',
            text: "Tôi đã nhận được ảnh của Nora! Đây là một chú chó Husky đẹp. Tôi có thể giúp gì thêm không?"
          };
          setMessages(prev => [...prev, aiResponse]);
        }, 2000);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 p-4 flex items-center justify-center">
      <div className="flex flex-col lg:flex-row gap-4 max-w-7xl w-full">
        
        {/* LEFT SECTION - Chat */}
        <div className="flex flex-col gap-4 w-full lg:w-[500px]">
          
          {/* Upload Section */}
          <div className="bg-indigo-800/40 backdrop-blur-md rounded-3xl p-8 flex items-center justify-center gap-8 border border-indigo-500/30">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-28 h-28 rounded-full bg-indigo-700/50 border-4 border-cyan-400 flex items-center justify-center hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(34,211,238,0.6)] relative group"
            >
              <div className="absolute inset-0 rounded-full border-4 border-cyan-400/30 animate-ping"></div>
              <Upload className="w-12 h-12 text-cyan-400 relative z-10" />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-8 py-3 bg-indigo-600/60 text-white font-semibold rounded-2xl border-2 border-indigo-400/50 hover:bg-indigo-600/80 hover:border-indigo-400 transition-all duration-300"
            >
              Upload Pet Photo
            </button>
          </div>

          {/* Chat Box */}
          <div className="bg-indigo-800/40 backdrop-blur-md rounded-3xl overflow-hidden border border-indigo-500/30 flex flex-col h-[600px]">
            
            {/* Header */}
            <div className="bg-indigo-700/40 p-5 flex items-center gap-3 border-b border-indigo-500/30">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-2xl shadow-lg">
                🐾
              </div>
              <div className="flex-1">
                <h3 className="text-white font-bold text-lg">Pet AI Assistant</h3>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 font-medium">Sẵn sàng tư vấn</span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4">
              {messages.map((message, index) => (
                <div
                  key={message.id}
                  className={`flex gap-3 animate-[slideUp_0.3s_ease-out] ${
                    message.type === 'user' ? 'flex-row-reverse' : ''
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-2xl text-white text-sm leading-relaxed ${
                      message.type === 'ai'
                        ? 'bg-indigo-600/60 backdrop-blur-sm border border-indigo-400/30 rounded-tl-sm'
                        : 'bg-gradient-to-br from-purple-500 to-indigo-500 rounded-tr-sm shadow-lg'
                    }`}
                  >
                    {message.image ? (
                      <img src={message.image} alt="Uploaded" className="max-w-[250px] rounded-xl" />
                    ) : (
                      message.text
                    )}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-3 animate-[slideUp_0.3s_ease-out]">
                  <div className="bg-indigo-600/60 backdrop-blur-sm border border-indigo-400/30 rounded-2xl rounded-tl-sm p-4 flex gap-1.5">
                    <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
                    <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-5 border-t border-indigo-500/30 bg-indigo-700/20">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Hỏi về chăm sóc thú cưng..."
                  className="flex-1 bg-indigo-900/40 text-white placeholder-indigo-300/60 px-5 py-3.5 rounded-full border border-indigo-400/30 outline-none focus:border-indigo-400 focus:bg-indigo-900/60 transition-all duration-300"
                />
                <button
                  onClick={handleSendMessage}
                  className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-blue-500/50"
                >
                  <Send className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SECTION - Pet Profile */}
        <div className="w-full lg:w-[420px] h-[732px] bg-gradient-to-br from-teal-600 via-teal-700 to-slate-900 rounded-3xl overflow-y-auto shadow-2xl border-r-8 border-yellow-400">
          <div className="p-6 space-y-4">
            
            {/* Measurements Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-teal-800/40 backdrop-blur-sm rounded-2xl p-4 border border-teal-500/30">
                <div className="text-teal-300 text-xs font-medium mb-1">Eo</div>
                <div className="text-white text-2xl font-bold">{petData.measurements.waistCm} cm</div>
              </div>
              <div className="bg-teal-800/40 backdrop-blur-sm rounded-2xl p-4 border border-teal-500/30">
                <div className="text-teal-300 text-xs font-medium mb-1">Chân</div>
                <div className="text-white text-2xl font-bold">{petData.measurements.legCm} cm</div>
              </div>
            </div>

            {/* Thói Quen Section */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-5 bg-cyan-400 rounded-full"></div>
                <h3 className="text-cyan-400 text-sm font-bold uppercase tracking-wider">Thói Quen</h3>
              </div>
              <div className="space-y-2">
                {petData.habits.map((habit, index) => (
                  <div key={index} className="bg-slate-800/60 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-slate-600/40 flex items-center gap-2">
                    <span className="text-lg">{habit.icon}</span>
                    <span className="text-white text-sm font-medium">{habit.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sở Thích Ăn Uống Section */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-5 bg-cyan-400 rounded-full"></div>
                <h3 className="text-cyan-400 text-sm font-bold uppercase tracking-wider">Sở Thích Ăn Uống</h3>
              </div>
              <div className="space-y-2">
                {petData.dietPreferences.map((pref, index) => (
                  <div key={index} className="bg-slate-800/60 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-slate-600/40 flex items-center gap-2">
                    <span className="text-lg">{pref.icon}</span>
                    <span className="text-white text-sm font-medium">{pref.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dị Ứng Section */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-5 bg-cyan-400 rounded-full"></div>
                <h3 className="text-cyan-400 text-sm font-bold uppercase tracking-wider">Dị Ứng</h3>
              </div>
              <div className="space-y-2">
                {petData.allergies.map((allergy, index) => (
                  <div key={index} className="bg-red-900/40 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-red-600/40 flex items-center gap-2">
                    <span className="text-lg">{allergy.icon}</span>
                    <span className="text-white text-sm font-medium">{allergy.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Phong Cách Chơi Section */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-5 bg-cyan-400 rounded-full"></div>
                <h3 className="text-cyan-400 text-sm font-bold uppercase tracking-wider">Phong Cách Chơi</h3>
              </div>
              <div className="space-y-2">
                {petData.playStyle.map((style, index) => (
                  <div key={index} className="bg-slate-800/60 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-slate-600/40 flex items-center gap-2">
                    <span className="text-lg">{style.icon}</span>
                    <span className="text-white text-sm font-medium">{style.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mục Tiêu Section */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-5 bg-cyan-400 rounded-full"></div>
                <h3 className="text-cyan-400 text-sm font-bold uppercase tracking-wider">Mục Tiêu</h3>
              </div>
              <div className="space-y-3">
                {petData.goals.map((goal, index) => (
                  <div key={index} className={`bg-slate-800/60 backdrop-blur-sm p-4 rounded-2xl border ${
                    goal.color === 'cyan' ? 'border-cyan-500/40' : 'border-orange-500/40'
                  } flex items-center gap-3`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                      goal.color === 'cyan' ? 'bg-cyan-500' : 'bg-orange-500'
                    }`}>
                      {goal.icon}
                    </div>
                    <span className="text-white text-base font-semibold">{goal.text}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default PetAIAssistant;