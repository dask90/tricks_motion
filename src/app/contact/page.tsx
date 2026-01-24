"use client";

import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function ContactPage() {
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
        <div className="min-h-screen pt-32 pb-20 px-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-20"
                >
                    <h1 className="text-6xl md:text-7xl mb-6">Get in Touch</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Let's create something beautiful together. I'd love to hear about your vision
                        and how we can bring it to life.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-16">
                    {/* Contact Information */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-12"
                    >
                        <div>
                            <h2 className="text-3xl mb-8">Let's Connect</h2>
                            <p className="text-muted-foreground leading-relaxed mb-8">
                                Whether you're planning a wedding, need professional portraits, or have a
                                creative project in mind, I'm here to help bring your vision to life.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <Mail className="w-5 h-5 mt-1 text-muted-foreground" />
                                <div>
                                    <div className="text-sm text-muted-foreground mb-1 tracking-wider uppercase">
                                        Email
                                    </div>
                                    <a
                                        href="mailto:hello@lensandlight.com"
                                        className="hover:text-muted-foreground transition-colors"
                                    >
                                        hello@lensandlight.com
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <Phone className="w-5 h-5 mt-1 text-muted-foreground" />
                                <div>
                                    <div className="text-sm text-muted-foreground mb-1 tracking-wider uppercase">
                                        Phone
                                    </div>
                                    <a
                                        href="tel:+15551234567"
                                        className="hover:text-muted-foreground transition-colors"
                                    >
                                        +1 (555) 123-4567
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <MapPin className="w-5 h-5 mt-1 text-muted-foreground" />
                                <div>
                                    <div className="text-sm text-muted-foreground mb-1 tracking-wider uppercase">
                                        Location
                                    </div>
                                    <p>Los Angeles, California</p>
                                    <p className="text-sm text-muted-foreground mt-1">Available for travel worldwide</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8">
                            <h3 className="text-xl mb-4">Working Hours</h3>
                            <div className="space-y-2 text-muted-foreground">
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
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm mb-2 tracking-wider uppercase">
                                    Name *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-input px-4 py-3 border border-border focus:border-foreground/40 transition-colors outline-none"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm mb-2 tracking-wider uppercase">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-input px-4 py-3 border border-border focus:border-foreground/40 transition-colors outline-none"
                                />
                            </div>

                            <div>
                                <label htmlFor="phone" className="block text-sm mb-2 tracking-wider uppercase">
                                    Phone
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full bg-input px-4 py-3 border border-border focus:border-foreground/40 transition-colors outline-none"
                                />
                            </div>

                            <div>
                                <label htmlFor="eventType" className="block text-sm mb-2 tracking-wider uppercase">
                                    Service Type *
                                </label>
                                <select
                                    id="eventType"
                                    name="eventType"
                                    value={formData.eventType}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-input px-4 py-3 border border-border focus:border-foreground/40 transition-colors outline-none"
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
                                <label htmlFor="eventDate" className="block text-sm mb-2 tracking-wider uppercase">
                                    Event Date (if applicable)
                                </label>
                                <input
                                    type="date"
                                    id="eventDate"
                                    name="eventDate"
                                    value={formData.eventDate}
                                    onChange={handleChange}
                                    className="w-full bg-input px-4 py-3 border border-border focus:border-foreground/40 transition-colors outline-none"
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm mb-2 tracking-wider uppercase">
                                    Message *
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows={6}
                                    className="w-full bg-input px-4 py-3 border border-border focus:border-foreground/40 transition-colors outline-none resize-none"
                                    placeholder="Tell me about your vision..."
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-foreground text-background py-4 hover:bg-foreground/90 transition-all flex items-center justify-center gap-2 group"
                            >
                                <span className="tracking-widest uppercase text-sm">Send Message</span>
                                <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </form>

                        <p className="text-sm text-muted-foreground mt-6 text-center">
                            I typically respond within 24-48 hours. For urgent inquiries, please call directly.
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
