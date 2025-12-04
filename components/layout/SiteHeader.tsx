"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Logo from "@/app/logo1.webp";
export function SiteHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur">
      <div className="w-[90%] mx-auto px-4 h-16 flex items-center justify-between">
  <div className="flex items-center gap-2">
  <img
    src={Logo.src}
    alt="Toolcorehub"
    className="h-5 w-auto object-contain"
  />
 
</div>

        <nav className="hidden md:flex items-center gap-6 text-sm text-slate-100/85">
          <button className="hover:text-sky-400 transition-colors">About</button>
          <button className="hover:text-sky-400 transition-colors">Services</button>
          <button className="hover:text-sky-400 transition-colors">Tools</button>
          <button className="hover:text-sky-400 transition-colors">Blog</button>
         
        </nav>

        <Button
          size="sm"
          className="text-xs px-4 py-1.5 bg-slate-100 text-slate-900 hover:bg-white shadow-sm"
        >
          Login
        </Button>
      </div>
    </header>
  );
}
