import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Package, Plus, Edit, Trash2, Search, Filter, Eye, EyeOff,
    Upload, X, Save, DollarSign, Tag, Image as ImageIcon,
    BarChart3, Users, ShoppingCart, TrendingUp, AlertCircle
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useToast } from '@/hooks/use-toast';

// Types
interface Product {
    id: string;
    name: string;
    category: string;
    price: string;
    supplier: string;
    image: string;
    icon: string;
    verified: boolean;
    description?: string;
    minOrder?: string;
    leadTime?: string;
    stock?: number;
    isActive: boolean;
}

// Sample initial products
const initialProducts: Product[] = [
    {
        id: '1',
        name: 'Organic Cotton Fabric',
        category: 'Textiles',
        price: '$12.50/meter',
        supplier: 'Gujarat Textiles Ltd',
        image: 'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=600&h=400&fit=crop&q=80',
        icon: '🧵',
        verified: true,
        description: 'Premium organic cotton fabric, GOTS certified',
        minOrder: '500 meters',
        leadTime: '15-20 days',
        stock: 10000,
        isActive: true,
    },
    {
        id: '2',
        name: 'Basmati Rice Premium',
        category: 'Agriculture',
        price: '$850/ton',
        supplier: 'Punjab Agro Exports',
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=400&fit=crop&q=80',
        icon: '🌾',
        verified: true,
        description: 'Premium aged Basmati rice with extra-long grains',
        minOrder: '10 tons',
        leadTime: '10-15 days',
        stock: 500,
        isActive: true,
    },
];

export default function AdminDashboard() {
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
    const { toast } = useToast();

    const categories = ['All', 'Textiles', 'Agriculture', 'Hardware', 'Handicrafts', 'Spices', 'Leather Goods', 'Ayurveda & Wellness', 'Gems & Jewelry'];

    // Filter products
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // Stats
    const stats = {
        totalProducts: products.length,
        activeProducts: products.filter(p => p.isActive).length,
        totalValue: products.reduce((sum, p) => sum + (p.stock || 0), 0),
        verifiedProducts: products.filter(p => p.verified).length,
    };

    // Handlers
    const handleAddProduct = (product: Omit<Product, 'id'>) => {
        const newProduct = {
            ...product,
            id: Date.now().toString(),
        };
        setProducts([...products, newProduct]);
        setIsAddModalOpen(false);
        toast({
            title: "Product Added",
            description: `${product.name} has been added successfully`,
        });
    };

    const handleEditProduct = (product: Product) => {
        setProducts(products.map(p => p.id === product.id ? product : p));
        setIsEditModalOpen(false);
        setCurrentProduct(null);
        toast({
            title: "Product Updated",
            description: `${product.name} has been updated successfully`,
        });
    };

    const handleDeleteProduct = (id: string) => {
        const product = products.find(p => p.id === id);
        if (window.confirm(`Are you sure you want to delete "${product?.name}"?`)) {
            setProducts(products.filter(p => p.id !== id));
            toast({
                title: "Product Deleted",
                description: "Product has been removed successfully",
                variant: "destructive",
            });
        }
    };

    const handleToggleActive = (id: string) => {
        setProducts(products.map(p =>
            p.id === id ? { ...p, isActive: !p.isActive } : p
        ));
    };

    return (
        <ProtectedRoute requireAdmin={true}>
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-20">
                <Navigation />

                <div className="max-w-[1600px] mx-auto px-6 md:px-8 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
                            Admin Dashboard
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400">
                            Manage your products, inventory, and settings
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard
                            icon={Package}
                            label="Total Products"
                            value={stats.totalProducts}
                            color="blue"
                        />
                        <StatCard
                            icon={Eye}
                            label="Active Products"
                            value={stats.activeProducts}
                            color="green"
                        />
                        <StatCard
                            icon={ShoppingCart}
                            label="Total Stock Units"
                            value={stats.totalValue.toLocaleString()}
                            color="purple"
                        />
                        <StatCard
                            icon={TrendingUp}
                            label="Verified Products"
                            value={stats.verifiedProducts}
                            color="orange"
                        />
                    </div>

                    {/* Controls */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 mb-6">
                        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
                            {/* Search */}
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Category Filter */}
                            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                                {categories.map((category) => (
                                    <button
                                        key={category}
                                        onClick={() => setSelectedCategory(category)}
                                        className={`px-4 py-2 text-sm whitespace-nowrap rounded-xl transition-all ${selectedCategory === category
                                            ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                                            }`}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>

                            {/* Add Product Button */}
                            <button
                                onClick={() => setIsAddModalOpen(true)}
                                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium rounded-xl transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50"
                            >
                                <Plus className="w-5 h-5" />
                                Add Product
                            </button>
                        </div>
                    </div>

                    {/* Products Table */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                            Product
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                            Category
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                            Price
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                            Stock
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                    {filteredProducts.map((product) => (
                                        <motion.tr
                                            key={product.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        className="w-12 h-12 rounded-lg object-cover"
                                                    />
                                                    <div>
                                                        <p className="font-semibold text-slate-900 dark:text-white">
                                                            {product.name}
                                                        </p>
                                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                                            {product.supplier}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-sm rounded-full">
                                                    {product.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">
                                                {product.price}
                                            </td>
                                            <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                                                {product.stock?.toLocaleString() || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => handleToggleActive(product.id)}
                                                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-colors ${product.isActive
                                                        ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                                        }`}
                                                >
                                                    {product.isActive ? (
                                                        <>
                                                            <Eye className="w-3 h-3" />
                                                            Active
                                                        </>
                                                    ) : (
                                                        <>
                                                            <EyeOff className="w-3 h-3" />
                                                            Inactive
                                                        </>
                                                    )}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setCurrentProduct(product);
                                                            setIsEditModalOpen(true);
                                                        }}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteProduct(product.id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>

                            {filteredProducts.length === 0 && (
                                <div className="py-16 text-center">
                                    <Package className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                                    <p className="text-slate-600 dark:text-slate-400">No products found</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Add Product Modal */}
                <ProductModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onSave={handleAddProduct}
                    title="Add New Product"
                />

                {/* Edit Product Modal */}
                {currentProduct && (
                    <ProductModal
                        isOpen={isEditModalOpen}
                        onClose={() => {
                            setIsEditModalOpen(false);
                            setCurrentProduct(null);
                        }}
                        onSave={handleEditProduct}
                        product={currentProduct}
                        title="Edit Product"
                    />
                )}
            </div>
        </ProtectedRoute>
    );
}

// Stat Card Component
function StatCard({ icon: Icon, label, value, color }: {
    icon: any;
    label: string;
    value: number | string;
    color: 'blue' | 'green' | 'purple' | 'orange';
}) {
    const colorClasses = {
        blue: 'from-blue-500 to-blue-600',
        green: 'from-green-500 to-green-600',
        purple: 'from-purple-500 to-purple-600',
        orange: 'from-orange-500 to-orange-600',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:shadow-lg transition-shadow"
        >
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 bg-gradient-to-br ${colorClasses[color]} rounded-xl`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                {value}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
                {label}
            </p>
        </motion.div>
    );
}

// Product Modal Component
function ProductModal({
    isOpen,
    onClose,
    onSave,
    product,
    title
}: {
    isOpen: boolean;
    onClose: () => void;
    onSave: (product: any) => void;
    product?: Product;
    title: string;
}) {
    const [formData, setFormData] = useState<Partial<Product>>(
        product || {
            name: '',
            category: 'Textiles',
            price: '',
            supplier: '',
            image: '',
            icon: '📦',
            verified: true,
            description: '',
            minOrder: '',
            leadTime: '',
            stock: 0,
            isActive: true,
        }
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData as Product);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                >
                    {/* Header */}
                    <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                            {title}
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Product Name */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Product Name *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., Organic Cotton Fabric"
                            />
                        </div>

                        {/* Category & Supplier */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Category *
                                </label>
                                <select
                                    required
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option>Textiles</option>
                                    <option>Agriculture</option>
                                    <option>Hardware</option>
                                    <option>Handicrafts</option>
                                    <option>Spices</option>
                                    <option>Leather Goods</option>
                                    <option>Ayurveda & Wellness</option>
                                    <option>Gems & Jewelry</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Supplier *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.supplier}
                                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., Gujarat Textiles Ltd"
                                />
                            </div>
                        </div>

                        {/* Price & Stock */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Price *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., $12.50/meter"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Stock
                                </label>
                                <input
                                    type="number"
                                    value={formData.stock}
                                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                                    className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., 1000"
                                />
                            </div>
                        </div>

                        {/* Image URL */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Image URL *
                            </label>
                            <input
                                type="url"
                                required
                                value={formData.image}
                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Description
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Product description..."
                            />
                        </div>

                        {/* Min Order & Lead Time */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Minimum Order
                                </label>
                                <input
                                    type="text"
                                    value={formData.minOrder}
                                    onChange={(e) => setFormData({ ...formData, minOrder: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., 500 meters"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Lead Time
                                </label>
                                <input
                                    type="text"
                                    value={formData.leadTime}
                                    onChange={(e) => setFormData({ ...formData, leadTime: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., 15-20 days"
                                />
                            </div>
                        </div>

                        {/* Checkboxes */}
                        <div className="flex gap-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.verified}
                                    onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
                                    className="w-4 h-4 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
                                />
                                <span className="text-sm text-slate-700 dark:text-slate-300">Verified</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="w-4 h-4 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
                                />
                                <span className="text-sm text-slate-700 dark:text-slate-300">Active</span>
                            </label>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-6 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium rounded-xl transition-all shadow-lg shadow-blue-500/30"
                            >
                                <Save className="w-4 h-4 inline mr-2" />
                                Save Product
                            </button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
