import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const DashboardLayout: React.FC = () => {
    return (
        <>
            {/* Unified Top Navigation */}
            <Navbar />

            {/* Main Page Layout matching AI Insights and site-wide container conventions */}
            <div style={{ position: 'relative', zIndex: 1, paddingTop: 80, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <main className="container" style={{ paddingTop: '1rem', paddingBottom: '4rem', flex: 1, minWidth: 0 }}>
                    <Outlet />
                </main>
                <Footer />
            </div>
        </>
    );
};

