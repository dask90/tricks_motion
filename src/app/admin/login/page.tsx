"use client";

import { useState } from 'react';
import { supabase } from '../../../lib/supabase';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
        } else {
            window.location.href = '/admin/contacts';
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="bg-card w-full max-w-md p-8 rounded-xl border border-border">
                <h1 className="text-2xl mb-6 text-center">Admin Login</h1>
                
                {error && (
                    <div className="bg-red-500/10 text-red-500 p-3 rounded-lg text-sm mb-4 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm mb-2 text-muted-foreground uppercase tracking-wider">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-input border border-border px-4 py-3 outline-none focus:border-foreground/40 transition-colors"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm mb-2 text-muted-foreground uppercase tracking-wider">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-input border border-border px-4 py-3 outline-none focus:border-foreground/40 transition-colors"
                            required
                        />
                    </div>
                    
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-foreground text-background py-3 mt-6 hover:bg-foreground/90 transition-colors disabled:opacity-50 tracking-widest uppercase text-sm"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
}
