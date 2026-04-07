export interface PortfolioImage {
  id: string;
  url: string;
  title: string;
  category: string;
  description?: string;
  site_section?: string;
}

export interface CategoryMetadata {
  title: string;
  heroImage: string;
  subtitle: string;
  description: string;
}

// These are now dynamic in Supabase. 
// Use usePortfolio() hook in client components.
