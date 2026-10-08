"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';

// Simple class name merger (replaces @/lib/utils cn)
function cn(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(' ');
}

// Prop types for the HeroSection component
interface HeroSectionProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
    logo?: {
        url: string;
        alt: string;
        text?: string;
    };
    slogan?: string;
    title: React.ReactNode;
    subtitle: string;
    callToAction: {
        primary: { text: string; href: string };
        secondary: { text: string; href: string };
    };
    backgroundImage: string;
}

const HeroSection = React.forwardRef<HTMLDivElement, HeroSectionProps>(
    ({ className, logo, slogan, title, subtitle, callToAction, backgroundImage, ...props }, ref) => {

        // Animation variants for the container to orchestrate children animations
        const containerVariants = {
            hidden: { opacity: 0 },
            visible: {
                opacity: 1,
                transition: {
                    staggerChildren: 0.15,
                    delayChildren: 0.2,
                },
            },
        };

        // Animation variants for individual text/UI elements
        const itemVariants = {
            hidden: { y: 20, opacity: 0 },
            visible: {
                y: 0,
                opacity: 1,
                transition: {
                    duration: 0.5,
                    ease: "easeOut" as const,
                },
            },
        };

        return (
            <>
                {/* ── MOBILE HERO: Simple full-bleed bg image + text overlay (hidden on md+) ── */}
                <section
                    className="relative md:hidden w-full overflow-hidden text-white"
                    style={{ minHeight: '100svh' }}
                >
                    {/* Background image */}
                    <div
                        aria-hidden="true"
                        className="absolute inset-0"
                        style={{
                            backgroundImage: `url(${backgroundImage})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    />

                    {/* Dark gradient overlay so text is legible */}
                    <div
                        aria-hidden="true"
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.15) 100%)',
                        }}
                    />

                    {/* Content */}
                    <div
                        className="relative z-10 flex flex-col justify-between"
                        style={{ minHeight: '100svh' }}
                    >
                        {/* ── Top: slogan + heading + accent rule + subtitle ── */}
                        <div className="pt-24 px-6">
                            {slogan && (
                                <p className="text-[10px] uppercase tracking-[0.22em] text-white/70 mb-8">
                                    {slogan}
                                </p>
                            )}

                            <h1
                                className="font-bold text-white leading-none"
                                style={{
                                    fontSize: 'clamp(2.75rem, 13vw, 4rem)',
                                    letterSpacing: '-0.025em',
                                    textShadow: '0 2px 28px rgba(0,0,0,0.4)',
                                }}
                            >
                                {title}
                            </h1>

                            {/* Thin accent rule */}
                            <div className="mt-5 mb-5 bg-white" style={{ width: '2rem', height: '2px' }} />

                            <p className="text-sm leading-relaxed text-white/80">
                                {subtitle}
                            </p>
                        </div>

                        {/* ── Bottom: Two CTA buttons ── */}
                        <div className="px-6 pb-12 flex flex-col gap-3">
                            <Link
                                href={callToAction.primary.href}
                                className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-black text-[11px] font-bold tracking-[0.18em] uppercase transition-opacity hover:opacity-80 active:opacity-60"
                            >
                                {callToAction.primary.text}
                                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                            </Link>
                            <Link
                                href={callToAction.secondary.href}
                                className="flex items-center justify-center gap-2 px-6 py-3.5 border border-white/50 text-white text-[11px] font-bold tracking-[0.18em] uppercase backdrop-blur-sm bg-white/5 transition-colors hover:bg-white/15 active:bg-white/25"
                            >
                                {callToAction.secondary.text}
                            </Link>
                        </div>
                    </div>
                </section>

                {/*
                ── MOBILE HERO (COMMENTED OUT): Diagonal split composition ──
                <section
                    className="relative md:hidden w-full overflow-hidden bg-background text-foreground"
                    style={{ minHeight: '100svh' }}
                >
                    [diagonal split layout preserved here for future reference]
                </section>
                */}

                {/* ── DESKTOP HERO: Original split layout — completely unchanged (md+) ── */}
                <motion.section
                    ref={ref}
                    className={cn(
                        "relative hidden md:flex w-full overflow-hidden bg-background text-foreground md:flex-row",
                        className
                    )}
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    {...(props as any)}
                >
                    {/* Left Side: Content */}
                    <div className="flex w-full flex-col justify-between p-8 md:w-1/2 md:p-12 lg:w-3/5 lg:p-16">
                        <div>
                            <motion.header className="mb-12" variants={itemVariants}>
                                {logo && (
                                    <div className="flex items-center">
                                        <img src={logo.url} alt={logo.alt} className="mr-3 h-8" />
                                        <div>
                                            {logo.text && <p className="text-lg font-bold text-foreground">{logo.text}</p>}
                                            {slogan && <p className="text-xs tracking-wider text-muted-foreground">{slogan}</p>}
                                        </div>
                                    </div>
                                )}
                            </motion.header>

                            <motion.main variants={containerVariants}>
                                <motion.h1 className="text-4xl font-bold leading-tight text-foreground md:text-5xl" variants={itemVariants}>
                                    {title}
                                </motion.h1>
                                <motion.div className="my-6 h-1 w-20 bg-primary" variants={itemVariants} />
                                <motion.p className="mb-8 max-w-md text-base text-muted-foreground" variants={itemVariants}>
                                    {subtitle}
                                </motion.p>
                                <motion.div className="flex flex-wrap items-center gap-4" variants={itemVariants}>
                                    <Link
                                        href={callToAction.primary.href}
                                        className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-primary text-primary-foreground text-xs font-bold tracking-[0.16em] uppercase transition-all hover:opacity-90 hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5"
                                        style={{ borderRadius: 0 }}
                                    >
                                        {callToAction.primary.text}
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                                    </Link>
                                    <Link
                                        href={callToAction.secondary.href}
                                        className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-foreground/25 text-foreground text-xs font-bold tracking-[0.16em] uppercase transition-all hover:border-foreground/60 hover:bg-foreground/5 hover:-translate-y-0.5"
                                        style={{ borderRadius: 0 }}
                                    >
                                        {callToAction.secondary.text}
                                    </Link>
                                </motion.div>
                            </motion.main>
                        </div>


                    </div>

                    {/* Right Side: Image with Clip Path Animation */}
                    <motion.div
                        className="w-full min-h-[300px] bg-cover bg-center md:w-1/2 md:min-h-full lg:w-2/5"
                        style={{ backgroundImage: `url(${backgroundImage})` }}
                        initial={{ clipPath: 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)' }}
                        animate={{ clipPath: 'polygon(25% 0, 100% 0, 100% 100%, 0% 100%)' }}
                        transition={{ duration: 1.2, ease: 'circOut' }}
                    />
                </motion.section>
            </>
        );
    }
);

HeroSection.displayName = "HeroSection";

export { HeroSection };
