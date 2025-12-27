"use client";

import { Card, CardContent } from "@/components/ui/card";

interface AdBannerProps {
  width?: number;
  height?: number;
  label?: string;
  className?: string;
}

export function AdBanner({
  width = 728,
  height = 90,
  label,
  className = "",
}: AdBannerProps) {
  const sizeLabel = `${width} x ${height}`;
  const displayLabel = label || "Espaço Publicitário";

  return (
    <Card className={`border-2 border-orange-200 bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 ${className}`}>
      <CardContent className="p-0">
        <div
          className="w-full bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 flex items-center justify-center border-2 border-dashed border-orange-300"
          style={{ minHeight: `${height}px` }}
        >
          <div className="text-center p-4">
            <p className="text-xs font-semibold text-orange-700 uppercase tracking-wider mb-1">
              {displayLabel}
            </p>
            <p className="text-xs text-orange-600">{sizeLabel}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}













