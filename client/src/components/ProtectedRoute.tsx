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
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600 dark:text-slate-400">Loading...</p>
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
            <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md w-full"
                >
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 border border-red-100 dark:border-red-900/20">
                        {/* Icon */}
                        <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Lock className="w-10 h-10 text-white" />
                        </div>

                        {/* Title */}
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-3">
                            Access Denied
                        </h1>

                        {/* Message */}
                        <p className="text-slate-600 dark:text-slate-400 text-center mb-6">
                            You don't have permission to access this page. Admin privileges are required.
                        </p>

                        {/* User Info */}
                        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                    <span className="text-white font-semibold text-sm">
                                        {user.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                                        {user.name}
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        {user.email}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-500 dark:text-slate-400">Role:</span>
                                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full font-medium">
                                        {user.role}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-3">
                            <button
                                onClick={() => setLocation('/')}
                                className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium rounded-xl transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
                            >
                                Go to Home
                                <ArrowRight className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => window.history.back()}
                                className="w-full px-6 py-3 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            >
                                Go Back
                            </button>
                        </div>

                        {/* Help Text */}
                        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                            <div className="flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400">
                                <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                <p>
                                    If you believe you should have admin access, please contact the system administrator.
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
