import React, { useState, useEffect, useRef, useCallback, ElementType } from "react";
import { Search } from "../../config/icons";
import { Input } from "../ui/input";
import { cn } from "../../lib/utils";
import { useNavigate } from "react-router-dom";
import { labsConfig } from "../../config/labs";
import { navigationConfig } from "../../config/navigation";
import { shortcutManager } from "../../services/shortcuts";

interface SearchResult {
  id: string;
  name: string;
  path: string;
  icon: ElementType;
  type: string;
}

interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  containerClassName?: string;
}

export function SearchInput({ className, containerClassName, ...props }: SearchInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const results = React.useMemo(() => {
    if (!query.trim()) {
      return [];
    }
    
    const searchIndex: SearchResult[] = [];
    navigationConfig.forEach(section => {
      section.items.forEach(item => {
        searchIndex.push({
          id: item.href,
          name: item.name,
          path: item.href,
          icon: item.icon,
          type: section.title || "Navigation",
        });
      });
    });

    labsConfig.forEach(lab => {
      if (!searchIndex.find(s => s.path === lab.path)) {
        searchIndex.push({
          id: lab.id,
          name: lab.title,
          path: lab.path,
          icon: lab.icon,
          type: "Lab",
        });
      }
    });

    const lowerQ = query.toLowerCase();
    return searchIndex.filter(item => 
      item.name.toLowerCase().includes(lowerQ) || item.type.toLowerCase().includes(lowerQ)
    );
  }, [query]);

  const handleSelect = useCallback((path: string) => {
    setIsOpen(false);
    setQuery("");
    inputRef.current?.blur();
    navigate(path);
  }, [navigate]);

  useEffect(() => {
    const unregister = shortcutManager.register({
      key: "k",
      ctrlKey: true,
      handler: () => {
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 10);
      }
    });
    return () => unregister();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (results[selectedIndex]) {
          handleSelect(results[selectedIndex].path);
        }
      } else if (e.key === "Escape") {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, selectedIndex, handleSelect]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={cn("relative flex items-center w-full max-w-sm", containerClassName)}>
      <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        ref={inputRef}
        type="search"
        placeholder="Search... (Ctrl+K)"
        className={cn("pl-9 bg-muted/50 focus-visible:bg-background transition-colors", className)}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setSelectedIndex(0);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        {...props}
      />

      {isOpen && query && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-md shadow-lg z-50 max-h-[300px] overflow-y-auto">
          {results.length > 0 ? (
            <ul className="py-2">
              {results.map((result, idx) => (
                <li
                  key={result.id}
                  className={cn(
                    "px-4 py-2 cursor-pointer flex items-center space-x-3 transition-colors",
                    idx === selectedIndex ? "bg-accent text-accent-foreground" : "hover:bg-muted"
                  )}
                  onClick={() => handleSelect(result.path)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                >
                  <result.icon className="h-4 w-4 text-muted-foreground" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{result.name}</span>
                    <span className="text-xs text-muted-foreground">{result.type}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-6 text-center text-sm text-muted-foreground">
              No results found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
