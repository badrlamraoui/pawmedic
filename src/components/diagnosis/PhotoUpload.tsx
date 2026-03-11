"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface PhotoUploadProps {
  maxFiles?: number;
  onFilesChange: (files: File[]) => void;
  label?: string;
  sublabel?: string;
  dropzoneText?: string;
}

export default function PhotoUpload({
  maxFiles = 3,
  onFilesChange,
  label,
  sublabel,
  dropzoneText = "Glissez vos photos ici ou cliquez pour sélectionner",
}: PhotoUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const validFiles = Array.from(newFiles)
      .filter((f) => f.type.startsWith("image/"))
      .slice(0, maxFiles - files.length);

    const updated = [...files, ...validFiles].slice(0, maxFiles);
    setFiles(updated);
    onFilesChange(updated);
  };

  const removeFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    onFilesChange(updated);
  };

  const onDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => setIsDragging(false);

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-3">
      {label && (
        <div>
          <p className="text-sm font-medium text-ink">{label}</p>
          {sublabel && <p className="text-xs text-muted mt-0.5">{sublabel}</p>}
        </div>
      )}

      {files.length < maxFiles && (
        <div
          className={cn(
            "border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors",
            isDragging
              ? "border-cyan bg-cyan-light"
              : "border-border hover:border-cyan/50 hover:bg-cream"
          )}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
        >
          <svg
            className={cn("w-8 h-8 mx-auto mb-2", isDragging ? "text-cyan" : "text-muted")}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
          <p className="text-sm text-muted">{dropzoneText}</p>
          <p className="text-xs text-muted/60 mt-1">
            {files.length}/{maxFiles} photos
          </p>
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept="image/*"
            multiple={maxFiles > 1}
            onChange={onChange}
          />
        </div>
      )}

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            className="flex gap-3 flex-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {files.map((file, i) => {
              const url = URL.createObjectURL(file);
              return (
                <motion.div
                  key={`${file.name}-${i}`}
                  className="relative"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <img
                    src={url}
                    alt={`Photo ${i + 1}`}
                    className="w-20 h-20 object-cover rounded-xl border border-border"
                  />
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-ink text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                  >
                    x
                  </button>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
