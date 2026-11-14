import React, { useEffect, useRef } from 'react';

interface Star {
    x: number; y: number; r: number; opacity: number;
    speed: number; twinklePeriod: number; twinkleOffset: number;
}

export const StarfieldBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animId: number;
        let stars: Star[] = [];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            // regenerate stars on resize
            const N = Math.floor((canvas.width * canvas.height) / 8000);
            stars = Array.from({ length: N }, () => ({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: Math.random() * 1.5 + 0.2,
                opacity: Math.random() * 0.6 + 0.1,
                speed: Math.random() * 0.02 + 0.005,
                twinklePeriod: Math.random() * 3000 + 1500,
                twinkleOffset: Math.random() * 6000,
            }));
        };

        resize();
        window.addEventListener('resize', resize);

        const draw = (time: number) => {
            if (!canvas || !ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Subtle nebula gradients
            const g1 = ctx.createRadialGradient(canvas.width * 0.2, canvas.height * 0.3, 0, canvas.width * 0.2, canvas.height * 0.3, 300);
            g1.addColorStop(0, 'rgba(146,117,255,0.04)');
            g1.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = g1;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const g2 = ctx.createRadialGradient(canvas.width * 0.8, canvas.height * 0.6, 0, canvas.width * 0.8, canvas.height * 0.6, 250);
            g2.addColorStop(0, 'rgba(83,231,255,0.03)');
            g2.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = g2;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Stars
            for (const s of stars) {
                const t = (time + s.twinkleOffset) % s.twinklePeriod / s.twinklePeriod;
                const twinkle = s.opacity * (0.5 + 0.5 * Math.sin(t * Math.PI * 2));
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(244,247,255,${twinkle.toFixed(3)})`;
                ctx.fill();
            }

            animId = requestAnimationFrame(draw);
        };

        animId = requestAnimationFrame(draw);
        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed', inset: 0, zIndex: 0,
                pointerEvents: 'none', opacity: 0.9,
            }}
            aria-hidden="true"
        />
    );
};
