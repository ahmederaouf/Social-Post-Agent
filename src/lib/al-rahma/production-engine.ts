import sharp from "sharp";
import { ArabicCopywriter, ProductDetails, GeneratedArabicCopy, PostAngle } from "./arabic-copywriter";
import { OverlaySystem, OverlayOptions } from "./overlay-system";
import { QualityGate, QualityGateReport } from "./quality-gate";

export interface ProductionRequest {
  product: ProductDetails;
  angle?: PostAngle;
  width?: number;
  height?: number;
  baseImageBuffer?: Buffer;
  baseColor?: string;
  customPillText?: string;
}

export interface ProductionResult {
  success: boolean;
  copy: GeneratedArabicCopy;
  qualityReport: QualityGateReport;
  svgOverlay: string;
  compositeImageBuffer?: Buffer;
  compositeImageBase64?: string;
  metadata: {
    productName: string;
    salePrice: number;
    angle: string;
    generatedAt: string;
    dimensions: { width: number; height: number };
  };
}

export class ProductionEngine {
  /**
   * تشغيل خط الإنتاج الكامل لبوست "مخزن الرحمة"
   */
  public static async execute(request: ProductionRequest): Promise<ProductionResult> {
    const {
      product,
      angle = "flash_sale",
      width = 1080,
      height = 1080,
      baseImageBuffer,
      baseColor = "#F1F5F9",
      customPillText,
    } = request;

    // 1. توليد النصوص التسويقية العربية
    const copy = ArabicCopywriter.generatePost(product, angle);

    // 2. إعداد مواصفات الـ Overlay
    let discountText = "عرض خاص";
    if (product.originalPrice && product.originalPrice > product.salePrice) {
      const percentage = Math.round(((product.originalPrice - product.salePrice) / product.originalPrice) * 100);
      discountText = `خصم ${percentage}%`;
    }

    const overlayOpts: OverlayOptions = {
      width,
      height,
      showLogo: true,
      showDiscountBadge: true,
      discountText,
      showPriceTag: true,
      salePrice: product.salePrice,
      originalPrice: product.originalPrice,
      currency: product.currency || "ج.م",
      showFooterBar: true,
      customPillText: customPillText || "خامة أصلية 100%",
    };

    // 3. توليد كود الـ SVG للطبقات البصرية
    const svgOverlay = OverlaySystem.generateOverlaySvg(overlayOpts);

    // 4. فحص الجودة (Quality Gate)
    const qualityReport = QualityGate.evaluate(copy, product, overlayOpts);

    // 5. دمج الصورة والخلفية مع الـ SVG باستخدام Sharp
    let compositeImageBuffer: Buffer | undefined;
    let compositeImageBase64: string | undefined;

    try {
      let background = baseImageBuffer
        ? sharp(baseImageBuffer).resize(width, height, { fit: "cover" })
        : sharp({
            create: {
              width,
              height,
              channels: 4,
              background: baseColor,
            },
          });

      const svgBuffer = Buffer.from(svgOverlay);

      compositeImageBuffer = await background
        .composite([
          {
            input: svgBuffer,
            top: 0,
            left: 0,
          },
        ])
        .png()
        .toBuffer();

      compositeImageBase64 = `data:image/png;base64,${compositeImageBuffer.toString("base64")}`;
    } catch (err) {
      console.error("Error creating composite image with Sharp:", err);
    }

    return {
      success: qualityReport.passed,
      copy,
      qualityReport,
      svgOverlay,
      compositeImageBuffer,
      compositeImageBase64,
      metadata: {
        productName: product.title,
        salePrice: product.salePrice,
        angle,
        generatedAt: new Date().toISOString(),
        dimensions: { width, height },
      },
    };
  }
}

