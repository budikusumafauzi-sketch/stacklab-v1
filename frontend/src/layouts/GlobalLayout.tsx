import { type ReactNode } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

import { CommandPalette } from "../components/system/CommandPalette";

interface GlobalLayoutProps {
  children: ReactNode;
}

export default function GlobalLayout({ children }: GlobalLayoutProps) {
  return (
    <div className="flex h-screen w-full bg-muted font-sans text-foreground">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>

      <CommandPalette />
    </div>
  );
}
