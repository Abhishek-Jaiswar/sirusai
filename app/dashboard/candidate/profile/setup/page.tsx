"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { CloudUploadIcon } from "lucide-react";
import React, { useRef, useState } from "react";

export default function ProfileSetup() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const openFilePicker = () => {
    inputRef.current?.click();
  };

  const validateAndSetFile = (file: File) => {
    setError(null);

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (JPG, PNG, WEBP, etc.).");
      return;
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputElement = e.target;
    const file = inputElement.files;

    if (file && file.length > 0) {
      console.log("Selected File: ", file[0].name);
    }
  };
  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <Label className="text-neutral-200">Profile Banner</Label>
        <p className="text-xs text-neutral-500">
          Add a banner that motivates you to keep working hard. This appears at
          the top of you profile
        </p>
        <Card
          onClick={openFilePicker}
          className="border border-dashed border-primary bg-primary/10"
        >
          <CardContent className="">
            <input
              type="file"
              ref={inputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
            <div className="flex items-center justify-center flex-col">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <CloudUploadIcon className="size-8" />
              </div>
              <div>
                <h1 className="text-lg font-semibold">
                  Drop a banner that motivates you to keep going..
                </h1>
              </div>
            </div>
          </CardContent>
        </Card>
        {error && (
          <p className="mt-2 text-xs text-red-500" role="alert">
            {error}
          </p>
        )}
      </section>
      <div>
        <div>{/* profile Image */}</div>
        <div>{/* personal Info */}</div>
      </div>
      <div>{/* Targeted Job info */}</div>
      <div></div>
    </div>
  );
}
