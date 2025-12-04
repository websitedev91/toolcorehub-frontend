import React from "react";

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex-1 bg-[#0b1220] pt-16">
      <div className="w-[90%] mx-auto pb-[calc(footerHeight)]">
        {/* full width tool content */}
        <div className="w-full">
          {children}
        </div>
      </div>
    </main>
  );
}
