"use client";

import { useState } from "react";
import Image from "next/image";
import { PartnerLogoFallback } from "./partner-logo-fallback";

interface PartnerLogoProps {
  src: string;
  alt: string;
  name: string;
  size?: number;
}

export function PartnerLogo({ src, alt, name, size = 64 }: PartnerLogoProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="w-full h-full flex items-center justify-center relative">
      {!imageError ? (
        <Image
          src={src}
          alt={alt}
          width={size}
          height={size}
          className="w-full h-full object-contain p-2"
          onError={() => setImageError(true)}
        />
      ) : (
        <PartnerLogoFallback name={name} size={size} />
      )}
    </div>
  );
}












