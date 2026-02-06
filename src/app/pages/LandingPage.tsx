"use client";

import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { portfolioImages } from '@/app/data/portfolioData';
import { HeroSlider } from '@/app/components/HeroSlider';

export function LandingPage() {
    const featuredImages = portfolioImages.slice(0, 4);

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative min-h-[100svh] flex items-center justify-center px-4">
                <HeroSlider images={portfolioImages.slice(0, 5)} />

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="relative z-10 text-center px-4 w-full"
                >
                    <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl mb-4 sm:mb-6 tracking-tight leading-tight">
                        Lens & Light
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-8 sm:mb-12 tracking-wide max-w-2xl mx-auto px-4">
                        Capturing the extraordinary in the everyday
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                        <Link href="/portfolio" className="w-full sm:w-auto">
                            <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-foreground text-background hover:bg-foreground/90 transition-all flex items-center justify-center gap-2 group">
                                <span className="tracking-widest uppercase text-xs sm:text-sm">View Work</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </Link>
                        <Link href="/contact" className="w-full sm:w-auto">
                            <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 border border-foreground/20 hover:border-foreground/40 transition-all">
                                <span className="tracking-widest uppercase text-xs sm:text-sm">Book a Session</span>
                            </button>
                        </Link>
                    </div>
                </motion.div>
            </section>

            {/* Featured Work Section */}
            <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="mb-12 sm:mb-16"
                    >
                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 sm:mb-6">Featured Work</h2>
                        <p className="text-muted-foreground text-sm sm:text-base lg:text-lg max-w-2xl">
                            A carefully curated selection of my most recent and meaningful projects.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                        {featuredImages.map((image, index) => (
                            <motion.div
                                key={image.id}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                            >
                                <Link href="/portfolio" className="group block">
                                    <div className="relative aspect-[4/5] overflow-hidden mb-3 sm:mb-4">
                                        <img
                                            src={image.url}
                                            alt={image.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-lg sm:text-xl mb-1">{image.title}</h3>
                                            <p className="text-xs sm:text-sm text-muted-foreground tracking-wider uppercase">
                                                {image.category}
                                            </p>
                                        </div>
                                        <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About Preview Section */}
            <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 bg-secondary">
                <div className="max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="grid md:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center"
                    >
                        <div className="order-2 md:order-1">
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-6 sm:mb-8">About My Work</h2>
                            <p className="text-muted-foreground text-sm sm:text-base lg:text-lg mb-4 sm:mb-6 leading-relaxed">
                                Photography is more than capturing images—it's about preserving emotions,
                                telling stories, and creating timeless art. With over a decade of experience,
                                I specialize in creating cinematic, emotive imagery that resonates.
                            </p>
                            <Link href="/about">
                                <button className="flex items-center gap-2 hover:gap-4 transition-all group mt-6">
                                    <span className="tracking-widest uppercase text-xs sm:text-sm">Learn More</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </Link>
                        </div>
                        <div className="aspect-[3/4] overflow-hidden order-1 md:order-2">
                            <img
                                src={portfolioImages[5].url}
                                alt="Photographer"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
