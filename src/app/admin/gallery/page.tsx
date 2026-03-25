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

    // Drag state
    const [draggedItemIdx, setDraggedItemIdx] = useState<number | null>(null);
    const [dragOverItemIdx, setDragOverItemIdx] = useState<number | null>(null);

    // Edit state
    const [editingImage, setEditingImage] = useState<PortfolioImage | null>(null);
    const [editFiles, setEditFiles] = useState<FileList | null>(null);
    const [editTitle, setEditTitle] = useState('');
    const [editSection, setEditSection] = useState('');
    const [editCategory, setEditCategory] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [savingEdit, setSavingEdit] = useState(false);

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
        } catch (error: any) {
            console.error('Error fetching images:', error);
            if (error?.message) console.error('Details:', error.message);
            Swal.fire({
                icon: 'error',
                title: 'Connection Error',
                text: 'Could not fetch images. Please check your network connection.',
                confirmButtonColor: '#000000',
            });
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

    const handleEditClick = (img: PortfolioImage) => {
        setEditingImage(img);
        setEditTitle(img.title);
        setEditSection(img.site_section || 'Portfolio');
        setEditCategory(img.category);
        setEditDescription(img.description || '');
        setEditFiles(null);
    };

    const handleEditSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingImage || !editTitle) return;

        setSavingEdit(true);
        try {
            let finalUrl = editingImage.url;

            if (editFiles && editFiles.length > 0) {
                const file = editFiles[0];
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
                const filePath = `images/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('portfolio')
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('portfolio')
                    .getPublicUrl(filePath);
                
                finalUrl = publicUrl;

                const urlParts = editingImage.url.split('/portfolio/');
                let oldFilePath = '';
                if (urlParts.length > 1) {
                    oldFilePath = urlParts[1];
                } else {
                    const oldName = editingImage.url.split('/').pop();
                    if (oldName) oldFilePath = `images/${oldName}`;
                }
                if (oldFilePath) {
                    await supabase.storage.from('portfolio').remove([oldFilePath]);
                }
            }

            const { data: updatedData, error: dbError } = await supabase
                .from('portfolio_images')
                .update({
                    title: editTitle,
                    category: editCategory,
                    site_section: editSection,
                    description: editDescription || null,
                    url: finalUrl
                })
                .eq('id', editingImage.id)
                .select();

            if (dbError) throw dbError;
            if (!updatedData || updatedData.length === 0) {
                throw new Error("Missing UPDATE permissions! Please go to your Supabase Dashboard -> Authentication -> Policies, and enable the 'UPDATE' policy for the 'portfolio_images' table.");
            }

            setEditingImage(null);
            fetchImages();
            Swal.fire({ icon: 'success', title: 'Saved!', text: 'Changes saved successfully.', confirmButtonColor: '#000000', timer: 1500, showConfirmButton: false });
        } catch (error: any) {
            console.error('Error saving:', error);
            Swal.fire({ icon: 'error', title: 'Save Failed', text: error.message, confirmButtonColor: '#000000' });
        } finally {
            setSavingEdit(false);
        }
    };

    const handleDragStart = (e: React.DragEvent, index: number) => {
        setDraggedItemIdx(index);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', index.toString());
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (dragOverItemIdx !== index) {
            setDragOverItemIdx(index);
        }
    };

    const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
        e.preventDefault();
        setDragOverItemIdx(null);
        
        if (activeTab !== 'Homepage Featured') return;
        if (draggedItemIdx === null || draggedItemIdx === dropIndex) return;

        const items = [...filteredViewImages];
        const draggedItem = items[draggedItemIdx];
        
        items.splice(draggedItemIdx, 1);
        items.splice(dropIndex, 0, draggedItem);

        const now = Date.now();
        const updates = items.map((item, idx) => ({
            id: item.id,
            created_at: new Date(now - idx * 1000).toISOString()
        }));

        setImages(prev => {
            const newImages = [...prev];
            updates.forEach(update => {
                const index = newImages.findIndex(img => img.id === update.id);
                if (index !== -1) {
                    newImages[index] = { ...newImages[index], created_at: update.created_at };
                }
            });
            return newImages.sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        });

        try {
            const updatePromises = updates.map(u => 
                supabase.from('portfolio_images')
                .update({ created_at: u.created_at })
                .eq('id', u.id)
                .select()
            );
            
            const results = await Promise.all(updatePromises);
            const errs = results.filter(r => r.error);
            const emptyUpdates = results.filter(r => !r.error && (!r.data || r.data.length === 0));
            
            if (errs.length > 0) throw errs[0].error;
            if (emptyUpdates.length > 0) {
                throw new Error("Missing UPDATE permissions! Please go to your Supabase Dashboard and add an 'UPDATE' policy for the 'portfolio_images' table.");
            }
        } catch (error: any) {
            console.error('Reorder error:', error);
            if (error?.message) console.error('Details:', error.message);
            fetchImages();
            Swal.fire({ icon: 'error', title: 'Reorder Failed', text: 'Could not save the new order.', confirmButtonColor: '#000000' });
        }
        
        setDraggedItemIdx(null);
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
                            {filteredViewImages.map((img, index) => (
                                <div 
                                    key={img.id} 
                                    draggable={activeTab === 'Homepage Featured'}
                                    onDragStart={(e) => handleDragStart(e, index)}
                                    onDragOver={(e) => handleDragOver(e, index)}
                                    onDrop={(e) => handleDrop(e, index)}
                                    onDragEnd={() => setDragOverItemIdx(null)}
                                    className={`bg-card border border-border rounded-xl overflow-hidden flex flex-col group transition-all ${activeTab === 'Homepage Featured' ? 'cursor-move' : ''} ${dragOverItemIdx === index ? 'border-foreground border-2 scale-105 opacity-80' : ''} ${draggedItemIdx === index ? 'opacity-50' : ''}`}
                                >
                                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                                        <img 
                                            src={img.url} 
                                            alt={img.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
                                            <span className="bg-background/80 backdrop-blur-sm text-foreground text-[10px] px-2 py-1 rounded-md uppercase tracking-wider font-medium shadow-sm">
                                                {img.category}
                                            </span>
                                            {activeTab === 'Homepage Featured' && (
                                                <span className="bg-foreground text-background text-[10px] px-2 py-1 rounded-md uppercase tracking-wider font-medium shadow-sm flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    Drag to Reorder
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="p-4 flex flex-col flex-1">
                                        <div className="flex justify-between items-start gap-2 mb-2">
                                            <h3 className="font-medium truncate" title={img.title}>{img.title}</h3>
                                            <div className="flex items-center gap-3 shrink-0">
                                                <button 
                                                    onClick={() => handleEditClick(img)}
                                                    className="text-blue-500 hover:text-blue-600 text-[10px] uppercase tracking-wider"
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(img.id, img.url)}
                                                    className="text-red-500 hover:text-red-600 text-[10px] uppercase tracking-wider"
                                                >
                                                    Delete
                                                </button>
                                            </div>
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

            {/* Edit Modal */}
            {editingImage && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
                    <div className="bg-card w-full max-w-md rounded-xl border border-border p-6 shadow-xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-medium">Edit Image Details</h2>
                            <button onClick={() => setEditingImage(null)} className="text-muted-foreground hover:text-foreground text-xl">
                                ✕
                            </button>
                        </div>
                        
                        <form onSubmit={handleEditSave} className="space-y-4">
                            <div>
                                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">Update Image File (Optional)</label>
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={(e) => setEditFiles(e.target.files)}
                                    className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-muted file:text-foreground hover:file:bg-muted/80 cursor-pointer"
                                />
                                <p className="text-[10px] text-muted-foreground mt-1 tracking-wide">Leave blank to keep the current image.</p>
                            </div>
                            
                            <div>
                                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">Title *</label>
                                <input 
                                    type="text" 
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    className="w-full bg-input border border-border px-4 py-2 outline-none focus:border-foreground/40 transition-colors text-sm"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">Section *</label>
                                <select 
                                    value={editSection}
                                    onChange={(e) => setEditSection(e.target.value)}
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
                                    value={editCategory}
                                    onChange={(e) => setEditCategory(e.target.value)}
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
                                    value={editDescription}
                                    onChange={(e) => setEditDescription(e.target.value)}
                                    className="w-full bg-input border border-border px-4 py-2 outline-none focus:border-foreground/40 transition-colors text-sm resize-none"
                                    rows={3}
                                />
                            </div>

                            <div className="flex gap-3 mt-8">
                                <button 
                                    type="button"
                                    onClick={() => setEditingImage(null)}
                                    className="flex-1 border border-border py-3 hover:bg-muted transition-colors tracking-widest uppercase text-xs"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    disabled={savingEdit || !editTitle}
                                    className="flex-1 bg-foreground text-background py-3 hover:bg-foreground/90 transition-colors disabled:opacity-50 tracking-widest uppercase text-xs"
                                >
                                    {savingEdit ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
