import React from "react";
import { MessageSquare, PhoneCall, Wifi, Globe, MapPin } from "lucide-react";
import { Language, NetworkStatus, FarmerProfile } from "../types";
import { TRANSLATIONS } from "../data/translations";
import { MundaAiLogo } from "./MundaAiLogo";

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  networkStatus: NetworkStatus;
  setNetworkStatus: (status: NetworkStatus) => void;
  farmer: FarmerProfile;
  onOpenEscalation: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  language,
  setLanguage,
  networkStatus,
  setNetworkStatus,
  farmer,
  onOpenEscalation,
}) => {
  const t = TRANSLATIONS[language];

  const navItems = [
    { id: "home", label: t.navHome },
    { id: "ask", label: t.navAsk },
    { id: "scan", label: t.navScan },
    { id: "irrigation", label: t.navIrrigation },
    { id: "markets", label: t.navMarkets },
    { id: "companies", label: t.navCompanies },
    { id: "fertilizer", label: t.navFertilizer },
    { id: "knowledge", label: t.navKnowledge },
    { id: "whatsapp", label: "WhatsApp" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-stone-900/95 backdrop-blur border-b border-stone-800 text-stone-100 shadow-md">
      {/* Top micro-bar with demo banner & status indicators */}
      <div className="bg-emerald-950/80 border-b border-emerald-900/50 px-4 py-1.5 text-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded font-bold text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            MUNDAAI AGRONOMIST
          </span>
          <span className="hidden sm:inline text-stone-300">
            • <strong className="text-emerald-400">Smart Farming Zimbabwe</strong>
          </span>
          <span className="hidden md:inline text-stone-400">
            | {t.demoFarmBadge}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Network status toggle for low-bandwidth simulation */}
          <button
            onClick={() => {
              const next: Record<NetworkStatus, NetworkStatus> = {
                ONLINE: "LOW_BANDWIDTH",
                LOW_BANDWIDTH: "OFFLINE",
                OFFLINE: "ONLINE",
              };
              setNetworkStatus(next[networkStatus]);
            }}
            title="Click to simulate low-bandwidth or offline conditions in rural Zimbabwe"
            className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
          >
            <Wifi className={`w-3 h-3 ${networkStatus === "ONLINE" ? "text-emerald-400" : networkStatus === "LOW_BANDWIDTH" ? "text-amber-400" : "text-rose-400"}`} />
            <span className="text-[10px] font-semibold">{t[networkStatus === "ONLINE" ? "online" : networkStatus === "LOW_BANDWIDTH" ? "lowBandwidth" : "offline"]}</span>
          </button>

          {/* Language selector */}
          <div className="flex items-center gap-1 bg-stone-800 px-1.5 py-0.5 rounded border border-stone-700">
            <Globe className="w-3 h-3 text-stone-400" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="bg-transparent text-[11px] text-stone-200 outline-none font-medium cursor-pointer"
            >
              <option value="English" className="bg-stone-900 text-stone-100">EN (English)</option>
              <option value="Shona" className="bg-stone-900 text-stone-100">SN (ChiShona)</option>
              <option value="Ndebele" className="bg-stone-900 text-stone-100">ND (SiNdebele)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Navigation Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Logo & Brand Identity */}
        <button
          onClick={() => setCurrentTab("home")}
          className="flex items-center text-left group focus:outline-none"
        >
          <MundaAiLogo
            variant="horizontal"
            size="md"
            theme="dark"
            showSubtitle={true}
            subtitleText={t.tagline}
          />
        </button>

        {/* Navigation Tabs (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1 bg-stone-800/80 p-1 rounded-xl border border-stone-700/60">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-stone-300 hover:text-white hover:bg-stone-700/50"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenEscalation}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 transition-colors"
            title="Connect with Agritex Agricultural Extension Officer"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Agritex Officer</span>
          </button>

          <button
            onClick={() => setCurrentTab("whatsapp")}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-stone-950 transition-all shadow-md shadow-emerald-500/20"
          >
            <MessageSquare className="w-3.5 h-3.5 fill-current" />
            <span>WhatsApp</span>
          </button>
        </div>
      </div>

      {/* Mobile Horizontal Navigation Scroll */}
      <div className="lg:hidden border-t border-stone-800 px-4 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? "bg-emerald-600 text-white font-semibold"
                  : "bg-stone-800 text-stone-300 hover:bg-stone-700"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
