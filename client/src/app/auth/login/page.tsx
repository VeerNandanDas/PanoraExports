import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { useLocation, Link } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { isAdminCredentials } from '@/lib/rbac';

export default function LoginPage() {
    const [, setLocation] = useLocation();
    const { login } = useAuth();
    const { toast } = useToast();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const { error } = await login(formData.email, formData.password);

            if (error) {
                toast({
                    title: 'Authentication Failed',
                    description: error.message || 'Invalid credentials provided.',
                    variant: 'destructive',
                });
            } else {
                toast({
                    title: 'Access Granted',
                    description: 'Redirecting to secure dashboard...',
                });

                const isLoggingInAsAdmin = isAdminCredentials(formData.email, formData.password);

                setTimeout(() => {
                    if (isLoggingInAsAdmin) {
                        setLocation('/admin');
                    } else {
                        const params = new URLSearchParams(window.location.search);
                        const redirectTo = params.get('redirect');
                        setLocation(redirectTo || '/');
                    }
                }, 1000);
            }
        } catch (error: any) {
            toast({
                title: 'System Error',
                description: error.message || 'An unexpected error occurred during authentication.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12 font-sans antialiased text-primary">
            <div className="w-full max-w-md relative z-10">
                {/* Logo Section */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-10"
                >
                    <Link href="/" className="inline-block">
                        <div className="flex items-baseline gap-1.5 justify-center">
                            <span className="text-3xl font-bold tracking-tight">Panora</span>
                            <span className="font-serif italic text-primary text-2xl font-light">exports</span>
                        </div>
                    </Link>
                </motion.div>

                {/* Authentication Card */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="bg-background border border-border p-8 md:p-12 rounded-sm"
                >
                    <div className="mb-10 text-center">
                        <h2 className="text-xl font-bold uppercase tracking-tight mb-2">Login</h2>
                        <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest opacity-60">
                            Welcome Back
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Email Field */}
                        <div className="space-y-3 group">
                            <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" strokeWidth={1.5} />
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full pl-8 pr-4 py-3 border-b border-border bg-transparent focus:outline-none focus:border-primary transition-all text-base font-medium text-primary placeholder:text-muted-foreground/30"
                                    placeholder="name@company.com"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-3 group">
                            <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" strokeWidth={1.5} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full pl-8 pr-12 py-3 border-b border-border bg-transparent focus:outline-none focus:border-primary transition-all text-base font-medium text-primary placeholder:text-muted-foreground/30"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                </button>
                            </div>
                        </div>

                        {/* Additional Options */}
                        <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-widest">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    className="w-3 h-3 border border-border bg-background rounded-none accent-primary"
                                />
                                <span className="text-muted-foreground group-hover:text-primary transition-colors">
                                    Remember Me
                                </span>
                            </label>
                            <Link href="/auth/forgot-password" opacity-80 transition-opacity>
                                <span className="text-primary/60 hover:text-primary transition-colors cursor-pointer">Forgot?</span>
                            </Link>
                        </div>

                        {/* Primary Action */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary text-primary-foreground py-4 text-[10px] font-bold uppercase tracking-[0.2em] hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-3 rounded-sm"
                        >
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <>
                                    Login <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Secondary Navigation */}
                    <div className="relative my-10">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-[9px] font-bold uppercase tracking-widest">
                            <span className="px-4 bg-background text-muted-foreground opacity-40">
                                New here?
                            </span>
                        </div>
                    </div>

                    <Link
                        href="/auth/register"
                        className="block w-full text-center border border-border text-primary py-4 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-secondary transition-all rounded-sm"
                    >
                        Create Account
                    </Link>
                </motion.div>

                {/* Back Link */}
                <div className="text-center mt-10">
                    <Link
                        href="/"
                        className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-all inline-flex items-center gap-2 opacity-60"
                    >
                        <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
