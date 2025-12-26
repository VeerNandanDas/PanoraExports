'use client';

import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Shield, Truck, Star, Share2 } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { motion } from 'framer-motion';
import { useState } from 'react';

// Sample product data (in real app, this would come from API)
const allProducts = [
    {
        id: '1',
        name: 'Organic Cotton Fabric',
        category: 'Textiles',
        price: '$12.50/meter',
        supplier: 'Gujarat Textiles Ltd',
        image: 'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=800&h=600&fit=crop&q=80',
        icon: '🧵',
        verified: true,
        description: 'Premium organic cotton fabric, GOTS certified. Perfect for apparel, home textiles, and eco-friendly products. Available in various weights and colors.',
        minOrder: '500 meters',
        leadTime: '15-20 days',
        rating: 4.8,
        reviews: 124,
    },
    {
        id: '2',
        name: 'Basmati Rice Premium',
        category: 'Agriculture',
        price: '$850/ton',
        supplier: 'Punjab Agro Exports',
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&h=600&fit=crop&q=80',
        icon: '🌾',
        verified: true,
        description: 'Premium aged Basmati rice with extra-long grains. Aromatic and fluffy when cooked. Export quality with all certifications.',
        minOrder: '10 tons',
        leadTime: '10-15 days',
        rating: 4.9,
        reviews: 89,
    },
    {
        id: '3',
        name: 'Brass Door Handles',
        category: 'Hardware',
        price: '$24.99/piece',
        supplier: 'Jaipur Hardware Co',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&q=80',
        icon: '🔧',
        verified: true,
        description: 'Handcrafted brass door handles with antique finish. Durable and elegant design suitable for residential and commercial properties.',
        minOrder: '100 pieces',
        leadTime: '20-25 days',
        rating: 4.7,
        reviews: 56,
    },
];

export default function ProductDetailPage() {
    const params = useParams();
    const navigate = useNavigate();
    const [showActualImage, setShowActualImage] = useState(false);

    const product = allProducts.find(p => p.id === params.id);

    if (!product) {
        return (
            <div className="min-h-screen bg-[#fdfbf7] dark:bg-slate-950 pt-20">
                <Navigation />
                <div className="max-w-[1400px] mx-auto px-6 md:px-8 py-16 text-center">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Product not found</h1>
                    <button
                        onClick={() => navigate('/products')}
                        className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    >
                        ← Back to Products
                    </button>
                </div>
            </div>
        );
    }

    // Get related products from same category
    const relatedProducts = allProducts.filter(p => p.category === product.category && p.id !== product.id);

    return (
        <div className="min-h-screen bg-[#fdfbf7] dark:bg-slate-950 pt-20">
            <Navigation />

            {/* Breadcrumb */}
            <section className="border-b border-slate-200/50 dark:border-slate-800/50">
                <div className="max-w-[1400px] mx-auto px-6 md:px-8 py-4">
                    <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                        <a href="/products" className="hover:text-slate-900 dark:hover:text-white transition-colors">Products</a>
                        <span>/</span>
                        <a href={`/products?category=${product.category}`} className="hover:text-slate-900 dark:hover:text-white transition-colors">{product.category}</a>
                        <span>/</span>
                        <span className="text-slate-900 dark:text-white">{product.name}</span>
                    </div>
                </div>
            </section>

            {/* Product Detail */}
            <section className="max-w-[1400px] mx-auto px-6 md:px-8 py-8">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </button>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Image */}
                    <div
                        className="relative aspect-square bg-slate-100 dark:bg-slate-900 overflow-hidden cursor-pointer group"
                        onMouseEnter={() => setShowActualImage(true)}
                        onMouseLeave={() => setShowActualImage(false)}
                    >
                        {/* Blurred/Sharp Image */}
                        <img
                            src={product.image}
                            alt={product.name}
                            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${showActualImage
                                ? 'blur-none brightness-100 saturate-100 scale-105'
                                : 'blur-xl brightness-75 saturate-50 scale-110'
                                }`}
                        />

                        {/* Gradient overlay */}
                        <div className={`absolute inset-0 bg-gradient-to-t from-black/30 to-transparent transition-opacity duration-500 ${showActualImage ? 'opacity-0' : 'opacity-100'}`} />

                        {/* Hover hint */}
                        <div className={`absolute bottom-4 left-4 right-4 text-center text-xs text-white bg-black/50 backdrop-blur-sm py-2 px-3 rounded-sm transition-opacity ${showActualImage ? 'opacity-0' : 'opacity-100'}`}>
                            Hover to see clear image
                        </div>
                    </div>

                    {/* Details */}
                    <div>
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">{product.category}</span>
                                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{product.name}</h1>
                            </div>
                            <button className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                                <Share2 className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-[#d4af37] text-[#d4af37]' : 'text-slate-300 dark:text-slate-600'}`}
                                    />
                                ))}
                            </div>
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                                {product.rating} ({product.reviews} reviews)
                            </span>
                        </div>

                        {/* Supplier */}
                        <div className="flex items-center gap-2 mb-6 pb-6 border-b border-slate-200 dark:border-slate-800">
                            <span className="text-sm text-slate-600 dark:text-slate-400">by</span>
                            <span className="text-sm font-semibold text-slate-900 dark:text-white">{product.supplier}</span>
                            {product.verified && (
                                <span className="px-2 py-0.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs font-medium">
                                    ✓ Verified
                                </span>
                            )}
                        </div>

                        {/* Price */}
                        <div className="mb-6">
                            <p className="text-4xl font-bold text-slate-900 dark:text-white">{product.price}</p>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                            {product.description}
                        </p>

                        {/* Key Info */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50">
                                <div className="flex items-center gap-2 mb-2">
                                    <Package className="w-4 h-4 text-slate-400" />
                                    <span className="text-xs text-slate-500 dark:text-slate-400">Min. Order</span>
                                </div>
                                <p className="text-sm font-semibold text-slate-900 dark:text-white">{product.minOrder}</p>
                            </div>
                            <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50">
                                <div className="flex items-center gap-2 mb-2">
                                    <Truck className="w-4 h-4 text-slate-400" />
                                    <span className="text-xs text-slate-500 dark:text-slate-400">Lead Time</span>
                                </div>
                                <p className="text-sm font-semibold text-slate-900 dark:text-white">{product.leadTime}</p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button className="flex-1 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-medium hover:opacity-90 transition-opacity uppercase tracking-wider">
                                Request Quote
                            </button>
                            <button className="px-6 py-3 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors uppercase tracking-wider">
                                Contact Supplier
                            </button>
                        </div>

                        {/* Trust Badges */}
                        <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div>
                                    <Shield className="w-5 h-5 text-green-600 mx-auto mb-1" />
                                    <p className="text-xs text-slate-600 dark:text-slate-400">Verified Seller</p>
                                </div>
                                <div>
                                    <Truck className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                                    <p className="text-xs text-slate-600 dark:text-slate-400">Fast Shipping</p>
                                </div>
                                <div>
                                    <Star className="w-5 h-5 text-[#d4af37] mx-auto mb-1" />
                                    <p className="text-xs text-slate-600 dark:text-slate-400">Top Rated</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <section className="max-w-[1400px] mx-auto px-6 md:px-8 py-12 border-t border-slate-200/50 dark:border-slate-800/50">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Similar Products</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {relatedProducts.map((relatedProduct, index) => (
                            <motion.a
                                key={relatedProduct.id}
                                href={`/products/${relatedProduct.id}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className="group block bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 hover:border-slate-300 dark:hover:border-slate-700 transition-all hover:shadow-lg"
                            >
                                <div className="relative aspect-square bg-slate-100 dark:bg-slate-900 overflow-hidden">
                                    <img
                                        src={relatedProduct.image}
                                        alt={relatedProduct.name}
                                        loading="lazy"
                                        className="absolute inset-0 w-full h-full object-cover blur-md brightness-75 saturate-50 scale-110 group-hover:blur-none group-hover:brightness-100 group-hover:saturate-100 group-hover:scale-105 transition-all duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent group-hover:opacity-0 transition-opacity duration-500" />
                                </div>
                                <div className="p-3">
                                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1 line-clamp-2 group-hover:text-[#d4af37] transition-colors">
                                        {relatedProduct.name}
                                    </h3>
                                    <p className="text-base font-bold text-slate-900 dark:text-white">{relatedProduct.price}</p>
                                </div>
                            </motion.a>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
