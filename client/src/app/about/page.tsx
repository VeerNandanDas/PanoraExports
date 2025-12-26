'use client';

import { Target, Users, Globe, TrendingUp, Award, Heart, Zap, Shield } from 'lucide-react';
import Navigation from '@/components/Navigation';

const stats = [
    { value: '500+', label: 'Verified Sellers' },
    { value: '1,200+', label: 'Active Buyers' },
    { value: '50+', label: 'Countries' },
    { value: '10+', label: 'Categories' },
];

const values = [
    {
        icon: Shield,
        title: 'Trust & Transparency',
        description: 'We verify every business on our platform to ensure authentic, secure B2B transactions.',
    },
    {
        icon: Globe,
        title: 'Global Reach',
        description: 'Connecting Indian exporters with verified buyers across 50+ countries worldwide.',
    },
    {
        icon: Zap,
        title: 'Speed & Efficiency',
        description: 'Streamlined processes from verification to order fulfillment, making trade seamless.',
    },
    {
        icon: Heart,
        title: 'Customer First',
        description: 'Dedicated support team available 24/7 to assist with your export journey.',
    },
];

const team = [
    {
        name: 'Rajesh Kumar',
        role: 'Founder & CEO',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    },
    {
        name: 'Priya Sharma',
        role: 'Head of Operations',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    },
    {
        name: 'Amit Patel',
        role: 'Chief Technology Officer',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    },
    {
        name: 'Sneha Reddy',
        role: 'Head of Verification',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    },
];

const milestones = [
    { year: '1985', title: 'Founded', description: 'Panora Exports established with a vision to connect India to the world' },
    { year: '2010', title: 'Digital Transformation', description: 'Launched our first online B2B platform' },
    { year: '2018', title: 'Global Expansion', description: 'Reached 50+ countries with verified buyer network' },
    { year: '2024', title: 'Innovation Leader', description: 'Introduced AI-powered verification and matching' },
];

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 pt-20">
            <Navigation />
            {/* Hero Section */}
            <section className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                <div className="max-w-[1600px] mx-auto px-8 md:px-12 py-20">
                    <div className="max-w-4xl">
                        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
                            Connecting India's<br />Finest Exports to the World
                        </h1>
                        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
                            Since 1985, Panora Exports has been India's premier B2B platform, connecting verified buyers with trusted export categories including Textiles, Agriculture, Hardware, Handicrafts, and Spices. We ensure quality, authenticity, and seamless global trade.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <a
                                href="/auth/register"
                                className="inline-block px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-medium hover:opacity-90 transition-opacity"
                            >
                                GET STARTED
                            </a>
                            <a
                                href="/products"
                                className="inline-block px-8 py-4 border border-slate-900 dark:border-white text-slate-900 dark:text-white text-sm font-medium hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 transition-colors"
                            >
                                BROWSE PRODUCTS
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-[1600px] mx-auto px-8 md:px-12 py-16">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <p className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2">
                                    {stat.value}
                                </p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    {stat.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="max-w-[1600px] mx-auto px-8 md:px-12 py-20">
                <div className="grid md:grid-cols-2 gap-16">
                    <div>
                        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-900 flex items-center justify-center mb-6">
                            <Target className="w-6 h-6 text-slate-900 dark:text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                            Our Mission
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                            To empower Indian exporters by providing a trusted, efficient, and transparent B2B platform that connects them with verified buyers worldwide, ensuring quality and authenticity in every transaction.
                        </p>
                    </div>
                    <div>
                        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-900 flex items-center justify-center mb-6">
                            <TrendingUp className="w-6 h-6 text-slate-900 dark:text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                            Our Vision
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                            To become the world's most trusted B2B export platform, recognized for innovation, reliability, and our commitment to making global trade accessible to businesses of all sizes.
                        </p>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                <div className="max-w-[1600px] mx-auto px-8 md:px-12 py-20">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                            Our Core Values
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            The principles that guide everything we do
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => (
                            <div
                                key={index}
                                className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-8 hover:border-slate-400 dark:hover:border-slate-600 transition-colors"
                            >
                                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-900 flex items-center justify-center mb-6">
                                    <value.icon className="w-6 h-6 text-slate-900 dark:text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                                    {value.title}
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    {value.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Timeline Section */}
            <section className="max-w-[1600px] mx-auto px-8 md:px-12 py-20">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                        Our Journey
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Four decades of excellence in global trade
                    </p>
                </div>

                <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-slate-200 dark:bg-slate-800" />

                    <div className="space-y-12">
                        {milestones.map((milestone, index) => (
                            <div
                                key={index}
                                className={`relative flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                                    }`}
                            >
                                <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                                    <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 hover:border-slate-400 dark:hover:border-slate-600 transition-colors">
                                        <div className="text-3xl font-bold text-slate-300 dark:text-slate-700 mb-2">
                                            {milestone.year}
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                                            {milestone.title}
                                        </h3>
                                        <p className="text-slate-600 dark:text-slate-400">
                                            {milestone.description}
                                        </p>
                                    </div>
                                </div>
                                {/* Timeline dot */}
                                <div className="absolute left-0 md:left-1/2 w-4 h-4 bg-slate-900 dark:bg-white border-4 border-white dark:border-slate-950 rounded-full -translate-x-1/2" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                <div className="max-w-[1600px] mx-auto px-8 md:px-12 py-20">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                            Meet Our Team
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            The people behind Panora Exports' success
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {team.map((member, index) => (
                            <div key={index} className="text-center group">
                                <div className="aspect-square bg-slate-200 dark:bg-slate-800 mb-4 overflow-hidden">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                    />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                                    {member.name}
                                </h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    {member.role}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="border-t border-slate-200 dark:border-slate-800">
                <div className="max-w-[1600px] mx-auto px-8 md:px-12 py-20 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
                        Join Our Growing Network
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
                        Whether you're a seller looking to expand globally or a buyer seeking quality Indian exports, we're here to help.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="/auth/register"
                            className="inline-block px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-medium hover:opacity-90 transition-opacity"
                        >
                            GET VERIFIED NOW
                        </a>
                        <a
                            href="/products"
                            className="inline-block px-8 py-4 border border-slate-900 dark:border-white text-slate-900 dark:text-white text-sm font-medium hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 transition-colors"
                        >
                            BROWSE PRODUCTS
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
