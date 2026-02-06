import { Instagram, Twitter, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 sm:gap-8">
          <div className="text-center md:text-left">
            <div className="text-xl sm:text-2xl font-serif mb-2">Tricks Motion</div>
            <p className="text-muted-foreground text-xs sm:text-sm">
              Bringing your ideas to life through motion.
            </p>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-muted-foreground transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="size-5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-muted-foreground transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="size-5" />
            </a>
            <a
              href="mailto:contact@tricksmotion.com"
              className="hover:text-muted-foreground transition-colors"
              aria-label="Email"
            >
              <Mail className="size-5" />
            </a>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-border text-center text-xs sm:text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Tricks Motion. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
