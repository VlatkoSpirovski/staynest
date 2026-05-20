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

  return (
    <div className="grid gap-3 rounded-[8px] border border-ink/10 bg-mist p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-ink">{label}</p>
          <p className="text-xs text-ink/55">{hint}</p>
        </div>
        <ImageIcon className="text-lagoon" size={20} />
      </div>

      <div className="overflow-hidden rounded-[8px] border border-dashed border-ink/15 bg-white">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt={`${label} preview`} className="h-40 w-full object-cover" />
        ) : (
          <div className="grid h-40 place-items-center text-sm font-semibold text-ink/45">No image selected</div>
        )}
      </div>

      {error ? <div className="rounded-[8px] border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{error}</div> : null}

      <label className="focus-ring inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-ink ring-1 ring-ink/10 transition hover:bg-white/80">
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

      <input name={urlName} className={inputClass} defaultValue={currentUrl || ""} placeholder="Or paste image URL if uploads are not configured" />

      <label className="inline-flex items-center gap-2 text-sm font-semibold text-ink/60">
        <input
          name={removeName}
          type="checkbox"
          value="1"
          checked={removed}
          onChange={(event) => setRemoved(event.target.checked)}
          className="h-4 w-4 rounded border-ink/20"
        />
        <Trash2 size={15} />
        Remove current image
      </label>
    </div>
  );
}
