import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle, Phone, PhoneCall, ArrowUpRight } from "lucide-react";
import { createPageUrl } from "../lib/utils";
import AnimatedGridBackground from "./AnimatedGridBackground";

interface CTASectionProps {
  headline: string;
  body: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  primaryButtonIsExternal?: boolean;
  testIdPrefix?: string;
  backgroundImage?: string;
  backgroundPosition?: string;
}

export default function CTASection({
  headline,
  body,
  primaryButtonText,
  primaryButtonLink,
  primaryButtonIsExternal = false,
  testIdPrefix = "cta",
  backgroundImage,
  backgroundPosition = "center 35%",
}: CTASectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const rm = !!prefersReducedMotion;

  return (
    <section className="relative bg-slate-900 overflow-hidden" data-testid={`section-${testIdPrefix}`}>
      {backgroundImage && (
        <div className="absolute inset-0 hidden opacity-80 sm:block">
          <img
            src={backgroundImage}
            alt=""
            className="w-full h-full object-cover"
            style={{ objectPosition: backgroundPosition, transform: "scale(1.15)" }}
          />
        </div>
      )}
      {backgroundImage && (
        <div className="absolute inset-0 hidden bg-slate-900/50 mix-blend-multiply sm:block" />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 to-slate-950/95 sm:from-slate-900/20 sm:to-slate-950/60" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.015)_1px,transparent_1px)] bg-[size:12px_12px]" />
      </div>
      <div className="absolute inset-0 opacity-[0.12] pointer-events-none z-[2]" aria-hidden="true">
        <AnimatedGridBackground />
      </div>
      <div className="pe-cta-glow-pulse absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] bg-cyan-500/[0.06] rounded-full blur-[120px] pointer-events-none z-[3]" />
      <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 py-12 sm:py-16 md:py-20 lg:py-24">
        <motion.h2
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white mb-5 sm:mb-8 tracking-tight leading-[1.08] font-bold"
          style={{ textShadow: "0 0 40px rgba(6,182,212,0.15), 0 0 80px rgba(6,182,212,0.08)" }}
          data-testid={`text-${testIdPrefix}-title`}
          initial={rm ? { opacity: 1 } : { opacity: 0, y: 40, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.3 }}
          transition={rm ? { duration: 0 } : { duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {headline}
        </motion.h2>
        <motion.p
          className="sm:text-lg md:text-xl lg:text-2xl text-slate-200 mb-8 sm:mb-12 font-light max-w-3xl mx-auto text-[20px]"
          initial={rm ? { opacity: 1 } : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={rm ? { duration: 0 } : { duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          {body}
        </motion.p>

        <motion.div
          className="inline-flex flex-col sm:flex-row gap-3 sm:gap-5 md:gap-8 justify-center items-center mb-8 sm:mb-12 bg-white/[0.05] backdrop-blur-sm border border-white/[0.12] rounded-lg sm:rounded-full px-4 sm:px-6 py-4 sm:py-3 shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)]"
          initial={rm ? { opacity: 1 } : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={rm ? { duration: 0 } : { duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          {primaryButtonIsExternal ? (
            <a
              href={primaryButtonLink}
              className="w-full sm:w-auto px-10 sm:px-14 py-4 sm:py-[18px] bg-orange-600 hover:bg-orange-500 text-white font-bold tracking-tight text-base sm:text-lg rounded-sm sm:rounded-full flex items-center justify-center gap-3 shadow-[0_4px_12px_rgba(249,115,22,0.15)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_35px_rgba(249,115,22,0.5)] active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:ring-offset-2 focus-visible:outline-none"
              data-testid={`link-${testIdPrefix}-primary`}
            >
              <PhoneCall className="w-5 h-5 sm:w-6 sm:h-6" />
              {primaryButtonText}
            </a>
          ) : (
            <Link
              to={primaryButtonLink}
              className="w-full sm:w-auto px-10 sm:px-14 py-4 sm:py-[18px] bg-orange-600 hover:bg-orange-500 text-white font-bold tracking-tight text-base sm:text-lg rounded-sm sm:rounded-full flex items-center justify-center gap-3 shadow-[0_4px_12px_rgba(249,115,22,0.15)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_35px_rgba(249,115,22,0.5)] active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:ring-offset-2 focus-visible:outline-none"
              data-testid={`link-${testIdPrefix}-primary`}
            >
              <PhoneCall className="w-5 h-5 sm:w-6 sm:h-6" />
              {primaryButtonText}
            </Link>
          )}
          <a
            href="tel:+14156894428"
            className="flex w-full items-center justify-center gap-3 rounded-sm px-10 py-4 text-base font-bold tracking-tight text-white shadow-[0_4px_12px_rgba(6,182,212,0.12)] transition-all duration-300 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 sm:hidden [background:radial-gradient(ellipse_at_center,#0891b2,#3b82f6)]"
            data-testid={`link-${testIdPrefix}-call-mobile`}
          >
            <Phone className="w-5 h-5" /> (415) 689-4428
          </a>
          <Link
            to={createPageUrl("Contact")}
            className="hidden w-auto items-center justify-center gap-3 rounded-full px-14 py-[18px] text-lg font-bold tracking-tight text-white shadow-[0_4px_12px_rgba(6,182,212,0.12)] transition-all duration-300 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 hover:-translate-y-1 hover:shadow-[0_12px_35px_rgba(6,182,212,0.45)] sm:flex [background:radial-gradient(ellipse_at_center,#0891b2,#3b82f6)] hover:[background:radial-gradient(ellipse_at_center,#06b6d4,#2563eb)]"
            data-testid={`link-${testIdPrefix}-contact`}
          >
            Get in Touch
            <ArrowUpRight className="w-5 h-5" />
          </Link>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-x-4 sm:gap-x-8 gap-y-2 sm:gap-y-3 text-slate-300 text-xs sm:text-sm font-medium">
          {[
            { label: "Licensed PE/QSD/QSP" },
            { label: "Class A & B Contractor" },
            { label: "2,500+ Projects" },
          ].map((badge, i) => (
            <motion.span
              key={badge.label}
              className="inline-flex items-center gap-1.5 sm:gap-2"
              initial={rm ? { opacity: 1 } : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={rm ? { duration: 0 } : { duration: 0.5, delay: 0.5 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-500" />{" "}
              {badge.label}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}
