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
            // Lightweight star count
            const N = Math.min(80, Math.floor((canvas.width * canvas.height) / 16000));
            stars = Array.from({ length: N }, () => ({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: Math.random() * 1.2 + 0.3,
                opacity: Math.random() * 0.5 + 0.2,
                speed: Math.random() * 0.02 + 0.005,
                twinklePeriod: Math.random() * 3000 + 1500,
                twinkleOffset: Math.random() * 6000,
            }));
        };

        resize();
        window.addEventListener('resize', resize);

        let lastDraw = 0;
        const frameInterval = 1000 / 25; // 25 FPS max to preserve CPU/battery

        const draw = (time: number) => {
            animId = requestAnimationFrame(draw);
            if (time - lastDraw < frameInterval) return;
            lastDraw = time;

            if (!canvas || !ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Stars
            for (const s of stars) {
                const t = (time + s.twinkleOffset) % s.twinklePeriod / s.twinklePeriod;
                const twinkle = s.opacity * (0.6 + 0.4 * Math.sin(t * Math.PI * 2));
                ctx.fillStyle = `rgba(244,247,255,${twinkle.toFixed(2)})`;
                ctx.fillRect(s.x, s.y, s.r * 1.8, s.r * 1.8);
            }
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
