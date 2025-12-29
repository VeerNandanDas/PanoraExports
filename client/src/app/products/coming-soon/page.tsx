import { motion } from 'framer-motion';
import { Package, Sparkles, Bell, ArrowRight, CheckCircle2, Globe, Shield } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function ProductsComingSoon() {
    const [email, setEmail] = useState('');
    const [isSubscribed, setIsSubscribed] = useState(false);
    const { toast } = useToast();

    const isBusinessEmail = (email: string) => {
        const publicDomains = [
            'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com',
            'icloud.com', 'aol.com', 'zoho.com', 'protonmail.com',
            'mail.com', 'yandex.com', 'live.com'
        ];
        const domain = email.split('@')[1]?.toLowerCase();
        return domain && !publicDomains.includes(domain);
    };

    const handleNotifyMe = (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            toast({
                title: "Authentication Required",
                description: "Corporate email is mandatory for priority access.",
                variant: "destructive"
            });
            return;
        }

        if (!isBusinessEmail(email)) {
            toast({
                title: "Invalid Protocol",
                description: "Please provide a verified business domain for procurement access.",
                variant: "destructive"
            });
            return;
        }

        setIsSubscribed(true);
        toast({
            title: "Access Registered",
            description: "Your organization has been queued for early-access notification.",
        });
        setEmail('');
    };

    return (
        <div className="min-h-screen bg-background pt-20 font-sans antialiased text-primary relative overflow-hidden">
            <Navigation />

            {/* Main Content */}
            <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-8 py-20 md:py-32">
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center"
                >
                    {/* Brand Identifier */}
                    <div className="flex items-center justify-center gap-3 mb-8">
                        <div className="h-[1.5px] w-8 bg-primary" />
                        <span className="text-primary text-[9px] font-bold uppercase tracking-widest">Upcoming Products</span>
                        <div className="h-[1.5px] w-8 bg-primary" />
                    </div>

                    {/* Heading */}
                    <motion.h1
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-bold mb-8 text-primary leading-tight tracking-tight"
                    >
                        New Quality <br />
                        <span className="font-serif italic font-light opacity-80">Coming Soon.</span>
                    </motion.h1>

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-primary/60 mb-12 max-w-xl mx-auto font-medium"
                    >
                        We are currently sourcing new premium commodities from verified Indian partners.
                        Sign up to receive notifications when they become available.
                    </motion.p>

                    {/* Features */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="grid md:grid-cols-3 gap-6 mb-16 max-w-3xl mx-auto"
                    >
                        {[
                            { icon: Shield, text: "Quality Vetted" },
                            { icon: Globe, text: "Direct Sourcing" },
                            { icon: CheckCircle2, text: "Best Pricing" }
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className="flex flex-col items-center gap-4 p-8 bg-secondary border border-border rounded-sm transition-all"
                            >
                                <feature.icon className="w-6 h-6 text-primary" strokeWidth={1.5} />
                                <span className="text-[9px] font-bold uppercase tracking-widest text-primary">{feature.text}</span>
                            </div>
                        ))}
                    </motion.div>

                    {/* Register Interest */}
                    {!isSubscribed ? (
                        <motion.form
                            onSubmit={handleNotifyMe}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="max-w-md mx-auto"
                        >
                            <div className="flex flex-col gap-3 p-2 bg-background border border-border shadow-sm rounded-sm">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Business email address"
                                    className="w-full px-4 py-4 bg-transparent text-primary font-bold text-sm placeholder:text-muted-foreground/30 focus:outline-none"
                                />
                                <button
                                    type="submit"
                                    className="w-full py-4 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-all rounded-sm flex items-center justify-center gap-3 group"
                                >
                                    Notify Me
                                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                                </button>
                            </div>
                            <p className="text-[9px] font-bold uppercase tracking-widest text-primary/30 mt-6 md:mt-8">
                                Business emails only for priority access.
                            </p>
                        </motion.form>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="max-w-md mx-auto p-12 bg-background border border-primary rounded-sm shadow-sm"
                        >
                            <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-6" strokeWidth={1.5} />
                            <h3 className="text-xl font-bold text-primary mb-2 uppercase tracking-tight">You're Added</h3>
                            <p className="text-primary/60 font-medium">
                                We'll notify you as soon as the collection drops.
                            </p>
                        </motion.div>
                    )}

                    {/* Navigation */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-20"
                    >
                        <a
                            href="/products"
                            className="inline-flex items-center gap-3 text-[9px] font-bold uppercase tracking-widest text-primary hover:opacity-70 transition-opacity"
                        >
                            <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                            <span>Return to Products</span>
                        </a>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
