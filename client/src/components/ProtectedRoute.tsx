import { ReactNode, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { isAdmin } from '@/lib/rbac';
import { motion } from 'framer-motion';
import { Shield, Lock, ArrowRight } from 'lucide-react';

interface ProtectedRouteProps {
    children: ReactNode;
    requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
    const { user, loading } = useAuth();
    const [, setLocation] = useLocation();

    useEffect(() => {
        if (!loading && !user) {
            // Not logged in, redirect to login
            setLocation('/auth/login?redirect=' + window.location.pathname);
        } else if (!loading && user && requireAdmin && !isAdmin(user)) {
            // Logged in but not admin, show access denied
            // We'll handle this in the render
        }
    }, [user, loading, requireAdmin, setLocation]);

    // Show loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-[1.5px] border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-primary/40">Securing Session...</p>
                </div>
            </div>
        );
    }

    // Not logged in
    if (!user) {
        return null; // Will redirect via useEffect
    }

    // Logged in but not admin (when admin is required)
    if (requireAdmin && !isAdmin(user)) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-8">
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="max-w-md w-full"
                >
                    <div className="bg-background border border-border p-10 md:p-12 rounded-sm shadow-sm relative overflow-hidden">
                        {/* Decorative background mark */}
                        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-40 h-40 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

                        {/* Icon */}
                        <div className="w-16 h-16 bg-secondary border border-border flex items-center justify-center mb-10 mx-auto rounded-sm">
                            <Lock className="w-6 h-6 text-primary" strokeWidth={1.5} />
                        </div>

                        {/* Title */}
                        <h1 className="text-2xl font-bold text-primary text-center mb-4 uppercase tracking-tight">
                            Access Restricted
                        </h1>

                        {/* Message */}
                        <p className="text-[13px] text-primary/60 text-center mb-10 font-medium leading-relaxed">
                            Administrative privileges are mandatory for this security level. Your account has been logged but access is withheld.
                        </p>

                        {/* User Profile Summary */}
                        <div className="bg-secondary/50 border border-border rounded-sm p-6 mb-10">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-primary flex items-center justify-center rounded-sm">
                                    <span className="text-primary-foreground font-bold text-sm">
                                        {user.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-xs font-bold text-primary uppercase truncate tracking-tight">
                                        {user.name}
                                    </p>
                                    <p className="text-[10px] text-primary/40 font-bold uppercase tracking-widest truncate">
                                        {user.email}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                                <span className="text-[9px] font-bold text-primary/40 uppercase tracking-widest">Active Role</span>
                                <span className="text-[9px] font-bold text-primary uppercase tracking-widest px-3 py-1 bg-background border border-border rounded-sm">
                                    {user.role}
                                </span>
                            </div>
                        </div>

                        {/* Action Suite */}
                        <div className="space-y-4">
                            <button
                                onClick={() => setLocation('/')}
                                className="w-full px-8 py-4 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-[0.2em] rounded-sm hover:opacity-90 transition-all flex items-center justify-center gap-3"
                            >
                                Return to Terminal
                                <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={() => window.history.back()}
                                className="w-full px-8 py-4 border border-border text-primary text-[10px] font-bold uppercase tracking-[0.2em] rounded-sm hover:bg-secondary transition-all"
                            >
                                Revert Change
                            </button>
                        </div>

                        {/* Security Ledger */}
                        <div className="mt-10 pt-8 border-t border-border">
                            <div className="flex items-start gap-3">
                                <Shield className="w-3.5 h-3.5 text-primary/40 flex-shrink-0 mt-0.5" strokeWidth={1} />
                                <p className="text-[9px] font-medium text-primary/50 leading-relaxed uppercase tracking-widest">
                                    This event has been recorded in the security ledger. Unauthorized access attempts are monitored for compliance.
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    // All checks passed, render children
    return <>{children}</>;
}
