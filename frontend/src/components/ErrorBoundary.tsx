import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
    children: ReactNode;
    fallbackTitle?: string;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('AstroCare ErrorBoundary caught an unhandled error:', error, errorInfo);
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: null });
        window.location.reload();
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div
                    style={{
                        minHeight: '60vh',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '2rem',
                    }}
                >
                    <div
                        className="glass-card"
                        style={{
                            maxWidth: 550,
                            padding: '2rem',
                            textAlign: 'center',
                            border: '1px solid rgba(255, 100, 124, 0.3)',
                            background: 'rgba(11, 16, 38, 0.95)',
                        }}
                    >
                        <div
                            style={{
                                width: 56,
                                height: 56,
                                borderRadius: '50%',
                                background: 'rgba(255, 100, 124, 0.12)',
                                border: '1px solid rgba(255, 100, 124, 0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 1.25rem',
                            }}
                        >
                            <AlertTriangle size={28} color="var(--critical-coral)" />
                        </div>

                        <div className="section-eyebrow" style={{ color: 'var(--critical-coral)', marginBottom: '0.5rem' }}>
                            SUBSYSTEM RUNTIME RECOVERY
                        </div>

                        <h2 style={{ fontSize: '1.4rem', marginBottom: '0.75rem', color: 'var(--stellar-white)' }}>
                            {this.props.fallbackTitle || 'Telemetry Display Interrupted'}
                        </h2>

                        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                            An unexpected component anomaly was trapped. AstroCare core data systems remain protected.
                        </p>

                        {this.state.error && (
                            <div
                                style={{
                                    padding: '0.75rem',
                                    background: 'rgba(5, 8, 22, 0.8)',
                                    borderRadius: 'var(--radius-sm)',
                                    border: '1px solid var(--border-subtle)',
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '0.75rem',
                                    color: 'var(--warning-amber)',
                                    textAlign: 'left',
                                    overflowX: 'auto',
                                    marginBottom: '1.5rem',
                                }}
                            >
                                {this.state.error.message || String(this.state.error)}
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <button className="btn btn-primary btn-sm" onClick={this.handleReset}>
                                <RefreshCw size={14} />
                                Reload Subsystem
                            </button>
                            <a href="/" className="btn btn-ghost btn-sm">
                                <Home size={14} />
                                Return Home
                            </a>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
