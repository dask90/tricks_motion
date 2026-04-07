"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
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

type PortfolioCategory = {
    id: string;
    name: string;
    slug: string;
    hero_image: string | null;
    subtitle: string | null;
    description: string | null;
    created_at: string;
};

export default function GalleryAdminPage() {
    const [images, setImages] = useState<PortfolioImage[]>([]);
    const [categoriesList, setCategoriesList] = useState<PortfolioCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    
    // View state
    const [viewMode, setViewMode] = useState<'images' | 'categories'>('images');
    const [activeTab, setActiveTab] = useState('Portfolio');

    // Image Form state
    const [files, setFiles] = useState<FileList | null>(null);
    const [title, setTitle] = useState('');
    const [siteSection, setSiteSection] = useState('Portfolio');
    const [category, setCategory] = useState<string>(''); 
    const [description, setDescription] = useState('');

    // Category Form state
    const [catName, setCatName] = useState('');
    const [catHeroFile, setCatHeroFile] = useState<FileList | null>(null);
    const [catSubtitle, setCatSubtitle] = useState('');
    const [catDesc, setCatDesc] = useState('');

    // Drag state
    const [draggedItemIdx, setDraggedItemIdx] = useState<number | null>(null);
    const [dragOverItemIdx, setDragOverItemIdx] = useState<number | null>(null);

    // Edit state
    const [editingImage, setEditingImage] = useState<PortfolioImage | null>(null);
    const [editFiles, setEditFiles] = useState<FileList | null>(null);
    const [editingCategory, setEditingCategory] = useState<PortfolioCategory | null>(null);
    
    // Form fields for editing images
    const [editTitle, setEditTitle] = useState('');
    const [editSection, setEditSection] = useState('');
    const [editCategory, setEditCategory] = useState('');
    const [editDescription, setEditDescription] = useState('');

    // Category edit fields
    const [editCatName, setEditCatName] = useState('');
    const [editCatSubtitle, setEditCatSubtitle] = useState('');
    const [editCatDesc, setEditCatDesc] = useState('');
    const [editCatHeroFile, setEditCatHeroFile] = useState<FileList | null>(null);
    const [savingEdit, setSavingEdit] = useState(false);

    useEffect(() => {
        const checkAuthAndFetch = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                window.location.href = '/admin/login';
                return;
            }
            fetchInitialData();
        };
        checkAuthAndFetch();
    }, []);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            await Promise.all([fetchImages(), fetchCategories()]);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        const { data, error } = await supabase
            .from('portfolio_categories')
            .select('*')
            .order('name', { ascending: true });
        
        if (error) {
            console.error('Error fetching categories:', error);
            return;
        }
        setCategoriesList(data || []);
        if (data && data.length > 0 && !category) {
            setCategory(data[0].name);
        }
    };

    const fetchImages = async () => {
        try {
            const { data, error } = await supabase
                .from('portfolio_images')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setImages(data || []);
        } catch (error: any) {
            console.error('Error fetching images:', error);
            Swal.fire({
                icon: 'error',
                title: 'Connection Error',
                text: 'Could not fetch images.',
                confirmButtonColor: '#000000',
            });
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!files || files.length === 0 || !title || !category) return;

        setUploading(true);
        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
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

                const finalCategory = category;
                const imageTitle = files.length > 1 ? `${title} ${i + 1}` : title;

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
            text: "Are you sure you want to delete this image?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (!result.isConfirmed) return;

        try {
            const urlParts = url.split('/portfolio/');
            let filePathInStorage = '';
            if (urlParts.length > 1) {
                filePathInStorage = urlParts[1];
            } else {
                const fileName = url.split('/').pop();
                if (fileName) filePathInStorage = `images/${fileName}`;
            }

            if (filePathInStorage) {
                await supabase.storage.from('portfolio').remove([filePathInStorage]);
            }

            const { error: dbError } = await supabase.from('portfolio_images').delete().eq('id', id);
            if (dbError) throw dbError;

            fetchImages();
            Swal.fire({ icon: 'success', title: 'Deleted!', timer: 1500, showConfirmButton: false });
        } catch (error: any) {
            Swal.fire({ icon: 'error', title: 'Delete Failed', text: error.message });
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
                const { error: uploadError } = await supabase.storage.from('portfolio').upload(filePath, file);
                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage.from('portfolio').getPublicUrl(filePath);
                finalUrl = publicUrl;

                const urlParts = editingImage.url.split('/portfolio/');
                const oldFilePath = urlParts.length > 1 ? urlParts[1] : `images/${editingImage.url.split('/').pop()}`;
                await supabase.storage.from('portfolio').remove([oldFilePath]);
            }

            const { error: dbError } = await supabase
                .from('portfolio_images')
                .update({ title: editTitle, category: editCategory, site_section: editSection, description: editDescription || null, url: finalUrl })
                .eq('id', editingImage.id);

            if (dbError) throw dbError;

            setEditingImage(null);
            fetchImages();
            Swal.fire({ icon: 'success', title: 'Saved!', timer: 1500, showConfirmButton: false });
        } catch (error: any) {
            Swal.fire({ icon: 'error', title: 'Save Failed', text: error.message });
        } finally {
            setSavingEdit(false);
        }
    };

    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!catName) return;

        setUploading(true);
        try {
            let heroImageUrl = '';
            if (catHeroFile && catHeroFile.length > 0) {
                const file = catHeroFile[0];
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
                const filePath = `categories/${fileName}`;
                const { error: uploadError } = await supabase.storage.from('portfolio').upload(filePath, file);
                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage.from('portfolio').getPublicUrl(filePath);
                heroImageUrl = publicUrl;
            }

            const slug = catName.toLowerCase().replace(/\s+/g, '-');
            const { error: dbError } = await supabase
                .from('portfolio_categories')
                .insert([{ name: catName, slug: slug, hero_image: heroImageUrl || null, subtitle: catSubtitle || null, description: catDesc || null }]);

            if (dbError) throw dbError;

            setCatName(''); setCatSubtitle(''); setCatDesc(''); setCatHeroFile(null);
            const fileInput = document.getElementById('cat-hero-upload') as HTMLInputElement;
            if (fileInput) fileInput.value = '';
            
            fetchCategories();
            Swal.fire({ icon: 'success', title: 'Category Added!', confirmButtonColor: '#000000' });
        } catch (error: any) {
            Swal.fire({ icon: 'error', title: 'Action Failed', text: error.message });
        } finally {
            setUploading(false);
        }
    };

    const handleEditCategoryClick = (cat: PortfolioCategory) => {
        setEditingCategory(cat);
        setEditCatName(cat.name);
        setEditCatSubtitle(cat.subtitle || '');
        setEditCatDesc(cat.description || '');
        setEditCatHeroFile(null);
    };

    const handleUpdateCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingCategory || !editCatName) return;

        setSavingEdit(true);
        try {
            let finalHeroUrl = editingCategory.hero_image;
            if (editCatHeroFile && editCatHeroFile.length > 0) {
                const file = editCatHeroFile[0];
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
                const filePath = `categories/${fileName}`;
                const { error: uploadError } = await supabase.storage.from('portfolio').upload(filePath, file);
                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage.from('portfolio').getPublicUrl(filePath);
                finalHeroUrl = publicUrl;
            }

            const { error: dbError } = await supabase
                .from('portfolio_categories')
                .update({ name: editCatName, subtitle: editCatSubtitle, description: editCatDesc, hero_image: finalHeroUrl })
                .eq('id', editingCategory.id);

            if (dbError) throw dbError;

            setEditingCategory(null);
            fetchCategories();
            Swal.fire({ icon: 'success', title: 'Saved!', confirmButtonColor: '#000000' });
        } catch (error: any) {
            Swal.fire({ icon: 'error', title: 'Save Failed', text: error.message });
        } finally {
            setSavingEdit(false);
        }
    };

    const handleDeleteCategory = async (id: string, name: string) => {
        const result = await Swal.fire({
            title: `Delete '${name}'?`,
            text: "This will Remove the category settings. Images will stay but lose their category link.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });
        if (!result.isConfirmed) return;
        try {
            const { error } = await supabase.from('portfolio_categories').delete().eq('id', id);
            if (error) throw error;
            fetchCategories();
            Swal.fire({ icon: 'success', title: 'Deleted!' });
        } catch (error: any) {
            Swal.fire({ icon: 'error', title: 'Delete Failed', text: error.message });
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
        if (dragOverItemIdx !== index) setDragOverItemIdx(index);
    };

    const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
        e.preventDefault();
        setDragOverItemIdx(null);
        if (activeTab !== 'Homepage Featured' || draggedItemIdx === null || draggedItemIdx === dropIndex) return;

        const items = [...images.filter(img => (img.site_section || 'Portfolio') === activeTab)];
        const draggedItem = items[draggedItemIdx];
        items.splice(draggedItemIdx, 1);
        items.splice(dropIndex, 0, draggedItem);

        const now = Date.now();
        const updates = items.map((item, idx) => ({ id: item.id, created_at: new Date(now - idx * 1000).toISOString() }));

        setImages(prev => {
            const newImages = [...prev];
            updates.forEach(u => {
                const idx = newImages.findIndex(img => img.id === u.id);
                if (idx !== -1) newImages[idx].created_at = u.created_at;
            });
            return newImages.sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        });

        try {
            await Promise.all(updates.map(u => supabase.from('portfolio_images').update({ created_at: u.created_at }).eq('id', u.id)));
        } catch (error) {
            fetchImages();
            Swal.fire({ icon: 'error', title: 'Reorder Failed' });
        }
        setDraggedItemIdx(null);
    };

    if (loading) return <div className="p-8 text-center text-muted-foreground">Loading...</div>;

    const filteredViewImages = images.filter(img => (img.site_section || 'Portfolio') === activeTab);

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
            <div className="flex items-center gap-4 mb-8 border-b border-border pb-4">
                <button onClick={() => setViewMode('images')} className={`text-sm tracking-widest uppercase pb-2 transition-all ${viewMode === 'images' ? 'text-foreground border-b-2 border-foreground font-medium' : 'text-muted-foreground hover:text-foreground'}`}>Manage Images</button>
                <button onClick={() => setViewMode('categories')} className={`text-sm tracking-widest uppercase pb-2 transition-all ${viewMode === 'categories' ? 'text-foreground border-b-2 border-foreground font-medium' : 'text-muted-foreground hover:text-foreground'}`}>Manage Categories</button>
            </div>

            {viewMode === 'images' ? (
                <div className="grid lg:grid-cols-3 gap-8 sm:gap-12">
                    <div className="lg:col-span-1">
                        <div className="bg-card rounded-xl border border-border p-6 sticky top-32">
                            <h2 className="text-xl mb-6 font-medium">Add New Image</h2>
                            <form onSubmit={handleUpload} className="space-y-4">
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">Files *</label>
                                    <input id="file-upload" type="file" multiple accept="image/*" onChange={(e) => setFiles(e.target.files)} className="w-full text-sm" required />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">Title *</label>
                                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-input border border-border px-4 py-2 text-sm" required />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">Section *</label>
                                    <select value={siteSection} onChange={(e) => setSiteSection(e.target.value)} className="w-full bg-input border border-border px-4 py-2 text-sm">
                                        <option value="Portfolio">Portfolio</option>
                                        <option value="Homepage Slider">Slider</option>
                                        <option value="Homepage Featured">Featured</option>
                                        <option value="About Page">About</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">Category *</label>
                                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-input border border-border px-4 py-2 text-sm" required>
                                        {categoriesList.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">Description</label>
                                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-input border border-border px-4 py-2 text-sm" rows={3} />
                                </div>
                                <button type="submit" disabled={uploading || !files || !title} className="w-full bg-foreground text-background py-3 uppercase text-xs tracking-widest">{uploading ? 'Uploading...' : 'Upload'}</button>
                            </form>
                        </div>
                    </div>

                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-medium">Images ({filteredViewImages.length})</h2>
                            <select value={activeTab} onChange={(e) => setActiveTab(e.target.value)} className="bg-muted p-2 text-sm rounded border">
                                <option value="Portfolio">Portfolio</option>
                                <option value="Homepage Slider">Slider</option>
                                <option value="Homepage Featured">Featured</option>
                                <option value="About Page">About</option>
                            </select>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {filteredViewImages.map((img, idx) => (
                                <div key={img.id} draggable={activeTab === 'Homepage Featured'} onDragStart={(e) => handleDragStart(e, idx)} onDragOver={(e) => handleDragOver(e, idx)} onDrop={(e) => handleDrop(e, idx)} className={`bg-card border border-border rounded-xl overflow-hidden group ${dragOverItemIdx === idx ? 'scale-105 opacity-80 border-foreground' : ''}`}>
                                    <div className="relative aspect-video overflow-hidden">
                                        <img src={img.url} alt={img.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                        <span className="absolute top-2 right-2 bg-background/80 text-[10px] px-2 py-1 rounded uppercase">{img.category}</span>
                                    </div>
                                    <div className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-medium truncate">{img.title}</h3>
                                            <div className="flex gap-2">
                                                <button onClick={() => handleEditClick(img)} className="text-blue-500 text-[10px] uppercase">Edit</button>
                                                <button onClick={() => handleDelete(img.id, img.url)} className="text-red-500 text-[10px] uppercase">Del</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-12">
                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-1">
                            <div className="bg-card rounded-xl border border-border p-6 sticky top-32">
                                <h2 className="text-xl mb-6 font-medium">Add New Category</h2>
                                <form onSubmit={handleAddCategory} className="space-y-5">
                                    <div>
                                        <label className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-2 font-medium">Category Name *</label>
                                        <input 
                                            type="text" 
                                            value={catName} 
                                            onChange={(e) => setCatName(e.target.value)} 
                                            placeholder="e.g. Weddings" 
                                            className="w-full bg-input border border-border px-4 py-2.5 outline-none focus:border-foreground/40 transition-colors text-sm" 
                                            required 
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-2 font-medium">Background Image (Hero)</label>
                                        <div className="relative group">
                                            <input 
                                                id="cat-hero-upload"
                                                type="file" 
                                                accept="image/*"
                                                onChange={(e) => setCatHeroFile(e.target.files)} 
                                                className="w-full text-xs file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-[10px] file:uppercase file:tracking-wider file:bg-muted file:text-foreground hover:file:bg-muted/80 cursor-pointer" 
                                            />
                                        </div>
                                        <p className="text-[10px] text-muted-foreground mt-2 italic">This image appears as the full-screen background on the category page.</p>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-2 font-medium">Category Subtitle</label>
                                        <input 
                                            type="text" 
                                            value={catSubtitle} 
                                            onChange={(e) => setCatSubtitle(e.target.value)} 
                                            placeholder="e.g. A Cinematic Collection" 
                                            className="w-full bg-input border border-border px-4 py-2.5 outline-none focus:border-foreground/40 transition-colors text-sm" 
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-2 font-medium">Description</label>
                                        <textarea 
                                            value={catDesc} 
                                            onChange={(e) => setCatDesc(e.target.value)} 
                                            placeholder="A short story about this gallery..." 
                                            className="w-full bg-input border border-border px-4 py-2.5 outline-none focus:border-foreground/40 transition-colors text-sm resize-none" 
                                            rows={3} 
                                        />
                                    </div>

                                    <button 
                                        type="submit" 
                                        disabled={uploading || !catName} 
                                        className="w-full bg-foreground text-background py-3.5 text-[10px] tracking-[0.2em] uppercase font-medium hover:bg-foreground/90 transition-all disabled:opacity-50 mt-2"
                                    >
                                        {uploading ? 'Creating...' : 'Create Category'}
                                    </button>
                                </form>
                            </div>
                        </div>
                        <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
                            {categoriesList.map(cat => (
                                <div key={cat.id} className="bg-card border border-border rounded-xl p-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="font-medium text-lg">{cat.name}</h3>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleEditCategoryClick(cat)} className="text-blue-500 text-[10px] uppercase">Edit</button>
                                            <button onClick={() => handleDeleteCategory(cat.id, cat.name)} className="text-red-500 text-[10px] uppercase">Del</button>
                                        </div>
                                    </div>
                                    {cat.hero_image && <img src={cat.hero_image} className="w-full h-24 object-cover rounded mb-2" />}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {editingImage && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
                    <div className="bg-card w-full max-w-md rounded-xl border p-6 shadow-xl">
                        <h2 className="text-xl mb-4 font-medium">Edit Image</h2>
                        <form onSubmit={handleEditSave} className="space-y-4">
                            <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="w-full border p-2 text-sm" placeholder="Title" required />
                            <select value={editCategory} onChange={(e) => setEditCategory(e.target.value)} className="w-full border p-2 text-sm">
                                {categoriesList.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                            </select>
                            <textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} className="w-full border p-2 text-sm" rows={3} placeholder="Description" />
                            <div className="flex gap-2">
                                <button type="button" onClick={() => setEditingImage(null)} className="flex-1 border py-2 text-xs uppercase">Cancel</button>
                                <button type="submit" disabled={savingEdit} className="flex-1 bg-foreground text-background py-2 text-xs uppercase">{savingEdit ? 'Saving...' : 'Save'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {editingCategory && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
                    <div className="bg-card w-full max-w-md rounded-xl border border-border p-6 shadow-xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-medium">Edit Category</h2>
                            <button onClick={() => setEditingCategory(null)} className="text-muted-foreground hover:text-foreground text-xl">✕</button>
                        </div>
                        
                        <form onSubmit={handleUpdateCategory} className="space-y-5">
                            <div>
                                <label className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-2 font-medium">Category Name</label>
                                <input 
                                    type="text" 
                                    value={editCatName} 
                                    onChange={(e) => setEditCatName(e.target.value)} 
                                    className="w-full bg-input border border-border px-4 py-2.5 text-sm outline-none focus:border-foreground/40 transition-colors" 
                                    required 
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-2 font-medium">Update Background Image</label>
                                {editingCategory.hero_image && (
                                    <div className="mb-3 relative aspect-video w-full overflow-hidden rounded-lg border border-border bg-muted">
                                        <img src={editingCategory.hero_image} alt="current background" className="w-full h-full object-cover opacity-50" />
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            <span className="text-[10px] uppercase tracking-wider text-white bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-sm">Current Background</span>
                                        </div>
                                    </div>
                                )}
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={(e) => setEditCatHeroFile(e.target.files)} 
                                    className="w-full text-xs file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-[10px] file:uppercase file:tracking-wider file:bg-muted file:text-foreground hover:file:bg-muted/80 cursor-pointer" 
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-2 font-medium">Category Subtitle</label>
                                <input 
                                    type="text" 
                                    value={editCatSubtitle} 
                                    onChange={(e) => setEditCatSubtitle(e.target.value)} 
                                    className="w-full bg-input border border-border px-4 py-2.5 text-sm outline-none focus:border-foreground/40 transition-colors" 
                                    placeholder="e.g. A Cinematic Collection" 
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-2 font-medium">Description</label>
                                <textarea 
                                    value={editCatDesc} 
                                    onChange={(e) => setEditCatDesc(e.target.value)} 
                                    className="w-full bg-input border border-border px-4 py-2.5 text-sm outline-none focus:border-foreground/40 transition-colors resize-none" 
                                    rows={3} 
                                    placeholder="Description" 
                                />
                            </div>

                            <div className="flex gap-3 mt-4">
                                <button 
                                    type="button" 
                                    onClick={() => setEditingCategory(null)} 
                                    className="flex-1 border border-border py-3 text-[10px] uppercase tracking-widest font-medium hover:bg-muted transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={savingEdit} 
                                    className="flex-1 bg-foreground text-background py-3 text-[10px] uppercase tracking-widest font-medium hover:bg-foreground/90 transition-colors disabled:opacity-50"
                                >
                                    {savingEdit ? 'Updating...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
