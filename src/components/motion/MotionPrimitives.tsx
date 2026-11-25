import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// 1. Sliding Tab Indicator (Motion Primitives / Kokonut UI standard)
interface SlidingTabsProps {
  tabs: { id: string; label: React.ReactNode; badge?: string }[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
  activeColor?: string;
  layoutGroupId?: string;
}

export const SlidingTabs: React.FC<SlidingTabsProps> = ({
  tabs,
  activeId,
  onChange,
  className = '',
  activeColor = 'bg-[#FF6A00] text-white',
  layoutGroupId = 'sliding-pill'
}) => {
  return (
    <div className={`relative flex items-center p-1 rounded-2xl bg-slate-100 border border-slate-200 ${className}`}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`relative z-10 flex-1 flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors duration-200 ${
              isActive ? 'text-white' : 'text-slate-600 hover:text-[#111827]'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId={layoutGroupId}
                className={`absolute inset-0 rounded-xl shadow-md ${activeColor}`}
                transition={{ type: 'spring', stiffness: 500, damping: 38 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">{tab.label}</span>
            {tab.badge && (
              <span className={`relative z-10 text-[9px] uppercase px-1.5 py-0.2 rounded-full font-black ${
                isActive ? 'bg-black/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

// 2. Spotlight Card (Kokonut UI / Motion Primitives cursor radial glow)
interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  spotlightColor?: string;
  className?: string;
}

export const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  spotlightColor = 'rgba(255, 106, 0, 0.08)',
  className = '',
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden ${className}`}
      {...props}
    >
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 80%)`
        }}
      />
      {children}
    </div>
  );
};

// 3. Animated Counter (Smooth numbers transition)
export const AnimatedCounter: React.FC<{ value: number; prefix?: string; suffix?: string; duration?: number }> = ({
  value,
  prefix = '',
  suffix = '',
  duration = 800
}) => {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const startValue = displayValue;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startValue + (value - startValue) * easeProgress);
      setDisplayValue(current);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [value, duration]);

  return (
    <span>
      {prefix}
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  );
};

// 4. Springy Interactive Button (Anime.js / Motion Primitives micro-spring)
interface SpringButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export const SpringButton: React.FC<SpringButtonProps> = ({
  children,
  className = '',
  onClick,
  ...props
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.025 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      onClick={onClick}
      className={className}
      {...(props as any)}
    >
      {children}
    </motion.button>
  );
};
