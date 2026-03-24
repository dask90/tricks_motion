"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';

type ContactMessage = {
    id: string;
    created_at: string;
    name: string;
    email: string;
    phone: string | null;
    eventType: string;
    eventDate: string | null;
    message: string;
};

export default function ContactsAdminPage() {
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuthAndFetch = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            
            if (!session) {
                window.location.href = '/admin/login';
                return;
            }

            try {
                const { data, error } = await supabase
                    .from('contacts')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setMessages(data || []);
            } catch (error) {
                console.error('Error fetching messages:', error);
            } finally {
                setLoading(false);
            }
        };

        checkAuthAndFetch();
    }, []);

    if (loading) {
        return <div className="min-h-screen pt-32 px-6 flex justify-center">Loading contacts...</div>;
    }

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
            <h1 className="text-2xl sm:text-3xl font-medium mb-6 sm:mb-8">Contact Submissions</h1>
            
            <div className="bg-card rounded-xl border border-border overflow-hidden">
                    <div className="overflow-x-auto">
                        {/* Desktop View */}
                        <table className="w-full text-left text-sm whitespace-nowrap hidden md:table">
                            <thead className="bg-muted/50 border-b border-border">
                                <tr>
                                    <th className="px-6 py-4 font-medium tracking-wider uppercase text-xs">Date</th>
                                    <th className="px-6 py-4 font-medium tracking-wider uppercase text-xs">Name</th>
                                    <th className="px-6 py-4 font-medium tracking-wider uppercase text-xs">Contact Info</th>
                                    <th className="px-6 py-4 font-medium tracking-wider uppercase text-xs">Service & Date</th>
                                    <th className="px-6 py-4 font-medium tracking-wider uppercase text-xs">Message</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {messages.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                                            No messages found.
                                        </td>
                                    </tr>
                                ) : (
                                    messages.map((msg) => (
                                        <tr key={msg.id} className="hover:bg-muted/50 transition-colors">
                                            <td className="px-6 py-4 text-muted-foreground">
                                                {new Date(msg.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 font-medium">
                                                {msg.name}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <a href={`mailto:${msg.email}`} className="hover:underline">{msg.email}</a>
                                                    {msg.phone && <a href={`tel:${msg.phone}`} className="text-muted-foreground hover:underline">{msg.phone}</a>}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className="capitalize">{msg.eventType}</span>
                                                    {msg.eventDate && <span className="text-muted-foreground">{msg.eventDate}</span>}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 max-w-xs whitespace-normal line-clamp-3">
                                                {msg.message}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>

                        {/* Mobile View */}
                        <div className="md:hidden divide-y divide-border">
                            {messages.length === 0 ? (
                                <div className="p-6 text-center text-muted-foreground">No messages found.</div>
                            ) : (
                                messages.map((msg) => (
                                    <div key={msg.id} className="p-4 sm:p-5 space-y-4">
                                        <div className="flex justify-between items-start gap-4">
                                            <div className="flex-1 min-w-0">
                                                <div className="font-medium text-base truncate">{msg.name}</div>
                                                <div className="text-xs text-muted-foreground mt-1">{new Date(msg.created_at).toLocaleDateString()}</div>
                                            </div>
                                            <div className="shrink-0 flex flex-col items-end gap-1.5 text-xs text-right">
                                                <span className="bg-muted text-muted-foreground px-2 py-1 rounded-md capitalize font-medium">{msg.eventType}</span>
                                                {msg.eventDate && <span className="text-muted-foreground/80">{msg.eventDate}</span>}
                                            </div>
                                        </div>
                                        
                                        <div className="bg-muted/30 rounded-lg p-3 space-y-1.5 text-sm">
                                            <div className="flex items-center gap-2">
                                                <span className="text-muted-foreground uppercase tracking-widest text-[10px]">Email</span>
                                                <a href={`mailto:${msg.email}`} className="hover:underline truncate">{msg.email}</a>
                                            </div>
                                            {msg.phone && (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-muted-foreground uppercase tracking-widest text-[10px]">Phone</span>
                                                    <a href={`tel:${msg.phone}`} className="hover:underline truncate">{msg.phone}</a>
                                                </div>
                                            )}
                                        </div>

                                        <div className="text-sm">
                                            <span className="block text-muted-foreground uppercase tracking-widest text-[10px] mb-2">Message</span>
                                            <p className="whitespace-pre-wrap text-foreground/90 leading-relaxed border-l-2 border-border/50 pl-3">
                                                {msg.message}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
        </div>
    );
}
