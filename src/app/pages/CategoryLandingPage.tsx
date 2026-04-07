"use client";

import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, MoreVertical, Link2, Share2 } from 'lucide-react';
import { usePortfolio } from '@/app/hooks/usePortfolio';

interface CategoryLandingPageProps {
  category: string;
}

export function CategoryLandingPage({ category }: CategoryLandingPageProps) {
  const { images, categoryMetadata, loading: portfolioLoading } = usePortfolio();
  const metadata = categoryMetadata[category];
  const galleryRef = useRef<HTMLDivElement>(null);

  const realImages = images.filter(img => img.category === category && img.site_section === 'Portfolio');
  const categoryImages = realImages;
  
  const [selectedImage, setSelectedImage] = useState<typeof categoryImages[0] | null>(null);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const shareMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(e.target as Node)) {
        setShowShareMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({ title: `Tricks Motion — ${category}`, url: window.location.href });
    }
  };

  if (portfolioLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
      </div>
    );
  }

  if (!metadata) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl">Category not found</h1>
      </div>
    );
  }

  const scrollToGallery = () => {
    galleryRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedImage) return;
    const index = categoryImages.findIndex(img => img.id === selectedImage.id);
    if (index > 0) setSelectedImage(categoryImages[index - 1]);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedImage) return;
    const index = categoryImages.findIndex(img => img.id === selectedImage.id);
    if (index < categoryImages.length - 1) setSelectedImage(categoryImages[index + 1]);
  };

  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{ backgroundImage: `url(${metadata.heroImage})` }}
        >
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Top-Left Logo */}
        <div className="absolute top-8 left-8 sm:top-12 sm:left-12 z-20">
          <span className="text-xl sm:text-2xl font-serif tracking-widest text-white drop-shadow-md">
            Tricks Motion
          </span>
        </div>

        {/* Bottom overlay: mobile = stacked column, desktop = split left/right */}
        <div className="absolute bottom-0 left-0 right-0 z-20 flex flex-col sm:flex-row sm:items-end sm:justify-between px-6 sm:px-12 pb-10 sm:pb-20 gap-6 sm:gap-0">
          {/* Title and Date */}
          <div className="max-w-2xl">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white tracking-widest uppercase leading-none mb-4"
            >
              {metadata.title}
            </motion.h1>
            {metadata.subtitle && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                <p className="text-base sm:text-lg text-white/80 font-light tracking-[0.3em] uppercase">
                  {metadata.subtitle}
                </p>
              </motion.div>
            )}
          </div>

          {/* View Gallery button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="self-start sm:self-auto"
          >
            <button
              onClick={scrollToGallery}
              className="group relative flex items-center gap-4 px-8 py-4 border border-white/40 hover:border-white text-white transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10 text-sm tracking-[0.2em] uppercase font-light">
                View Gallery
              </span>
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Gallery Section */}
      <section
        ref={galleryRef}
        className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-12 max-w-[1920px] mx-auto"
      >
        <div className="mb-12 border-b border-border pb-8">
          {/* Title row */}
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl sm:text-3xl font-serif tracking-widest uppercase">Gallery</h2>

            {/* 3-dot share menu */}
            <div className="relative" ref={shareMenuRef}>
              <button
                onClick={() => setShowShareMenu(v => !v)}
                className="p-2 rounded-full hover:bg-foreground/10 transition-colors text-muted-foreground hover:text-foreground"
                aria-label="Share"
              >
                <MoreVertical className="w-5 h-5" />
              </button>

              {showShareMenu && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-background border border-border rounded-lg shadow-xl z-50 overflow-hidden">
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm hover:bg-muted/50 transition-colors"
                  >
                    <Link2 className="w-4 h-4 text-muted-foreground" />
                    {copied ? 'Link copied!' : 'Copy link'}
                  </button>
                  {typeof navigator !== 'undefined' && 'share' in navigator && (
                    <button
                      onClick={handleNativeShare}
                      className="flex items-center gap-3 w-full px-4 py-3 text-sm hover:bg-muted/50 transition-colors border-t border-border"
                    >
                      <Share2 className="w-4 h-4 text-muted-foreground" />
                      Share via...
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Description below title */}
          <p className="text-sm tracking-[0.15em] uppercase text-muted-foreground font-light">{metadata.description}</p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="columns-2 sm:columns-3 lg:columns-4 gap-1"
        >
          {categoryImages.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (index % 10) * 0.05 }}
              onClick={() => setSelectedImage(image)}
              className="break-inside-avoid group cursor-pointer relative overflow-hidden rounded-sm bg-muted/20 mb-1"
            >
              <img
                src={image.url}
                alt={image.title}
                className="w-full h-auto grayscale-[0.5] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-end">
                <div className="p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-xs text-white tracking-[0.2em] font-light uppercase border-l border-white/40 pl-3">
                    {image.title}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Lightbox - Reused and refined from PortfolioPage */}
        <AnimatePresence>
          {selectedImage && (() => {
            const currentIndex = categoryImages.findIndex(img => img.id === selectedImage.id);
            const hasPrev = currentIndex > 0;
            const hasNext = currentIndex < categoryImages.length - 1;

            return (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedImage(null)}
                className="fixed inset-0 z-[100] bg-black/98 flex items-center justify-center p-4 sm:p-12 cursor-pointer backdrop-blur-xl"
              >
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-8 right-8 p-3 text-white/50 hover:text-white hover:bg-white/10 transition-all rounded-full z-10"
                >
                  <X className="w-8 h-8" />
                </button>

                {hasPrev && (
                  <button
                    onClick={handlePrev}
                    className="absolute left-8 p-6 hover:bg-white/5 transition-all rounded-full text-white/40 hover:text-white z-10 hidden md:block"
                  >
                    <ChevronLeft className="w-12 h-12" />
                  </button>
                )}

                {hasNext && (
                  <button
                    onClick={handleNext}
                    className="absolute right-8 p-6 hover:bg-white/5 transition-all rounded-full text-white/40 hover:text-white z-10 hidden md:block"
                  >
                    <ChevronRight className="w-12 h-12" />
                  </button>
                )}

                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                  className="max-w-7xl w-full flex flex-col md:flex-row gap-12 items-center cursor-default bg-black/40 p-4 sm:p-8 rounded-lg"
                >
                  <div className="flex-1 w-full max-h-[70vh] sm:max-h-[85vh] relative flex items-center justify-center">
                    <img
                      src={selectedImage.url}
                      alt={selectedImage.title}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  <div className="w-full md:w-80 text-white flex flex-col justify-center gap-6">
                    <div>
                      <h3 className="text-3xl font-serif mb-2">{selectedImage.title}</h3>
                      <div className="w-12 h-px bg-white/20" />
                    </div>

                    <div className="flex items-center gap-4 text-white/40 text-xs tracking-[0.3em] uppercase">
                      <span>{category}</span>
                    </div>

                    {selectedImage.description && (
                      <p className="text-white/60 text-sm leading-relaxed font-light tracking-wide">{selectedImage.description}</p>
                    )}

                    <div className="flex gap-4 mt-8 md:hidden">
                      <button
                        onClick={handlePrev}
                        disabled={!hasPrev}
                        className={`p-4 border border-white/10 rounded-full ${!hasPrev ? 'opacity-20' : 'hover:bg-white/10 active:scale-95'}`}
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={handleNext}
                        disabled={!hasNext}
                        className={`p-4 border border-white/10 rounded-full ${!hasNext ? 'opacity-20' : 'hover:bg-white/10 active:scale-95'}`}
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })()}
        </AnimatePresence>
      </section>
    </div>
  );
}
