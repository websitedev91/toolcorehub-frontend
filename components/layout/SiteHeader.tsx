"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Logo from "@/app/logo1.webp";

export function SiteHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-violet-200 bg-[#F5F3FF]/90 backdrop-blur">
      <div className="w-[90%] mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src={Logo.src}
            alt="Toolcorehub"
            className="h-5 w-auto object-contain"
          />
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm text-violet-800">
          <button className="hover:text-[#7C3AED] transition-colors">About</button>
          <button className="hover:text-[#7C3AED] transition-colors">Services</button>
          <button className="hover:text-[#7C3AED] transition-colors">Tools</button>
          <button className="hover:text-[#7C3AED] transition-colors">Blog</button>
        </nav>

        <Button
          size="sm"
          className="text-xs px-4 py-1.5 bg-[#7C3AED] text-white hover:bg-[#5B21B6] shadow-sm"
        >
          Login
        </Button>
      </div>
    </header>
  );
}
