"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Newspaper, Calendar, BarChart3, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Destaques",
    icon: Home,
    href: "/",
  },
  {
    label: "Notícias",
    icon: Newspaper,
    href: "/noticias",
  },
  {
    label: "Eventos",
    icon: Calendar,
    href: "/events",
  },
  {
    label: "Menu",
    icon: MoreHorizontal,
    href: "#",
    isMenu: true,
  },
];

interface MobileBottomNavProps {
  onMenuClick?: () => void;
}

export function MobileBottomNav({ onMenuClick }: MobileBottomNavProps) {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden safe-area-pb">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.iconComponent || item.icon;
          const isActive = pathname === item.href;

          if (item.isMenu) {
            return (
              <button
                key={item.label}
                onClick={onMenuClick}
                className="flex flex-col items-center justify-center flex-1 h-full gap-1 text-gray-500 hover:text-primary transition-colors"
              >
                <Icon className="w-6 h-6" />
                <span className="text-[10px] font-medium uppercase tracking-tight">
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors relative",
                isActive ? "text-[#FF6F00]" : "text-gray-500"
              )}
            >
              <Icon className={cn("w-6 h-6", isActive && "text-[#FF6F00]")} />
              <span className="text-[10px] font-medium uppercase tracking-tight">
                {item.label}
              </span>
              {isActive && (
                <div className="absolute top-0 w-8 h-1 bg-[#FF6F00] rounded-b-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}







