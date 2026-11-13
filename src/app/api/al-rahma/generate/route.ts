import { NextRequest, NextResponse } from "next/server";
import { ProductionEngine } from "@/lib/al-rahma/production-engine";
import { PostAngle } from "@/lib/al-rahma/arabic-copywriter";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      category = "أدوات منزلية",
      salePrice = 199,
      originalPrice = 299,
      features = ["خامة ممتازة متينة وتعيش", "تصميم عصري موفر للمساحة", "سهل الاستخدام والتنظيف"],
      angle = "flash_sale",
      customPillText = "خامة أصلية 100%",
    } = body;

    const result = await ProductionEngine.execute({
      product: {
        title,
        category,
        salePrice: Number(salePrice),
        originalPrice: originalPrice ? Number(originalPrice) : undefined,
        features: Array.isArray(features) ? features : [features],
      },
      angle: angle as PostAngle,
      customPillText,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Al-Rahma generation error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

