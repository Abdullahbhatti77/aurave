"use client";
import React, { useState, ChangeEvent } from "react";

interface UploadImageProps {
  onUpload: (url: string) => void;
  initialUrl?: string;
}

export default function UploadImage({
  onUpload,
  initialUrl,
}: UploadImageProps) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | undefined>(initialUrl);

  const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        (process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string) || ""
      );

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      if (data?.secure_url) {
        setPreview(data.secure_url);
        onUpload(data.secure_url);
      } else {
        console.error("Cloudinary response error", data);
      }
    } catch (err) {
      console.error("Upload error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="border p-2 w-full rounded-md"
      />
      {loading ? (
        <p className="text-sm text-gray-600 mt-2">Uploading...</p>
      ) : (
        preview && (
          <img
            src={preview}
            alt="Preview"
            className="w-24 h-24 object-cover mt-2 rounded"
          />
        )
      )}
    </div>
  );
}
