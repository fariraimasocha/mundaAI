import React, { useState } from "react";
import { Header } from "./components/Header";
import { HeroStory } from "./components/HeroStory";
import { WhatsAppAgronomist } from "./components/WhatsAppAgronomist";
import { AskMufarmChat } from "./components/AskMufarmChat";
import { CropScanner } from "./components/CropScanner";
import { SmartIrrigationWeather } from "./components/SmartIrrigationWeather";
import { MarketIntelligence } from "./components/MarketIntelligence";
import { AgriCompanyConnect } from "./components/AgriCompanyConnect";
import { FertilizerAssistant } from "./components/FertilizerAssistant";
import { KnowledgeBase } from "./components/KnowledgeBase";
import { HumanEscalationModal } from "./components/HumanEscalationModal";
import { FloatingActionButton } from "./components/FloatingActionButton";
import { MundaAiLogo } from "./components/MundaAiLogo";
import { Language, NetworkStatus, FarmerProfile, CropScanAssessment } from "./types";
import { TRANSLATIONS } from "./data/translations";
import { Sprout, ShieldCheck, Heart, Sparkles } from "lucide-react";

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>("home");
  const [language, setLanguage] = useState<Language>("English");
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>("ONLINE");

  // Demo Farm Profile
  const [farmer, setFarmer] = useState<FarmerProfile>({
    name: "Tendai",
    location: "Mashonaland West, Zimbabwe",
    district: "Chinhoyi Rural / Makonde",
    naturalRegion: "Region IIa",
    primaryCrop: "White Maize",
    variety: "Seed Co SC 719",
    areaHa: 2.0,
    growthStage: "Vegetative (V6)",
    soilType: "Sandy Loam",
    isDemoFarm: true,
  });

  const [isEscalationOpen, setIsEscalationOpen] = useState(false);
  const [currentAssessment, setCurrentAssessment] = useState<CropScanAssessment | null>(null);

  const t = TRANSLATIONS[language];

  const handleOpenEscalation = (assessment?: CropScanAssessment) => {
    if (assessment) setCurrentAssessment(assessment);
    setIsEscalationOpen(true);
  };

  const handleLaunchDemoScenario = (scenarioType: string) => {
    if (scenarioType === "scan") {
      setCurrentTab("scan");
    } else if (scenarioType === "irrigation") {
      setCurrentTab("irrigation");
    } else if (scenarioType === "market") {
      setCurrentTab("markets");
    } else if (scenarioType === "companies") {
      setCurrentTab("companies");
    } else {
      setCurrentTab("ask");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-100/70 text-stone-900 selection:bg-emerald-500 selection:text-white">
      {/* Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        language={language}
        setLanguage={setLanguage}
        networkStatus={networkStatus}
        setNetworkStatus={setNetworkStatus}
        farmer={farmer}
        onOpenEscalation={() => handleOpenEscalation()}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {/* Tab 1: Home (Hero + Story + WhatsApp + Quick Launch) */}
        {currentTab === "home" && (
          <div className="space-y-12">
            <HeroStory
              onNavigate={setCurrentTab}
              onLaunchDemoScenario={handleLaunchDemoScenario}
              language={language}
              farmer={farmer}
            />

            {/* Prompt Mandate: "Place the WhatsApp experience directly on the homepage immediately after the hero" */}
            <WhatsAppAgronomist
              language={language}
              setLanguage={setLanguage}
              onOpenWebAgronomist={() => setCurrentTab("ask")}
            />
          </div>
        )}

        {/* Tab 2: Ask Mufarm */}
        {currentTab === "ask" && (
          <AskMufarmChat
            language={language}
            farmer={farmer}
            onOpenEscalation={() => handleOpenEscalation()}
            onOpenScanner={() => setCurrentTab("scan")}
          />
        )}

        {/* Tab 3: Crop Scanner */}
        {currentTab === "scan" && (
          <CropScanner
            language={language}
            farmer={farmer}
            onOpenEscalation={(assess) => handleOpenEscalation(assess)}
          />
        )}

        {/* Tab 4: Smart Irrigation & Weather */}
        {currentTab === "irrigation" && (
          <SmartIrrigationWeather
            language={language}
            farmer={farmer}
            onAskIrrigation={() => setCurrentTab("ask")}
          />
        )}

        {/* Tab 5: Market Intelligence */}
        {currentTab === "markets" && (
          <MarketIntelligence
            language={language}
            farmer={farmer}
            onAskMarket={() => setCurrentTab("ask")}
          />
        )}

        {/* Tab 6: Agri-Company & Products Connect (Availability & Off-take) */}
        {currentTab === "companies" && (
          <AgriCompanyConnect
            language={language}
            farmer={farmer}
            onAskAgronomist={() => setCurrentTab("ask")}
          />
        )}

        {/* Tab 7: Fertilizer & Pfumvudza Assistant */}
        {currentTab === "fertilizer" && (
          <FertilizerAssistant
            language={language}
            farmer={farmer}
          />
        )}

        {/* Tab 7: Agritex Knowledge Base */}
        {currentTab === "knowledge" && (
          <KnowledgeBase
            language={language}
            onAskKnowledgeTopic={(topic) => setCurrentTab("ask")}
          />
        )}

        {/* Tab 8: WhatsApp Dedicated View */}
        {currentTab === "whatsapp" && (
          <WhatsAppAgronomist
            language={language}
            setLanguage={setLanguage}
            onOpenWebAgronomist={() => setCurrentTab("ask")}
          />
        )}
      </main>

      {/* Floating Action Button */}
      <FloatingActionButton onNavigate={setCurrentTab} />

      {/* Agritex Extension Escalation Modal */}
      <HumanEscalationModal
        isOpen={isEscalationOpen}
        onClose={() => setIsEscalationOpen(false)}
        farmer={farmer}
        assessment={currentAssessment}
      />

      {/* Footer */}
      <footer className="bg-stone-900 border-t border-stone-800 text-stone-400 py-10 px-4 sm:px-6 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <MundaAiLogo
              variant="horizontal"
              size="sm"
              theme="dark"
              showSubtitle={true}
              subtitleText="Your AI Agronomist for Zimbabwe"
            />
          </div>

          <div className="flex flex-col items-center md:items-end gap-1.5 text-stone-400 text-center md:text-right">
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-semibold">SEE IT. UNDERSTAND IT. KNOW WHAT TO DO NEXT.</span>
            </div>
            <p className="text-[11px] text-stone-500">
              Grounded in Zimbabwe Agritex practices & Pfumvudza Conservation Agriculture.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
