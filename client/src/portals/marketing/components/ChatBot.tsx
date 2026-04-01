import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, X, Send, Phone, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { createPageUrl } from "../lib/utils";

const STORAGE_KEY = "peci_chatbot_state_v2";
const PHONE = "+14156894428";
const CONSULTATION_PATH = createPageUrl("SWPPPChecker");
const CONTACT_PATH = createPageUrl("Contact");

const URGENCY_KEYWORDS = /\b(asap|urgent|today|tomorrow|now|rush|emergency)\b/i;
const INSPECTION_KEYWORDS = /\b(concrete|inspection|inspections|pour|rebar|shear wall|hold[- ]down|bolt|testing)\b/i;
const TESTING_KEYWORDS = /\b(test|testing|pcb|pcbs|heavy metal|turbidity|coliform|e-coli|e coli|soil|compaction)\b/i;
const SWPPP_KEYWORDS = /\b(swppp|stormwater|bmps|storm water|storm-water)\b/i;
const ENGINEERING_KEYWORDS = /\b(engineer|engineering|structural|design|calc|calculation)\b/i;
const LOCATION_KEYWORDS = /\b([A-Za-z ]+,(?:\s)?(?:CA|California)|San Francisco|Oakland|Berkeley|San Jose|Bay Area)\b/i;
const TIMELINE_KEYWORDS = /\b(\b(?:next week|this week|tomorrow|today|asap|within \d+ (days|weeks))\b)/i;
const AGENCY_KEYWORDS = /\b(permit|city|county|baykeeper|water board|sfbru|caltrans|california)\b/i;

type ChatIntent = "urgent" | "inspection" | "testing" | "swppp" | "engineering" | "pricing" | "contact" | "consult" | "unknown";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: string;
  actions?: string[];
}

interface ChatMemory {
  projectType: string | null;
  location: string | null;
  timeline: string | null;
  agency: string | null;
}

interface ChatState {
  messages: ChatMessage[];
  memory: ChatMemory;
}

function classifyIntent(text: string | null | undefined): { intent: ChatIntent; confidence: number } {
  if (!text) return { intent: "unknown", confidence: 0.5 };
  const t = text.toLowerCase();
  if (URGENCY_KEYWORDS.test(t)) return { intent: "urgent", confidence: 0.99 };
  if (INSPECTION_KEYWORDS.test(t)) return { intent: "inspection", confidence: 0.9 };
  if (TESTING_KEYWORDS.test(t)) return { intent: "testing", confidence: 0.9 };
  if (SWPPP_KEYWORDS.test(t)) return { intent: "swppp", confidence: 0.9 };
  if (ENGINEERING_KEYWORDS.test(t)) return { intent: "engineering", confidence: 0.85 };
  if (/price|cost|rate|quote/.test(t)) return { intent: "pricing", confidence: 0.8 };
  if (/contact|talk|call|phone/.test(t)) return { intent: "contact", confidence: 0.8 };
  if (/consult|consultation|start form|intake|schedule/.test(t)) return { intent: "consult", confidence: 0.85 };
  return { intent: "unknown", confidence: 0.5 };
}

function extractEntities(text: string) {
  const entities: Record<string, string> = {};
  const loc = text.match(LOCATION_KEYWORDS);
  if (loc) entities.location = loc[0].trim();
  const tl = text.match(TIMELINE_KEYWORDS);
  if (tl) entities.timeline = tl[0].trim();
  const ag = text.match(AGENCY_KEYWORDS);
  if (ag) entities.agency = ag[0].trim();
  return entities;
}

function loadState(): ChatState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveState(state: ChatState) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
}

const WELCOME_MSG: ChatMessage = {
  role: "assistant",
  content: "Hi! I'm Pacific Engineering's assistant. I can help with questions about our engineering, construction, SWPPP, and inspection services across the Bay Area. How can I help you today?",
  actions: ["Schedule Consultation", "Our Services", "Contact Us"],
};

function getIntentResponse(intent: ChatIntent, entities: Record<string, string>): string {
  const loc = entities.location ? ` in ${entities.location}` : " in the Bay Area";
  switch (intent) {
    case "urgent":
      return `For urgent requests, please call us directly at ${PHONE}. We offer rapid response scheduling for time-sensitive projects${loc}.`;
    case "inspection":
      return `We provide comprehensive inspection services including concrete, rebar, shear wall, and hold-down inspections${loc}. Our ICC-certified inspectors are available for same-day and next-day scheduling. Would you like to schedule an inspection or learn more about our capabilities?`;
    case "testing":
      return `Our testing services cover soil compaction, materials testing, PCB analysis, turbidity monitoring, and environmental compliance testing${loc}. All testing follows ASTM standards with certified lab results. Want to discuss your specific testing needs?`;
    case "swppp":
      return `Pacific Engineering provides complete SWPPP services including plan development, BMP design, monitoring, and regulatory compliance${loc}. Our QSD/QSP-certified team handles everything from initial assessment to final NOT filing. Ready to get started with a free consultation?`;
    case "engineering":
      return `Our licensed Professional Engineers provide civil and structural engineering services${loc}, including design, calculations, plan review, and construction support. We work on projects from residential additions to major infrastructure. What type of engineering support do you need?`;
    case "pricing":
      return `Pricing varies by project scope and requirements. We'd be happy to provide a detailed quote. The best way to get started is through our free consultation form, or you can call us at ${PHONE}.`;
    case "contact":
      return `You can reach us at ${PHONE} or visit our contact page. We're located in San Francisco and serve the entire Bay Area. Would you like to schedule a consultation?`;
    case "consult":
      return `Great! You can start a free consultation through our online form. We'll review your project details and get back to you within 24 hours with a tailored approach.`;
    default:
      return `I'd be happy to help! We offer engineering, construction, SWPPP planning, and inspection services across the Bay Area. Could you tell me more about what you're looking for?`;
  }
}

export default function ChatBot() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCallOverlay, setShowCallOverlay] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const autoOpenedRef = useRef(false);
  const manuallyClosedRef = useRef(false);

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = loadState();
    return saved?.messages || [WELCOME_MSG];
  });

  const [memory, setMemory] = useState<ChatMemory>(() => {
    const saved = loadState();
    return saved?.memory || { projectType: null, location: null, timeline: null, agency: null };
  });

  const getBaseBottom = () => typeof window !== "undefined" && window.innerWidth < 640 ? 80 : 24;
  const [bottomOffset, setBottomOffset] = useState(getBaseBottom);
  const [showPromptBubble, setShowPromptBubble] = useState(false);
  const hasClickedRef = useRef(false);
  const promptDismissedRef = useRef(false);

  const [isDragging, setIsDragging] = useState(false);
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
  const dragStartRef = useRef<{ x: number; y: number; startX: number; startY: number } | null>(null);
  const hasDraggedRef = useRef(false);

  useEffect(() => {
    saveState({ messages, memory });
  }, [messages, memory]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handler = () => {
      const scrollY = window.scrollY;
      const docH = document.documentElement.scrollHeight;
      const winH = window.innerHeight;
      const scrollPct = scrollY / Math.max(1, docH - winH);

      if (!isOpen) {
        const base = getBaseBottom();
        if (scrollPct > 0.15) {
          const raisePx = Math.min(scrollPct * 0.3, 0.25) * winH;
          setBottomOffset(base + raisePx);
        } else {
          setBottomOffset(base);
        }

        if (scrollPct > 0.92 && !hasClickedRef.current && !promptDismissedRef.current) {
          setShowPromptBubble(true);
        }
      }

      if (scrollPct >= 0.5 && !autoOpenedRef.current && !manuallyClosedRef.current && !isOpen) {
        autoOpenedRef.current = true;
        setIsOpen(true);
      }
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [isOpen]);

  const handleClose = useCallback(() => {
    manuallyClosedRef.current = true;
    setIsOpen(false);
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (isOpen) return;
    const el = e.currentTarget as HTMLElement;
    el.setPointerCapture(e.pointerId);
    const rect = el.getBoundingClientRect();
    dragStartRef.current = { x: e.clientX, y: e.clientY, startX: rect.left, startY: rect.top };
    hasDraggedRef.current = false;
  }, [isOpen]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragStartRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      hasDraggedRef.current = true;
      setIsDragging(true);
      const newX = dragStartRef.current.startX + dx;
      const newY = dragStartRef.current.startY + dy;
      const clampX = Math.max(0, Math.min(window.innerWidth - 56, newX));
      const clampY = Math.max(0, Math.min(window.innerHeight - 56, newY));
      setDragPos({ x: clampX, y: clampY });
    }
  }, []);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    const el = e.currentTarget as HTMLElement;
    el.releasePointerCapture(e.pointerId);
    dragStartRef.current = null;
    setIsDragging(false);
    if (!hasDraggedRef.current) {
      hasClickedRef.current = true;
      setShowPromptBubble(false);
      setIsOpen(true);
    }
  }, []);

  const handleAction = (action: string) => {
    if (action === "Schedule Consultation") {
      navigate(CONSULTATION_PATH);
    } else if (action === "Our Services") {
      navigate(createPageUrl("ServicesOverview"));
    } else if (action === "Contact Us") {
      navigate(CONTACT_PATH);
    } else if (action === "Call Now") {
      window.location.href = `tel:${PHONE}`;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: "user", content: input.trim(), timestamp: new Date().toISOString() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    const { intent } = classifyIntent(userMsg.content);
    const entities = extractEntities(userMsg.content);

    if (entities.location) setMemory((m) => ({ ...m, location: entities.location! }));
    if (entities.timeline) setMemory((m) => ({ ...m, timeline: entities.timeline! }));
    if (intent === "urgent") setShowCallOverlay(true);

    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.content, context: memory }),
      });
      const data = await res.json();

      let responseText: string;
      let actions: string[] = [];

      if (data.source === "fallback" || !data.response) {
        responseText = getIntentResponse(intent, { ...memory, ...entities } as Record<string, string>);
        if (intent === "swppp" || intent === "consult") actions = ["Schedule Consultation"];
        else if (intent === "contact" || intent === "urgent") actions = ["Call Now", "Contact Us"];
        else actions = ["Schedule Consultation", "Our Services"];
      } else {
        responseText = data.response;
      }

      const assistantMsg: ChatMessage = {
        role: "assistant",
        content: responseText,
        timestamp: new Date().toISOString(),
        actions,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: getIntentResponse(intent, { ...memory, ...entities } as Record<string, string>),
        timestamp: new Date().toISOString(),
        actions: ["Schedule Consultation", "Contact Us"],
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = () => {
    setMessages([WELCOME_MSG]);
    setMemory({ projectType: null, location: null, timeline: null, agency: null });
  };

  const iconStyle: React.CSSProperties = dragPos
    ? { position: "fixed", left: dragPos.x, top: dragPos.y, bottom: "auto", right: "auto", zIndex: 60 }
    : { position: "fixed", bottom: bottomOffset, right: 24, zIndex: 60, transition: isDragging ? "none" : "bottom 0.4s ease-out" };

  return (
    <>
      {!isOpen && (
        <div style={iconStyle}>
          {showPromptBubble && (
            <div className="absolute -top-16 right-0 whitespace-nowrap bg-white text-slate-800 text-sm font-medium px-4 py-2.5 rounded-xl shadow-lg border border-slate-200 animate-bounce-gentle" data-testid="chatbot-prompt-bubble">
              What are we building?
              <button
                onClick={(e) => { e.stopPropagation(); setShowPromptBubble(false); promptDismissedRef.current = true; }}
                className="ml-2 text-slate-400 hover:text-slate-600"
                data-testid="btn-dismiss-prompt"
              >
                <X className="w-3 h-3 inline" />
              </button>
              <div className="absolute -bottom-1 right-6 w-2.5 h-2.5 bg-white border-r border-b border-slate-200 rotate-45" />
            </div>
          )}
          <button
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className={cn(
              "w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-full shadow-xl shadow-cyan-500/30 hover:shadow-2xl flex items-center justify-center touch-none select-none",
              isDragging ? "scale-110 cursor-grabbing" : "cursor-pointer hover:-translate-y-1 transition-all duration-300"
            )}
            data-testid="button-chatbot-open"
            aria-label="Open chat"
          >
            <MessageCircle className="w-6 h-6" />
          </button>
          <style>{`@keyframes bounce-gentle { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } } .animate-bounce-gentle { animation: bounce-gentle 2s ease-in-out infinite; }`}</style>
        </div>
      )}

      {isOpen && (
        <div className="fixed bottom-[5.5rem] sm:bottom-6 right-6 z-[60] w-[calc(100vw-3rem)] sm:w-96 max-h-[min(500px,calc(100vh-7rem))] sm:max-h-[600px] flex flex-col" data-testid="chatbot-panel">
          <div className="rounded-xl shadow-2xl border border-gray-200 bg-white flex flex-col overflow-hidden max-h-[550px]">
            <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between rounded-t-xl">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-sm">Pacific Engineering</div>
                  <div className="text-xs text-green-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                    Online
                  </div>
                </div>
              </div>
              <button onClick={handleClose} className="text-white/70 hover:text-white" data-testid="button-chatbot-close">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 min-h-[200px] max-h-[400px]">
              {messages.map((msg, i) => (
                <div key={i} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
                  <div
                    className={cn(
                      "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                      msg.role === "user"
                        ? "bg-blue-600 text-white rounded-br-sm"
                        : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm"
                    )}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    {msg.actions && msg.actions.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {msg.actions.map((action) => (
                          <button
                            key={action}
                            onClick={() => handleAction(action)}
                            className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full hover:bg-blue-100 transition-colors border border-blue-200"
                            data-testid={`button-chatbot-action-${action.toLowerCase().replace(/\s+/g, "-")}`}
                          >
                            {action}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-200">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1"
                  disabled={isLoading}
                  data-testid="input-chatbot-message"
                />
                <Button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className={cn("bg-blue-600 hover:bg-blue-700", isLoading && "opacity-60")}
                  data-testid="button-chatbot-send"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              {messages.length > 1 && (
                <button
                  type="button"
                  onClick={clearHistory}
                  className="text-xs text-gray-400 hover:text-gray-600 mt-2 transition-colors"
                  data-testid="button-chatbot-clear"
                >
                  Clear chat history
                </button>
              )}
            </form>
          </div>

          {showCallOverlay && (
            <div className="mt-3 rounded-lg shadow-lg bg-white p-3 flex items-center gap-3 border border-red-100">
              <div className="flex-1">
                <div className="text-sm font-semibold text-red-600">Urgent request?</div>
                <div className="text-xs text-slate-600">Call now for fastest scheduling.</div>
              </div>
              <div className="flex gap-2">
                <a href={`tel:${PHONE}`} className="bg-red-500 text-white px-3 py-2 rounded-lg font-semibold hover:bg-red-600 transition" data-testid="link-chatbot-call">Call</a>
                <button onClick={() => setShowCallOverlay(false)} className="px-3 py-2 rounded border hover:bg-gray-50 transition">Dismiss</button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
