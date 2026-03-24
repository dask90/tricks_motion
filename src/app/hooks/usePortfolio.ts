import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { PortfolioImage, portfolioImages as staticImages } from '../data/portfolioData';

export function usePortfolio() {
    const [images, setImages] = useState<PortfolioImage[]>(staticImages);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const { data, error } = await supabase
                    .from('portfolio_images')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;
                
                if (data && data.length > 0) {
                    // Map database columns to the PortfolioImage interface shape
                    const mappedData: PortfolioImage[] = data.map((item: any) => ({
                        id: item.id,
                        url: item.url,
                        title: item.title,
                        category: item.category as any, // Cast to match string literal union
                        description: item.description || undefined,
                        site_section: item.site_section || 'Portfolio'
                    }));
                    setImages(mappedData);
                }
            } catch (error) {
                console.error('Error fetching portfolio images:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchImages();
    }, []);

    return { images, loading };
}
