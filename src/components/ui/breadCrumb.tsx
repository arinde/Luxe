"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

export default function Breadcrumb() {
  const pathname = usePathname();

  const segments = pathname
    .split("/")
    .filter(Boolean)
    .map((segment, index, arr) => ({
      label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " "),
      href: "/" + arr.slice(0, index + 1).join("/"),
    }));

  if (segments.length === 0) return null;

  return (
    <nav className="flex items-center gap-1 text-[12px] font-['Inter'] tracking-[0.05em]">
      <Link href="/" className="text-[#888888] hover:text-[#F5F5F3] transition-colors duration-200">
        Home
      </Link>

      {segments.map((segment, i) => (
        <span key={segment.href} className="flex items-center gap-1">
          <ChevronRight size={12} className="text-[#555555]" />
          {i === segments.length - 1 ? (
            <span className="text-[#F5F5F3]">{segment.label}</span>
          ) : (
            <Link href={segment.href} className="text-[#888888] hover:text-[#F5F5F3] transition-colors duration-200">
              {segment.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}