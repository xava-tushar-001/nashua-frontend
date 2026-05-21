import React, { useEffect, useState } from 'react';
import { GetTemplate } from "../../api/api_client";
import { Mail, FileText, Calendar, Eye, Pencil, Trash2, Copy, Tag, Clock, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Template() {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const navigate = useNavigate();

    const getTemplates = async () => {
        try {
            setLoading(true);
            const response = await GetTemplate();
            setTemplates(response?.data?.body?.templates || []);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getTemplates();
    }, []);

    const filteredTemplates = templates.filter(template => {
        const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             template.subject.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const getCategoryColor = (category) => {
        const colors = {
            marketing: 'bg-purple-100 text-purple-700',
            transactional: 'bg-green-100 text-green-700',
            newsletter: 'bg-blue-100 text-blue-700',
            default: 'bg-gray-100 text-gray-700'
        };
        return colors[category] || colors.default;
    };

    const StatCard = ({ icon: Icon, label, value, color }) => (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${color}`}>
                    <Icon className="w-5 h-5" />
                </div>
                <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
                    <p className="text-2xl font-bold text-gray-800">{value}</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen from-slate-50 via-blue-50 to-indigo-50">
            {/* Animated Background Pattern */}
            <div className="fixed inset-0 opacity-30 pointer-events-none">
                <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[size:40px_40px]" />
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/20 via-transparent to-purple-400/20" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Enhanced Header */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                                    <Mail className="w-6 h-6 text-white" />
                                </div>
                                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
                                    Email Templates
                                </h1>
                            </div>
                            <p className="text-gray-600 ml-1">
                                Create, manage, and optimize your email communications
                            </p>
                        </div>
                        
                        {/* <button 
                            onClick={() => navigate('/create-template')}
                            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 font-medium flex items-center gap-2"
                        >
                            <span>+</span>
                            Create Template
                        </button> */}
                    </div>
                </div>

                {/* Stats Overview */}
                {/* {!loading && templates.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <StatCard 
                            icon={Mail} 
                            label="Total Templates" 
                            value={templates.length}
                            color="bg-blue-100 text-blue-600"
                        />
                        <StatCard 
                            icon={Clock} 
                            label="Last Updated" 
                            value={new Date(Math.max(...templates.map(t => new Date(t.updatedAt)))).toLocaleDateString()}
                            color="bg-green-100 text-green-600"
                        />
                        <StatCard 
                            icon={Tag} 
                            label="Categories" 
                            value="3"
                            color="bg-purple-100 text-purple-600"
                        />
                        <StatCard 
                            icon={Eye} 
                            label="Total Views" 
                            value="1,234"
                            color="bg-orange-100 text-orange-600"
                        />
                    </div>
                )} */}

                {/* Search Bar */}
                {/* {!loading && templates.length > 0 && (
                    <div className="mb-6">
                        <div className="relative max-w-md">
                            <input
                                type="text"
                                placeholder="Search templates by name or subject..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2.5 pl-10 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                            <svg className="absolute left-3 top-3 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                )} */}

                {/* Loading State */}
                {loading ? (
                    <div className="flex justify-center items-center h-96">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Mail className="w-6 h-6 text-blue-600 animate-pulse" />
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Empty State */}
                        {filteredTemplates.length === 0 ? (
                            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-16 text-center">
                                <div className="max-w-md mx-auto">
                                    <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Mail className="w-12 h-12 text-blue-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                        No Templates Found
                                    </h2>
                                    <p className="text-gray-500 mb-6">
                                        {searchTerm ? "No templates match your search criteria." : "You haven't created any email templates yet."}
                                    </p>
                                    {!searchTerm && (
                                        <button 
                                            onClick={() => navigate('/create-template')}
                                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:shadow-lg transition-all font-medium"
                                        >
                                            Create Your First Template
                                        </button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filteredTemplates.map((item, idx) => (
                                    <div
                                        key={item._id}
                                        className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 animate-fade-in"
                                        style={{ animationDelay: `${idx * 50}ms` }}
                                    >
                                        {/* Header with gradient accent */}
                                        <div className="relative h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
                                        
                                        <div className="p-6">
                                            {/* Title Section */}
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex-1">
                                                    <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
                                                        {item.name}
                                                    </h2>
                                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                                        <FileText className="w-4 h-4 flex-shrink-0" />
                                                        <span className="line-clamp-1">{item.subject}</span>
                                                    </div>
                                                </div>
                                                <div className="ml-3 p-2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl group-hover:scale-110 transition-transform">
                                                    <Mail className="w-5 h-5 text-blue-600" />
                                                </div>
                                            </div>

                                            {/* Dynamic Variables */}
                                            {item.dynamic_constants && item.dynamic_constants.length > 0 && (
                                                <div className="mb-4">
                                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                                        Variables
                                                    </p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {item.dynamic_constants.slice(0, 3).map((dynamic, index) => (
                                                            <span
                                                                key={index}
                                                                className="px-2.5 py-1 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 rounded-lg text-xs font-mono border border-gray-200"
                                                            >
                                                                {`{{${dynamic.key}}}`}
                                                            </span>
                                                        ))}
                                                        {item.dynamic_constants.length > 3 && (
                                                            <span className="px-2.5 py-1 text-xs text-gray-500">
                                                                +{item.dynamic_constants.length - 3}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Metadata */}
                                            <div className="flex items-center justify-between text-sm text-gray-500 mb-5 pt-3 border-t border-gray-100">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>{new Date(item.createdAt).toLocaleDateString('en-US', { 
                                                        year: 'numeric', 
                                                        month: 'short', 
                                                        day: 'numeric' 
                                                    })}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    <span className="text-xs">
                                                        {new Date(item.updatedAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex gap-3">
                                                {/* <button
                                                    className="flex-1 flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 py-2.5 rounded-xl transition-all border border-gray-200 hover:border-gray-300 group"
                                                    onClick={() => {}}
                                                >
                                                    <Eye className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                                    <span className="text-sm font-medium">Preview</span>
                                                </button> */}
                                                <button
                                                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg"
                                                    onClick={() => navigate(`/edit-email/${item._id}`)}
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                    <span className="text-sm font-medium">Edit</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

            <style jsx>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out forwards;
                }
                .bg-grid-slate-900\/\[0\.04\] {
                    background-image: linear-gradient(to right, #0f172a 1px, transparent 1px),
                                      linear-gradient(to bottom, #0f172a 1px, transparent 1px);
                }
            `}</style>
        </div>
    );
}