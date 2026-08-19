"use client";

import { useFormState } from "react-dom";
import { Sparkles } from "lucide-react";
import { SubmitButton } from "@/components/submit-button";
import { generatePreviewFromUrl } from "@/app/preview-actions";
import { Field, inputClass, Panel } from "@/components/ui/panel";

export function PreviewForm() {
  const [state, formAction] = useFormState(generatePreviewFromUrl, { error: "" });

  return (
    <Panel className="mt-12 bg-white p-6 shadow-[0_20px_60px_rgba(23,32,51,0.06)] rounded-[24px] border border-[#D8D1C4]/55 max-w-xl">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#EFF5F1] text-[#6F9287]">
          <Sparkles size={18} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-[#172033]">See your property inside StayNest</h3>
          <p className="text-sm font-medium text-[#172033]/60">Preview a review-ready guest guide from your Booking.com listing.</p>
        </div>
      </div>

      <form action={formAction} className="mt-6 grid gap-4">
        {state.error ? (
          <div className="rounded-[8px] border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
            {state.error}
          </div>
        ) : null}

        <Field label="Booking.com listing URL">
          <input
            name="listingUrl"
            type="url"
            placeholder="https://www.booking.com/hotel/..."
            className={inputClass}
            required
          />
        </Field>

        <SubmitButton pendingText="Reading listing and building preview..." className="min-h-12 w-full rounded-[14px] text-sm shadow-[0_12px_28px_rgba(23,32,51,0.12)]">
          Generate review-ready preview
        </SubmitButton>

        <p className="text-center text-xs font-semibold text-[#172033]/45 uppercase tracking-wider mt-1">
          No registration required.
        </p>
      </form>
    </Panel>
  );
}
