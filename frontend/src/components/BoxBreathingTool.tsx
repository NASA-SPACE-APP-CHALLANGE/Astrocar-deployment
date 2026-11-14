import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

export const BoxBreathingTool: React.FC = () => {
    const [isActive, setIsActive] = useState<boolean>(false);
    const [phase, setPhase] = useState<'inhale' | 'hold_in' | 'exhale' | 'hold_out'>('inhale');
    const [countdown, setCountdown] = useState<number>(4);
    const [cycleCount, setCycleCount] = useState<number>(0);

    const PHASE_DURATION = 4; // 4 seconds per phase

    useEffect(() => {
        let timer: any = null;
        if (isActive) {
            timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev > 1) {
                        return prev - 1;
                    }
                    // Transition phase
                    setPhase((currentPhase) => {
                        if (currentPhase === 'inhale') return 'hold_in';
                        if (currentPhase === 'hold_in') return 'exhale';
                        if (currentPhase === 'exhale') return 'hold_out';
                        // Complete cycle
                        setCycleCount((c) => c + 1);
                        return 'inhale';
                    });
                    return PHASE_DURATION;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isActive]);

    const handleReset = () => {
        setIsActive(false);
        setPhase('inhale');
        setCountdown(4);
        setCycleCount(0);
    };

    const getPhaseDescription = () => {
        switch (phase) {
            case 'inhale':
                return { title: 'INHALE SLOWLY', instruction: 'Deep breath through the nose, expanding diaphragm', scale: 1.35, color: 'var(--electric-cyan)' };
            case 'hold_in':
                return { title: 'HOLD LUNGS FULL', instruction: 'Maintain quiet fullness without muscular straining', scale: 1.35, color: 'var(--purple-haze)' };
            case 'exhale':
                return { title: 'EXHALE SMOOTHLY', instruction: 'Gentle complete release through parted lips', scale: 0.85, color: 'var(--success-mint)' };
            case 'hold_out':
                return { title: 'HOLD IN STILLNESS', instruction: 'Rest in tranquil emptiness before the next wave', scale: 0.85, color: 'var(--warning-amber)' };
        }
    };

    const currentInfo = getPhaseDescription();

    return (
        <div className="glass-card" style={{ padding: '1.75rem', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <span className="telemetry-label" style={{ color: 'var(--electric-cyan)' }}>AUTONOMIC COPING TOOL</span>
                        <span style={{ color: 'var(--text-muted)' }}>•</span>
                        <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>0.1 HZ VAGAL ENTRAINMENT</span>
                    </div>
                    <h3 style={{ fontSize: '1.2rem', color: 'var(--stellar-white)', margin: 0 }}>
                        Guided Box Breathing & Stress Modulation
                    </h3>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                        Standard NASA countermeasure to lower cortisol, stabilize heart rate variability (HRV), and counteract isolation stress.
                    </p>
                </div>

                <div style={{
                    padding: '0.4rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(5,8,22,0.6)',
                    border: '1px solid rgba(83,231,255,0.2)',
                    fontSize: '0.8rem',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--electric-cyan)',
                }}>
                    COMPLETED CYCLES: {cycleCount} / 10
                </div>
            </div>

            {/* Breathing Animation Canvas */}
            <div style={{
                height: 240,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                background: 'radial-gradient(circle at center, rgba(14,24,54,0.6) 0%, rgba(5,8,22,0.95) 100%)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid rgba(83,231,255,0.15)',
                overflow: 'hidden',
                margin: '1rem 0',
            }}>
                {/* Expanding / Contracting Halo */}
                <div style={{
                    width: 140,
                    height: 140,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${currentInfo.color}33 0%, ${currentInfo.color}05 70%, transparent 100%)`,
                    border: `2px solid ${currentInfo.color}`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: `scale(${isActive ? currentInfo.scale : 1.0})`,
                    transition: 'transform 3.8s ease-in-out, border-color 0.8s ease',
                    boxShadow: `0 0 30px ${currentInfo.color}44`,
                }}>
                    <span style={{
                        fontSize: '2.5rem',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700,
                        color: 'var(--stellar-white)',
                        lineHeight: 1,
                    }}>
                        {countdown}
                    </span>
                    <span style={{
                        fontSize: '0.68rem',
                        fontFamily: 'var(--font-mono)',
                        color: currentInfo.color,
                        marginTop: 4,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                    }}>
                        SECONDS
                    </span>
                </div>

                <div style={{
                    marginTop: '1.25rem',
                    textAlign: 'center',
                    zIndex: 2,
                }}>
                    <div style={{
                        fontSize: '1rem',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700,
                        color: currentInfo.color,
                        letterSpacing: '0.08em',
                    }}>
                        {currentInfo.title}
                    </div>
                    <div style={{
                        fontSize: '0.8rem',
                        color: 'var(--text-secondary)',
                        marginTop: 2,
                    }}>
                        {currentInfo.instruction}
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '1.25rem' }}>
                <button
                    type="button"
                    onClick={() => setIsActive(!isActive)}
                    className="btn-primary"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.65rem 1.75rem',
                        fontSize: '0.9rem',
                        minWidth: 150,
                        justifyContent: 'center',
                    }}
                >
                    {isActive ? <Pause size={16} /> : <Play size={16} />}
                    <span>{isActive ? 'Pause Session' : 'Start 4-4-4-4 Breathing'}</span>
                </button>

                <button
                    type="button"
                    onClick={handleReset}
                    className="btn-ghost"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.65rem 1.25rem' }}
                >
                    <RotateCcw size={15} />
                    <span>Reset</span>
                </button>
            </div>
        </div>
    );
};

