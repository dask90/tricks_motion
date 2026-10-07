import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { PortfolioImage, CategoryMetadata } from '../data/portfolioData';

export function usePortfolio() {
    const [images, setImages] = useState<PortfolioImage[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [categoryMetadata, setCategoryMetadata] = useState<Record<string, CategoryMetadata>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPortfolioData = async () => {
            try {
                // Fetch images and categories in parallel
                const [imagesRes, categoriesRes] = await Promise.all([
                    supabase
                        .from('portfolio_images')
                        .select('*')
                        .order('created_at', { ascending: false }),
                    supabase
                        .from('portfolio_categories')
                        .select('*')
                        .order('name', { ascending: true })
                ]);

                if (imagesRes.error) throw imagesRes.error;
                if (categoriesRes.error) throw categoriesRes.error;

                // 1. Process Images
                if (imagesRes.data) {
                    const mappedImages: PortfolioImage[] = imagesRes.data.map((item: any) => ({
                        id: item.id,
                        url: item.url,
                        title: item.title,
                        category: item.category as any,
                        description: item.description || undefined,
                        site_section: item.site_section || 'Portfolio'
                    }));
                    setImages(mappedImages);
                }

                // 2. Process Categories
                if (categoriesRes.data) {
                    const dynamicCategories = ['All', ...categoriesRes.data.map((c: any) => c.name)];
                    setCategories(dynamicCategories);

                    const metadataMap: Record<string, CategoryMetadata> = {};
                    categoriesRes.data.forEach((c: any) => {
                        metadataMap[c.name] = {
                            title: c.name,
                            heroImage: c.hero_image || '',
                            subtitle: (c as any).subtitle || '',
                            description: c.description || ''
                        };
                    });
                    setCategoryMetadata(metadataMap);
                }
            } catch (error: any) {
                console.error('Error fetching portfolio data:', error?.message || error?.code || JSON.stringify(error) || error);
            } finally {
                setLoading(false);
            }
        };

        fetchPortfolioData();
    }, []);

    return { images, categories, categoryMetadata, loading };
}
