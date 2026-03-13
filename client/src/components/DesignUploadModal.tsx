'use client';

import React, { useState } from 'react';
import { Upload, Palette, X, Camera, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';

interface DesignUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: (designFile: File | null) => void;
  productName: string;
}

export default function DesignUploadModal({ isOpen, onClose, onContinue, productName }: DesignUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSkip = () => {
    setLoading(true);
    onContinue(null);
  };

  const handleUploadAndContinue = () => {
    if (selectedFile) {
      setLoading(true);
      onContinue(selectedFile);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in slide-in-from-bottom-8 duration-500">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-black dark:hover:text-white transition-colors z-10"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col md:flex-row h-full">
          {/* Left Side: Visual/Context */}
          <div className="hidden md:flex md:w-5/12 bg-primary p-10 flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6">
                <Palette className="text-white" size={24} />
              </div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-tight mb-4">
                Personalize Your <br /> {productName}
              </h3>
              <p className="text-white/70 text-sm font-medium leading-relaxed">
                Ensure your brand stands out with high-quality custom printing.
              </p>
            </div>
            
            <div className="relative z-10 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-white shrink-0" size={18} />
                <p className="text-[10px] text-white font-bold uppercase tracking-widest leading-normal">
                  Pro Tip: Upload AI, PDF or High-res PNG for best results.
                </p>
              </div>
            </div>
          </div>

          {/* Right Side: Options */}
          <div className="flex-1 p-8 md:p-12">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-8">
              Choose your path
            </h2>

            <div className="space-y-6">
              {/* Option 1: Upload */}
              <div className={`relative group border-2 rounded-3xl p-6 transition-all ${selectedFile ? 'border-primary bg-primary/5' : 'border-slate-100 dark:border-slate-800 hover:border-secondary/30'}`}>
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${selectedFile ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:bg-secondary/10 group-hover:text-secondary'}`}>
                    <Upload size={24} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tight mb-1">Upload Design</h4>
                    <p className="text-xs font-medium text-slate-500 mb-4">Upload your ready-to-print artwork files.</p>
                    
                    {!selectedFile ? (
                      <label className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-full cursor-pointer hover:bg-slate-800 transition-all">
                        <Camera size={14} /> Browse Files
                        <input type="file" className="hidden" accept="image/*,.pdf,.ai" onChange={handleFileChange} />
                      </label>
                    ) : (
                      <div className="flex items-center gap-3">
                        {previewUrl && (
                          <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-200">
                            <img src={previewUrl} className="w-full h-full object-cover" alt="preview" />
                          </div>
                        )}
                        <span className="text-xs font-bold text-slate-700 truncate max-w-[150px]">{selectedFile.name}</span>
                        <button onClick={() => {setSelectedFile(null); setPreviewUrl(null);}} className="text-red-500 text-[10px] font-black uppercase">Remove</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* OR Divider */}
              <div className="flex items-center gap-4 py-2">
                <div className="h-px bg-slate-100 dark:bg-slate-800 flex-1"></div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">OR</span>
                <div className="h-px bg-slate-100 dark:bg-slate-800 flex-1"></div>
              </div>

              {/* Option 2: Skip/Contiue without */}
              <button 
                onClick={handleSkip}
                disabled={loading}
                className="w-full relative group border-2 border-slate-100 dark:border-slate-800 hover:border-secondary/30 hover:bg-secondary/5 rounded-3xl p-6 transition-all text-left flex items-start gap-4"
              >
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:bg-secondary group-hover:text-white rounded-2xl flex items-center justify-center shrink-0 transition-colors">
                  <Palette size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tight mb-1">No Design? No Problem</h4>
                  <p className="text-xs font-medium text-slate-500 leading-relaxed">
                    Continue without label. Our experts will design for you and contact you after order.
                  </p>
                </div>
                <ArrowRight className="text-slate-300 group-hover:text-secondary absolute right-6 top-1/2 -translate-y-1/2 transition-colors" size={20} />
              </button>
            </div>

            {/* Bottom Actions */}
            {selectedFile && (
              <div className="mt-8">
                <button 
                  onClick={handleUploadAndContinue}
                  className="w-full bg-secondary hover:brightness-110 py-5 rounded-2xl text-white font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 shadow-2xl shadow-secondary/20"
                >
                  Confirm & Continue <ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
