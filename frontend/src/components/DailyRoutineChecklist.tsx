import React, { useState, useEffect } from 'react';
import {
    CheckCircle2, Circle, Flame, Award, Clock, ArrowRight, Shield,
    Droplets, Moon, Dumbbell, Activity, CheckSquare
} from 'lucide-react';
import {
    loadDailyRoutine,
    toggleRoutineItem,
    type RoutineDayState,
    type DailyRoutineItem
} from '@/services/routineChecklistService';
import {
    loadGamificationState,
    type GamificationState
} from '@/services/gamificationService';

export const DailyRoutineChecklist: React.FC<{ astronautId?: string }> = ({ astronautId = 'ASTRO-01' }) => {
    const [routineState, setRoutineState] = useState<RoutineDayState>(() => loadDailyRoutine(astronautId));
    const [gamificationState, setGamificationState] = useState<GamificationState>(() => loadGamificationState(astronautId));

    useEffect(() => {
        setRoutineState(loadDailyRoutine(astronautId));
        setGamificationState(loadGamificationState(astronautId));
    }, [astronautId]);

    const handleToggle = (itemId: string) => {
        const updated = toggleRoutineItem(astronautId, itemId);
        setRoutineState(updated);
        // Refresh gamification state
        setGamificationState(loadGamificationState(astronautId));
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'vitals': return <Activity size={14} color="var(--electric-cyan)" />;
            case 'wellbeing': return <Moon size={14} color="var(--purple-haze)" />;
            case 'exercise': return <Dumbbell size={14} color="var(--success-mint)" />;
            case 'nutrition': return <Droplets size={14} color="var(--electric-cyan)" />;
            case 'eva': return <Shield size={14} color="var(--warning-amber)" />;
            default: return <Clock size={14} />;
        }
    };

    return (
        <div className="glass-card" style={{ padding: '1.75rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <span className="telemetry-label" style={{ color: 'var(--electric-cyan)' }}>FLIGHT DAY HEALTH CHECKLIST</span>
                        <span style={{ color: 'var(--text-muted)' }}>•</span>
                        <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                            SOL 142 • {routineState.date}
                        </span>
                    </div>
                    <h3 style={{ fontSize: '1.2rem', color: 'var(--stellar-white)', margin: 0 }}>
                        Mission Daily Protocols & Wellness Engagement
                    </h3>
                </div>

                {/* Gamification Streak & Points Pill */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        padding: '0.35rem 0.75rem',
                        borderRadius: 'var(--radius-md)',
                        background: 'rgba(255, 100, 124, 0.15)',
                        border: '1px solid rgba(255, 100, 124, 0.35)',
                        fontSize: '0.8rem',
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--critical-coral)',
                    }}>
                        <Flame size={15} />
                        <span>{gamificationState.currentStreakDays} DAY STREAK</span>
                    </div>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        padding: '0.35rem 0.75rem',
                        borderRadius: 'var(--radius-md)',
                        background: 'rgba(93, 242, 180, 0.15)',
                        border: '1px solid rgba(93, 242, 180, 0.35)',
                        fontSize: '0.8rem',
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--success-mint)',
                    }}>
                        <Award size={15} />
                        <span>{gamificationState.weeklyPointsEarned} PTS</span>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.4rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Daily Routine Completion:</span>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--electric-cyan)', fontWeight: 600 }}>
                        {routineState.completionPercentage}% Complete
                    </span>
                </div>
                <div className="progress-bar" style={{ height: 8 }}>
                    <div
                        className="progress-bar-fill"
                        style={{
                            width: `${routineState.completionPercentage}%`,
                            background: routineState.completionPercentage === 100 ? 'var(--success-mint)' : 'var(--electric-cyan)',
                        }}
                    />
                </div>
            </div>

            {/* Checklist Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {routineState.items.map((item: DailyRoutineItem) => (
                    <div
                        key={item.id}
                        onClick={() => handleToggle(item.id)}
                        style={{
                            padding: '0.85rem 1rem',
                            borderRadius: 'var(--radius-md)',
                            background: item.completed ? 'rgba(93, 242, 180, 0.06)' : 'rgba(5, 8, 22, 0.65)',
                            border: `1px solid ${item.completed ? 'rgba(93, 242, 180, 0.25)' : 'rgba(83, 231, 255, 0.12)'}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '1rem',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                            <div style={{ color: item.completed ? 'var(--success-mint)' : 'var(--text-muted)' }}>
                                {item.completed ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                            </div>

                            <div>
                                <div style={{
                                    fontSize: '0.88rem',
                                    fontWeight: 500,
                                    color: item.completed ? 'var(--stellar-white)' : 'var(--text-secondary)',
                                    textDecoration: item.completed ? 'none' : 'none',
                                }}>
                                    {item.title}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 3 }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                        {getCategoryIcon(item.category)}
                                        {item.scheduledTime}
                                    </span>
                                    {item.notes && (
                                        <>
                                            <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>•</span>
                                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{item.notes}</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <span style={{
                            fontSize: '0.75rem',
                            fontFamily: 'var(--font-mono)',
                            color: item.completed ? 'var(--success-mint)' : 'var(--text-muted)',
                            background: item.completed ? 'rgba(93, 242, 180, 0.1)' : 'rgba(255, 255, 255, 0.04)',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            flexShrink: 0,
                        }}>
                            +{item.pointsReward} pts
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};
