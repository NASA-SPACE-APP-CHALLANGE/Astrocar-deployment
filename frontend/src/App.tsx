import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { StarfieldBackground } from '@/components/StarfieldBackground';
import { Navbar } from '@/components/Navbar';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Footer } from '@/components/Footer';
import { ScrollToTop } from '@/components/ScrollToTop';

// Code-split dynamic page imports for optimal performance
const LandingPage = lazy(() => import('@/pages/LandingPage').then(m => ({ default: m.LandingPage })));
const LoginPage = lazy(() => import('@/pages/LoginPage').then(m => ({ default: m.LoginPage })));
const DashboardOverview = lazy(() => import('@/pages/DashboardOverview').then(m => ({ default: m.DashboardOverview })));
const HealthAnalyticsPage = lazy(() => import('@/pages/HealthAnalyticsPage').then(m => ({ default: m.HealthAnalyticsPage })));
const AIInsightsPage = lazy(() => import('@/pages/AIInsightsPage').then(m => ({ default: m.AIInsightsPage })));
const AlertCenterPage = lazy(() => import('@/pages/AlertCenterPage').then(m => ({ default: m.AlertCenterPage })));
const AstronautProfilePage = lazy(() => import('@/pages/AstronautProfilePage').then(m => ({ default: m.AstronautProfilePage })));
const MissionReportsPage = lazy(() => import('@/pages/MissionReportsPage').then(m => ({ default: m.MissionReportsPage })));
const DataSimulatorPage = lazy(() => import('@/pages/DataSimulatorPage').then(m => ({ default: m.DataSimulatorPage })));
const MissionDataPage = lazy(() => import('@/pages/MissionDataPage').then(m => ({ default: m.MissionDataPage })));
const DataImportPage = lazy(() => import('@/pages/DataImportPage').then(m => ({ default: m.DataImportPage })));
const DatasetInfoPage = lazy(() => import('@/pages/DatasetInfoPage').then(m => ({ default: m.DatasetInfoPage })));
const MissionTimelinePage = lazy(() => import('@/pages/MissionTimelinePage').then(m => ({ default: m.MissionTimelinePage })));
const SettingsPage = lazy(() => import('@/pages/SettingsPage').then(m => ({ default: m.SettingsPage })));
const AboutPage = lazy(() => import('@/pages/AboutPage').then(m => ({ default: m.AboutPage })));
const ResearchHubPage = lazy(() => import('@/pages/ResearchHubPage').then(m => ({ default: m.ResearchHubPage })));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

const PageLoadingFallback: React.FC = () => (
  <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div className="spinner" />
  </div>
);

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ScrollToTop />
      <div style={{ position: 'relative', minHeight: '100vh', background: 'var(--deep-space)' }}>
        {/* Animated starfield always present */}
        <StarfieldBackground />

        <ErrorBoundary fallbackTitle="Mission Application Subsystem">
          <Suspense fallback={<PageLoadingFallback />}>
            <Routes>
              {/* Landing page with top navbar */}
              <Route
                path="/"
                element={
                  <>
                    <Navbar />
                    <div style={{ position: 'relative', zIndex: 1, paddingTop: 0 }}>
                      <LandingPage />
                    </div>
                  </>
                }
              />

              {/* Login Page */}
              <Route
                path="/login"
                element={
                  <>
                    <Navbar />
                    <div style={{ position: 'relative', zIndex: 1, paddingTop: 64 }}>
                      <LoginPage />
                    </div>
                  </>
                }
              />

              {/* About page with top navbar */}
              <Route
                path="/about"
                element={
                  <>
                    <Navbar />
                    <div style={{ position: 'relative', zIndex: 1, paddingTop: 80, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                      <div className="container" style={{ paddingTop: '1rem', paddingBottom: '4rem', flex: 1 }}>
                        <AboutPage />
                      </div>
                      <Footer />
                    </div>
                  </>
                }
              />

              {/* Research Hub page with top navbar */}
              <Route
                path="/research"
                element={
                  <>
                    <Navbar />
                    <div style={{ position: 'relative', zIndex: 1, paddingTop: 80, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ flex: 1 }}>
                        <ResearchHubPage inDashboard={false} />
                      </div>
                      <Footer />
                    </div>
                  </>
                }
              />

              {/* AI Insights page with top navbar */}
              <Route
                path="/ai-insights"
                element={
                  <>
                    <Navbar />
                    <div style={{ position: 'relative', zIndex: 1, paddingTop: 80, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                      <div className="container" style={{ paddingTop: '1rem', paddingBottom: '4rem', flex: 1 }}>
                        <AIInsightsPage />
                      </div>
                      <Footer />
                    </div>
                  </>
                }
              />

              {/* Mission Data page with top navbar */}
              <Route
                path="/mission-data"
                element={
                  <>
                    <Navbar />
                    <div style={{ position: 'relative', zIndex: 1, paddingTop: 80, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                      <div className="container" style={{ paddingTop: '1rem', paddingBottom: '4rem', flex: 1 }}>
                        <MissionDataPage />
                      </div>
                      <Footer />
                    </div>
                  </>
                }
              />

              {/* Live Monitoring & Mission Console — Unified top navbar layout */}
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<DashboardOverview />} />
                <Route path="analytics" element={<HealthAnalyticsPage />} />
                <Route path="alerts" element={<AlertCenterPage />} />
                <Route path="profile" element={<AstronautProfilePage />} />
                <Route path="reports" element={<MissionReportsPage />} />
                <Route path="simulator" element={<DataSimulatorPage />} />
                <Route path="telemetry" element={<MissionDataPage />} />
                <Route path="import" element={<DataImportPage />} />
                <Route path="dataset" element={<DatasetInfoPage />} />
                <Route path="timeline" element={<MissionTimelinePage />} />
                <Route path="research" element={<ResearchHubPage inDashboard={true} />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>

              {/* Legacy/alias routes */}
              <Route path="/dashboard/ai" element={<Navigate to="/ai-insights" replace />} />
              <Route path="/analytics" element={<Navigate to="/dashboard/analytics" replace />} />
              <Route path="/profile" element={<Navigate to="/dashboard/profile" replace />} />
              <Route path="/reports" element={<Navigate to="/dashboard/reports" replace />} />

              {/* 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </div>
    </AuthProvider>
  );
};

export default App;
