export interface PortfolioImage {
  id: string;
  url: string;
  title: string;
  category: 'Weddings' | 'Graduations' | 'Events' | 'Birthdays' | 'Parties' | 'Funerals';
  description?: string;
  site_section?: string;
}



export const categories = ['All', 'Weddings', 'Graduations', 'Events', 'Birthdays', 'Parties', 'Funerals'] as const;
