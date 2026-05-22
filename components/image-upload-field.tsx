"use client";

import { ImageIcon, Trash2, Upload } from "lucide-react";
import { useMemo, useState } from "react";
import { inputClass } from "@/components/ui/panel";

const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
const maxFileSize = 5 * 1024 * 1024;

export function ImageUploadField({
  label,
  fileName,
  urlName,
  removeName,
  currentUrl,
  hint = "JPG, PNG or WEBP. Max 5MB."
}: {
  label: string;
  fileName: string;
  urlName: string;
  removeName: string;
  currentUrl?: string | null;
  hint?: string;
}) {
  const [previewUrl, setPreviewUrl] = useState(currentUrl || "");
  const [error, setError] = useState("");
  const [removed, setRemoved] = useState(false);
  const preview = useMemo(() => (removed ? "" : previewUrl), [previewUrl, removed]);
  const hasStoredDeviceImage = Boolean(currentUrl?.startsWith("data:image/"));

  return (
    <div className="grid gap-3 rounded-[18px] border border-[#172234]/8 bg-white p-3 shadow-[0_18px_48px_rgba(17,24,39,0.08)] sm:p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-black text-[#162033]">{label}</p>
          <p className="text-xs font-semibold text-[#162033]/50">{hint}</p>
        </div>
        <div className="grid h-9 w-9 place-items-center rounded-[14px] bg-[#E3F0ED] text-[#5F9D99] shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]">
          <ImageIcon size={18} />
        </div>
      </div>

      <div className="overflow-hidden rounded-[16px] border border-dashed border-[#172234]/14 bg-[#F9FAFB]">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt={`${label} preview`} className="h-32 w-full object-cover sm:h-40" />
        ) : (
          <div className="grid h-28 place-items-center text-sm font-semibold text-[#162033]/40 sm:h-40">No image selected</div>
        )}
      </div>

      {error ? <div className="rounded-[8px] border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{error}</div> : null}

      <label className="focus-ring inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-[16px] bg-[#111827] px-4 text-sm font-black text-white shadow-[0_16px_38px_rgba(17,24,39,0.24),inset_0_1px_0_rgba(255,255,255,0.12)] transition hover:bg-[#162033]">
        <Upload size={16} />
        Choose image
        <input
          name={fileName}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={(event) => {
            const file = event.target.files?.[0];
            setError("");
            setRemoved(false);
            if (!file) return;
            if (!allowedTypes.includes(file.type)) {
              setError("Images must be JPG, PNG or WEBP.");
              event.target.value = "";
              return;
            }
            if (file.size > maxFileSize) {
              setError("Images must be 5MB or smaller.");
              event.target.value = "";
              return;
            }
            setPreviewUrl(URL.createObjectURL(file));
          }}
        />
      </label>

      <div className="grid gap-1">
        <input name={urlName} className={inputClass} defaultValue={hasStoredDeviceImage ? "" : currentUrl || ""} placeholder="Or paste image URL" />
        {hasStoredDeviceImage ? <p className="text-xs font-medium text-[#162033]/50">Device image saved. Leave the URL empty to keep it.</p> : null}
      </div>

      {currentUrl || preview ? <label className={`inline-grid h-10 w-10 cursor-pointer place-items-center rounded-[14px] transition focus-within:outline-none focus-within:ring-2 focus-within:ring-red-200 ${removed ? "bg-red-50 text-red-600" : "text-red-600 hover:bg-red-50"}`} title="Remove current image" aria-label="Remove current image">
        <input
          name={removeName}
          type="checkbox"
          value="1"
          checked={removed}
          onChange={(event) => setRemoved(event.target.checked)}
          className="sr-only"
        />
        <Trash2 size={15} />
        <span className="sr-only">Remove current image</span>
      </label> : null}
    </div>
  );
}
