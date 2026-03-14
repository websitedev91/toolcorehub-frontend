// app/blog/layout.tsx
import React from "react";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {children}
      </div>
    </div>
  );
}
