"use client";

import React from 'react';
import { motion } from 'motion/react';

// Simple class name merger (replaces @/lib/utils cn)
function cn(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(' ');
}

// Icon component for contact details
const InfoIcon = ({ type }: { type: 'website' | 'phone' | 'address' }) => {
    const icons = {
        website: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-primary">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" x2="22" y1="12" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
        ),
        phone: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-primary">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
        ),
        address: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-primary">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                <circle cx="12" cy="10" r="3"></circle>
            </svg>
        ),
    };
    return <div className="mr-2 flex-shrink-0">{icons[type]}</div>;
};

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
        text: string;
        href: string;
    };
    backgroundImage: string;
    contactInfo: {
        website: string;
        phone: string;
        address: string;
    };
}

const HeroSection = React.forwardRef<HTMLDivElement, HeroSectionProps>(
    ({ className, logo, slogan, title, subtitle, callToAction, backgroundImage, contactInfo, ...props }, ref) => {

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

                        {/* ── Bottom: CTA + contact strip ── */}
                        <div className="px-6 pb-10">
                            <a
                                href={callToAction.href}
                                className="inline-flex items-center gap-3 text-[11px] font-bold tracking-[0.18em] uppercase text-white transition-opacity hover:opacity-60"
                            >
                                <span
                                    className="block bg-white flex-shrink-0"
                                    style={{ width: '1.25rem', height: '1.5px' }}
                                />
                                {callToAction.text.replace('→ ', '')}
                            </a>

                            <div className="mt-5 flex flex-col gap-1.5">
                                <div className="flex items-center gap-2 text-[10px] text-white">
                                    <InfoIcon type="website" />
                                    <span>{contactInfo.website}</span>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] text-white">
                                    <InfoIcon type="phone" />
                                    <span>{contactInfo.phone}</span>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] text-white">
                                    <InfoIcon type="address" />
                                    <span>{contactInfo.address}</span>
                                </div>
                            </div>
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
                                <motion.a
                                    href={callToAction.href}
                                    className="text-lg font-bold tracking-widest text-primary transition-colors hover:text-primary/80"
                                    variants={itemVariants}
                                >
                                    {callToAction.text}
                                </motion.a>
                            </motion.main>
                        </div>

                        <motion.footer className="mt-12 w-full" variants={itemVariants}>
                            <div className="grid grid-cols-1 gap-6 text-xs text-foreground sm:grid-cols-3">
                                <div className="flex items-center">
                                    <InfoIcon type="website" />
                                    <span>{contactInfo.website}</span>
                                </div>
                                <div className="flex items-center">
                                    <InfoIcon type="phone" />
                                    <span>{contactInfo.phone}</span>
                                </div>
                                <div className="flex items-center">
                                    <InfoIcon type="address" />
                                    <span>{contactInfo.address}</span>
                                </div>
                            </div>
                        </motion.footer>
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
