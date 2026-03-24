"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { categories } from '../../data/portfolioData';
import Swal from 'sweetalert2';

type PortfolioImage = {
    id: string;
    created_at: string;
    url: string;
    title: string;
    category: string;
    description: string | null;
    site_section?: string;
};

export default function GalleryAdminPage() {
    const [images, setImages] = useState<PortfolioImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    
    // Form state
    const [files, setFiles] = useState<FileList | null>(null);
    const [title, setTitle] = useState('');
    const [siteSection, setSiteSection] = useState('Portfolio');
    const [category, setCategory] = useState<string>(categories[1]); // Default to first actual category (not 'All')
    const [description, setDescription] = useState('');

    // View state
    const [activeTab, setActiveTab] = useState('Portfolio');

    useEffect(() => {
        const checkAuthAndFetch = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                window.location.href = '/admin/login';
                return;
            }
            fetchImages();
        };
        checkAuthAndFetch();
    }, []);

    const fetchImages = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('portfolio_images')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setImages(data || []);
        } catch (error) {
            console.error('Error fetching images:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!files || files.length === 0 || !title) return;

        setUploading(true);
        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                // 1. Upload file to Supabase Storage
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
                const filePath = `images/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('portfolio')
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                // 2. Get public URL
                const { data: { publicUrl } } = supabase.storage
                    .from('portfolio')
                    .getPublicUrl(filePath);

                // We now allow capturing the category for all sections, so users know it's a 'wedding' or 'graduation'
                const finalCategory = category;
                const imageTitle = files.length > 1 ? `${title} ${i + 1}` : title;

                // 3. Insert into database
                const { error: dbError } = await supabase
                    .from('portfolio_images')
                    .insert([{
                        url: publicUrl,
                        title: imageTitle,
                        category: finalCategory,
                        description: description || null,
                        site_section: siteSection
                    }]);

                if (dbError) throw dbError;
            }

            // Reset form and refresh 
            setFiles(null);
            setTitle('');
            setDescription('');
            const fileInput = document.getElementById('file-upload') as HTMLInputElement;
            if (fileInput) fileInput.value = '';
            
            fetchImages();
            Swal.fire({
                icon: 'success',
                title: 'Upload Successful!',
                text: `Successfully uploaded ${files.length} image(s)!`,
                confirmButtonColor: '#000000',
            });
        } catch (error: any) {
            console.error('Error uploading:', error);
            Swal.fire({
                icon: 'error',
                title: 'Upload Failed',
                text: error.message,
                confirmButtonColor: '#000000',
            });
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: string, url: string) => {
        const result = await Swal.fire({
            title: 'Delete Image?',
            text: "Are you sure you want to delete this image? You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (!result.isConfirmed) return;

        try {
            // Extract the file path from the URL for storage deletion
            // Example URL: https://[project].supabase.co/storage/v1/object/public/portfolio/images/filename.jpg
            // We need 'images/filename.jpg'
            const urlParts = url.split('/portfolio/');
            let filePathInStorage = '';
            if (urlParts.length > 1) {
                filePathInStorage = urlParts[1];
            } else {
                // Fallback if URL format changes or is unexpected
                const fileName = url.split('/').pop();
                if (fileName) filePathInStorage = `images/${fileName}`;
            }

            if (filePathInStorage) {
                // 1. Delete from Supabase Storage
                const { error: storageError } = await supabase.storage
                    .from('portfolio')
                    .remove([filePathInStorage]);

                if (storageError) throw storageError;
            }

            // 2. Delete from database
            const { error: dbError } = await supabase
                .from('portfolio_images')
                .delete()
                .eq('id', id);

            if (dbError) throw dbError;

            fetchImages();
            
            Swal.fire({
                icon: 'success',
                title: 'Deleted!',
                text: 'The image has been deleted successfully.',
                confirmButtonColor: '#000000',
                timer: 1500,
                showConfirmButton: false
            });
        } catch (error: any) {
            console.error('Error deleting:', error);
            Swal.fire({
                icon: 'error',
                title: 'Delete Failed',
                text: error.message,
                confirmButtonColor: '#000000',
            });
        }
    };

    if (loading && images.length === 0) {
        return <div className="p-8 text-center text-muted-foreground">Loading gallery...</div>;
    }

    const filteredViewImages = images.filter(img => (img.site_section || 'Portfolio') === activeTab);

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
            <div className="grid lg:grid-cols-3 gap-8 sm:gap-12">
                
                {/* Upload Form - Left Side on Desktop */}
                <div className="lg:col-span-1">
                    <div className="bg-card rounded-xl border border-border p-6 sticky top-32">
                        <h2 className="text-xl mb-6 font-medium">Add New Image</h2>
                        
                        <form onSubmit={handleUpload} className="space-y-4">
                            <div>
                                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">Image Files (Select Multiple) *</label>
                                <input 
                                    id="file-upload"
                                    type="file" 
                                    accept="image/*"
                                    multiple
                                    onChange={(e) => setFiles(e.target.files)}
                                    className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-muted file:text-foreground hover:file:bg-muted/80 cursor-pointer"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">Title *</label>
                                <input 
                                    type="text" 
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full bg-input border border-border px-4 py-2 outline-none focus:border-foreground/40 transition-colors text-sm"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">Where should this appear? *</label>
                                <select 
                                    value={siteSection}
                                    onChange={(e) => setSiteSection(e.target.value)}
                                    className="w-full bg-input border border-border px-4 py-2 outline-none focus:border-foreground/40 transition-colors text-sm"
                                    required
                                >
                                    <option value="Portfolio">Main Portfolio Grid</option>
                                    <option value="Homepage Slider">Homepage Top Slider</option>
                                    <option value="Homepage Featured">Homepage Featured Grid</option>
                                    <option value="About Page">About Page Portrait</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">Category *</label>
                                <select 
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full bg-input border border-border px-4 py-2 outline-none focus:border-foreground/40 transition-colors text-sm capitalize"
                                    required
                                >
                                    {categories.filter(c => c !== 'All').map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">Description</label>
                                <textarea 
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full bg-input border border-border px-4 py-2 outline-none focus:border-foreground/40 transition-colors text-sm resize-none"
                                    rows={3}
                                />
                            </div>

                            <button 
                                type="submit"
                                disabled={uploading || !files || files.length === 0 || !title}
                                className="w-full bg-foreground text-background py-3 mt-4 hover:bg-foreground/90 transition-colors disabled:opacity-50 tracking-widest uppercase text-xs"
                            >
                                {uploading ? 'Uploading...' : 'Upload Image(s)'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Gallery View - Right Side on Desktop */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <h2 className="text-2xl sm:text-3xl font-medium">Uploaded Images ({filteredViewImages.length})</h2>
                        <select 
                            value={activeTab}
                            onChange={(e) => setActiveTab(e.target.value)}
                            className="bg-muted text-foreground p-2 rounded-md outline-none text-sm border border-border"
                        >
                            <option value="Portfolio">Portfolio</option>
                            <option value="Homepage Slider">Homepage Slider</option>
                            <option value="Homepage Featured">Homepage Featured</option>
                            <option value="About Page">About Page</option>
                        </select>
                    </div>
                    
                    {filteredViewImages.length === 0 ? (
                        <div className="bg-card border border-border rounded-xl p-12 text-center text-muted-foreground">
                            No images uploaded to this section yet.
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                            {filteredViewImages.map(img => (
                                <div key={img.id} className="bg-card border border-border rounded-xl overflow-hidden flex flex-col group">
                                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                                        <img 
                                            src={img.url} 
                                            alt={img.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute top-2 right-2">
                                            <span className="bg-background/80 backdrop-blur-sm text-foreground text-[10px] px-2 py-1 rounded-md uppercase tracking-wider font-medium">
                                                {img.category}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-4 flex flex-col flex-1">
                                        <div className="flex justify-between items-start gap-2 mb-2">
                                            <h3 className="font-medium truncate" title={img.title}>{img.title}</h3>
                                            <button 
                                                onClick={() => handleDelete(img.id, img.url)}
                                                className="text-red-500 hover:text-red-600 text-[10px] uppercase tracking-wider shrink-0"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                        {img.description && (
                                            <p className="text-xs text-muted-foreground line-clamp-2 mt-auto">
                                                {img.description}
                                            </p>
                                        )}
                                        <div className="text-[10px] text-muted-foreground/60 mt-4">
                                            Added {new Date(img.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
