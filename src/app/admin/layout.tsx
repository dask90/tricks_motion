"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const isLogin = pathname === '/admin/login';

    if (isLogin) {
        return <>{children}</>;
    }

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/admin/login');
    };

    return (
        <div className="min-h-screen flex flex-col pt-20">
            <div className="bg-muted/30 border-b border-border">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <nav className="flex items-center gap-2 sm:gap-4 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
                        <Link 
                            href="/admin/contacts" 
                            className={`px-4 py-2 rounded-md text-sm sm:text-base whitespace-nowrap transition-colors ${pathname === '/admin/contacts' ? 'bg-foreground text-background' : 'hover:bg-muted'}`}
                        >
                            Contact Submissions
                        </Link>
                        <Link 
                            href="/admin/gallery" 
                            className={`px-4 py-2 rounded-md text-sm sm:text-base whitespace-nowrap transition-colors ${pathname === '/admin/gallery' ? 'bg-foreground text-background' : 'hover:bg-muted'}`}
                        >
                            Portfolio Gallery
                        </Link>
                    </nav>
                    <button 
                        onClick={handleSignOut}
                        className="text-xs sm:text-sm px-4 py-2 border border-border focus:border-foreground/40 hover:bg-muted/50 transition-colors uppercase tracking-wider shrink-0 w-full sm:w-auto"
                    >
                        Sign Out
                    </button>
                </div>
            </div>
            <main className="flex-1 bg-background">
                {children}
            </main>
        </div>
    );
}
