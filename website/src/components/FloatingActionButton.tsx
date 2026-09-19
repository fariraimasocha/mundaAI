import React, { useState } from "react";
import { MessageSquare, Camera, HelpCircle, Building2, X } from "lucide-react";
import { MundaAiLogo } from "./MundaAiLogo";

interface FloatingActionButtonProps {
  onNavigate: (tab: string) => void;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onNavigate,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
      {isOpen && (
        <div className="flex flex-col items-end gap-2 mb-2 animate-fadeIn text-xs font-bold">
          <button
            onClick={() => {
              onNavigate("companies");
              setIsOpen(false);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-700 hover:bg-emerald-600 text-white shadow-lg border border-emerald-500 transition-all hover:scale-105"
          >
            <span>Companies & Inputs Stock</span>
            <Building2 className="w-4 h-4 text-emerald-200" />
          </button>

          <button
            onClick={() => {
              onNavigate("whatsapp");
              setIsOpen(false);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-stone-950 shadow-lg border border-emerald-400 transition-all hover:scale-105"
          >
            <span>Chat on WhatsApp</span>
            <MessageSquare className="w-4 h-4 fill-current" />
          </button>

          <button
            onClick={() => {
              onNavigate("scan");
              setIsOpen(false);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white shadow-lg border border-stone-700 transition-all hover:scale-105"
          >
            <span>Scan Crop Leaf</span>
            <Camera className="w-4 h-4 text-emerald-400" />
          </button>

          <button
            onClick={() => {
              onNavigate("ask");
              setIsOpen(false);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white shadow-lg border border-stone-700 transition-all hover:scale-105"
          >
            <span>Ask Agronomist</span>
            <HelpCircle className="w-4 h-4 text-emerald-400" />
          </button>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-stone-900 hover:bg-stone-800 text-white shadow-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 border-2 border-stone-700 p-2"
        title="Quick MundaAI Agronomist Action"
      >
        {isOpen ? <X className="w-6 h-6 text-stone-300" /> : <MundaAiLogo variant="icon" size="sm" iconClassName="w-10 h-10 rounded-xl" />}
      </button>
    </div>
  );
};

