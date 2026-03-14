"use client";

import React from "react";

export function SiteFooter() {
  return (
    <footer className="w-full bg-[#5B21B6] border-t border-violet-700 py-5 relative z-50">
      <div className="w-[90%] mx-auto px-4 text-[12px] text-violet-200 flex flex-col md:flex-row items-center justify-between gap-3">
        <div>© {new Date().getFullYear()} Toolcorehub. All rights reserved.</div>
        <div className="flex gap-4">
          <button className="hover:text-white transition-colors">Privacy Policy</button>
          <button className="hover:text-white transition-colors">Terms</button>
          <button className="hover:text-white transition-colors">Contact</button>
        </div>
      </div>
    </footer>
  );
}
