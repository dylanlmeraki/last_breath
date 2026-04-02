

interface ShinyButtonCSSVars {
  "--shiny-cta-bg"?: string;
  "--shiny-cta-bg-subtle"?: string;
  "--shiny-cta-fg"?: string;
  "--shiny-cta-highlight"?: string;
  "--shiny-cta-highlight-subtle"?: string;
  "--shiny-cta-shadow"?: string;
  "--shiny-cta-glow"?: string;
}

type ShinyButtonStyle = React.CSSProperties & ShinyButtonCSSVars;

type ShinyButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'style'> & {
  children: React.ReactNode;
  className?: string;
  style?: ShinyButtonStyle;
  type?: "button" | "submit" | "reset";
};

export function ShinyButton({
  children,
  onClick,
  className = "",
  style = {},
  type = "button",
  ...props
}: ShinyButtonProps) {
  const cssVars: ShinyButtonStyle = {
    "--shiny-cta-bg": style["--shiny-cta-bg"] || "#0f172a",
    "--shiny-cta-bg-subtle": style["--shiny-cta-bg-subtle"] || "rgba(15, 23, 42, 0.85)",
    "--shiny-cta-fg": style["--shiny-cta-fg"] || "#ffffff",
    "--shiny-cta-highlight": style["--shiny-cta-highlight"] || "#2563eb",
    "--shiny-cta-highlight-subtle": style["--shiny-cta-highlight-subtle"] || "#38bdf8",
    "--shiny-cta-shadow": style["--shiny-cta-shadow"] || "rgba(37, 99, 235, 0.45)",
    "--shiny-cta-glow": style["--shiny-cta-glow"] || "rgba(59, 130, 246, 0.45)",
    ...style,
  };

  return (
    <button
      type={type}
      className={`shiny-cta ${className}`}
      onClick={onClick}
      style={cssVars}
      {...props}
    >
      <span>{children}</span>
    </button>
  );
}
