"use client";

import React from "react";
import { Search, Bell } from "lucide-react";
import Logo from "@/app/logo1.webp";

export function SiteHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-[#0F172A] border-b border-[#334155] flex items-center">
      {/* Logo zone — matches sidebar width */}
      <div className="w-64 shrink-0 flex items-center px-6 border-r border-[#334155] h-full">
        <img
          src={Logo.src}
          alt="Toolcorehub"
          className="h-5 w-auto object-contain"
        />
      </div>

      {/* Search — center */}
      <div className="flex-1 px-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8] pointer-events-none" />
          <input
            type="text"
            placeholder="Search tools..."
            className="w-full h-9 bg-[#1E293B] border border-[#334155] rounded-lg pl-9 pr-4 text-sm text-[#F8FAFC] placeholder:text-[#94A3B8] outline-none focus:border-[#2563EB] transition-colors"
          />
        </div>
      </div>

      {/* Right — notifications + avatar */}
      <div className="flex items-center gap-2 px-6">
        {/* Bell */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-lg text-[#94A3B8] hover:bg-[#1E293B] hover:text-[#F8FAFC] transition-all">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#2563EB] rounded-full" />
        </button>

        {/* User avatar */}
        <button className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2563EB] to-[#7C3AED] flex items-center justify-center text-white text-xs font-bold shrink-0">
          U
        </button>
      </div>
    </header>
  );
}
