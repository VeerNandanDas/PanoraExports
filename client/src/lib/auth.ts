import { supabase, type User, type UserRole, type AuthResponse } from './supabase';

export interface RegisterData {
    email: string;
    password: string;
    name: string;
    phone: string;
    country: string;
    role: UserRole;
    companyName?: string;
}

export interface LoginData {
    email: string;
    password: string;
}

class AuthService {
    /**
     * Register a new user
     */
    async register(data: RegisterData): Promise<AuthResponse> {
        try {
            // 1. Create auth user
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
                options: {
                    data: {
                        name: data.name,
                        phone: data.phone,
                        country: data.country,
                        role: data.role,
                        company_name: data.companyName,
                    },
                },
            });

            if (authError) {
                throw authError;
            }

            if (!authData.user) {
                throw new Error('User creation failed');
            }

            // 2. Create user profile in database
            const { error: profileError } = await supabase
                .from('users')
                .insert({
                    id: authData.user.id,
                    email: data.email,
                    name: data.name,
                    phone: data.phone,
                    country: data.country,
                    role: data.role,
                    company_name: data.companyName,
                    verification_status: 'PENDING',
                });

            if (profileError) {
                console.error('Profile creation error:', profileError);
                // Don't throw here as auth user is already created
            }

            return {
                user: authData.user as any,
                session: authData.session,
                error: null,
            };
        } catch (error: any) {
            return {
                user: null,
                session: null,
                error: error,
            };
        }
    }

    /**
     * Login user
     */
    async login(data: LoginData): Promise<AuthResponse> {
        try {
            const { data: authData, error } = await supabase.auth.signInWithPassword({
                email: data.email,
                password: data.password,
            });

            if (error) {
                throw error;
            }

            // Fetch user profile
            const user = await this.getCurrentUser();

            return {
                user,
                session: authData.session,
                error: null,
            };
        } catch (error: any) {
            return {
                user: null,
                session: null,
                error: error,
            };
        }
    }

    /**
     * Logout user
     */
    async logout(): Promise<{ error: Error | null }> {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            return { error: null };
        } catch (error: any) {
            return { error };
        }
    }

    /**
     * Get current user profile
     */
    async getCurrentUser(): Promise<User | null> {
        try {
            if (!supabase.auth) return null;

            const { data: { user: authUser } } = await supabase.auth.getUser();

            if (!authUser) return null;

            // If it's the placeholder URL, don't try to fetch profile
            if (supabase.auth.constructor.name === 'SupabaseAuthClient' &&
                (supabase as any).supabaseUrl?.includes('placeholder')) {
                return null;
            }

            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', authUser.id)
                .single();

            if (error) {
                console.error('Error fetching user profile:', error);
                return null;
            }

            return data as User;
        } catch (error) {
            console.error('Error getting current user:', error);
            return null;
        }
    }

    /**
     * Get current session
     */
    async getSession() {
        const { data: { session } } = await supabase.auth.getSession();
        return session;
    }

    /**
     * Check if user is authenticated
     */
    async isAuthenticated(): Promise<boolean> {
        const session = await this.getSession();
        return !!session;
    }

    /**
     * Update user profile
     */
    async updateProfile(updates: Partial<User>): Promise<{ error: Error | null }> {
        try {
            const { data: { user: authUser } } = await supabase.auth.getUser();

            if (!authUser) {
                throw new Error('Not authenticated');
            }

            const { error } = await supabase
                .from('users')
                .update(updates)
                .eq('id', authUser.id);

            if (error) throw error;

            return { error: null };
        } catch (error: any) {
            return { error };
        }
    }

    /**
     * Upload verification documents
     */
    async uploadVerificationDocuments(files: File[]): Promise<{ urls: string[]; error: Error | null }> {
        try {
            const { data: { user: authUser } } = await supabase.auth.getUser();

            if (!authUser) {
                throw new Error('Not authenticated');
            }

            const uploadPromises = files.map(async (file) => {
                const fileName = `verification/${authUser.id}/${Date.now()}-${file.name}`;

                const { data, error } = await supabase.storage
                    .from('panora-documents')
                    .upload(fileName, file);

                if (error) throw error;

                const { data: urlData } = supabase.storage
                    .from('panora-documents')
                    .getPublicUrl(data.path);

                return urlData.publicUrl;
            });

            const urls = await Promise.all(uploadPromises);

            // Update user profile with document URLs
            await this.updateProfile({
                verification_documents: urls,
                verification_status: 'PENDING',
            } as any);

            return { urls, error: null };
        } catch (error: any) {
            return { urls: [], error };
        }
    }

    /**
     * Request password reset
     */
    async requestPasswordReset(email: string): Promise<{ error: Error | null }> {
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/reset-password`,
            });

            if (error) throw error;
            return { error: null };
        } catch (error: any) {
            return { error };
        }
    }

    /**
     * Update password
     */
    async updatePassword(newPassword: string): Promise<{ error: Error | null }> {
        try {
            const { error } = await supabase.auth.updateUser({
                password: newPassword,
            });

            if (error) throw error;
            return { error: null };
        } catch (error: any) {
            return { error };
        }
    }

    /**
     * Listen to auth state changes
     */
    onAuthStateChange(callback: (user: User | null) => void) {
        if (!supabase.auth || !supabase.auth.onAuthStateChange) {
            return { data: { subscription: { unsubscribe: () => { } } } };
        }

        try {
            return supabase.auth.onAuthStateChange(async (event: string, session: any) => {
                if (session?.user) {
                    const user = await this.getCurrentUser();
                    callback(user);
                } else {
                    callback(null);
                }
            });
        } catch (error) {
            console.warn('Supabase auth state change error:', error);
            return { data: { subscription: { unsubscribe: () => { } } } };
        }
    }
}

export const authService = new AuthService();
