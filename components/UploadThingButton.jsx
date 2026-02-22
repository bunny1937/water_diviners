"use client";
import { useUploadThing } from "@/lib/uploadthing";

export function UploadButton({ onUpload }) {
  const { startUpload, isUploading } = useUploadThing("imageUploader");

  return (
    <label
      style={{ display: "inline-block", cursor: "pointer", marginLeft: 12 }}
    >
      <span
        style={{
          padding: "6px 14px",
          background: isUploading ? "#e5e7eb" : "#0077be",
          color: isUploading ? "#6b7280" : "#fff",
          borderRadius: 6,
          fontSize: 13,
          fontWeight: 600,
          display: "inline-block",
        }}
      >
        {isUploading ? "⏳ Uploading..." : "📷 Replace Image"}
      </span>
      <input
        type="file"
        accept="image/*"
        hidden
        disabled={isUploading}
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const res = await startUpload([file]);
          if (res?.[0]?.url) onUpload(res[0].url);
          e.target.value = "";
        }}
      />
    </label>
  );
}
