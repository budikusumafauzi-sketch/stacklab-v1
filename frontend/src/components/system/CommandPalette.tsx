import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Input } from "../ui/input";
import { Search } from "lucide-react";

export function CommandPalette() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setOpen(true);
    document.addEventListener("cmd-palette:open", handleOpen);
    return () => {
      document.removeEventListener("cmd-palette:open", handleOpen);
    };
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-xl p-0 overflow-hidden bg-background/80 backdrop-blur-md border-border/50">
        <DialogHeader className="sr-only">
          <DialogTitle>Command Palette</DialogTitle>
          <DialogDescription>Search for anything in the workspace</DialogDescription>
        </DialogHeader>
        <div className="flex items-center border-b px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <Input 
            className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 border-0 focus-visible:ring-0" 
            placeholder="Search commands, files, or ask AI..." 
          />
        </div>
        <div className="max-h-[300px] overflow-y-auto p-2">
          {/* Mock results for now */}
          <div className="py-6 text-center text-sm text-muted-foreground">
            No results found. Start typing to search.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}