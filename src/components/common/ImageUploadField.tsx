import React, { useState, useRef } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Loader2,
  X,
  Link2,
  ClipboardPaste,
  Check,
  FolderOpen,
  Zap,
} from 'lucide-react';
import { supabaseService } from '../../supabase/service';
import { formatBytes } from '../../utils/imageOptimizer';

interface ImageUploadFieldProps {
  label: string;
  value?: string;
  onChange: (url: string) => void;
  storageFolder?: string;
  placeholder?: string;
  aspectRatio?: 'square' | 'banner' | 'auto';
  helperText?: string;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  value = '',
  onChange,
  storageFolder = 'uploads',
  placeholder = 'https://ejemplo.com/imagen.jpg',
  aspectRatio = 'auto',
  helperText,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [optimizationNotice, setOptimizationNotice] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [pasteSuccess, setPasteSuccess] = useState(false);

  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('Por favor selecciona un archivo de imagen válido (JPG, PNG, WebP, SVG, GIF).');
      return;
    }

    // Support up to 25MB original file because client-side compression will optimize it
    if (file.size > 25 * 1024 * 1024) {
      setUploadError('La imagen no debe superar los 25 MB.');
      return;
    }

    try {
      setIsUploading(true);
      setUploadError(null);
      const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const uploadPath = `${storageFolder}/${Date.now()}_${cleanName}`;
      
      const preset =
        aspectRatio === 'banner' ? 'cover' : aspectRatio === 'square' ? 'logo' : 'general';
      const { url, optimization } = await supabaseService.uploadImageWithDetails(
        file,
        uploadPath,
        preset
      );
      onChange(url);

      if (optimization.savedPercentage > 0) {
        setOptimizationNotice(
          `Optimizado: ${formatBytes(optimization.originalSize)} ➔ ${formatBytes(optimization.optimizedSize)} (${optimization.savedPercentage}% más ligero)`
        );
        setTimeout(() => setOptimizationNotice(null), 5000);
      }
    } catch (err: any) {
      console.error('Error al subir imagen:', err);
      setUploadError('No se pudo subir la imagen. Intenta con otra imagen o pega la URL.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
    // Reset input so the same file can be selected again if needed
    if (e.target) {
      e.target.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && text.trim().startsWith('http')) {
        onChange(text.trim());
        setPasteSuccess(true);
        setTimeout(() => setPasteSuccess(false), 2000);
      } else {
        setShowUrlInput(true);
      }
    } catch (err) {
      setShowUrlInput(true);
    }
  };

  return (
    <div className="space-y-2">
      {/* Label and Actions */}
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-sky-200 uppercase tracking-wider">
          {label}
        </label>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-[11px] text-sky-300 hover:text-white font-bold flex items-center gap-1 px-2 py-0.5 rounded-lg bg-sky-950 border border-sky-800/80 hover:bg-sky-900 transition-colors cursor-pointer"
            title="Seleccionar imagen de mis archivos"
          >
            <FolderOpen className="w-3 h-3 text-sky-400" />
            <span>Mis archivos</span>
          </button>
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className={`text-[11px] font-bold flex items-center gap-1 px-2 py-0.5 rounded-lg border transition-colors cursor-pointer ${
              showUrlInput
                ? 'bg-sky-600 text-white border-sky-500'
                : 'bg-slate-900/80 text-sky-300 hover:text-white border-slate-700 hover:bg-slate-800'
            }`}
            title="Alternar ingreso de URL web"
          >
            <Link2 className="w-3 h-3" />
            <span>{showUrlInput ? 'Ocultar URL' : 'Ingresar URL'}</span>
          </button>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Upload Zone / Preview */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={`relative rounded-xl border-2 transition-all p-3 text-center ${
          isDragOver
            ? 'border-sky-400 bg-sky-950/40 shadow-lg shadow-sky-500/20'
            : value
            ? 'border-slate-700/80 bg-[#0f1722]/80 hover:border-slate-600'
            : 'border-dashed border-slate-700 bg-[#0f1722]/50 hover:border-sky-500/60 hover:bg-slate-900/50'
        }`}
      >
        {isUploading ? (
          <div className="py-6 flex flex-col items-center justify-center space-y-2">
            <Loader2 className="w-7 h-7 text-sky-400 animate-spin" />
            <p className="text-xs font-semibold text-sky-200">Optimizando y subiendo imagen ultrarrápido...</p>
            <p className="text-[10px] text-slate-400">Compresión canvas en tiempo real</p>
          </div>
        ) : value ? (
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Thumbnail */}
            <div
              className={`relative overflow-hidden rounded-lg border border-slate-700 bg-slate-950 shrink-0 ${
                aspectRatio === 'banner'
                  ? 'w-full sm:w-36 h-20'
                  : aspectRatio === 'square'
                  ? 'w-16 h-16'
                  : 'w-20 h-20'
              }`}
            >
              <img
                src={value}
                alt="Vista previa"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300&auto=format&fit=crop&q=80';
                }}
              />
            </div>

            {/* Info and Actions */}
            <div className="flex-1 text-left min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-800">
                  <Check className="w-2.5 h-2.5" /> Imagen lista
                </span>
                <span className="text-[10px] text-slate-400 truncate max-w-[150px]">
                  {value.startsWith('data:') ? 'Imagen local optimizada' : value}
                </span>
              </div>
              {optimizationNotice && (
                <div className="my-1.5 px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-800/80 text-[10px] text-emerald-300 flex items-center gap-1">
                  <Zap className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                  <span>{optimizationNotice}</span>
                </div>
              )}
              <div className="flex items-center gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 transition-colors flex items-center gap-1 cursor-pointer shadow"
                >
                  <Upload className="w-3 h-3" />
                  Cambiar archivo
                </button>
                <button
                  type="button"
                  onClick={() => onChange('')}
                  className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-slate-800 hover:bg-red-950 hover:text-red-300 hover:border-red-800 text-slate-300 border border-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
                  title="Eliminar imagen"
                >
                  <X className="w-3 h-3" />
                  Quitar
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="py-4 cursor-pointer flex flex-col items-center justify-center space-y-1.5"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-950 border border-sky-800/80 text-sky-400 flex items-center justify-center shadow-inner">
              <Upload className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-white">
              Haz clic para seleccionar desde tus archivos
            </p>
            <p className="text-[11px] text-slate-400">
              o arrastra y suelta tu imagen aquí (PNG, JPG, SVG, WebP)
            </p>
          </div>
        )}
      </div>

      {/* Optional URL Input Mode */}
      {showUrlInput && (
        <div className="pt-1 space-y-1">
          <div className="relative">
            <input
              type="text"
              inputMode="url"
              placeholder={placeholder}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full pl-8 pr-16 py-1.5 text-xs rounded-xl border border-slate-700 bg-[#0f1722] text-white focus:outline-none focus:ring-1 focus:ring-sky-400 font-mono"
            />
            <Link2 className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <button
              type="button"
              onClick={handlePasteClipboard}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded bg-sky-950 hover:bg-sky-900 border border-sky-800/80 text-[10px] text-sky-300 font-bold flex items-center gap-1 cursor-pointer transition-colors"
              title="Pegar enlace del portapapeles"
            >
              {pasteSuccess ? (
                <>
                  <Check className="w-2.5 h-2.5 text-emerald-400" />
                  <span className="text-emerald-400">Pegado</span>
                </>
              ) : (
                <>
                  <ClipboardPaste className="w-2.5 h-2.5" />
                  <span>Pegar</span>
                </>
              )}
            </button>
          </div>
          <p className="text-[10px] text-slate-400">
            También puedes ingresar o pegar un enlace directo a una imagen de internet.
          </p>
        </div>
      )}

      {/* Error alert if any */}
      {uploadError && (
        <div className="p-2 rounded-lg bg-red-950/60 border border-red-800 text-[11px] text-red-200 flex items-center justify-between">
          <span>{uploadError}</span>
          <button
            type="button"
            onClick={() => setUploadError(null)}
            className="text-red-400 hover:text-white"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {helperText && <p className="text-[11px] text-slate-400">{helperText}</p>}
    </div>
  );
};
