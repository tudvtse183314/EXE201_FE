import React, { useEffect } from 'react';

const LoadingSpinner = () => {
  useEffect(() => {
    // Inject CSS styles for Capybara loader
    const style = document.createElement('style');
    style.textContent = `
      .capybaraloader {
        width: 14em;
        height: 10em;
        position: relative;
        z-index: 1;
        --color: rgb(204, 125, 45);
        --color2: rgb(83, 56, 28);
        transform: scale(0.75);
      }
      .capybara {
        width: 100%;
        height: 7.5em;
        position: relative;
        z-index: 1;
      }
      .loader {
        width: 100%;
        height: 2.5em;
        position: relative;
        z-index: 1;
        overflow: hidden;
      }
      .capy {
        width: 85%;
        height: 100%;
        background: linear-gradient(var(--color), 90%, var(--color2));
        border-radius: 45%;
        position: relative;
        z-index: 1;
        animation: movebody 1s linear infinite;
      }
      .capyhead {
        width: 7.5em;
        height: 7em;
        bottom: 0em;
        right: 0em;
        position: absolute;
        background-color: var(--color);
        z-index: 3;
        border-radius: 3.5em;
        box-shadow: -1em 0em var(--color2);
        animation: movebody 1s linear infinite;
      }
      .capyear {
        width: 2em;
        height: 2em;
        background: linear-gradient(-45deg, var(--color), 90%, var(--color2));
        top: 0em;
        left: 0em;
        border-radius: 100%;
        position: absolute;
        overflow: hidden;
        z-index: 3;
      }
      .capyear:nth-child(2) {
        left: 5em;
        background: linear-gradient(25deg, var(--color), 90%, var(--color2));
      }
      .capyear2 {
        width: 100%;
        height: 1em;
        background-color: var(--color2);
        bottom: 0em;
        left: 0.5em;
        border-radius: 100%;
        position: absolute;
        transform: rotate(-45deg);
      }
      .capymouth {
        width: 3.5em;
        height: 2em;
        background-color: var(--color2);
        position: absolute;
        bottom: 0em;
        left: 2.5em;
        border-radius: 50%;
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: 0.5em;
      }
      .capylips {
        width: 0.25em;
        height: 0.75em;
        border-radius: 100%;
        transform: rotate(-45deg);
        background-color: var(--color);
      }
      .capylips:nth-child(2) {
        transform: rotate(45deg);
      }
      .capyeye {
        width: 2em;
        height: 0.5em;
        background-color: var(--color2);
        position: absolute;
        bottom: 3.5em;
        left: 1.5em;
        border-radius: 5em;
        transform: rotate(45deg);
      }
      .capyeye:nth-child(4) {
        transform: rotate(-45deg);
        left: 5.5em;
        width: 1.75em;
      }
      .capyleg {
        width: 6em;
        height: 5em;
        bottom: 0em;
        left: 0em;
        position: absolute;
        background: linear-gradient(var(--color), 95%, var(--color2));
        z-index: 2;
        border-radius: 2em;
        animation: movebody 1s linear infinite;
      }
      .capyleg2 {
        width: 1.75em;
        height: 3em;
        bottom: 0em;
        left: 3.25em;
        position: absolute;
        background: linear-gradient(var(--color), 80%, var(--color2));
        z-index: 2;
        border-radius: 0.75em;
        box-shadow: inset 0em -0.5em var(--color2);
        animation: moveleg 1s linear infinite;
      }
      .capyleg2:nth-child(3) {
        width: 1.25em;
        left: 0.5em;
        height: 2em;
        animation: moveleg2 1s linear infinite 0.075s;
      }

      @keyframes moveleg {
        0% {
          transform: rotate(-45deg) translateX(-5%);
        }
        50% {
          transform: rotate(45deg) translateX(5%);
        }
        100% {
          transform: rotate(-45deg) translateX(-5%);
        }
      }

      @keyframes moveleg2 {
        0% {
          transform: rotate(45deg);
        }
        50% {
          transform: rotate(-45deg);
        }
        100% {
          transform: rotate(45deg);
        }
      }

      @keyframes movebody {
        0% {
          transform: translateX(0%);
        }
        50% {
          transform: translateX(2%);
        }
        100% {
          transform: translateX(0%);
        }
      }

      .loaderline {
        width: 50em;
        height: 0.5em;
        border-top: 0.5em dashed var(--color2);
        animation: moveline 10s linear infinite;
      }

      @keyframes moveline {
        0% {
          transform: translateX(0%);
          opacity: 0%;
        }
        5% {
          opacity: 100%;
        }
        95% {
          opacity: 100%;
        }
        100% {
          opacity: 0%;
          transform: translateX(-70%);
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      // Cleanup on unmount
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-white min-h-screen flex items-center justify-center z-50">
      <div className="capybaraloader">
        <div className="capybara">
          <div className="capyhead">
            <div className="capyear">
              <div className="capyear2"></div>
            </div>
            <div className="capyear"></div>
            <div className="capymouth">
              <div className="capylips"></div>
              <div className="capylips"></div>
            </div>
            <div className="capyeye"></div>
            <div className="capyeye"></div>
          </div>
          <div className="capyleg"></div>
          <div className="capyleg2"></div>
          <div className="capyleg2"></div>
          <div className="capy"></div>
        </div>
        <div className="loader">
          <div className="loaderline"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
