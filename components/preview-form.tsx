"use client";

import { useFormState } from "react-dom";
import Link from "next/link";
import { Link2 } from "lucide-react";
import { SubmitButton } from "@/components/submit-button";
import { generatePreviewFromUrl } from "@/app/preview-actions";
import { getAppUrl } from "@/lib/utils";

export function PreviewForm() {
  const [state, formAction] = useFormState(generatePreviewFromUrl, { error: "" } as { error: string; blockedHost?: string });

  return (
    <form action={formAction} className="w-full">
      <label htmlFor="preview-listing-url" className="sr-only">
        Booking.com listing URL
      </label>
      <div className="flex flex-col gap-2 rounded-[22px] border border-sn-line/10 bg-white p-2 shadow-[0_18px_50px_rgba(17,24,39,0.08)] sm:flex-row sm:items-center sm:rounded-full">
        <div className="flex min-h-12 flex-1 items-center gap-2 px-3">
          <Link2 size={18} className="shrink-0 text-sn-accent" aria-hidden="true" />
          <input
            id="preview-listing-url"
            name="listingUrl"
            type="url"
            required
            placeholder="Paste your Booking.com link"
            className="min-w-0 flex-1 bg-transparent text-[15px] font-medium text-sn-ink outline-none placeholder:text-sn-muted/70"
          />
        </div>
        <SubmitButton
          pendingText="Building your preview..."
          className="min-h-12 rounded-full bg-sn-ink px-6 text-[15px] font-semibold text-white hover:bg-sn-ink/90"
        >
          See my guide
        </SubmitButton>
      </div>
      {state.blockedHost ? (
        <div role="alert" className="mt-3 rounded-2xl bg-sn-accent-soft px-4 py-3 text-sm text-sn-ink">
          <p>{state.error}</p>
          <Link href={`${getAppUrl()}/register?plan=ai`} className="mt-2 inline-flex font-semibold text-sn-accent underline-offset-4 hover:underline">
            Create my free guide
          </Link>
        </div>
      ) : state.error ? (
        <p role="alert" className="mt-3 rounded-2xl bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700">
          {state.error}
        </p>
      ) : (
        <p className="mt-3 text-sm text-sn-muted">Free preview of your own property. No account needed.</p>
      )}
    </form>
  );
}
