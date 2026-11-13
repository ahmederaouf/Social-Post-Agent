"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlRahmaStudio } from "@/components/al-rahma/AlRahmaStudio";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"al-rahma" | "brand-extractor">("al-rahma");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/brand/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ? JSON.stringify(json.error) : `HTTP ${res.status}`);
      router.push(`/brand/${json.id}`);
    } catch (e) {
      setError(String(e));
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              ر
            </div>
            <div>
              <span className="font-extrabold text-base text-slate-900">مخزن الرحمة</span>
              <span className="text-xs text-slate-500 font-medium mr-2">| Social Post Agent</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("al-rahma")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === "al-rahma"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              استوديو مخزن الرحمة
            </button>
            <button
              onClick={() => setActiveTab("brand-extractor")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === "brand-extractor"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              محلل الروابط (Open-Pomelli)
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      {activeTab === "al-rahma" ? (
        <AlRahmaStudio />
      ) : (
        <div className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-8 px-6 pt-16">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">محلل هوية المواقع (Brand Extractor)</h1>
            <p className="mt-2 text-slate-500 text-sm">
              ضع رابط أي متجر أو موقع إلكتروني لاستخراج ألوانه وهويته الترويجية وتوليد حملات تسويقية متكاملة.
            </p>
          </div>

          <form onSubmit={submit} className="flex w-full gap-2">
            <input
              type="url"
              required
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !url}
              className="rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50 shadow-sm"
            >
              {loading ? "جاري التحليل..." : "تحليل"}
            </button>
          </form>

          {error && (
            <div className="w-full rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700 font-medium">
              {error}
            </div>
          )}

          <div className="flex gap-6 text-xs text-slate-500 font-semibold pt-4">
            <Link href="/photo-studio" className="hover:text-emerald-700">
              استوديو الصور (Photo Studio) ←
            </Link>
            <Link href="/animate" className="hover:text-emerald-700">
              تحريك الصور (Animate) ←
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
