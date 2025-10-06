import { useRef } from "react"
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"

/**
 * Shuffle Component - Animated text with shuffle effect and glow
 * @param {string} text - Text to animate
 * @param {string} shuffleDirection - Direction of shuffle animation ("left" | "right" | "up" | "down")
 * @param {number} duration - Animation duration in seconds
 * @param {string} ease - GSAP easing function
 * @param {number} stagger - Delay between each character animation
 * @param {string} glowColor - Color for the glow effect
 */
export default function Shuffle({
  text,
  shuffleDirection = "up",
  duration = 0.5,
  ease = "power3.out",
  stagger = 0.03,
  glowColor = "#a855f7", // purple neon
}) {
  const container = useRef(null)

  useGSAP(() => {
    const chars = container.current?.querySelectorAll(".shuffle-char")

    if (chars) {
      // Set initial position based on direction
      let initialY = 0
      let initialX = 0
      
      switch (shuffleDirection) {
        case "up":
          initialY = 100
          break
        case "down":
          initialY = -100
          break
        case "left":
          initialX = 100
          break
        case "right":
          initialX = -100
          break
        default:
          initialY = 100
          break
      }

      // Shuffle animation
      gsap.fromTo(
        chars,
        { 
          yPercent: initialY, 
          xPercent: initialX,
          opacity: 0 
        },
        {
          yPercent: 0,
          xPercent: 0,
          opacity: 1,
          duration,
          ease,
          stagger,
        }
      )

      // Glow effect (pulse light)
      gsap.to(chars, {
        textShadow: `0 0 8px ${glowColor}, 0 0 16px ${glowColor}`,
        repeat: -1,
        yoyo: true,
        duration: 1.5,
        ease: "power1.inOut",
      })
    }
  }, [text, shuffleDirection, duration, ease, stagger, glowColor])

  return (
    <div
      ref={container}
      className="inline-block overflow-hidden cursor-default select-none"
    >
      {text.split("").map((char, i) => (
        <span
          key={i}
          className="shuffle-char inline-block font-bold tracking-wide"
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </div>
  )
}

/**
 * Shuffle.jsx
 * - Animates text letters using GSAP (shuffle-in effect)
 * - Adds neon glow that pulses continuously
 * - Ideal for animated titles or headers
 * - Supports multiple shuffle directions
 */
