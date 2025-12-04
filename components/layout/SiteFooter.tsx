"use client";

import React from "react";

export function SiteFooter() {
  return (
    <footer className="w-full bg-slate-950 border-t border-slate-800 py-5 relative z-50">
      <div className="w-[90%] mx-auto px-4 text-[12px] text-slate-400 flex flex-col md:flex-row items-center justify-between gap-3">
        <div>© {new Date().getFullYear()} Toolcorehub. All rights reserved.</div>
        <div className="flex gap-4">
          <button className="hover:text-sky-400 transition-colors">Privacy Policy</button>
          <button className="hover:text-sky-400 transition-colors">Terms</button>
          <button className="hover:text-sky-400 transition-colors">Contact</button>
        </div>
      </div>
    </footer>
  );
}
