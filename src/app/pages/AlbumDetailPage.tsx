"use client";

import { motion } from 'motion/react';
// import { useParams } from 'react-router-dom';
import { portfolioImages } from '@/app/data/portfolioData';

export function AlbumDetailPage() {
    // const { id } = useParams(); // Handled by Next.js page params
    const albumImages = portfolioImages.filter((img) => img.category === 'Weddings');

    return (
        <div className="min-h-screen pt-20 sm:pt-24 lg:pt-32 pb-12 sm:pb-16 lg:pb-20">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-16 sm:mb-20 text-center"
                >
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-4 sm:mb-6">Wedding Album</h1>
                    <p className="text-muted-foreground text-sm sm:text-base lg:text-lg max-w-2xl mx-auto px-4">
                        A beautiful celebration of love, captured in timeless moments.
                    </p>
                    <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-8 text-xs sm:text-sm text-muted-foreground">
                        <span>Location: California</span>
                        <span className="hidden sm:inline">•</span>
                        <span>Date: June 2025</span>
                        <span className="hidden sm:inline">•</span>
                        <span>Category: Wedding</span>
                    </div>
                </motion.div>

                {/* Story-driven layout */}
                <div className="space-y-20 sm:space-y-28 lg:space-y-32">
                    {albumImages.map((image, index) => (
                        <motion.div
                            key={image.id}
                            initial={{ opacity: 0, y: 60 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-100px' }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className={index % 2 === 0 ? '' : 'sm:ml-0 md:ml-16 lg:ml-32'}
                        >
                            <div className="aspect-[3/2] overflow-hidden mb-6 sm:mb-8">
                                <img
                                    src={image.url}
                                    alt={image.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            {image.description && (
                                <div className="max-w-xl mx-auto text-center px-4">
                                    <h3 className="text-xl sm:text-2xl mb-3 sm:mb-4">{image.title}</h3>
                                    <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                                        {image.description}
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>

                {/* Cinematic Quote */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                    className="mt-20 sm:mt-28 lg:mt-32 py-12 sm:py-16 lg:py-20 text-center px-4"
                >
                    <blockquote className="text-2xl sm:text-3xl lg:text-4xl italic max-w-3xl mx-auto leading-relaxed">
                        "In every wedding, there's a story waiting to be told through light and shadow."
                    </blockquote>
                </motion.div>
            </div>
        </div>
    );
}
