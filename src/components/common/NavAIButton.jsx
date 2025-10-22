// src/components/common/NavAIButton.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function NavAIButton({ size = 'desktop' }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/ai-analysis');
  };

  // Điều chỉnh kích thước để bao phủ hết chữ "AI Analysis"
  const buttonWidth = size === 'mobile' ? '120px' : '140px';
  const buttonHeight = size === 'mobile' ? '40px' : '48px';
  const textSize = size === 'mobile' ? '12px' : '14px';

  return (
    <button
      className="group relative outline-0 bg-sky-200 border border-solid border-transparent rounded-xl flex items-center justify-center cursor-pointer transition-transform duration-200 active:scale-[0.95] bg-[linear-gradient(45deg,#efad21,#ffd60f)] [box-shadow:#3c40434d_0_1px_2px_0,#3c404326_0_2px_6px_2px,#0000004d_0_30px_60px_-30px,#34343459_0_-2px_6px_0_inset] focus:ring-2 focus:ring-eda274 focus:ring-offset-2"
      style={{
        '--sz-btn': buttonHeight,
        '--space': `calc(${buttonHeight}/5.5)`,
        '--gen-sz': `calc(var(--space)*2)`,
        '--sz-text': `calc(${buttonHeight}-var(--gen-sz))`,
        height: buttonHeight,
        width: buttonWidth,
        padding: '0 16px'
      }}
      onClick={handleClick}
      aria-label="AI Analysis"
    >
      <svg
        className="animate-pulse absolute z-10 overflow-visible transition-all duration-300 text-[#ffea50] group-hover:text-white"
        style={{
          top: '50%',
          left: '12px',
          transform: 'translateY(-50%)',
          height: 'var(--gen-sz)',
          width: 'var(--gen-sz)'
        }}
        stroke="none"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5zM16.5 15a.75.75 0 01.712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 010 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 01-1.422 0l-.395-1.183a1.5 1.5 0 00-.948-.948l-1.183-.395a.75.75 0 010-1.422l1.183-.395c.447-.15.799-.5-.948-.948l.395-1.183A.75.75 0 0116.5 15z"
        />
      </svg>
      <span
        className="font-extrabold leading-none text-white transition-all duration-200 group-hover:opacity-0 ml-2"
        style={{ fontSize: textSize }}
      >
        AI Analysis
      </span>
    </button>
  );
}
