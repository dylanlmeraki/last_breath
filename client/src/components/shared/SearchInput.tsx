import { useState, useEffect, useCallback } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
  className?: string;
}

export function SearchInput({ value, onChange, placeholder = "Search...", debounceMs = 300, className }: SearchInputProps) {
  const [internal, setInternal] = useState(value);

  useEffect(() => {
    setInternal(value);
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (internal !== value) {
        onChange(internal);
      }
    }, debounceMs);
    return () => clearTimeout(timer);
  }, [internal, debounceMs]);

  return (
    <div className={`relative ${className || ""}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        value={internal}
        onChange={(e) => setInternal(e.target.value)}
        placeholder={placeholder}
        className="pl-9 pr-8"
        data-testid="input-search"
      />
      {internal && (
        <button
          onClick={() => { setInternal(""); onChange(""); }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          data-testid="button-clear-search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
