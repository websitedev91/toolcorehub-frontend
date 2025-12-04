"use client";

import React from "react";

const ToolsSidebar: React.FC = () => {
  return (
    <aside className="fixed top-16 right-[5%] w-[20rem]">
      <div className="sticky top-20 bg-[#1E1E1E] border-l border-[#3E3E3E] rounded-md p-3">
        <div className="text-xs font-medium text-muted-foreground mb-3">
          Sponsored
        </div>

        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-lg border bg-card p-3 hover:shadow-md transition-shadow mb-4"
        >
          <div className="relative h-32 bg-muted rounded-md mb-3 overflow-hidden" />
          <h3 className="font-medium text-xs sm:text-sm">
            Self Managed Hosting 2.0
          </h3>
          <p className="text-xs text-muted-foreground">
            Stop paying for what you own. Host tools on a fast VPS.
          </p>
        </a>

        <div className="rounded-lg border bg-card overflow-hidden h-72 flex items-center justify-center text-xs text-muted-foreground">
          Ad slot (300x300)
        </div>
      </div>
    </aside>
  );
};

export default ToolsSidebar;
