"use client";

import * as React from "react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Mail, Phone, Instagram, Twitter, ArrowUpRight } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export function Navigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);

  const links = [
    { path: '/', label: 'Home' },
    { path: '/portfolio', label: 'Portfolio' },
    { path: '/about', label: 'About Us' },
    { path: '/contact', label: 'Contact' },
  ];

  // Prevent scrolling when drawer is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close menu when route changes
  React.useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xl sm:text-2xl tracking-wider z-50 relative">
              <span className="font-serif">NhyiraShots</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8 lg:gap-12">
              {links.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className="relative text-sm tracking-widest hover:text-foreground/70 transition-colors uppercase"
                >
                  {link.label}
                  {pathname === link.path && (
                    <motion.div
                      layoutId="underline"
                      className="absolute -bottom-1 left-0 right-0 h-px bg-foreground"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
              <ThemeToggle />
            </div>

            {/* Mobile Nav Trigger & Theme Toggle */}
            <div className="flex items-center gap-2 md:hidden">
              <ThemeToggle />
              <button
                onClick={() => setIsOpen(true)}
                className="p-2 -mr-2 text-foreground focus:outline-none hover:text-foreground/70 transition-colors"
                aria-label="Open menu"
              >
                <Menu className="size-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              aria-hidden="true"
            />

            {/* Slide-in Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="absolute top-0 right-0 bottom-0 w-[85%] max-w-sm bg-background border-l border-border shadow-2xl flex flex-col justify-between p-6 sm:p-8 overflow-y-auto"
            >
              {/* Drawer Header */}
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-border/60">
                  <span className="font-serif text-lg tracking-wider">Menu</span>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 -mr-2 text-foreground hover:text-foreground/70 transition-colors rounded-full hover:bg-secondary"
                    aria-label="Close menu"
                  >
                    <X className="size-5" />
                  </button>
                </div>

                {/* Navigation Links */}
                <div className="py-8 space-y-4">
                  {links.map((link, idx) => {
                    const isActive = pathname === link.path;
                    return (
                      <motion.div
                        key={link.path}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * (idx + 1), duration: 0.3 }}
                      >
                        <Link
                          href={link.path}
                          className={`flex items-center justify-between py-3 text-xl font-serif tracking-wider transition-colors ${
                            isActive
                              ? 'text-foreground font-semibold'
                              : 'text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          <span>{link.label}</span>
                          {isActive ? (
                            <span className="w-1.5 h-1.5 rounded-full bg-foreground" />
                          ) : (
                            <ArrowUpRight className="size-4 opacity-40" />
                          )}
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Drawer Footer with Contact & Socials */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.3 }}
                className="pt-6 border-t border-border/60 space-y-5"
              >
                <div>
                  <div className="text-[11px] uppercase tracking-widest text-muted-foreground mb-2">
                    Direct Contact
                  </div>
                  <a
                    href="mailto:nhyirashots@gmail.com"
                    className="flex items-center gap-2.5 text-xs text-foreground/80 hover:text-foreground transition-colors py-1"
                  >
                    <Mail className="size-3.5 text-muted-foreground" />
                    <span>nhyirashots@gmail.com</span>
                  </a>
                  <a
                    href="tel:+233248498137"
                    className="flex items-center gap-2.5 text-xs text-foreground/80 hover:text-foreground transition-colors py-1"
                  >
                    <Phone className="size-3.5 text-muted-foreground" />
                    <span>+233 (024) 849 8137</span>
                  </a>
                </div>

                {/* Social Links */}
                <div className="flex items-center gap-4 pt-1">
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram className="size-4" />
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Twitter"
                  >
                    <Twitter className="size-4" />
                  </a>
                </div>

                <p className="text-[10px] text-muted-foreground/70 pt-2">
                  &copy; {new Date().getFullYear()} NhyiraShots. All rights reserved.
                </p>
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
