"use client";

import { useState, useEffect } from "react";
import AppImage from "@/components/AppImage";
import { 
  PlusIcon, 
  PencilSquareIcon, 
  TrashIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
  SparklesIcon
} from "@heroicons/react/24/outline";

type Product = { 
  id: string; 
  name: string; 
  description: string; 
  price: number; 
  oldPrice: number | null;
  imageUrl: string | null; 
  badgeLabel: string | null;
  category: string; 
  isAvailable: boolean;
  stock: number;
  lowStockThreshold: number;
};

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  
  // Modal State
  const [formData, setFormData] = useState({
    name: "", description: "", price: "", oldPrice: "", imageUrl: "", badgeLabel: "", category: "Perfumes", stock: "0", lowStockThreshold: "5", isAvailable: true
  });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  
  // Bulk Upload State
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkFiles, setBulkFiles] = useState<File[]>([]);
  const [bulkProgress, setBulkProgress] = useState({ current: 0, total: 0 });
  const [bulkStatus, setBulkStatus] = useState("");
  const [bulkCategory, setBulkCategory] = useState("Perfumes");
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);
  const [publishImmediately, setPublishImmediately] = useState(false);
  
  // Single Upload State
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const res = await fetch(`/api/products?admin=true&t=${Date.now()}`, { cache: 'no-store' });
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  };

  const handleBulkUpload = async () => {
    if (bulkFiles.length === 0) return;
    
    setIsBulkProcessing(true);
    setBulkProgress({ current: 0, total: bulkFiles.length });
    
    for (let i = 0; i < bulkFiles.length; i++) {
      const file = bulkFiles[i];
      setBulkProgress(prev => ({ ...prev, current: i + 1 }));
      setBulkStatus(`Uploading image ${i + 1}...`);
      
      try {
        // 1. Upload
        const formData = new FormData();
        formData.append('file', file);
        const uploadRes = await fetch('/api/admin/upload', { method: 'POST', body: formData });
        const uploadData = await uploadRes.json();
        
        if (!uploadData.url) throw new Error("Upload failed");
        
        // 2. AI Gen
        setBulkStatus(`AI analyzing product ${i + 1}...`);
        const aiRes = await fetch('/api/admin/generate-details', {
          method: 'POST',
          body: JSON.stringify({ imageUrl: uploadData.url })
        });
        const aiData = await aiRes.json();
        
        // 3. Save as Draft
        setBulkStatus(`Saving draft ${i + 1}...`);
        await fetch('/api/products', {
          method: 'POST',
          body: JSON.stringify({
            name: aiData.name || `Bulk Product ${i + 1}`,
            description: aiData.description || "",
            price: aiData.price || 0,
            imageUrl: uploadData.url,
            category: bulkCategory,
            stock: "0",
            lowStockThreshold: "5",
            isAvailable: publishImmediately // Use new flag
          })
        });
      } catch (error) {
        console.error("Bulk process error for file", i, error);
      }
    }
    
    setBulkStatus("Bulk Upload Complete!");
    setIsBulkProcessing(false);
    fetchProducts();
    setTimeout(() => {
      setIsBulkModalOpen(false);
      setBulkFiles([]);
      setBulkStatus("");
    }, 2000);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setFormData(prev => ({ ...prev, imageUrl: data.url }));
      }
    } catch (error) {
      console.error('Upload failed', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAISuggest = async () => {
    if (!formData.imageUrl) return;

    setIsGenerating(true);
    try {
      const res = await fetch('/api/admin/generate-details', {
        method: 'POST',
        body: JSON.stringify({ imageUrl: formData.imageUrl }),
      });
      const data = await res.json();
      if (!data.error) {
        setFormData(prev => ({
          ...prev,
          name: data.name || prev.name,
          description: data.description || prev.description,
          category: data.category || prev.category,
          price: data.price?.toString() || prev.price
        }));
      }
    } catch (error) {
      console.error('AI Suggestion failed', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const categories = ["All", "Perfumes", "Accessories", "Beauty", ...Array.from(new Set(products.map(p => p.category))).filter(c => !["Perfumes", "Accessories", "Beauty"].includes(c))];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "All" || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleOpenModal = (product: Product | null = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        oldPrice: product.oldPrice?.toString() || "",
        imageUrl: product.imageUrl || "",
        badgeLabel: product.badgeLabel || "",
        category: product.category,
        stock: product.stock.toString(),
        lowStockThreshold: product.lowStockThreshold.toString(),
        isAvailable: product.isAvailable
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: "", description: "", price: "", oldPrice: "", imageUrl: "", badgeLabel: "", category: "Perfumes", stock: "0", lowStockThreshold: "5", isAvailable: true
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
    const method = editingProduct ? 'PUT' : 'POST';
    
    await fetch(url, {
      method,
      body: JSON.stringify(formData)
    });
    
    setIsModalOpen(false);
    fetchProducts();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Permanently remove this item from catalog?")) {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
        const data = await res.json();
        
        if (!res.ok) {
           throw new Error(data.error || "Delete failed");
        }
        
        await fetchProducts();
      } catch (error: any) {
        console.error("Delete UI Error:", error);
        alert(`Failed to delete: ${error.message}`);
        setLoading(false);
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    
    if (confirm(`Are you sure you want to PERMANENTLY delete ${selectedIds.length} items? This cannot be undone.`)) {
      setIsBulkDeleting(true);
      try {
        const res = await fetch('/api/admin/bulk-delete', {
          method: 'POST',
          body: JSON.stringify({ ids: selectedIds })
        });
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.error || "Bulk delete failed");
        
        setSelectedIds([]);
        await fetchProducts();
      } catch (error: any) {
        alert(error.message);
      } finally {
        setIsBulkDeleting(false);
      }
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredProducts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProducts.map(p => p.id));
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl md:text-6xl font-serif text-brand-plum dark:text-brand-rosegold italic mb-2 tracking-tight">Catalog</h2>
          <p className="text-gray-500 font-light text-lg">Manage your products and inventory</p>
        </div>
        <div className="flex gap-4">
          {selectedIds.length > 0 && (
            <button 
              onClick={handleBulkDelete}
              disabled={isBulkDeleting}
              className="px-8 py-4 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2 border border-red-100 dark:bg-red-900/10 dark:border-red-900/20"
            >
              <TrashIcon className="w-4 h-4" /> 
              {isBulkDeleting ? 'Deleting...' : `Delete ${selectedIds.length} Selection`}
            </button>
          )}
          <button 
            onClick={() => setIsBulkModalOpen(true)}
            className="px-8 py-4 bg-brand-plum/10 text-brand-plum hover:bg-brand-plum hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2"
          >
            ✨ Bulk Magic
          </button>
          <button 
            onClick={() => handleOpenModal()} 
            className="px-8 py-4 bg-brand-plum text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-brand-plum/20 hover:scale-105 transition-all active:scale-95 flex items-center gap-2"
          >
            <PlusIcon className="w-4 h-4" /> New Product
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search catalog..." 
            className="w-full pl-14 pr-6 py-5 rounded-[2rem] bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-gray-800 text-sm focus:border-brand-rosegold outline-none transition-all shadow-sm" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="relative">
          <FunnelIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <select 
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="w-full pl-16 pr-10 py-5 rounded-3xl bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-gray-800 shadow-sm focus:ring-4 focus:ring-brand-rosegold/10 outline-none transition-all appearance-none font-bold uppercase tracking-widest text-[10px]"
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Product Grid Table */}
      <div className="bg-white dark:bg-[#1E1E1E] rounded-[3rem] border border-gray-50 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-50 dark:border-gray-800">
                <th className="py-6 px-10 w-20">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 rounded border-gray-300 text-brand-plum focus:ring-brand-plum cursor-pointer" 
                    checked={selectedIds.length > 0 && selectedIds.length === filteredProducts.length}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="py-6 px-4">Product</th>
                <th className="py-6 px-4 text-center">Stock</th>
                <th className="py-6 px-4">Price</th>
                <th className="py-6 px-10 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {filteredProducts.map(product => (
                <tr key={product.id} className={`group hover:bg-gray-50/50 dark:hover:bg-gray-800/10 transition-colors ${selectedIds.includes(product.id) ? 'bg-brand-plum/5 dark:bg-brand-rosegold/5' : ''}`}>
                  <td className="py-6 px-10">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 rounded border-gray-300 text-brand-plum focus:ring-brand-plum cursor-pointer"
                      checked={selectedIds.includes(product.id)}
                      onChange={() => toggleSelect(product.id)}
                    />
                  </td>
                  <td className="py-6 px-4">
                    <div className="flex items-center gap-6">
                      <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-100 dark:border-gray-800 group-hover:scale-110 transition-transform duration-500">
                        <AppImage src={product.imageUrl} alt={product.name} fill />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg leading-tight">{product.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-black text-brand-rosegold uppercase tracking-widest">{product.category}</span>
                          {product.badgeLabel && <span className="text-[8px] bg-brand-plum text-white px-2 py-0.5 rounded-full font-black uppercase tracking-widest">{product.badgeLabel}</span>}
                          {!product.isAvailable && <span className="text-[8px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-black uppercase tracking-widest">Hidden</span>}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-6 px-4">
                    <div className="flex flex-col items-center">
                      <span className={`text-lg font-black ${product.stock <= product.lowStockThreshold ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}>
                        {product.stock}
                      </span>
                      <div className={`h-1 w-8 rounded-full ${product.stock <= product.lowStockThreshold ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
                    </div>
                  </td>
                  <td className="py-6 px-4">
                    <div className="flex flex-col">
                      <span className="font-serif text-xl italic text-brand-plum dark:text-brand-rosegold whitespace-nowrap">GHC {product.price}</span>
                      {product.oldPrice && (
                        <span className="text-[10px] text-gray-400 line-through font-bold">GHC {product.oldPrice}</span>
                      )}
                    </div>
                  </td>
                  <td className="py-6 px-10 text-right">
                    <div className="flex justify-end gap-2">
                       <button onClick={() => handleOpenModal(product)} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-500 hover:text-brand-plum dark:hover:text-brand-rosegold hover:shadow-md transition-all">
                         <PencilSquareIcon className="w-5 h-5" />
                       </button>
                       <button onClick={() => handleDelete(product.id)} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-500 hover:text-red-600 hover:shadow-md transition-all">
                         <TrashIcon className="w-5 h-5" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="p-20 text-center space-y-4">
             <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-[2rem] flex items-center justify-center mx-auto text-gray-300">
                <XMarkIcon className="w-10 h-10" />
             </div>
             <p className="text-gray-400 italic">No products matched your criteria.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 overflow-y-auto pt-20 pb-20">
          <div className="fixed inset-0 bg-brand-plum/40 backdrop-blur-md transition-opacity" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white dark:bg-[#1E1E1E] w-full max-w-2xl rounded-[3rem] shadow-2xl p-10 md:p-14 space-y-10 animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-3xl font-serif italic">{editingProduct ? 'Edit Item' : 'New Collection'}</h3>
                <p className="text-gray-400 text-sm">Add or refine your store offerings</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-full hover:rotate-90 transition-transform">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Product Title</label>
                <input required className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none outline-none ring-2 ring-transparent focus:ring-brand-rosegold/20 transition-all" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Retail Price (GHC)</label>
                <input required type="number" step="0.01" className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none outline-none" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Previous Price (Optional GHC)</label>
                <input type="number" step="0.01" className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none outline-none" value={formData.oldPrice} onChange={e => setFormData({...formData, oldPrice: e.target.value})} />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Marketing Label</label>
                <select className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none outline-none font-bold uppercase tracking-widest text-[10px]" value={formData.badgeLabel} onChange={e => setFormData({...formData, badgeLabel: e.target.value})}>
                  <option value="">None</option>
                  <option value="NEW">New Arrival</option>
                  <option value="BEST SELLER">Best Seller</option>
                  <option value="DISCOUNT">Discounted</option>
                  <option value="EXCLUSIVE">Exclusive</option>
                  <option value="LIMITED">Limited Edition</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Category Tag</label>
                <input className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none outline-none" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Current Stock</label>
                <input type="number" className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none outline-none" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Alert at level</label>
                <input type="number" className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none outline-none" value={formData.lowStockThreshold} onChange={e => setFormData({...formData, lowStockThreshold: e.target.value})} />
              </div>

              <div className="md:col-span-2 space-y-4">
                <div className="flex justify-between items-end">
                   <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Product Visuals</label>
                   {formData.imageUrl && (
                     <button 
                       type="button" 
                       onClick={handleAISuggest}
                       disabled={isGenerating}
                       className="text-[10px] font-black uppercase tracking-widest text-brand-rosegold hover:text-brand-plum flex items-center gap-1.5 transition-colors disabled:opacity-50"
                     >
                       {isGenerating ? 'AI Analyzing...' : '✨ AI Suggest Details'}
                     </button>
                   )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative group">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileUpload}
                      className="hidden" 
                      id="device-upload" 
                    />
                    <label 
                      htmlFor="device-upload" 
                      className={`w-full py-4 px-6 rounded-2xl border-2 border-dashed flex items-center justify-center gap-2 cursor-pointer transition-all ${isUploading ? 'border-brand-rosegold/50 bg-brand-rosegold/5 animate-pulse' : 'border-gray-200 dark:border-gray-700 hover:border-brand-rosegold/50 hover:bg-brand-rosegold/5'}`}
                    >
                      <PlusIcon className="w-5 h-5 text-gray-400" />
                      <span className="text-xs font-bold text-gray-500">{isUploading ? 'Uploading...' : 'Upload from Device'}</span>
                    </label>
                  </div>

                  <div className="relative">
                    <input 
                      className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none outline-none text-xs" 
                      placeholder="Paste Image URL instead..." 
                      value={formData.imageUrl} 
                      onChange={e => setFormData({...formData, imageUrl: e.target.value})} 
                    />
                  </div>
                </div>

                {formData.imageUrl && (
                  <div className="relative h-40 w-full rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                    <AppImage src={formData.imageUrl} alt="Preview" fill className="object-contain" />
                  </div>
                )}
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Detailed Description</label>
                <textarea required rows={3} className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none outline-none resize-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>

              <div className="md:col-span-2 flex items-center gap-4 py-4 border-t border-gray-50 dark:border-gray-800">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={formData.isAvailable} onChange={e => setFormData({...formData, isAvailable: e.target.checked})} />
                  <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-brand-plum"></div>
                  <span className="ml-3 text-sm font-bold uppercase tracking-widest text-gray-500">Enable in Storefront</span>
                </label>
              </div>

              <button type="submit" className="md:col-span-2 w-full bg-brand-plum text-white dark:bg-brand-rosegold dark:text-black font-black uppercase tracking-widest text-sm py-6 rounded-[2rem] shadow-2xl hover:-translate-y-1 transition-all">
                Finalize & Save Item
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Bulk Magic Modal */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center px-4 overflow-y-auto">
          <div className="fixed inset-0 bg-brand-plum/40 backdrop-blur-md" onClick={() => !isBulkProcessing && setIsBulkModalOpen(false)} />
          <div className="relative bg-white dark:bg-[#1E1E1E] w-full max-w-2xl rounded-[3rem] shadow-2xl p-10 md:p-14 animate-in zoom-in-95 duration-500">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-3xl font-serif italic text-brand-plum dark:text-brand-rosegold">Bulk Magic</h3>
              {!isBulkProcessing && (
                <button onClick={() => setIsBulkModalOpen(false)} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-full">
                  <XMarkIcon className="w-6 h-6" />
                </button>
              )}
            </div>

            <div className="space-y-8">
              {!isBulkProcessing ? (
                <>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Target Category for Batch</label>
                    <select 
                      value={bulkCategory} 
                      onChange={(e) => setBulkCategory(e.target.value)}
                      className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none outline-none font-bold uppercase tracking-widest text-[10px]"
                    >
                      {categories.filter(c => c !== "All").map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div className="flex items-center gap-4 py-4 px-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={publishImmediately} 
                        onChange={e => setPublishImmediately(e.target.checked)} 
                      />
                      <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-brand-plum"></div>
                      <span className="ml-3 text-[10px] font-black uppercase tracking-widest text-gray-500">Auto-Publish to Users</span>
                    </label>
                  </div>

                  <div className="relative group min-h-[200px] border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-3xl flex flex-col items-center justify-center p-10 hover:border-brand-rosegold transition-colors">
                    <input 
                      type="file" 
                      multiple 
                      accept="image/*" 
                      onChange={(e) => setBulkFiles(Array.from(e.target.files || []))}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <SparklesIcon className="w-12 h-12 text-brand-rosegold mb-4" />
                    <p className="font-bold text-gray-500">Drop your product photos here</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-2">Selected: {bulkFiles.length} images</p>
                  </div>

                  {bulkFiles.length > 0 && (
                    <button 
                      onClick={handleBulkUpload}
                      className="w-full py-6 bg-brand-plum text-white rounded-[2rem] font-black uppercase tracking-widest text-[10px] shadow-xl hover:-translate-y-1 transition-all"
                    >
                      ✨ Process {bulkFiles.length} Items with AI
                    </button>
                  )}
                </>
              ) : (
                <div className="text-center space-y-8 py-10">
                   <div className="relative w-32 h-32 mx-auto">
                      <div className="absolute inset-0 border-4 border-brand-rosegold/20 rounded-full"></div>
                      <div 
                        className="absolute inset-0 border-4 border-brand-rosegold rounded-full border-t-transparent animate-spin"
                        style={{ animationDuration: '2s' }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center font-black text-xl text-brand-rosegold">
                        {Math.round((bulkProgress.current / bulkProgress.total) * 100)}%
                      </div>
                   </div>

                   <div className="space-y-2">
                     <p className="text-xl font-serif italic">{bulkStatus}</p>
                     <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                        Item {bulkProgress.current} of {bulkProgress.total}
                     </p>
                   </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
