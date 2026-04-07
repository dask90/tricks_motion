"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePortfolio } from '@/app/hooks/usePortfolio';

export function PortfolioPage() {
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const { images, categories: dynamicCategories, loading } = usePortfolio();
    
    // Only show images assigned to the overall Portfolio grid
    const portfolioSectionImages = images.filter(img => img.site_section === 'Portfolio');
    const displayImages = portfolioSectionImages;

    const [selectedImage, setSelectedImage] = useState<typeof displayImages[0] | null>(null);

    const filteredImages =
        selectedCategory === 'All'
            ? displayImages
            : displayImages.filter((img) => img.category === selectedCategory);

    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!selectedImage) return;
        const index = filteredImages.findIndex(img => img.id === selectedImage.id);
        if (index > 0) setSelectedImage(filteredImages[index - 1]);
    };

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!selectedImage) return;
        const index = filteredImages.findIndex(img => img.id === selectedImage.id);
        if (index < filteredImages.length - 1) setSelectedImage(filteredImages[index + 1]);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-20 sm:pt-24 lg:pt-32 pb-12 sm:pb-16 lg:pb-20 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 sm:mb-16"
                >
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-4 sm:mb-6">Portfolio</h1>
                    <p className="text-muted-foreground text-sm sm:text-base lg:text-lg max-w-2xl">
                        A collection of my work across various genres and styles.
                    </p>
                </motion.div>

                {/* Category Filters */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-wrap gap-2 sm:gap-4 mb-12 sm:mb-16"
                >
                    {dynamicCategories.map((category) => (
                        category === 'All' ? (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 sm:px-6 py-2 sm:py-3 tracking-widest uppercase text-xs sm:text-sm transition-all ${selectedCategory === category
                                    ? 'bg-foreground text-background'
                                    : 'border border-foreground/20 hover:border-foreground/40'
                                    }`}
                            >
                                {category}
                            </button>
                        ) : (
                            <Link
                                key={category}
                                href={`/portfolio/${category}`}
                                className={`px-4 sm:px-6 py-2 sm:py-3 tracking-widest uppercase text-xs sm:text-sm transition-all border border-foreground/20 hover:border-foreground/40 hover:bg-foreground/5`}
                            >
                                {category}
                            </Link>
                        )
                    ))}
                </motion.div>

                {/* Masonry Grid */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="columns-2 sm:columns-3 lg:columns-3 gap-1"
                >
                    {filteredImages.map((image, index) => (
                        <motion.div
                            key={image.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => setSelectedImage(image)}
                            className="break-inside-avoid group cursor-pointer relative overflow-hidden mb-1 rounded-md shadow-sm border border-border/50 bg-muted/20"
                        >
                                <img
                                    src={image.url}
                                    alt={image.title}
                                    className="w-full h-auto group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                                    {selectedCategory === 'All' && (
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center p-4">
                                            <p className="text-xs sm:text-sm text-white tracking-wider uppercase">
                                                {image.category}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                </motion.div>

                {/* Lightbox */}
                <AnimatePresence>
                    {selectedImage && (() => {
                        const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
                        const hasPrev = currentIndex > 0;
                        const hasNext = currentIndex < filteredImages.length - 1;

                        return (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setSelectedImage(null)}
                                className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 sm:p-6 cursor-pointer"
                            >
                                <button
                                    onClick={() => setSelectedImage(null)}
                                    className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 text-white hover:bg-white/10 transition-colors z-10"
                                >
                                    <X className="w-5 sm:w-6 h-5 sm:h-6" />
                                </button>

                                {hasPrev && (
                                    <button 
                                        onClick={handlePrev}
                                        className="absolute left-2 sm:left-6 p-2 sm:p-4 hover:bg-white/10 transition-colors rounded-full text-white z-10 hidden sm:block"
                                    >
                                        <ChevronLeft className="w-8 sm:w-10 h-8 sm:h-10 opacity-70 hover:opacity-100 transition-opacity" />
                                    </button>
                                )}

                                {hasNext && (
                                    <button 
                                        onClick={handleNext}
                                        className="absolute right-2 sm:right-6 p-2 sm:p-4 hover:bg-white/10 transition-colors rounded-full text-white z-10 hidden sm:block"
                                    >
                                        <ChevronRight className="w-8 sm:w-10 h-8 sm:h-10 opacity-70 hover:opacity-100 transition-opacity" />
                                    </button>
                                )}

                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.9, opacity: 0 }}
                                    onClick={(e) => e.stopPropagation()}
                                    className="max-w-6xl w-full flex flex-col cursor-default"
                                >
                                    <img
                                        src={selectedImage.url}
                                        alt={selectedImage.title}
                                        className="max-h-[70vh] sm:max-h-[80vh] w-full object-contain"
                                    />
                                    <div className="mt-4 sm:mt-6 text-center px-4 text-white">
                                        <h3 className="text-xl sm:text-2xl mb-2">{selectedImage.title}</h3>
                                        
                                        <div className="flex justify-center items-center gap-4 text-muted-foreground text-xs sm:text-sm tracking-wider uppercase mb-2">
                                            <button onClick={handlePrev} disabled={!hasPrev} className={`sm:hidden p-2 ${!hasPrev ? 'opacity-20' : 'active:bg-white/10 rounded-full text-white'}`}>
                                                <ChevronLeft className="w-6 h-6"/>
                                            </button>
                                            
                                            <span>{selectedImage.category}</span>
                                            
                                            <button onClick={handleNext} disabled={!hasNext} className={`sm:hidden p-2 ${!hasNext ? 'opacity-20' : 'active:bg-white/10 rounded-full text-white'}`}>
                                                <ChevronRight className="w-6 h-6"/>
                                            </button>
                                        </div>

                                        {selectedImage.description && (
                                            <p className="text-muted-foreground text-sm sm:text-base">{selectedImage.description}</p>
                                        )}
                                    </div>
                                </motion.div>
                            </motion.div>
                        );
                    })()}
                </AnimatePresence>
            </div>
        </div>
    );
}
