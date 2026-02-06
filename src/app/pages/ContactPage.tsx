"use client";

import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        eventDate: '',
        eventType: '',
        message: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        // Handle form submission
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="min-h-screen pt-20 sm:pt-24 lg:pt-32 pb-12 sm:pb-16 lg:pb-20 px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12 sm:mb-16 lg:mb-20"
                >
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-4 sm:mb-6">Get in Touch</h1>
                    <p className="text-muted-foreground text-sm sm:text-base lg:text-lg max-w-2xl mx-auto px-4">
                        Let's create something beautiful together. I'd love to hear about your vision
                        and how we can bring it to life.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
                    {/* Contact Information */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-8 sm:space-y-12"
                    >
                        <div>
                            <h2 className="text-2xl sm:text-3xl mb-6 sm:mb-8">Let's Connect</h2>
                            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-6 sm:mb-8">
                                Whether you're planning a wedding, need professional portraits, or have a
                                creative project in mind, I'm here to help bring your vision to life.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <Mail className="w-5 h-5 mt-1 text-muted-foreground flex-shrink-0" />
                                <div>
                                    <div className="text-xs sm:text-sm text-muted-foreground mb-1 tracking-wider uppercase">
                                        Email
                                    </div>
                                    <a
                                        href="mailto:hello@lensandlight.com"
                                        className="text-sm sm:text-base hover:text-muted-foreground transition-colors break-all"
                                    >
                                        hello@lensandlight.com
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <Phone className="w-5 h-5 mt-1 text-muted-foreground flex-shrink-0" />
                                <div>
                                    <div className="text-xs sm:text-sm text-muted-foreground mb-1 tracking-wider uppercase">
                                        Phone
                                    </div>
                                    <a
                                        href="tel:+15551234567"
                                        className="text-sm sm:text-base hover:text-muted-foreground transition-colors"
                                    >
                                        +1 (555) 123-4567
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <MapPin className="w-5 h-5 mt-1 text-muted-foreground flex-shrink-0" />
                                <div>
                                    <div className="text-xs sm:text-sm text-muted-foreground mb-1 tracking-wider uppercase">
                                        Location
                                    </div>
                                    <p className="text-sm sm:text-base">Los Angeles, California</p>
                                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">Available for travel worldwide</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 sm:pt-8">
                            <h3 className="text-lg sm:text-xl mb-4">Working Hours</h3>
                            <div className="space-y-2 text-muted-foreground text-sm sm:text-base">
                                <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                                <p>Saturday: By appointment</p>
                                <p>Sunday: Closed</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-xs sm:text-sm mb-2 tracking-wider uppercase">
                                    Name *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-input px-4 py-3 border border-border focus:border-foreground/40 transition-colors outline-none text-sm sm:text-base"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-xs sm:text-sm mb-2 tracking-wider uppercase">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-input px-4 py-3 border border-border focus:border-foreground/40 transition-colors outline-none text-sm sm:text-base"
                                />
                            </div>

                            <div>
                                <label htmlFor="phone" className="block text-xs sm:text-sm mb-2 tracking-wider uppercase">
                                    Phone
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full bg-input px-4 py-3 border border-border focus:border-foreground/40 transition-colors outline-none text-sm sm:text-base"
                                />
                            </div>

                            <div>
                                <label htmlFor="eventType" className="block text-xs sm:text-sm mb-2 tracking-wider uppercase">
                                    Service Type *
                                </label>
                                <select
                                    id="eventType"
                                    name="eventType"
                                    value={formData.eventType}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-input px-4 py-3 border border-border focus:border-foreground/40 transition-colors outline-none text-sm sm:text-base"
                                >
                                    <option value="">Select a service</option>
                                    <option value="wedding">Wedding Photography</option>
                                    <option value="portrait">Portrait Session</option>
                                    <option value="fashion">Fashion/Editorial</option>
                                    <option value="commercial">Commercial Work</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="eventDate" className="block text-xs sm:text-sm mb-2 tracking-wider uppercase">
                                    Event Date (if applicable)
                                </label>
                                <input
                                    type="date"
                                    id="eventDate"
                                    name="eventDate"
                                    value={formData.eventDate}
                                    onChange={handleChange}
                                    className="w-full bg-input px-4 py-3 border border-border focus:border-foreground/40 transition-colors outline-none text-sm sm:text-base"
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-xs sm:text-sm mb-2 tracking-wider uppercase">
                                    Message *
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows={6}
                                    className="w-full bg-input px-4 py-3 border border-border focus:border-foreground/40 transition-colors outline-none resize-none text-sm sm:text-base"
                                    placeholder="Tell me about your vision..."
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-foreground text-background py-3 sm:py-4 hover:bg-foreground/90 transition-all flex items-center justify-center gap-2 group"
                            >
                                <span className="tracking-widest uppercase text-xs sm:text-sm">Send Message</span>
                                <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </form>

                        <p className="text-xs sm:text-sm text-muted-foreground mt-4 sm:mt-6 text-center">
                            I typically respond within 24-48 hours. For urgent inquiries, please call directly.
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
