import React from 'react';

interface LogoProps {
    size?: number;
    showText?: boolean;
    className?: string;
}

export const AstroCareLogo: React.FC<LogoProps> = ({ size = 36, showText = true, className = '' }) => (
    <div className={`flex items-center gap-3 ${className}`} style={{ userSelect: 'none' }}>
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            {/* Outer orbit ring */}
            <ellipse cx="20" cy="20" rx="17" ry="8" stroke="#53E7FF" strokeWidth="1.2" strokeDasharray="3 2" opacity="0.7"
                style={{ animation: 'orbitPulse 3s ease-in-out infinite' }}
            />
            {/* Inner orbit ring (rotated) */}
            <ellipse cx="20" cy="20" rx="17" ry="8" stroke="#9275FF" strokeWidth="0.8"
                transform="rotate(60 20 20)" opacity="0.4"
            />
            {/* Center star */}
            <circle cx="20" cy="20" r="5" fill="#0B1026" stroke="#53E7FF" strokeWidth="1.5" />
            <circle cx="20" cy="20" r="2.5" fill="#53E7FF" opacity="0.9" />
            {/* Pulse line (medical) */}
            <path d="M8 20 L12 20 L14 16 L16 24 L18 18 L20 20 L32 20"
                stroke="#5DF2B4" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.9"
            />
            {/* Satellite dot */}
            <circle cx="37" cy="20" r="2" fill="#9275FF" opacity="0.8" />
        </svg>
        {showText && (
            <div>
                <div style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    letterSpacing: '-0.02em',
                    color: '#F4F7FF',
                    lineHeight: 1,
                }}>
                    ASTRO<span style={{ color: '#53E7FF' }}>CARE</span>
                </div>
                <div style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '0.55rem',
                    color: '#91A0BE',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    lineHeight: 1.3,
                }}>
                    ALGOX · MISSION HEALTH
                </div>
            </div>
        )}
    </div>
);
