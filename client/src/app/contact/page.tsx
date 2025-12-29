import { useState } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import { Mail, Phone, MapPin, Send, Loader2, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

export default function ContactPage() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
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
                description: 'Please provide a professional business email address (e.g., name@yourcompany.com).',
                variant: 'destructive',
            });
            return;
        }

        setIsLoading(true);

        try {
            // Attempt to send via backend API
            // Note: This expects the backend to be running and configured with SMTP
            await apiRequest('POST', '/api/contact', formData);

            toast({
                title: 'Message Sent!',
                description: 'We have received your query and will get back to you shortly.',
            });
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            // Fallback to mailto if backend fails or is not reachable
            console.error('Backend email failed, falling back to mailto', error);

            const subject = encodeURIComponent(`[Panora Contact] ${formData.subject}`);
            const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`);
            window.location.href = `mailto:panoraexports@gmail.com?subject=${subject}&body=${body}`;

            toast({
                title: 'Opening Email Client',
                description: 'We could not connect to the server, opening your email app instead.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background pt-20 font-sans antialiased text-primary">
            <Navigation />

            {/* Hero */}
            <section className="relative py-20 bg-background">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 bg-secondary text-primary rounded-sm mb-8"
                    >
                        <Mail className="w-3.5 h-3.5" />
                        <span className="text-[9px] uppercase font-bold tracking-[0.2em]">Contact Us</span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-bold text-primary mb-8 tracking-tight"
                    >
                        Get in <span className="font-serif italic font-light opacity-80 text-primary">Touch.</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-primary/70 text-lg max-w-xl mx-auto font-medium"
                    >
                        Have questions about our products or sourcing? Our team is available to assist your business requirements.
                    </motion.p>
                </div>
            </section>

            <section className="max-w-[1400px] mx-auto px-6 md:px-12 py-20">
                <div className="grid lg:grid-cols-2 gap-20">
                    {/* Contact Info */}
                    <div className="space-y-12">
                        <div>
                            <div className="flex items-center gap-3 mb-10">
                                <div className="w-8 h-[1.5px] bg-primary" />
                                <h2 className="text-[10px] font-bold text-primary uppercase tracking-widest">Global Support</h2>
                            </div>

                            <div className="space-y-10">
                                {[
                                    {
                                        icon: Mail,
                                        label: 'Email',
                                        val: 'panoraexports@gmail.com',
                                        href: 'mailto:panoraexports@gmail.com'
                                    },
                                    {
                                        icon: Phone,
                                        label: 'Phone',
                                        val: '+91 (Support Line)',
                                        href: '#'
                                    },
                                    {
                                        icon: MapPin,
                                        label: 'HQ',
                                        val: 'Mumbai, India',
                                        sub: 'Serving UAE, UK, & Europe'
                                    }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-6 group">
                                        <div className="w-12 h-12 bg-secondary text-primary rounded-sm flex items-center justify-center border border-border transition-all">
                                            <item.icon className="w-5 h-5" strokeWidth={1.5} />
                                        </div>
                                        <div>
                                            <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold mb-1">{item.label}</p>
                                            {item.href ? (
                                                <a href={item.href} className="text-lg text-primary font-bold hover:opacity-70 transition-opacity">
                                                    {item.val}
                                                </a>
                                            ) : (
                                                <p className="text-lg text-primary font-bold">{item.val}</p>
                                            )}
                                            {item.sub && <p className="text-primary/50 font-medium text-[13px] mt-1">{item.sub}</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-10 bg-secondary/50 border border-border rounded-sm relative overflow-hidden group">
                            <h3 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-8 border-b border-border pb-4">Hours (IST)</h3>
                            <div className="space-y-4 text-primary font-bold text-[13px]">
                                {[
                                    { day: 'Mon - Fri', hours: '9:00 AM - 6:00 PM' },
                                    { day: 'Sat', hours: '10:00 AM - 4:00 PM' },
                                    { day: 'Sun', hours: 'Closed', highlight: true }
                                ].map((row, i) => (
                                    <div key={i} className="flex justify-between items-center">
                                        <span className="opacity-40 uppercase tracking-widest text-[9px]">{row.day}</span>
                                        <span className={row.highlight ? 'text-primary/60' : ''}>{row.hours}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-background border border-border p-8 md:p-12 rounded-sm shadow-sm">
                        <div className="flex items-center gap-3 mb-10">
                            <h2 className="text-xl font-bold text-primary uppercase tracking-tight">Send Message</h2>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {[
                                { label: 'Full Name', key: 'name', type: 'text', placeholder: 'John Doe' },
                                { label: 'Business Email', key: 'email', type: 'email', placeholder: 'john@company.com' },
                                { label: 'Subject', key: 'subject', type: 'text', placeholder: 'Product Inquiry' }
                            ].map((field) => (
                                <div key={field.key} className="space-y-2.5">
                                    <label className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">
                                        {field.label}
                                    </label>
                                    <input
                                        type={field.type}
                                        required
                                        value={(formData as any)[field.key]}
                                        onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                                        className="w-full px-0 py-3 border-b border-border bg-transparent focus:outline-none focus:border-primary transition-colors text-primary font-medium placeholder:text-muted-foreground/30 text-base"
                                        placeholder={field.placeholder}
                                    />
                                </div>
                            ))}

                            <div className="space-y-2.5">
                                <label className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">
                                    Message
                                </label>
                                <textarea
                                    required
                                    rows={4}
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full px-0 py-3 border-b border-border bg-transparent focus:outline-none focus:border-primary transition-colors text-primary font-medium placeholder:text-muted-foreground/30 text-base resize-none"
                                    placeholder="Tell us about your requirements..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-primary text-primary-foreground py-4 text-[10px] uppercase tracking-[0.2em] font-bold hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-3 rounded-sm mt-6"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        Send Message <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
}
