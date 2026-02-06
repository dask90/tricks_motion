export interface PortfolioImage {
  id: string;
  url: string;
  title: string;
  category: 'Weddings' | 'Graduations' | 'Events' | 'Birthdays' | 'Parties' | 'Funerals';
  description?: string;
}

export const portfolioImages: PortfolioImage[] = [
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1609054422770-1e7f59be4e91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmFtYXRpYyUyMHBvcnRyYWl0JTIwcGhvdG9ncmFwaHl8ZW58MXx8fHwxNzY5MTEyMzQwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Dramatic Portrait',
    category: 'Events',
    description: 'A study in light and shadow, capturing the essence of emotion.',
  },
  {
    id: '2',
    url: 'https://images.unsplash.com/photo-1697335638916-ecddb1af171f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaW5lbWF0aWMlMjB3ZWRkaW5nJTIwcGhvdG9ncmFwaHl8ZW58MXx8fHwxNzY5MTEyMzM5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Wedding Moments',
    category: 'Weddings',
    description: 'Timeless moments from a beautiful celebration.',
  },
  {
    id: '3',
    url: 'https://images.unsplash.com/photo-1685699584994-c551f7fae21d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwcGhvdG9ncmFwaHklMjBibGFjayUyMHdoaXRlfGVufDF8fHx8MTc2OTExMjMzOXww&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Fashion Editorial',
    category: 'Parties',
    description: 'High fashion meets artistic expression.',
  },
  {
    id: '4',
    url: 'https://images.unsplash.com/photo-1762436933065-fe6d7f51d4f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cmJhbiUyMHN0cmVldCUyMHBob3RvZ3JhcGh5fGVufDF8fHx8MTc2OTEwMTExM3ww&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Urban Stories',
    category: 'Events',
    description: 'Life unfolding in the city streets.',
  },
  {
    id: '5',
    url: 'https://images.unsplash.com/photo-1574800048190-2839bc9ff666?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsJTIwYXJjaGl0ZWN0dXJlJTIwcGhvdG9ncmFwaHl8ZW58MXx8fHwxNzY5MTEyMzQwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Minimal Lines',
    category: 'Graduations',
    description: 'Architecture as art.',
  },
  {
    id: '6',
    url: 'https://images.unsplash.com/photo-1627961888164-b79f406b245b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwaG90b2dyYXBoZXIlMjBwb3J0cmFpdHxlbnwxfHx8fDE3Njg5OTkyNDd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Professional Portrait',
    category: 'Funerals',
    description: 'Capturing personality and character.',
  },
];

export const categories = ['All', 'Weddings', 'Graduations', 'Events', 'Birthdays', 'Parties', 'Funerals'] as const;
