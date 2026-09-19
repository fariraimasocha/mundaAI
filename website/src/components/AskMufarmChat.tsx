import React, { useState } from "react";
import {
  Send,
  Sparkles,
  Wrench,
  HelpCircle,
  CheckCircle2,
  PhoneCall,
  RefreshCw,
  Droplets,
  CloudRain,
  TrendingUp,
  Cpu,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { ChatMessage, Language, FarmerProfile } from "../types";
import { TRANSLATIONS } from "../data/translations";
import { MundaAiLogo } from "./MundaAiLogo";

interface AskMufarmChatProps {
  language: Language;
  farmer: FarmerProfile;
  onOpenEscalation: () => void;
  onOpenScanner: () => void;
}

export const AskMufarmChat: React.FC<AskMufarmChatProps> = ({
  language,
  farmer,
  onOpenEscalation,
  onOpenScanner,
}) => {
  const t = TRANSLATIONS[language];

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "initial",
      role: "assistant",
      content: `Mhoroi Tendai! I am **Mufarm**, your AI Agronomist for Zimbabwe. I have your farm profile loaded for **Mashonaland West (2ha Maize, SC 719, Vegetative stage)**. \n\nHow can I assist your field today? You can ask me about symptoms on your crop, check whether rainfall allows irrigation, calculate Pfumvudza fertilizer, or check current Mbare Musika grain prices.`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      followUpQuestions: [
        "My maize leaves are turning yellow. What should I do?",
        "Should I irrigate Zone B today?",
        "Where should I consider selling my maize?",
      ],
      actionableNextStep: "Select a question above or type what you are observing in your field.",
    },
  ]);

  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeToolRunning, setActiveToolRunning] = useState<string | null>(null);

  const presetQueries = [
    {
      label: "Yellowing Maize (Reasoning Demo)",
      query: "My maize leaves are turning yellow. What should I do?",
      tag: "Conversational Reasoning",
    },
    {
      label: "Irrigation Check (Tool Calling Demo)",
      query: "Should I irrigate my maize today?",
      tag: "Tools: Weather + Soil",
    },
    {
      label: "Grain Selling (Market Tool Demo)",
      query: "Where should I consider selling my maize?",
      tag: "Tools: Mbare + GMB",
    },
    {
      label: "Shona Planting Query (Multilingual Demo)",
      query: "Ndirime chibage riini muRegion II?",
      tag: "Shona AI Reasoning",
    },
    {
      label: "Pfumvudza Fertilizer Calculation",
      query: "Calculate Pfumvudza fertilizer for 3 standard plots",
      tag: "Tools: Fertilizer Calc",
    },
  ];

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setLoading(true);

    // If message implies tools, show brief tool indicator for visual delight
    const lower = messageText.toLowerCase();
    if (lower.includes("irrigate") || lower.includes("water") || lower.includes("kudiridza")) {
      setActiveToolRunning("getWeather('Mashonaland West') & getSoilMoisture('zone-a')");
    } else if (lower.includes("market") || lower.includes("sell") || lower.includes("mutengo") || lower.includes("gmb")) {
      setActiveToolRunning("getMarketPrices('Maize')");
    } else if (lower.includes("fertilizer") || lower.includes("pfumvudza") || lower.includes("mupfudze")) {
      setActiveToolRunning("calculateFertilizer({ crop: 'Maize' })");
    }

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageText,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
          language,
          farmContext: farmer,
        }),
      });

      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.reply || data.fallback || "I received your question and reviewed your farm telemetry.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        toolsExecuted: data.toolsExecuted || [],
        followUpQuestions: data.followUpQuestions || [],
        actionableNextStep: data.actionableNextStep,
        escalation: data.escalation,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Sorry, I had trouble reaching the AI service. Please check your connectivity or try again.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
      setActiveToolRunning(null);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Context & Demo Header */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              <Cpu className="w-3.5 h-3.5" />
              AI Agronomy Engine
            </span>
            <a
              href="https://wa.me/16465894168?text=Hello%20mundaai%2C%20I%20need%20farming%20advice"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#25D366]/20 text-emerald-800 border border-[#25D366]/40 hover:bg-[#25D366]/30 transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>WhatsApp Bot: +1 (646) 589-4168</span>
            </a>
            <span className="text-xs font-semibold text-stone-500">• Grounded Tools Active</span>
          </div>
          <h2 className="text-xl font-bold text-stone-900 mt-1 font-['Outfit',sans-serif]">
            Ask mundaai — Interactive Agronomic Advisory
          </h2>
          <p className="text-xs text-stone-600">
            Current Farm Context: <strong>{farmer.name} • {farmer.district}, {farmer.naturalRegion} • {farmer.areaHa}ha {farmer.primaryCrop} ({farmer.variety})</strong>
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <a
            href="https://wa.me/16465894168?text=Hello%20mundaai%2C%20I%20need%20farming%20advice"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-stone-950 text-xs font-bold shadow-sm transition-colors"
          >
            <span>Ask on WhatsApp (+1 646 589-4168)</span>
          </a>
          <button
            onClick={onOpenScanner}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold border border-stone-300 transition-colors whitespace-nowrap self-start md:self-auto"
          >
            <span>Scan Leaf Photo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Preset 1-Click Field Inquiries */}
      <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
          1-Click Field Inquiries & Scenarios:
        </span>
        <div className="flex flex-wrap gap-2">
          {presetQueries.map((item, idx) => (
            <button
              key={idx}
              onClick={() => sendMessage(item.query)}
              disabled={loading}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 text-stone-800 hover:text-emerald-900 border border-stone-200 hover:border-emerald-500 text-xs font-medium transition-all shadow-sm disabled:opacity-50 text-left"
            >
              <span>{item.label}</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 font-semibold group-hover:bg-emerald-200">
                {item.tag}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Messages Thread */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden flex flex-col min-h-[480px]">
        <div className="flex-1 p-4 sm:p-6 space-y-6 overflow-y-auto">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[90%] sm:max-w-[80%] rounded-2xl p-4 space-y-3 ${
                  msg.role === "user"
                    ? "bg-emerald-700 text-white rounded-tr-none shadow-sm"
                    : "bg-stone-50 text-stone-900 rounded-tl-none border border-stone-200 shadow-sm"
                }`}
              >
                {/* Assistant avatar & header */}
                {msg.role === "assistant" && (
                  <div className="flex items-center justify-between border-b border-stone-200/80 pb-2 text-xs">
                    <div className="flex items-center gap-2">
                      <MundaAiLogo variant="icon" size="sm" iconClassName="w-6 h-6 rounded-md" />
                      <span className="font-bold text-stone-900 font-['Outfit',sans-serif]">mundaai Agronomist</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-semibold border border-amber-200">
                        Zimbabwe
                      </span>
                    </div>
                    <span className="text-[10px] text-stone-400">{msg.timestamp}</span>
                  </div>
                )}

                {/* Tool Executed Card */}
                {msg.toolsExecuted && msg.toolsExecuted.length > 0 && (
                  <div className="bg-white rounded-xl p-3 border border-stone-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-stone-700 font-bold text-[11px] border-b border-stone-100 pb-1">
                      <span className="flex items-center gap-1.5 text-blue-700">
                        <Wrench className="w-3.5 h-3.5" />
                        Automated Telemetry & Tools Executed
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono">Real-time Tool Bus</span>
                    </div>

                    <div className="space-y-1.5">
                      {msg.toolsExecuted.map((tool, tIdx) => (
                        <div
                          key={tIdx}
                          className="p-2 rounded bg-stone-50 border border-stone-200/60 font-mono text-[11px] text-stone-700 space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-emerald-700 font-bold">
                              {tool.name}({JSON.stringify(tool.args || {})})
                            </span>
                            <span className="text-[10px] text-stone-500 font-sans">
                              {tool.result?.source || "Grounded Feed"}
                            </span>
                          </div>

                          {/* Quick summary of returned data */}
                          {tool.name === "getWeather" && tool.result?.data && (
                            <div className="text-[10px] font-sans text-stone-600">
                              🌧️ Rain Prob: <strong>{tool.result.data.rainProbability}%</strong> • Temp: {tool.result.data.temperature}°C • Forecast: {tool.result.data.forecastNext48h}
                            </div>
                          )}

                          {tool.name === "getSoilMoisture" && tool.result?.data && (
                            <div className="text-[10px] font-sans text-stone-600">
                              💧 Zone A Moisture: <strong>42% (Optimal)</strong> • Zone B: <strong>68% (Mulched)</strong>
                            </div>
                          )}

                          {tool.name === "getMarketPrices" && (
                            <div className="text-[10px] font-sans text-stone-600">
                              📊 GMB Statutory: <strong>$335/t</strong> • Mbare Musika: <strong>$290/t</strong> (Deduct transport ~$25-35)
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Main Content */}
                <div className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">
                  {msg.content}
                </div>

                {/* "WHAT SHOULD I DO NEXT?" Principle Component */}
                {msg.actionableNextStep && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-950 space-y-1">
                    <div className="flex items-center gap-1.5 font-extrabold text-emerald-900 text-[11px] tracking-wide uppercase">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      {t.whatShouldIDoNext}
                    </div>
                    <p className="font-semibold text-emerald-950 text-xs">
                      {msg.actionableNextStep}
                    </p>
                  </div>
                )}

                {/* Intelligent Diagnostic Follow-Up Questions */}
                {msg.followUpQuestions && msg.followUpQuestions.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1">
                      <HelpCircle className="w-3 h-3" />
                      Follow-up questions to pinpoint diagnosis:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.followUpQuestions.map((q, qIdx) => (
                        <button
                          key={qIdx}
                          onClick={() => sendMessage(q)}
                          className="px-2.5 py-1 rounded-lg bg-white hover:bg-stone-100 text-stone-700 hover:text-emerald-800 text-[11px] font-medium border border-stone-200 transition-colors text-left"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Escalation to Agritex Extension Officer recommendation */}
                {msg.escalation?.recommended && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="font-bold flex items-center gap-1 text-amber-900">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                        Human Extension Escalation Recommended
                      </span>
                      <p className="text-[11px] text-amber-800">
                        This issue warrants on-site inspection by your Ward Agritex extension officer.
                      </p>
                    </div>
                    <button
                      onClick={onOpenEscalation}
                      className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs whitespace-nowrap shadow-sm"
                    >
                      Connect with Officer
                    </button>
                  </div>
                )}

                {msg.role === "user" && (
                  <div className="text-[10px] text-emerald-200 text-right">
                    {msg.timestamp}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-stone-50 border border-stone-200 rounded-2xl rounded-tl-none p-4 text-xs text-stone-700 space-y-2 max-w-sm">
                <div className="flex items-center gap-2 font-semibold text-emerald-700">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>mundaai AI is reasoning & consulting tools...</span>
                </div>
                {activeToolRunning && (
                  <div className="p-2 rounded bg-stone-100 font-mono text-[10px] text-stone-600 border border-stone-200">
                    Executing tool: {activeToolRunning}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-stone-50 border-t border-stone-200 space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage(inputText)}
              placeholder={
                language === "Shona"
                  ? "Bvunza Mufarm nezvembeu, mamiriro ekunze, kana kudiridza..."
                  : language === "Ndebele"
                  ? "Buza uMufarm ngezilimo, umkhathi, loba ukunisela..."
                  : "Ask Mufarm (e.g. 'Should I irrigate today?', 'My leaves have holes', 'Maize price at Mbare')..."
              }
              className="flex-1 bg-white border border-stone-300 focus:border-emerald-600 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-stone-900 outline-none shadow-sm transition-all"
            />

            <button
              onClick={() => sendMessage(inputText)}
              disabled={loading || !inputText.trim()}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-sm"
            >
              <span>Ask</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-stone-500 px-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              {t.disclaimerNotice}
            </span>
            <span className="font-mono text-[10px]">AI Agronomist • Grounded in Zimbabwe Extension Data</span>
          </div>
        </div>
      </div>
    </div>
  );
};
