"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PortfolioImage } from "@/app/data/portfolioData";

interface HeroSliderProps {
    images: PortfolioImage[];
}

export function HeroSlider({ images }: HeroSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (!images || images.length === 0) return;
        
        const timer = setInterval(() => {
            setCurrentIndex((prev) => {
                if (Number.isNaN(prev) || prev >= images.length) return 0;
                return (prev + 1) % images.length;
            });
        }, 5000);

        return () => clearInterval(timer);
    }, [images]);
    
    // Safety fallback just in case of stale state during hot-reload
    const safeIndex = (Number.isNaN(currentIndex) || currentIndex >= images.length) ? 0 : currentIndex;

    if (!images || images.length === 0) {
        return (
            <div className="absolute inset-0 overflow-hidden bg-black/80">
                <div className="absolute inset-0 bg-black/60" />
            </div>
        );
    }

    return (
        <div className="absolute inset-0 overflow-hidden bg-black">
            <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                    key={safeIndex}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="absolute inset-0"
                >
                    <img
                        src={images[safeIndex].url}
                        alt={images[safeIndex].title}
                        className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-black/30" />
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
