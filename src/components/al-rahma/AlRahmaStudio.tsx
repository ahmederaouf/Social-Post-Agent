"use client";

import { useState } from "react";
import { AL_RAHMA_BRAND_CORE } from "@/lib/al-rahma/brand-core";

interface QualityReport {
  passed: boolean;
  overallScore: number;
  checks: { checkName: string; passed: boolean; score: number; message: string }[];
  errors: string[];
  warnings: string[];
}

interface PostResult {
  headline: string;
  hook: string;
  body: string;
  cta: string;
  priceTag: string;
  hashtags: string[];
  fullPostText: string;
}

export function AlRahmaStudio() {
  const [title, setTitle] = useState("طقم منظمات تركي 5 قطع متعدد الاستخدام");
  const [category, setCategory] = useState("أدوات منزلية");
  const [originalPrice, setOriginalPrice] = useState(380);
  const [salePrice, setSalePrice] = useState(249);
  const [features, setFeatures] = useState("بلاستيك بيور صحي 100% معتمد\nمحكم الغلق ضد التسريب\nتصميم أنيق يوفر 50% من المساحة");
  const [angle, setAngle] = useState("flash_sale");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const [result, setResult] = useState<{
    copy: PostResult;
    qualityReport: QualityReport;
    compositeImageBase64?: string;
  } | null>(null);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setCopied(false);

    try {
      const res = await fetch("/api/al-rahma/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category,
          originalPrice,
          salePrice,
          features: features.split("\n").filter((f) => f.trim().length > 0),
          angle,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "فشل التوليد");
      setResult(data);
    } catch (err) {
      alert("حدث خطأ أثناء التوليد: " + String(err));
    } finally {
      setLoading(false);
    }
  }

  function copyText() {
    if (!result?.copy.fullPostText) return;
    navigator.clipboard.writeText(result.copy.fullPostText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-4">
      {/* Brand Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-sm mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3 border border-emerald-400/30">
            <span>🚀 Social Post Agent Pipeline</span>
            <span>•</span>
            <span>فرع al-rahma</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {AL_RAHMA_BRAND_CORE.brandName}
          </h1>
          <p className="mt-2 text-slate-300 text-sm sm:text-base max-w-xl">
            {AL_RAHMA_BRAND_CORE.tagline} — نظام أتمتة صناعة المحتوى الترويجي، نظام فحص الجودة (Quality Gate)، ونظام الطبقات البصرية (Overlay Engine).
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <span className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 font-medium">✨ كاتب إعلانات مصري</span>
          <span className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 font-medium">🛡️ Quality Gate 100%</span>
          <span className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 font-medium">🎨 Overlay دقة عالية</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Controls */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span>📦</span>
            <span>بيانات المنتج والعرض</span>
          </h2>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">اسم المنتج</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">التصنيف</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:border-emerald-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">زاوية البوست</label>
                <select
                  value={angle}
                  onChange={(e) => setAngle(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:border-emerald-500 outline-none transition"
                >
                  <option value="flash_sale">🔥 عرض تخفيض قوي (Flash Sale)</option>
                  <option value="product_features">✨ مواصفات وجودة المنتج</option>
                  <option value="home_solution">🏡 حل عملي للمنزل</option>
                  <option value="combo_deal">🎁 باقة توفير كبرى</option>
                  <option value="trust_guarantee">🛡️ المعاينة والضمان</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">السعر الأصلي (ج.م)</label>
                <input
                  type="number"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:border-emerald-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">سعر العرض (ج.م)</label>
                <input
                  type="number"
                  required
                  value={salePrice}
                  onChange={(e) => setSalePrice(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm text-emerald-800 font-bold focus:bg-white focus:border-emerald-500 outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">المواصفات والمميزات (كل ميزة في سطر)</label>
              <textarea
                rows={3}
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 p-3 text-sm text-slate-900 focus:bg-white focus:border-emerald-500 outline-none transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] transition shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>جاري معالجة الـ Pipeline...</span>
              ) : (
                <>
                  <span>⚡ تشغيل الـ Pipeline وإنتاج البوست</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results & Previews */}
        <div className="lg:col-span-7 space-y-6">
          {result ? (
            <>
              {/* Quality Gate Banner */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{result.qualityReport.passed ? "✅" : "⚠️"}</span>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">تقرير بوابة الجودة (Quality Gate)</h3>
                      <p className="text-xs text-slate-500">تم فحص النصوص والمطابقة ومعايير الإعلان</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">درجة الجودة</span>
                    <span className="text-2xl font-black text-emerald-600">
                      {result.qualityReport.overallScore}%
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100">
                  {result.qualityReport.checks.slice(0, 4).map((c, i) => (
                    <div key={i} className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <span className="text-xs font-semibold text-slate-700 block truncate">{c.checkName}</span>
                      <span className="text-xs font-bold text-emerald-600">✓ {c.score}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Visual Overlay & Render Preview */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <span>🖼️</span>
                    <span>معاينة التصميم وطبقات الـ Overlay</span>
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">1080 × 1080 (Sharp Rendered)</span>
                </div>

                {result.compositeImageBase64 && (
                  <div className="relative aspect-square w-full max-w-md mx-auto rounded-xl overflow-hidden border border-slate-200 shadow-inner">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={result.compositeImageBase64}
                      alt="Overlay Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Arabic Copy Result */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <span>✍️</span>
                    <span>الكوبي الترويجي المكتمل</span>
                  </h3>
                  <button
                    onClick={copyText}
                    className="text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg transition flex items-center gap-1.5"
                  >
                    <span>{copied ? "تم النسخ بنجاح! ✓" : "📋 نسخ النص كاملاً"}</span>
                  </button>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-slate-800 text-sm whitespace-pre-line leading-relaxed font-sans">
                  {result.copy.fullPostText}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-500">
              <span className="text-4xl block mb-3">⚡</span>
              <h3 className="text-base font-bold text-slate-800 mb-1">الـ Pipeline جاهز للتشغيل</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                اضغط على زر &ldquo;تشغيل الـ Pipeline وإنتاج البوست&rdquo; لتوليد الكوبي، حساب الخصومات، تطبيق الـ Overlay، وفحص الجودة تلقائياً.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

