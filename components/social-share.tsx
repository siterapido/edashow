"use client";

import { Facebook, Twitter, Linkedin, Share2, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
}

export function SocialShare({ url, title, description }: SocialShareProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== "undefined" ? window.location.href : url;
  const shareText = description || title;

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      shareUrl
    )}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      shareUrl
    )}&text=${encodeURIComponent(title)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      shareUrl
    )}`,
  };

  const handleShare = (platform: keyof typeof shareLinks) => {
    window.open(shareLinks[platform], "_blank", "width=600,height=400");
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Falha ao copiar link:", err);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-slate-200">
      <span className="text-sm font-semibold text-slate-700">Compartilhar:</span>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleShare("facebook")}
          className="gap-2 border-slate-200 hover:bg-blue-50 hover:border-blue-300"
          aria-label="Compartilhar no Facebook"
        >
          <Facebook className="w-4 h-4 text-blue-600" />
          <span className="hidden sm:inline">Facebook</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleShare("twitter")}
          className="gap-2 border-slate-200 hover:bg-sky-50 hover:border-sky-300"
          aria-label="Compartilhar no Twitter"
        >
          <Twitter className="w-4 h-4 text-sky-500" />
          <span className="hidden sm:inline">Twitter</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleShare("linkedin")}
          className="gap-2 border-slate-200 hover:bg-blue-50 hover:border-blue-300"
          aria-label="Compartilhar no LinkedIn"
        >
          <Linkedin className="w-4 h-4 text-blue-700" />
          <span className="hidden sm:inline">LinkedIn</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyLink}
          className="gap-2 border-slate-200 hover:bg-slate-50"
          aria-label="Copiar link"
        >
          {copied ? (
            <>
              <Link2 className="w-4 h-4 text-green-600" />
              <span className="hidden sm:inline text-green-600">Copiado!</span>
            </>
          ) : (
            <>
              <Link2 className="w-4 h-4" />
              <span className="hidden sm:inline">Copiar link</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}












