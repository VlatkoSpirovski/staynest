"use client";

import { Trash2 } from "lucide-react";

export function ConfirmSubmitButton({
  message = "Remove this item?",
  children = "Remove"
}: {
  message?: string;
  children?: React.ReactNode;
}) {
  return (
    <button
      type="submit"
      onClick={(event) => {
        if (!window.confirm(message)) {
          event.preventDefault();
        }
      }}
      className="inline-flex items-center gap-2 text-sm font-semibold text-red-600"
    >
      <Trash2 size={15} />
      {children}
    </button>
  );
}
