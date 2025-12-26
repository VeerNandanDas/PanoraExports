import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '@/lib/auth';
import { isAdminCredentials } from '@/lib/rbac';
import { isConfigured } from '@/lib/supabase';
import type { User } from '@/lib/supabase';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<{ error: Error | null }>;
    register: (data: any) => Promise<{ error: Error | null }>;
    logout: () => Promise<void>;
    updateProfile: (updates: Partial<User>) => Promise<{ error: Error | null }>;
    uploadVerificationDocuments: (files: File[]) => Promise<{ urls: string[]; error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Only run if Supabase is configured
        if (!isConfigured) {
            // Still check local admin session even if Supabase isn't configured
            const localAdmin = localStorage.getItem('panora_admin_session');
            if (localAdmin) {
                setUser(JSON.parse(localAdmin));
            }
            setLoading(false);
            return;
        }

        // Check current session on mount
        checkUser();

        // Listen for auth changes
        try {
            const { data: { subscription } } = authService.onAuthStateChange((user) => {
                setUser(user);
                setLoading(false);
            });

            return () => {
                subscription.unsubscribe();
            };
        } catch (error) {
            console.warn('Auth change listener error:', error);
            setLoading(false);
        }
    }, [isConfigured]);

    async function checkUser() {
        try {
            // Check for local admin session first
            const localAdmin = localStorage.getItem('panora_admin_session');
            if (localAdmin) {
                setUser(JSON.parse(localAdmin));
                setLoading(false);
                return;
            }

            // Only call Supabase if configured
            if (isConfigured) {
                const currentUser = await authService.getCurrentUser();
                setUser(currentUser);
            }
        } catch (error) {
            console.warn('Error checking user:', error);
        } finally {
            setLoading(false);
        }
    }

    async function login(email: string, password: string) {
        // Special handling for hardcoded admin credentials to bypass backend requirements if needed
        if (isAdminCredentials(email, password)) {
            const adminUser: User = {
                id: 'admin-hardcoded-id',
                email: email,
                name: 'Panora Admin',
                role: 'ADMIN',
                phone: '+91 999 999 9999',
                country: 'India',
                verification_status: 'VERIFIED',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };
            setUser(adminUser);
            // Persist locally for session persistence
            localStorage.setItem('panora_admin_session', JSON.stringify(adminUser));
            return { error: null };
        }

        // If not admin and Supabase is not configured
        if (!isConfigured) {
            return {
                error: new Error('Database is not configured. Only admin login is available currently.')
            };
        }

        const { user: loggedInUser, error } = await authService.login({ email, password });
        if (!error && loggedInUser) {
            setUser(loggedInUser);
        }
        return { error };
    }

    async function register(data: any) {
        if (!isConfigured) {
            return { error: new Error('Database is not configured. Account creation is currently disabled.') };
        }
        const { user: newUser, error } = await authService.register(data);
        if (!error && newUser) {
            setUser(newUser as any);
        }
        return { error };
    }

    async function logout() {
        localStorage.removeItem('panora_admin_session');
        await authService.logout();
        setUser(null);
    }

    async function updateProfile(updates: Partial<User>) {
        if (!isConfigured) {
            return { error: new Error('Database is not configured.') };
        }
        const { error } = await authService.updateProfile(updates);
        if (!error) {
            // Refresh user data
            const updatedUser = await authService.getCurrentUser();
            setUser(updatedUser);
        }
        return { error };
    }

    async function uploadVerificationDocuments(files: File[]) {
        if (!isConfigured) {
            return { urls: [], error: new Error('Database is not configured.') };
        }
        const result = await authService.uploadVerificationDocuments(files);
        if (!result.error) {
            // Refresh user data
            const updatedUser = await authService.getCurrentUser();
            setUser(updatedUser);
        }
        return result;
    }

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        uploadVerificationDocuments,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
