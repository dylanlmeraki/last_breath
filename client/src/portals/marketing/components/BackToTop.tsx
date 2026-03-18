import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.pageYOffset > 300);
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  if (!isVisible) return null;

  return (
    <Button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-20 sm:bottom-8 left-4 sm:left-8 z-50 w-12 h-12 rounded-full bg-slate-800 hover:bg-slate-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-0 border border-cyan-500/30"
      aria-label="Back to top"
      data-testid="button-back-to-top"
    >
      <ArrowUp className="w-5 h-5" />
    </Button>
  );
}
