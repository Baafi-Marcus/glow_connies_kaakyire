"use client";

import { useState, useEffect } from "react";
import { 
  KeyIcon, 
  CloudIcon, 
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from "@heroicons/react/24/outline";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    geminiKey: "",
    cloudinaryUrl: "",
    whatsappNumber: "233246702043"
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        setSettings({
          geminiKey: data.geminiKey || "",
          cloudinaryUrl: data.cloudinaryUrl || "",
          whatsappNumber: data.whatsappNumber || "233246702043"
        });
        setLoading(false);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    
    const res = await fetch('/api/admin/settings', {
      method: 'POST',
      body: JSON.stringify(settings)
    });

    if (res.ok) {
      setStatus({ type: 'success', msg: 'System configurations updated successfully.' });
    } else {
      setStatus({ type: 'error', msg: 'Failed to update configurations.' });
    }
    setSaving(false);
  };

  if (loading) return <div className="p-20 text-center animate-pulse">Loading Global Configurations...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h2 className="text-4xl md:text-6xl font-serif text-brand-plum dark:text-brand-rosegold italic mb-2 tracking-tight">System Settings</h2>
        <p className="text-gray-500 font-light text-lg">Manage your AI intelligence and cloud storage keys</p>
      </div>

      {status && (
        <div className={`p-6 rounded-3xl flex items-center gap-4 animate-in zoom-in-95 duration-300 ${status.type === 'success' ? 'bg-green-50 text-green-700 dark:bg-green-900/10' : 'bg-red-50 text-red-700 dark:bg-red-900/10'}`}>
          {status.type === 'success' ? <CheckCircleIcon className="w-6 h-6" /> : <ExclamationCircleIcon className="w-6 h-6" />}
          <span className="font-bold tracking-tight">{status.msg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 gap-8">
        {/* Gemini Key */}
        <div className="bg-white dark:bg-[#1E1E1E] p-10 rounded-[3rem] border border-gray-50 dark:border-gray-800 shadow-sm space-y-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-2xl bg-brand-plum/5 dark:bg-brand-rosegold/5">
              <KeyIcon className="w-6 h-6 text-brand-plum dark:text-brand-rosegold" />
            </div>
            <h3 className="text-xl font-serif italic">AI Intelligence (Gemini)</h3>
          </div>
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Generative AI API Keys (Comma-Separated)</label>
            <textarea 
              placeholder="key1, key2, key3..."
              rows={3}
              className="w-full px-6 py-5 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none outline-none ring-2 ring-transparent focus:ring-brand-rosegold/20 transition-all font-mono text-sm resize-none"
              value={settings.geminiKey}
              onChange={e => setSettings({...settings, geminiKey: e.target.value})}
            />
            <p className="text-[10px] text-gray-400 leading-relaxed">Required for the automated "AI Suggest". You can enter multiple keys separated by commas (,) and the system will automatically cycle through them to prevent free-tier rate limits!</p>
          </div>
        </div>

        {/* Cloudinary Key */}
        <div className="bg-white dark:bg-[#1E1E1E] p-10 rounded-[3rem] border border-gray-50 dark:border-gray-800 shadow-sm space-y-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-2xl bg-brand-plum/5 dark:bg-brand-rosegold/5">
              <CloudIcon className="w-6 h-6 text-brand-plum dark:text-brand-rosegold" />
            </div>
            <h3 className="text-xl font-serif italic">Cloud Storage (Cloudinary)</h3>
          </div>
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Cloudinary Connection URL</label>
            <input 
              type="text" 
              placeholder="cloudinary://api_key:api_secret@cloud_name"
              className="w-full px-6 py-5 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none outline-none ring-2 ring-transparent focus:ring-brand-rosegold/20 transition-all font-mono text-sm"
              value={settings.cloudinaryUrl}
              onChange={e => setSettings({...settings, cloudinaryUrl: e.target.value})}
            />
            <p className="text-[10px] text-gray-400 leading-relaxed">Used to host your device-uploaded pictures permanently in the cloud.</p>
          </div>
        </div>

        {/* WhatsApp Config */}
        <div className="bg-white dark:bg-[#1E1E1E] p-10 rounded-[3rem] border border-gray-50 dark:border-gray-800 shadow-sm space-y-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-2xl bg-brand-plum/5 dark:bg-brand-rosegold/5">
              <ChatBubbleLeftRightIcon className="w-6 h-6 text-brand-plum dark:text-brand-rosegold" />
            </div>
            <h3 className="text-xl font-serif italic">Store Communication</h3>
          </div>
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">WhatsApp Business Number</label>
            <input 
              type="text" 
              className="w-full px-6 py-5 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none outline-none ring-2 ring-transparent focus:ring-brand-rosegold/20 transition-all"
              value={settings.whatsappNumber}
              onChange={e => setSettings({...settings, whatsappNumber: e.target.value})}
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={saving}
          className="w-full bg-brand-plum text-white dark:bg-brand-rosegold dark:text-black font-black uppercase tracking-widest text-sm py-8 rounded-[2.5rem] shadow-2xl hover:-translate-y-1 transition-all disabled:opacity-50 disabled:translate-y-0"
        >
          {saving ? 'Encrypting & Saving...' : 'Commit System Changes'}
        </button>
      </form>
    </div>
  );
}
