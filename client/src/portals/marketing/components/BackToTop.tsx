import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const docH = document.documentElement.scrollHeight;
      const winH = window.innerHeight;
      const scrollPct = scrollY / Math.max(1, docH - winH);
      setIsVisible(scrollPct >= 0.5);
    };
    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <Button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-20 sm:bottom-8 left-4 sm:left-8 z-50 w-12 h-12 rounded-full bg-slate-800 hover:bg-slate-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-0 border border-cyan-500/30 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
      aria-label="Back to top"
      data-testid="button-back-to-top"
    >
      <ArrowUp className="w-5 h-5" />
    </Button>
  );
}
