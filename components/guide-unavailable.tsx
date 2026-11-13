import { Clock } from "lucide-react";

export function GuideUnavailable() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#FAF7F2] px-6 py-16 text-[#111827]">
      <div className="w-full max-w-sm rounded-[24px] border border-[#172234]/10 bg-white p-8 text-center shadow-[0_22px_62px_rgba(17,24,39,0.08)]">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#5F9D99]/12 text-[#3F7F7B]">
          <Clock size={22} aria-hidden="true" />
        </span>
        <h1 className="mt-5 text-xl font-black tracking-tight">This guest guide is taking a short break</h1>
        <p className="mt-3 text-sm font-semibold leading-6 text-[#111827]/68">
          It is temporarily unavailable. Please contact your host directly for Wi-Fi, check-in and other details.
        </p>
      </div>
    </main>
  );
}
