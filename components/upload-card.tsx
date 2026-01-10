'use client'

import { cn } from "@/lib/utils";
import { CloudUploadIcon, HandGrab, X } from "lucide-react";
import Image from "next/image";
import { Label } from "./ui/label";
import { Card, CardContent } from "./ui/card";
import { useRef, useState } from "react";

type UploadCardProps = {
  label: string;
  description: string;
  preview: string | null;
  file: File | null;
  onFileSelect: (file: File) => void;
  onClear: () => void;
  aspect?: "banner" | "avatar";
  maxSizeMB?: number;
};

function UploadCard({
  label,
  description,
  preview,
  file,
  onFileSelect,
  onClear,
  aspect = "banner",
  maxSizeMB = 5,
}: UploadCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const openPicker = () => inputRef.current?.click();

  const validateFile = (file: File) => {
    setError(null);

    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed");
      return;
    }

    if (file.size / (1024 * 1024) > maxSizeMB) {
      setError(`Max file size is ${maxSizeMB}MB`);
      return;
    }

    onFileSelect(file);
  };

  return (
    <section className="space-y-2">
      <Label className="dark:text-neutral-200">{label}</Label>
      <p className="text-xs text-neutral-500">{description}</p>

      <Card
        tabIndex={0}
        role="button"
        onClick={openPicker}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const file = e.dataTransfer.files?.[0];
          if (file) validateFile(file);
        }}
        className={cn(
          "border border-dashed cursor-pointer",
          isDragging ? "border-primary bg-primary/10" : "bg-primary/5"
        )}
      >
        <CardContent className="py-6">
          <input
            type="file"
            ref={inputRef}
            accept="image/*"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) validateFile(file);
            }}
          />

          {preview ? (
            <div className="relative">
              <Image
                src={preview}
                alt="Preview"
                width={aspect === "avatar" ? 200 : 800}
                height={200}
                className={cn(
                  "object-cover mx-auto",
                  aspect === "avatar"
                    ? "h-40 w-40 rounded-full"
                    : "h-40 w-full rounded-md"
                )}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClear();
                }}
                className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              {isDragging ? <HandGrab /> : <CloudUploadIcon />}
              <p className="text-xs font-medium">
                {isDragging ? "Drop image here" : "Click or drag image"}
              </p>
              <p className="text-xs text-muted-foreground">
                Max {maxSizeMB}MB · Images only
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </section>
  );
}

export default UploadCard;
