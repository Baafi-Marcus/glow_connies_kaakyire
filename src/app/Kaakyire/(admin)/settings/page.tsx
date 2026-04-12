"use client";

import { useState, useEffect } from "react";
import { 
  KeyIcon, 
  CloudIcon, 
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowPathIcon
} from "@heroicons/react/24/outline";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    geminiKey: "",
    cloudinaryUrl: "",
    whatsappNumber: ""
  });
  const [isLoading, setIsLoading] = useState(true);
  const [savingSection, setSavingSection] = useState<string | null>(null);
  const [status, setStatus] = useState<{ section: string, type: 'success' | 'error', msg: string } | null>(null);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        setSettings({
          geminiKey: data.geminiKey || "",
          cloudinaryUrl: data.cloudinaryUrl || "",
          whatsappNumber: data.whatsappNumber || "233246702043"
        });
        setIsLoading(false);
      })
      .catch(err => {
         console.error("Failed to load settings", err);
         setIsLoading(false);
      });
  }, []);

  const handleSaveSection = async (section: string, payload: any) => {
    setSavingSection(section);
    setStatus(null);
    
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setStatus({ section, type: 'success', msg: 'Updated successfully.' });
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      setStatus({ section, type: 'error', msg: 'Failed to update.' });
    } finally {
      setSavingSection(null);
    }
  };

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center p-40 space-y-4">
      <ArrowPathIcon className="w-12 h-12 text-brand-rosegold animate-spin" />
      <p className="font-serif italic text-gray-400">Loading Secure Configurations...</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl md:text-6xl font-serif text-brand-plum dark:text-brand-rosegold italic mb-2 tracking-tight">System Settings</h2>
          <p className="text-gray-500 font-light text-lg">Manage each configuration segment independently</p>
        </div>
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/10 rounded-full text-[10px] font-black uppercase text-green-600 tracking-widest border border-green-100 dark:border-green-900/20">
           <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
           Keys Synchronized
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Gemini Key */}
        <div className="bg-white dark:bg-[#1E1E1E] p-10 rounded-[3rem] border border-gray-50 dark:border-gray-800 shadow-sm space-y-8 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-brand-plum/5 dark:bg-brand-rosegold/5">
                <KeyIcon className="w-6 h-6 text-brand-plum dark:text-brand-rosegold" />
              </div>
              <h3 className="text-xl font-serif italic">AI Intelligence (Keys)</h3>
            </div>
            {status?.section === 'ai' && (
              <span className={`text-[10px] font-black uppercase tracking-widest ${status.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                {status.msg}
              </span>
            )}
          </div>
          
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">API Keys (Google AI Studio / GitHub Models)</label>
            <textarea 
              placeholder="Paste your keys here, separated by commas..."
              rows={3}
              className="w-full px-6 py-5 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none outline-none ring-2 ring-transparent focus:ring-brand-rosegold/20 transition-all font-mono text-sm resize-none"
              value={settings.geminiKey}
              onChange={e => setSettings({...settings, geminiKey: e.target.value})}
            />
            <p className="text-[10px] text-gray-400 leading-relaxed italic">Supports AIza... (Gemini) and ghp_... (GitHub). Cycle multiple keys with commas.</p>
          </div>

          <button 
            onClick={() => handleSaveSection('ai', { geminiKey: settings.geminiKey })}
            disabled={savingSection !== null}
            className="w-full py-5 bg-brand-plum text-white dark:bg-brand-rosegold dark:text-black rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-50"
          >
            {savingSection === 'ai' ? 'Updating AI Gateways...' : 'Save AI Configuration'}
          </button>
        </div>

        {/* Cloudinary Key */}
        <div className="bg-white dark:bg-[#1E1E1E] p-10 rounded-[3rem] border border-gray-50 dark:border-gray-800 shadow-sm space-y-8 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-brand-plum/5 dark:bg-brand-rosegold/5">
                <CloudIcon className="w-6 h-6 text-brand-plum dark:text-brand-rosegold" />
              </div>
              <h3 className="text-xl font-serif italic">Cloud Storage</h3>
            </div>
            {status?.section === 'cloud' && (
              <span className={`text-[10px] font-black uppercase tracking-widest ${status.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                {status.msg}
              </span>
            )}
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Connection URL</label>
            <input 
              type="text" 
              placeholder="cloudinary://api_key:api_secret@cloud_name"
              className="w-full px-6 py-5 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none outline-none ring-2 ring-transparent focus:ring-brand-rosegold/20 transition-all font-mono text-sm"
              value={settings.cloudinaryUrl}
              onChange={e => setSettings({...settings, cloudinaryUrl: e.target.value})}
            />
          </div>

          <button 
            onClick={() => handleSaveSection('cloud', { cloudinaryUrl: settings.cloudinaryUrl })}
            disabled={savingSection !== null}
            className="w-full py-5 bg-whatsapp/10 text-whatsapp rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-whatsapp hover:text-white transition-all active:scale-95 disabled:opacity-50 border border-whatsapp/20"
          >
            {savingSection === 'cloud' ? 'Syncing Cloud...' : 'Save Storage URL'}
          </button>
        </div>

        {/* WhatsApp Config */}
        <div className="bg-white dark:bg-[#1E1E1E] p-10 rounded-[3rem] border border-gray-50 dark:border-gray-800 shadow-sm space-y-8 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-brand-plum/5 dark:bg-brand-rosegold/5">
                <ChatBubbleLeftRightIcon className="w-6 h-6 text-brand-plum dark:text-brand-rosegold" />
              </div>
              <h3 className="text-xl font-serif italic">Sales Channel</h3>
            </div>
            {status?.section === 'whatsapp' && (
              <span className={`text-[10px] font-black uppercase tracking-widest ${status.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                {status.msg}
              </span>
            )}
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Business Phone Number</label>
            <input 
              type="text" 
              className="w-full px-6 py-5 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none outline-none ring-2 ring-transparent focus:ring-brand-rosegold/20 transition-all text-lg font-bold"
              value={settings.whatsappNumber}
              onChange={e => setSettings({...settings, whatsappNumber: e.target.value})}
            />
          </div>

          <button 
            onClick={() => handleSaveSection('whatsapp', { whatsappNumber: settings.whatsappNumber })}
            disabled={savingSection !== null}
            className="w-full py-5 bg-whatsapp text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all active:scale-95 disabled:opacity-50 shadow-xl shadow-whatsapp/20"
          >
            {savingSection === 'whatsapp' ? 'Configuring Channel...' : 'Save WhatsApp Number'}
          </button>
        </div>
      </div>
    </div>
  );
}
