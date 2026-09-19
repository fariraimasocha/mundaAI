import React from "react";
import {
  Sparkles,
  Search,
  Camera,
  MessageSquare,
  ArrowRight,
  Droplets,
  TrendingUp,
  Cpu,
  Layers,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Users,
  ShieldCheck,
} from "lucide-react";
import { Language, FarmerProfile } from "../types";
import { TRANSLATIONS } from "../data/translations";
import { MundaAiLogo } from "./MundaAiLogo";

interface HeroStoryProps {
  onNavigate: (tab: string) => void;
  onLaunchDemoScenario: (scenarioType: string) => void;
  language: Language;
  farmer: FarmerProfile;
}

export const HeroStory: React.FC<HeroStoryProps> = ({
  onNavigate,
  onLaunchDemoScenario,
  language,
  farmer,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-900 via-stone-900 to-emerald-950 text-white border border-stone-800 shadow-2xl p-6 sm:p-10 lg:p-14">
        {/* Background glow effects */}
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-stone-950/80 text-stone-200 border border-stone-800 shadow-sm">
              <MundaAiLogo variant="icon" size="sm" iconClassName="w-4 h-4 rounded-md" />
              <span>mundaai • Smart Farming Zimbabwe</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-stone-50 leading-[1.1] font-['Outfit',sans-serif]">
              {t.heroHeadline}
            </h1>

            <p className="text-base sm:text-lg text-stone-300 leading-relaxed font-normal">
              {t.heroSub}
            </p>

            {/* Primary Action CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate("ask")}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-sm sm:text-base transition-all shadow-lg shadow-emerald-500/30 hover:translate-y-[-1px]"
              >
                <Search className="w-4 h-4" />
                <span>{t.askMufarm}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate("scan")}
                className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-100 font-semibold text-sm sm:text-base border border-stone-700 transition-all hover:border-emerald-500/40"
              >
                <Camera className="w-4 h-4 text-emerald-400" />
                <span>{t.scanCrop}</span>
              </button>

              <button
                onClick={() => onNavigate("whatsapp")}
                className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 font-semibold text-sm sm:text-base border border-emerald-800/60 transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{t.chatWhatsApp}</span>
              </button>
            </div>

            {/* Trust points */}
            <div className="pt-4 border-t border-stone-800/80 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-stone-400">
              <span className="flex items-center gap-1.5 text-stone-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Grounded in Agritex & Pfumvudza Principles
              </span>
              <span className="flex items-center gap-1.5 text-stone-300">
                <Users className="w-4 h-4 text-amber-400" />
                Human Extension Escalation Supported
              </span>
              <span className="flex items-center gap-1.5 text-stone-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                English • Shona • Ndebele
              </span>
            </div>
          </div>

          {/* Official MundaAi Brand Showcase Card */}
          <div className="hidden lg:flex flex-col items-center justify-center p-6 bg-[#FAF6F0] rounded-2xl border border-stone-700/60 shadow-xl shrink-0 w-72 text-stone-900">
            <MundaAiLogo
              variant="stacked"
              size="lg"
              theme="light"
              showSubtitle={true}
              subtitleText="AI Agronomist for Zimbabwe"
            />
            <div className="mt-4 pt-3 border-t border-stone-300/80 w-full flex items-center justify-between text-[11px] text-stone-600">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                Agritex Grounded
              </span>
              <span className="font-semibold text-stone-800">Pfumvudza</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Home Advisory Portal (Connected to WhatsApp +1 646 589-4168) */}
      <section className="bg-gradient-to-r from-emerald-900 to-stone-900 rounded-3xl p-6 sm:p-8 text-white border border-emerald-700/40 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-800/80 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#25D366] animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                Official WhatsApp Advisory Portal • +1 (646) 589-4168
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1 font-['Outfit',sans-serif]">
              Ask Anything — Direct WhatsApp Agronomist Portal
            </h2>
          </div>
          <a
            href="https://wa.me/16465894168?text=Hello%20mundaai%2C%20I%20need%20farming%20advice"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-stone-950 font-bold text-xs shadow-md transition-all self-start sm:self-auto"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Open in WhatsApp (+1 646 589-4168)</span>
          </a>
        </div>

        <p className="text-xs sm:text-sm text-stone-200">
          Have an urgent question about pest outbreaks, rainfall windows, or Pfumvudza fertilizer? Ask right here or jump straight to our verified WhatsApp line.
        </p>

        <div className="flex flex-col sm:flex-row items-stretch gap-2 pt-1">
          <input
            type="text"
            id="home-quick-query"
            placeholder="Type your question (e.g. 'How much Compound D per Pfumvudza plot?', 'Should I spray Fall Armyworm today?')..."
            className="flex-1 bg-stone-950/80 border border-emerald-500/40 focus:border-emerald-400 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder:text-stone-400 outline-none"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const val = (e.target as HTMLInputElement).value;
                if (val.trim()) {
                  window.open(`https://wa.me/16465894168?text=${encodeURIComponent(val.trim())}`, "_blank");
                }
              }
            }}
          />
          <button
            onClick={() => {
              const input = document.getElementById("home-quick-query") as HTMLInputElement;
              const val = input?.value?.trim() || "Mhoroi mundaai, ndinoda rubatsiro rwekurima";
              window.open(`https://wa.me/16465894168?text=${encodeURIComponent(val)}`, "_blank");
            }}
            className="px-5 py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-stone-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-colors whitespace-nowrap"
          >
            <span>Ask WhatsApp Bot</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onNavigate("ask")}
            className="px-4 py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 border border-stone-700 transition-colors whitespace-nowrap"
          >
            <span>Ask in Web Portal</span>
          </button>
        </div>
      </section>

      {/* 1-Click Interactive Showcase Scenarios */}
      <section className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Guided Agronomy Showcase
            </span>
            <h2 className="text-lg font-bold text-stone-900 font-['Outfit',sans-serif]">
              Experience Agricultural Reasoning in 1-Click
            </h2>
          </div>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-stone-100 text-stone-700">
            Active Profile: <strong>{farmer.name} (Mashonaland West • 2ha Maize)</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <button
            onClick={() => onLaunchDemoScenario("yellowing")}
            className="p-4 rounded-xl border border-stone-200 hover:border-emerald-500 bg-stone-50/50 hover:bg-emerald-50/30 text-left transition-all group flex flex-col justify-between"
          >
            <div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                STEP 1 • REASONING
              </span>
              <h3 className="font-bold text-sm text-stone-900 group-hover:text-emerald-800 mt-2">
                "My maize leaves are turning yellow."
              </h3>
              <p className="text-xs text-stone-600 mt-1">
                The AI asks diagnostic follow-up questions instead of leaping to premature conclusions.
              </p>
            </div>
            <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1 mt-3">
              Run Demo <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </button>

          <button
            onClick={() => onLaunchDemoScenario("irrigation")}
            className="p-4 rounded-xl border border-stone-200 hover:border-emerald-500 bg-stone-50/50 hover:bg-emerald-50/30 text-left transition-all group flex flex-col justify-between"
          >
            <div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                STEP 2 • TOOL CALLING
              </span>
              <h3 className="font-bold text-sm text-stone-900 group-hover:text-emerald-800 mt-2">
                "Should I irrigate my maize today?"
              </h3>
              <p className="text-xs text-stone-600 mt-1">
                Queries live weather forecasts and soil telemetry to synthesize irrigation decisions.
              </p>
            </div>
            <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1 mt-3">
              Run Demo <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </button>

          <button
            onClick={() => onLaunchDemoScenario("scan")}
            className="p-4 rounded-xl border border-stone-200 hover:border-emerald-500 bg-stone-50/50 hover:bg-emerald-50/30 text-left transition-all group flex flex-col justify-between"
          >
            <div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                STEP 3 • MULTIMODAL
              </span>
              <h3 className="font-bold text-sm text-stone-900 group-hover:text-emerald-800 mt-2">
                Scan Maize Leaf Photograph
              </h3>
              <p className="text-xs text-stone-600 mt-1">
                Analyzes visible symptoms into structured diagnosis cards with confidence ratings.
              </p>
            </div>
            <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1 mt-3">
              Run Scanner <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </button>

          <button
            onClick={() => onLaunchDemoScenario("market")}
            className="p-4 rounded-xl border border-stone-200 hover:border-emerald-500 bg-stone-50/50 hover:bg-emerald-50/30 text-left transition-all group flex flex-col justify-between"
          >
            <div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                STEP 4 • MARKETS
              </span>
              <h3 className="font-bold text-sm text-stone-900 group-hover:text-emerald-800 mt-2">
                "Where should I sell my grain?"
              </h3>
              <p className="text-xs text-stone-600 mt-1">
                Retrieves Mbare Musika vs GMB statutory rates with rural transport deduction economics.
              </p>
            </div>
            <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1 mt-3">
              Run Demo <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </button>

          <button
            onClick={() => onLaunchDemoScenario("companies")}
            className="p-4 rounded-xl border border-stone-200 hover:border-emerald-500 bg-stone-50/50 hover:bg-emerald-50/30 text-left transition-all group flex flex-col justify-between"
          >
            <div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                STEP 5 • COMPANIES & INPUTS
              </span>
              <h3 className="font-bold text-sm text-stone-900 group-hover:text-emerald-800 mt-2">
                "Is SC 719 & Fert in Stock?"
              </h3>
              <p className="text-xs text-stone-600 mt-1">
                Direct connection to Seed Co, Windmill & ZFC showing live depot availability status.
              </p>
            </div>
            <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1 mt-3">
              Check Stock <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </button>
        </div>
      </section>

      {/* The 5-Step Mufarm Story */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            The Mufarm Mission
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-['Outfit',sans-serif]">
            Bridging Zimbabwe's Agricultural Knowledge Gap
          </h2>
          <p className="text-stone-600 text-sm">
            Turning fragmented agricultural data into timely, life-changing farming decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-sm space-y-2">
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs">
              01
            </div>
            <h3 className="font-bold text-stone-900 text-sm">THE PROBLEM</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Pests like Fall Armyworm, drought, and volatile market prices threaten smallholder yields. Agricultural guidance is often fragmented or delayed.
            </p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-sm space-y-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
              02
            </div>
            <h3 className="font-bold text-stone-900 text-sm">THE SOLUTION</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              mundaai: An AI Agronomist in every farmer’s pocket. Understands questions, photographs, and field conditions in English, Shona, and Ndebele.
            </p>
          </div>

          <div className="bg-emerald-900 text-white rounded-xl p-5 border border-emerald-800 shadow-md space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 text-stone-950 flex items-center justify-center font-bold text-xs">
              03
            </div>
            <h3 className="font-bold text-white text-sm">MUNDAAI ENGINE</h3>
            <p className="text-xs text-emerald-100 leading-relaxed">
              <strong>See → Understand → Reason → Retrieve → Explain.</strong> Multimodal image diagnosis combined with real-time tool calling.
            </p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-sm space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
              04
            </div>
            <h3 className="font-bold text-stone-900 text-sm">THE ACTION</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              <strong>What should I do next?</strong> Farmers receive precise, actionable steps instead of abstract technical summaries.
            </p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-sm space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
              05
            </div>
            <h3 className="font-bold text-stone-900 text-sm">THE IMPACT</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Reduced crop losses, optimized fertilizer usage, conserved irrigation water, and resilient food security across Zimbabwe.
            </p>
          </div>
        </div>
      </section>

      {/* The Three-Layer AI Architecture Model */}
      <section className="bg-stone-900 text-stone-100 rounded-2xl p-6 sm:p-8 border border-stone-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Technical Architecture
            </span>
            <h2 className="text-xl font-bold text-white font-['Outfit',sans-serif]">
              The Three-Layer Agricultural Intelligence Engine
            </h2>
          </div>
          <span className="text-xs px-3 py-1 rounded bg-stone-800 text-stone-300 border border-stone-700">
            Grounded in Zimbabwe Agronomic Telemetry
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Layer 1 */}
          <div className="bg-stone-800/80 rounded-xl p-5 border border-stone-700 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400">
              <Cpu className="w-5 h-5" />
              <h3 className="font-bold text-sm text-white">LAYER 1 • UNDERSTAND</h3>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              Processes multimodal farmer inputs:
            </p>
            <ul className="text-xs text-stone-400 space-y-1.5 list-disc list-inside">
              <li>Natural language questions</li>
              <li>Crop leaf & whorl photographs</li>
              <li>Multilingual (English, Shona, Ndebele)</li>
              <li>Farmer context (Region, Crop, Area)</li>
            </ul>
          </div>

          {/* Layer 2 */}
          <div className="bg-stone-800/80 rounded-xl p-5 border border-stone-700 space-y-3">
            <div className="flex items-center gap-2 text-blue-400">
              <Layers className="w-5 h-5" />
              <h3 className="font-bold text-sm text-white">LAYER 2 • CONNECT</h3>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              Executes grounded tools when external data is needed:
            </p>
            <ul className="text-xs text-stone-400 space-y-1.5 list-disc list-inside">
              <li><code className="text-emerald-300">getWeather(location)</code> 48h rain forecast</li>
              <li><code className="text-emerald-300">getSoilMoisture(zone)</code> IoT sensors</li>
              <li><code className="text-emerald-300">getMarketPrices(commodity)</code> GMB/Mbare</li>
              <li><code className="text-emerald-300">getAgriculturalKnowledge()</code> Agritex RAG</li>
            </ul>
          </div>

          {/* Layer 3 */}
          <div className="bg-stone-800/80 rounded-xl p-5 border border-stone-700 space-y-3">
            <div className="flex items-center gap-2 text-amber-400">
              <CheckCircle2 className="w-5 h-5" />
              <h3 className="font-bold text-sm text-white">LAYER 3 • ACT</h3>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              Synthesizes clear, responsible decision-support:
            </p>
            <ul className="text-xs text-stone-400 space-y-1.5 list-disc list-inside">
              <li>Communicates confidence & uncertainty</li>
              <li>Specific "What should I do next?" step</li>
              <li>Pfumvudza & basal fertilizer calculations</li>
              <li>Agritex Extension Officer escalation trigger</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};
