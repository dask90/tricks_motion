"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Masonry from 'react-responsive-masonry';
import { X } from 'lucide-react';
import { portfolioImages, categories } from '@/app/data/portfolioData';

export function PortfolioPage() {
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [selectedImage, setSelectedImage] = useState<typeof portfolioImages[0] | null>(null);

    const filteredImages =
        selectedCategory === 'All'
            ? portfolioImages
            : portfolioImages.filter((img) => img.category === selectedCategory);

    const [columns, setColumns] = useState(3);

    useEffect(() => {
        const updateColumns = () => {
            setColumns(window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 3);
        };
        updateColumns();
        window.addEventListener('resize', updateColumns);
        return () => window.removeEventListener('resize', updateColumns);
    }, []);

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
                    {categories.map((category) => (
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
                    ))}
                </motion.div>

                {/* Masonry Grid */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <Masonry columnsCount={columns} gutter="16px">
                        {filteredImages.map((image, index) => (
                            <motion.div
                                key={image.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => setSelectedImage(image)}
                                className="group cursor-pointer relative overflow-hidden"
                            >
                                <img
                                    src={image.url}
                                    alt={image.title}
                                    className="w-full h-auto group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center p-4">
                                        <h3 className="text-lg sm:text-xl mb-2">{image.title}</h3>
                                        <p className="text-xs sm:text-sm text-muted-foreground tracking-wider uppercase">
                                            {image.category}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </Masonry>
                </motion.div>

                {/* Lightbox */}
                <AnimatePresence>
                    {selectedImage && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedImage(null)}
                            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 sm:p-6 cursor-pointer"
                        >
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 hover:bg-white/10 transition-colors z-10"
                            >
                                <X className="w-5 sm:w-6 h-5 sm:h-6" />
                            </button>

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
                                <div className="mt-4 sm:mt-6 text-center px-4">
                                    <h3 className="text-xl sm:text-2xl mb-2">{selectedImage.title}</h3>
                                    <p className="text-muted-foreground text-xs sm:text-sm tracking-wider uppercase mb-2">
                                        {selectedImage.category}
                                    </p>
                                    {selectedImage.description && (
                                        <p className="text-muted-foreground text-sm sm:text-base">{selectedImage.description}</p>
                                    )}
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
