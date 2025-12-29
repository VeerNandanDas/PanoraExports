import { useState } from 'react';
import { Search, Grid, List, Package, ArrowRight } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { motion } from 'framer-motion';

// Sample product data with illustrative icons
const products = [
    {
        id: 1,
        name: 'Organic Cotton Fabric',
        category: 'Textiles',
        price: '$12.50/meter',
        supplier: 'Gujarat Textiles Ltd',
        image: 'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=600&h=400&fit=crop&q=80',
        icon: Package,
        verified: true,
    },
    {
        id: 2,
        name: 'Basmati Rice Premium',
        category: 'Agriculture',
        price: '$850/ton',
        supplier: 'Punjab Agro Exports',
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=400&fit=crop&q=80',
        icon: Package,
        verified: true,
    },
    {
        id: 3,
        name: 'Brass Door Handles',
        category: 'Hardware',
        price: '$24.99/piece',
        supplier: 'Jaipur Hardware Co',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop&q=80',
        icon: Package,
        verified: true,
    },
    {
        id: 4,
        name: 'Hand-woven Silk Saree',
        category: 'Handicrafts',
        price: '$180/piece',
        supplier: 'Kanchipuram Weavers',
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=400&fit=crop&q=80',
        icon: Package,
        verified: true,
    },
    {
        id: 5,
        name: 'Organic Turmeric Powder',
        category: 'Spices',
        price: '$4.50/kg',
        supplier: 'Kerala Spice Traders',
        image: 'https://images.unsplash.com/photo-1615485500834-bc10199bc727?w=600&h=400&fit=crop&q=80',
        icon: Package,
        verified: true,
    },
    {
        id: 6,
        name: 'Marble Tiles Premium',
        category: 'Hardware',
        price: '$45/sqm',
        supplier: 'Rajasthan Marble Inc',
        image: 'https://images.unsplash.com/photo-1615874694520-474822394e73?w=600&h=400&fit=crop&q=80',
        icon: Package,
        verified: true,
    },
    {
        id: 7,
        name: 'Leather Handbags',
        category: 'Leather Goods',
        price: '$65/piece',
        supplier: 'Kolkata Leather Works',
        image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&h=400&fit=crop&q=80',
        icon: Package,
        verified: true,
    },
    {
        id: 8,
        name: 'Jasmine Essential Oil',
        category: 'Ayurveda & Wellness',
        price: '$28/100ml',
        supplier: 'Tamil Nadu Aromatics',
        image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&h=400&fit=crop&q=80',
        icon: Package,
        verified: true,
    },
    {
        id: 9,
        name: 'Silver Jewelry Set',
        category: 'Gems & Jewelry',
        price: '$320/set',
        supplier: 'Jaipur Jewelers',
        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=400&fit=crop&q=80',
        icon: Package,
        verified: true,
    },
];

export default function ProductsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const categories = ['All', 'Textiles', 'Agriculture', 'Hardware', 'Handicrafts', 'Spices', 'Leather Goods', 'Ayurveda & Wellness', 'Gems & Jewelry'];

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen bg-background pt-20 font-sans antialiased text-primary">
            <Navigation />

            {/* Header Section */}
            <section className="bg-background">
                <div className="max-w-[1600px] mx-auto px-8 md:px-12 py-16 md:py-20">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-[1.5px] w-8 bg-primary" />
                        <span className="text-primary text-[9px] font-bold tracking-[0.3em] uppercase">Product Directory</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-primary mb-8 tracking-tight">
                        Quality <span className="font-serif italic font-light opacity-80">Collection.</span>
                    </h1>
                    <p className="text-lg text-primary/70 max-w-xl font-medium leading-relaxed">
                        Handpicked selection of premium commodities and industrial goods from certified Indian manufacturers.
                    </p>
                </div>
            </section>

            {/* Filters bar */}
            <section className="border-y border-border sticky top-[72px] bg-background/95 backdrop-blur-md z-40">
                <div className="max-w-[1600px] mx-auto px-8 md:px-12 py-5">
                    <div className="flex flex-col lg:flex-row gap-6 lg:items-center lg:justify-between">
                        {/* Search */}
                        <div className="relative flex-1 max-w-sm group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" strokeWidth={1.5} />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-border bg-background text-primary text-sm font-medium focus:outline-none focus:border-primary/40 rounded-sm transition-all"
                            />
                        </div>

                        {/* Category Pills */}
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-hide">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-5 py-2.5 text-[9px] uppercase tracking-wider font-bold transition-all rounded-sm border whitespace-nowrap ${selectedCategory === category
                                        ? 'bg-primary text-primary-foreground border-primary'
                                        : 'bg-background text-muted-foreground border-border hover:border-primary/30 hover:text-primary'
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>

                        {/* View Toggle */}
                        <div className="flex items-center gap-1 border border-border rounded-sm p-1 bg-background self-start lg:self-auto">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-sm transition-all ${viewMode === 'grid'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'text-muted-foreground hover:text-primary'
                                    }`}
                            >
                                <Grid className="w-3.5 h-3.5" strokeWidth={1.5} />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-sm transition-all ${viewMode === 'list'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'text-muted-foreground hover:text-primary'
                                    }`}
                            >
                                <List className="w-3.5 h-3.5" strokeWidth={1.5} />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Products Grid/List */}
            <section className="max-w-[1600px] mx-auto px-8 md:px-12 py-16">
                <div className="mb-10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <p className="text-[9px] uppercase tracking-widest font-bold text-muted-foreground">
                            {filteredProducts.length} Items Found
                        </p>
                    </div>
                </div>

                {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredProducts.map((product, index) => (
                            <motion.a
                                key={product.id}
                                href={`/products/${product.id}`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.03 }}
                                className="group flex flex-col bg-background border border-border hover:border-primary/20 transition-all rounded-sm overflow-hidden"
                            >
                                <div className="relative aspect-square overflow-hidden bg-secondary">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                    />
                                    <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm px-3 py-1 text-[8px] font-bold uppercase tracking-wider text-primary border border-border">
                                        {product.category}
                                    </div>
                                    <div className="absolute bottom-4 left-4 right-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                        <div className="bg-primary text-primary-foreground py-3 text-center text-[9px] font-bold uppercase tracking-widest rounded-sm">
                                            View Details
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <h3 className="text-sm font-bold text-primary mb-2 group-hover:text-primary-foreground transition-colors uppercase tracking-tight">
                                        {product.name}
                                    </h3>
                                    <p className="text-[9px] uppercase font-bold tracking-widest text-muted-foreground/60 mb-6">
                                        Supplier: {product.supplier}
                                    </p>

                                    <div className="flex items-center justify-between pt-4 border-t border-border">
                                        <div className="flex flex-col">
                                            <span className="text-[7px] uppercase font-bold text-muted-foreground tracking-widest mb-0.5">Indicative Price</span>
                                            <span className="text-lg font-bold text-primary">{product.price}</span>
                                        </div>
                                        <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all">
                                            <ArrowRight className="w-3.5 h-3.5 text-primary group-hover:text-secondary group-hover:translate-x-1 transition-all" />
                                        </div>
                                    </div>
                                </div>
                            </motion.a>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredProducts.map((product, index) => (
                            <motion.a
                                key={product.id}
                                href={`/products/${product.id}`}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.03 }}
                                className="group flex items-center bg-background border border-border p-5 hover:border-primary/20 transition-all rounded-sm"
                            >
                                <div className="w-20 h-20 bg-secondary overflow-hidden shrink-0 relative rounded-sm border border-border">
                                    <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                </div>

                                <div className="ml-8 flex-1">
                                    <div className="flex items-center gap-4 mb-2">
                                        <h3 className="text-base font-bold text-primary tracking-tight uppercase group-hover:text-primary/80 transition-colors">{product.name}</h3>
                                        <span className="px-3 py-0.5 bg-secondary text-primary text-[8px] font-bold uppercase tracking-wider rounded-sm">{product.category}</span>
                                    </div>
                                    <p className="text-[9px] uppercase font-bold tracking-widest text-muted-foreground/60">Sourced from: {product.supplier}</p>
                                </div>

                                <div className="text-right ml-8 shrink-0">
                                    <p className="text-[7px] uppercase font-bold text-muted-foreground tracking-widest mb-1">Unit Price</p>
                                    <p className="text-xl font-bold text-primary mb-2">{product.price}</p>
                                    <div className="flex items-center justify-end gap-2 text-[9px] font-bold uppercase tracking-widest text-primary/60 group-hover:text-primary transition-all">
                                        View <ArrowRight className="w-3.5 h-3.5" />
                                    </div>
                                </div>
                            </motion.a>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
