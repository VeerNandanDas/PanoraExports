'use client';

import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import { Shield, Award, Briefcase, CheckCircle, FileCheck, Globe, Building2, User } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background pt-20 font-sans antialiased text-primary">
            <Navigation />

            {/* Hero Section */}
            <section className="relative py-24 overflow-hidden bg-background">
                <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="max-w-3xl"
                    >
                        <div className="flex items-center gap-3 mb-8">
                            <div className="h-[1.5px] w-8 bg-secondary" />
                            <span className="text-secondary text-[9px] font-bold tracking-[0.3em] uppercase">Corporate Profile</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold text-primary mb-8 leading-[1.1] tracking-tight">
                            Institutional <br />
                            <span className="font-serif italic font-light text-secondary">Trade Compliance.</span>
                        </h1>
                        <p className="text-lg text-primary/80 leading-relaxed font-medium max-w-xl">
                            Panora Exports operates at the intersection of precision logistics and global trade integrity. We specialize in scaling high-volume Indian production for the MENA and European corridors, ensuring rigorous adherence to international enterprise standards.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Core Values Section */}
            <section className="py-20 bg-secondary/30">
                <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Shield,
                                title: "Integrity",
                                desc: "Transparency is at the core of our operations. Every supplier is thoroughly vetted to ensure compliance and ethical sourcing."
                            },
                            {
                                icon: Award,
                                title: "Quality Control",
                                desc: "We maintain strict quality benchmarks. Our catalogue represents the finest export capabilities from across the subcontinent."
                            },
                            {
                                icon: Globe,
                                title: "Market Expertise",
                                desc: "With a deep understanding of international logistics, we provide seamless trade solutions tailored to global requirements."
                            }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1, duration: 0.5 }}
                                className="p-8 bg-background border border-secondary/20 hover:border-secondary transition-all rounded-sm"
                            >
                                <div className="w-12 h-12 bg-secondary/10 flex items-center justify-center text-secondary mb-6 transition-all rounded-sm border border-secondary/20">
                                    <item.icon strokeWidth={1.5} className="w-5 h-5" />
                                </div>
                                <h3 className="text-lg font-bold text-primary mb-3 uppercase tracking-tight">{item.title}</h3>
                                <p className="text-primary/60 leading-relaxed text-[13px] font-medium">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Vision Section */}
            <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
                <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
                    <h2 className="text-3xl md:text-4xl font-serif italic mb-10 font-light text-secondary">Our Commitment</h2>
                    <div className="space-y-8">
                        <div className="w-12 h-[1px] bg-secondary/30 mx-auto" />
                        <p className="text-white/90 leading-relaxed font-serif italic text-xl md:text-2xl">
                            "Our mandate is to formalize global procurement protocols. We believe architectural trade is founded on the precision of fulfillment and the unwavering consistency of verified quality."
                        </p>
                        <div className="flex flex-col items-center">
                            <div className="w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center mb-4 border border-primary-foreground/20">
                                <User className="w-4 h-4 text-primary-foreground" strokeWidth={1.5} />
                            </div>
                            <h3 className="text-xs font-bold tracking-[0.2em] uppercase">Founder Statement</h3>
                            <p className="text-primary-foreground/40 text-[9px] uppercase tracking-widest mt-1">Panora Exports</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Certifications Section */}
            <section className="py-24 bg-background">
                <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                    <div className="mb-16">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-[1.5px] w-8 bg-secondary" />
                            <span className="text-secondary text-[9px] font-bold tracking-[0.3em] uppercase">Compliance Framework</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold text-primary mb-6 tracking-tight">Verified & <span className="font-serif italic font-light text-secondary">Authorized.</span></h2>
                        <p className="text-primary/60 text-base font-medium leading-relaxed max-w-2xl">
                            We adhere to all legal requirements for international trade and maintain necessary certifications issued by the Government of India.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { name: "Import Export Code", sub: "DGFT - Govt. of India", icon: FileCheck },
                            { name: "GST Registered", sub: "Tax & Legal Entity", icon: Building2 },
                            { name: "FIEO Member", sub: "Federation of Export Org.", icon: Globe },
                            { name: "ISO 9001:2015", sub: "Quality Management", icon: CheckCircle },
                        ].map((cert, i) => (
                            <div key={i} className="bg-background border border-border flex flex-col items-center justify-center p-8 text-center hover:border-primary/30 transition-all rounded-sm group">
                                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mb-5 group-hover:bg-primary transition-all">
                                    <cert.icon className="w-5 h-5 text-primary group-hover:text-secondary transition-colors" strokeWidth={1.5} />
                                </div>
                                <h4 className="font-bold text-primary text-[10px] uppercase tracking-wider mb-2">{cert.name}</h4>
                                <p className="text-[8px] text-muted-foreground font-bold uppercase tracking-widest">{cert.sub}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
