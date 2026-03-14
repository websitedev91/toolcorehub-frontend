"use client";

import React from "react";
import { Search, Bell } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-[#0F172A] border-b border-[#334155] flex items-center">
      {/* Logo zone — matches sidebar width */}
      <div className="w-64 shrink-0 flex items-center px-6 border-r border-[#334155] h-full">
        <div className="flex items-center gap-2.5">
          {/* Icon mark */}
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="logoGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#2563EB" />
                <stop offset="100%" stopColor="#38BDF8" />
              </linearGradient>
            </defs>
            {/* Rounded square background */}
            <rect width="32" height="32" rx="8" fill="url(#logoGrad)" />
            {/* Hub center dot */}
            <circle cx="16" cy="16" r="3" fill="white" />
            {/* Spoke lines */}
            <line x1="16" y1="7" x2="16" y2="11" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <line x1="16" y1="21" x2="16" y2="25" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <line x1="7" y1="16" x2="11" y2="16" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <line x1="21" y1="16" x2="25" y2="16" stroke="white" strokeWidth="2" strokeLinecap="round" />
            {/* Diagonal spokes */}
            <line x1="9.5" y1="9.5" x2="12.3" y2="12.3" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="19.7" y1="19.7" x2="22.5" y2="22.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="22.5" y1="9.5" x2="19.7" y2="12.3" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="12.3" y1="19.7" x2="9.5" y2="22.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          </svg>

          {/* Wordmark */}
          <span className="text-[15px] font-semibold leading-none">
            <span className="text-[#F8FAFC]">Toolcore</span>
            <span className="text-[#38BDF8]">hub</span>
            <span className="text-[#94A3B8] text-[13px]">.com</span>
          </span>
        </div>
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
