"use client";

import QRCode from "qrcode";
import { useEffect, useState } from "react";
import { Download, Eye, EyeOff } from "lucide-react";
import { type WifiSecurity, wifiQrPayload } from "@/lib/wifi-qr";

export function WifiQrGenerator() {
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [security, setSecurity] = useState<WifiSecurity>("WPA");
  const [hidden, setHidden] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [dataUrl, setDataUrl] = useState("");
  const [error, setError] = useState("");

  const ready = ssid.trim().length > 0 && (security === "nopass" || password.length > 0);

  useEffect(() => {
    if (!ready) {
      setDataUrl("");
      return;
    }
    let active = true;
    QRCode.toDataURL(wifiQrPayload({ ssid, password, security, hidden }), { width: 640, margin: 2, errorCorrectionLevel: "M" })
      .then((url) => {
        if (active) {
          setDataUrl(url);
          setError("");
        }
      })
      .catch(() => {
        if (active) setError("This network name or password is too long for a QR code.");
      });
    return () => {
      active = false;
    };
  }, [ssid, password, security, hidden, ready]);

  const inputClass =
    "mt-1.5 min-h-12 w-full rounded-[14px] border border-[#D8D1C4] bg-white px-4 text-base text-[#172033] outline-none focus:border-[#6F9287] focus:ring-2 focus:ring-[#6F9287]/30";

  return (
    <div className="grid gap-6 rounded-[24px] border border-[#D8D1C4]/60 bg-white p-5 shadow-[0_18px_50px_rgba(23,32,51,0.06)] sm:p-7 md:grid-cols-[1fr_260px]">
      <form className="grid gap-4" onSubmit={(event) => event.preventDefault()}>
        <label className="text-sm font-semibold">
          Network name (SSID)
          <input className={inputClass} value={ssid} onChange={(event) => setSsid(event.target.value)} autoComplete="off" spellCheck={false} placeholder="e.g. VillaBeti-Guest" />
        </label>

        <label className="text-sm font-semibold">
          Security
          <select className={inputClass} value={security} onChange={(event) => setSecurity(event.target.value as WifiSecurity)}>
            <option value="WPA">WPA / WPA2 / WPA3 (most routers)</option>
            <option value="WEP">WEP (old routers)</option>
            <option value="nopass">No password</option>
          </select>
        </label>

        {security !== "nopass" ? (
          <label className="text-sm font-semibold">
            Password
            <span className="relative block">
              <input
                className={`${inputClass} pr-12`}
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="off"
                spellCheck={false}
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-[calc(50%-3px)] place-items-center rounded-full text-[#172033]/60 hover:bg-[#172033]/5"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </span>
          </label>
        ) : null}

        <label className="flex min-h-11 items-center gap-3 text-sm font-semibold">
          <input type="checkbox" checked={hidden} onChange={(event) => setHidden(event.target.checked)} className="h-5 w-5 accent-[#172033]" />
          Hidden network
        </label>

        <p className="rounded-[14px] bg-[#F1F5F1] px-4 py-3 text-xs leading-5 text-[#3F5652]">
          The QR code is created in your browser. Your network name and password are not sent to StayNest or anyone else.
        </p>
      </form>

      <div className="flex flex-col items-center gap-4">
        <div className="grid aspect-square w-full max-w-[260px] place-items-center rounded-[18px] border border-dashed border-[#D8D1C4] bg-[#FAF7F2] p-3">
          {dataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={dataUrl} alt="Wi-Fi QR code for your network" className="h-full w-full" />
          ) : (
            <p className="px-4 text-center text-sm text-[#172033]/55">Enter your network name{security !== "nopass" ? " and password" : ""} to create the QR code.</p>
          )}
        </div>
        {error ? <p role="alert" className="text-center text-sm text-red-700">{error}</p> : null}
        <a
          href={dataUrl || undefined}
          download={dataUrl ? `wifi-qr-${ssid.trim().replace(/[^a-z0-9]+/gi, "-").toLowerCase() || "network"}.png` : undefined}
          aria-disabled={!dataUrl}
          className={`inline-flex min-h-12 w-full max-w-[260px] items-center justify-center gap-2 rounded-full px-5 text-sm font-black transition ${dataUrl ? "bg-[#111827] text-white hover:bg-[#1F2937]" : "pointer-events-none bg-[#172033]/10 text-[#172033]/40"}`}
        >
          <Download size={16} /> Download PNG
        </a>
      </div>
    </div>
  );
}
