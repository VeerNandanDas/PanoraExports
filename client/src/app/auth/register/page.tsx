import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, User, Phone, Globe, Building2 } from 'lucide-react';
import { useLocation, Link } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function RegisterPage() {
    const [, setLocation] = useLocation();
    const { register } = useAuth();
    const { toast } = useToast();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        country: 'India',
        password: '',
        confirmPassword: '',
        companyName: '',
        agreedToTerms: false,
    });

    const isBusinessEmail = (email: string) => {
        const publicDomains = [
            'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com',
            'icloud.com', 'aol.com', 'zoho.com', 'protonmail.com',
            'mail.com', 'yandex.com', 'live.com'
        ];
        const domain = email.split('@')[1]?.toLowerCase();
        return domain && !publicDomains.includes(domain);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isBusinessEmail(formData.email)) {
            toast({
                title: 'Business Email Required',
                description: 'Registration requires a verified business domain for procurement security.',
                variant: 'destructive',
            });
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast({
                title: 'Password Mismatch',
                description: 'The passwords you entered do not match.',
                variant: 'destructive',
            });
            return;
        }

        setIsLoading(true);

        try {
            const { error } = await register({
                email: formData.email,
                password: formData.password,
                name: formData.name,
                phone: formData.phone,
                country: formData.country,
                role: 'BUYER',
                companyName: formData.companyName,
            });

            if (error) {
                toast({
                    title: 'Registration Failed',
                    description: error.message || 'The system could not process this registration request.',
                    variant: 'destructive',
                });
            } else {
                toast({
                    title: 'Account Created',
                    description: 'Authorization successful. Please verify via business email.',
                });
                setTimeout(() => {
                    setLocation('/verification');
                }, 2000);
            }
        } catch (error: any) {
            toast({
                title: 'System Error',
                description: 'An unexpected error occurred during registration.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12 font-sans antialiased text-primary">
            <div className="w-full max-w-xl relative z-10">
                {/* Brand Header */}
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

                {/* Progress State */}
                <div className="flex items-center justify-center gap-8 mb-10">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold">1</div>
                        <span className="text-[9px] font-bold uppercase tracking-widest">Register</span>
                    </div>
                    <div className="w-12 h-[1px] bg-border" />
                    <div className="flex items-center gap-2 opacity-40">
                        <div className="w-6 h-6 rounded-full bg-secondary text-primary flex items-center justify-center text-[10px] font-bold">2</div>
                        <span className="text-[9px] font-bold uppercase tracking-widest">Verify</span>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="bg-background border border-border p-8 md:p-12 rounded-sm"
                >
                    <div className="mb-10 text-center">
                        <h2 className="text-xl font-bold uppercase tracking-tight mb-2">Create Account</h2>
                        <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest opacity-60">Join our export network</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Name Input */}
                            <div className="space-y-3 group">
                                <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" strokeWidth={1.5} />
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full pl-8 py-3 border-b border-border bg-transparent focus:outline-none focus:border-primary transition-all text-base font-medium text-primary placeholder:text-muted-foreground/30"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>

                            {/* Email Input */}
                            <div className="space-y-3 group">
                                <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                                    Business Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" strokeWidth={1.5} />
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full pl-8 py-3 border-b border-border bg-transparent focus:outline-none focus:border-primary transition-all text-base font-medium text-primary placeholder:text-muted-foreground/30"
                                        placeholder="john@company.com"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Phone Input */}
                            <div className="space-y-3 group">
                                <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                                    Phone Number
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" strokeWidth={1.5} />
                                    <input
                                        type="tel"
                                        required
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full pl-8 py-3 border-b border-border bg-transparent focus:outline-none focus:border-primary transition-all text-base font-medium text-primary placeholder:text-muted-foreground/30"
                                        placeholder="+91 1234567890"
                                    />
                                </div>
                            </div>

                            {/* Country Select */}
                            <div className="space-y-3 group">
                                <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                                    Region
                                </label>
                                <div className="relative">
                                    <Globe className="absolute left-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" strokeWidth={1.5} />
                                    <select
                                        required
                                        value={formData.country}
                                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                        className="w-full pl-8 py-3 border-b border-border bg-transparent focus:outline-none focus:border-primary transition-all text-base font-medium text-primary appearance-none cursor-pointer"
                                    >
                                        <option value="India">India</option>
                                        <option value="USA">USA / Canada</option>
                                        <option value="UK">UK / Europe</option>
                                        <option value="UAE">UAE / Middle East</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Company Name */}
                        <div className="space-y-3 group">
                            <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                                Company Name
                            </label>
                            <div className="relative">
                                <Building2 className="absolute left-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" strokeWidth={1.5} />
                                <input
                                    type="text"
                                    required
                                    value={formData.companyName}
                                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                    className="w-full pl-8 py-3 border-b border-border bg-transparent focus:outline-none focus:border-primary transition-all text-base font-medium text-primary placeholder:text-muted-foreground/30"
                                    placeholder="Enter your company name"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
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
                                        minLength={8}
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

                            {/* Confirm Password */}
                            <div className="space-y-3 group">
                                <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" strokeWidth={1.5} />
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        required
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        className="w-full pl-8 pr-12 py-3 border-b border-border bg-transparent focus:outline-none focus:border-primary transition-all text-base font-medium text-primary placeholder:text-muted-foreground/30"
                                        placeholder="••••••••"
                                        minLength={8}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-4 bg-secondary/50 rounded-sm">
                            <input
                                type="checkbox"
                                required
                                checked={formData.agreedToTerms}
                                onChange={(e) => setFormData({ ...formData, agreedToTerms: e.target.checked })}
                                className="mt-1 w-3.5 h-3.5 border border-border bg-background rounded-none accent-primary"
                            />
                            <label className="text-[9px] font-bold text-muted-foreground leading-relaxed uppercase tracking-wider">
                                I agree to the <Link href="/terms" className="text-primary hover:underline">Terms</Link> and <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary text-primary-foreground py-4 text-[10px] font-bold uppercase tracking-[0.2em] hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-3 rounded-sm"
                        >
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <>
                                    Create Account <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>
                </motion.div>

                <div className="text-center mt-10">
                    <Link
                        href="/auth/login"
                        className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-all opacity-60"
                    >
                        Already have an account? <span className="underline">Login here</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
