import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
    const navigate = useNavigate();
    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
            <div style={{ maxWidth: 500 }}>
                {/* Lost satellite SVG */}
                <svg viewBox="0 0 200 200" style={{ width: 160, height: 160, margin: '0 auto 2rem', display: 'block' }}>
                    <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(83,231,255,0.1)" strokeWidth="1" strokeDasharray="6 4" />
                    <circle cx="100" cy="100" r="60" fill="none" stroke="rgba(146,117,255,0.1)" strokeWidth="1" />
                    {/* Satellite body */}
                    <rect x="85" y="88" width="30" height="24" rx="4" fill="rgba(17,28,61,0.9)" stroke="rgba(83,231,255,0.4)" strokeWidth="1.5" />
                    {/* Solar panels */}
                    <rect x="55" y="94" width="28" height="12" rx="2" fill="rgba(83,231,255,0.15)" stroke="rgba(83,231,255,0.3)" strokeWidth="1" />
                    <rect x="117" y="94" width="28" height="12" rx="2" fill="rgba(83,231,255,0.15)" stroke="rgba(83,231,255,0.3)" strokeWidth="1" />
                    {/* Antenna */}
                    <line x1="100" y1="88" x2="100" y2="72" stroke="rgba(145,160,190,0.5)" strokeWidth="1" />
                    <circle cx="100" cy="70" r="3" fill="none" stroke="rgba(255,100,124,0.6)" strokeWidth="1" />
                    {/* Signal lost */}
                    <text x="100" y="160" textAnchor="middle" fontFamily="JetBrains Mono,monospace" fontSize="10" fill="rgba(255,100,124,0.6)">SIGNAL LOST</text>
                </svg>

                <div className="section-eyebrow" style={{ marginBottom: '0.75rem' }}>ERROR 404</div>
                <h2 style={{ marginBottom: '0.75rem' }}>
                    Sector <span className="text-cyan">Not Found</span>
                </h2>
                <p style={{ marginBottom: '2rem' }}>
                    This sector of the mission console doesn't exist. The navigation coordinates may be incorrect or this page has been decommissioned.
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button className="btn btn-primary" onClick={() => navigate('/')}>
                        <Home size={14} /> Mission Home
                    </button>
                    <button className="btn btn-outline" onClick={() => navigate(-1)}>
                        <ArrowLeft size={14} /> Go Back
                    </button>
                </div>
            </div>
        </div>
    );
};
