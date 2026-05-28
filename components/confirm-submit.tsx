"use client";

import { Trash2 } from "lucide-react";

export function ConfirmSubmitButton({
  message = "Remove this item?",
  children
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
      aria-label={typeof children === "string" ? children : "Remove"}
      title={typeof children === "string" ? children : "Remove"}
      className="grid h-10 w-10 place-items-center rounded-[14px] text-red-600 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200"
    >
      <Trash2 size={15} />
      {children ? <span className="sr-only">{children}</span> : null}
    </button>
  );
}
