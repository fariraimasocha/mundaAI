import React, { useState } from "react";
import {
  MessageSquare,
  Send,
  Camera,
  Mic,
  QrCode,
  ExternalLink,
  ShieldCheck,
  CheckCheck,
  Phone,
  Sparkles,
  Info,
  Code,
  ArrowRight,
} from "lucide-react";
import { Language } from "../types";
import { CROP_SAMPLES } from "../data/cropSamples";
import { MundaAiLogo } from "./MundaAiLogo";

interface WhatsAppAgronomistProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  onOpenWebAgronomist: () => void;
}

interface WhatsAppMsg {
  id: string;
  sender: "farmer" | "mufarm";
  text: string;
  time: string;
  image?: string;
  isAudio?: boolean;
}

export const WhatsAppAgronomist: React.FC<WhatsAppAgronomistProps> = ({
  language,
  setLanguage,
  onOpenWebAgronomist,
}) => {
  const [messages, setMessages] = useState<WhatsAppMsg[]>([
    {
      id: "1",
      sender: "farmer",
      text: "Mhoroi Mufarm. My maize leaves have strange yellowish spots and tips. What should I do?",
      time: "09:14",
    },
    {
      id: "2",
      sender: "mufarm",
      text: "Mhoroi! I can help you investigate this. Before applying any chemical, can you send me a clear photograph of the affected leaves? Also, is the yellowing on older lower leaves or the newest top leaves?",
      time: "09:15",
    },
    {
      id: "3",
      sender: "farmer",
      text: "Here is a photo of the lower leaf. It looks like a V-shape from the tip.",
      time: "09:16",
      image: CROP_SAMPLES[0].imageUri,
    },
    {
      id: "4",
      sender: "mufarm",
      text: "I can see the visible symptoms in your photo: A classic V-shaped yellowing starting from the leaf tip and progressing along the midrib on older leaves.\n\n⚠️ Preliminary Assessment: These symptoms are consistent with Nitrogen Deficiency (common after heavy leaching rains) or early streak virus.\n\n✅ Recommended Next Step:\n1. Inspect the underside of leaves for leafhoppers.\n2. If it's pure nutrient leaching, prepare a split top-dressing of Ammonium Nitrate (1 beer bottle cap per Pfumvudza basin).\n\nWould you like to connect with the Mashonaland West Agritex officer if this spreads?",
      time: "09:17",
    },
  ]);

  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showArchDetails, setShowArchDetails] = useState(false);

  const samplePrompts = {
    English: [
      "Should I irrigate Zone B today?",
      "What is the current maize price at Mbare Musika?",
      "How much Compound D for 2 Pfumvudza plots?",
    ],
    Shona: [
      "Ndirime chibage riini muRegion II?",
      "Mutengo wechibage paMbare uri pai?",
      "Mupfudze we Compound D unoiswa zvakadii?",
    ],
    Ndebele: [
      "Kumele nginisele umumbu wami lamuhla?",
      "Inani lomumbu eMbare limi njani?",
      "Umquba we Compound D ufakwa njani eIntwasa?",
    ],
  };

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputVal;
    if (!text.trim()) return;

    const newFarmerMsg: WhatsAppMsg = {
      id: Date.now().toString(),
      sender: "farmer",
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, newFarmerMsg]);
    if (!textToSend) setInputVal("");
    setIsTyping(true);

    // Realistic WhatsApp response simulation
    setTimeout(() => {
      let replyText = "";
      const lower = text.toLowerCase();

      if (lower.includes("irrigate") || lower.includes("kudiridza") || lower.includes("water") || lower.includes("kunisele")) {
        replyText = "🌧️ Checking weather and soil sensors for Mashonaland West...\n\nRain probability is 78% within the next 36 hours and your Zone B soil moisture is at 68% (Well mulched & optimal).\n\n💡 Next Step: Do NOT irrigate today. Save your pump fuel and prevent fertilizer leaching.";
      } else if (lower.includes("mbare") || lower.includes("price") || lower.includes("mutengo") || lower.includes("inani") || lower.includes("gmb")) {
        replyText = "📊 Current Indicative Grain Prices:\n• GMB Aspindale: $335/tonne ($16.75 / 50kg bag)\n• Mbare Musika: ~$290/tonne ($14.50 / 50kg bag)\n\n⚠️ Economic Note: Deduct ~$25-35/tonne for transport from rural depots to calculate your real net profit.";
      } else if (lower.includes("pfumvudza") || lower.includes("compound") || lower.includes("intwasa") || lower.includes("fertilizer")) {
        replyText = "🌱 Pfumvudza Fertilizer Rule (Agritex Standard):\nFor each 39m × 16m plot (1,456 basins):\n• Basal: 1 beer bottle cap (~10g) of Compound D per basin (approx 14.5kg per plot).\n• Top Dressing: 1 beer bottle cap of AN at knee height (V6 stage).\n\nEnsure soil is damp before applying AN.";
      } else {
        replyText = "Thank you for the update! I am tracking your maize field in Mashonaland West. I can assist you with diagnosing symptoms from photographs, checking regional rainfall probability, calculating Pfumvudza fertilizer, or checking commodity prices.";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "mufarm",
          text: replyText,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      setIsTyping(false);
    }, 1200);
  };

  const handleAttachPhoto = () => {
    const sample = CROP_SAMPLES[1]; // Armyworm sample
    const newMsg: WhatsAppMsg = {
      id: Date.now().toString(),
      sender: "farmer",
      text: "I checked the whorl and found these ragged holes and caterpillar frass.",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      image: sample.imageUri,
    };
    setMessages((prev) => [...prev, newMsg]);
    setIsTyping(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "mufarm",
          text: "🔍 Multimodal Leaf Analysis:\n\nObserved: Window-pane feeding and jagged holes in the central whorl with brownish sawdust-like frass.\n\n⚠️ Suspected: Fall Armyworm (Spodoptera frugiperda) infestation.\n\n✅ Recommended Action:\n1. Small plot: Handpick caterpillars or apply clean wood ash / sand into whorls early morning.\n2. Commercial: If >20% whorls infested, apply Agritex-registered spray (e.g. Emamectin Benzoate) in late afternoon.\n\nEscalation: Agritex Plant Protection Unit notified if regional outbreak continues.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <section className="bg-gradient-to-b from-stone-900 to-stone-950 text-white rounded-3xl p-6 sm:p-10 border border-stone-800 shadow-2xl space-y-8">
      {/* Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-stone-800 pb-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>ACCESSIBILITY FIRST • WHATSAPP BOT INTEGRATION</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white font-['Outfit',sans-serif]">
            Your Agronomist Is Now on WhatsApp.
          </h2>
          <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
            Chat live, send crop photos, and receive practical farming guidance on WhatsApp at <strong className="text-emerald-400">+1 (646) 589-4168</strong> in English, Shona, and Ndebele.
          </p>
        </div>

        {/* Status indicator badges */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            BOT LINE: +1 (646) 589-4168
          </span>
          <a
            href="https://wa.me/16465894168?text=Hello%20mundaai%2C%20I%20need%20farming%20advice"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#25D366] hover:bg-[#20bd5a] text-stone-950 flex items-center gap-1.5 shadow transition-colors"
          >
            <span>Open WhatsApp</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Interactive WhatsApp Phone Mockup */}
        <div className="lg:col-span-7 flex justify-center">
          <div className="w-full max-w-md bg-stone-950 rounded-[2.5rem] p-3 border-4 border-stone-800 shadow-2xl relative">
            {/* Phone Speaker & Camera Notch */}
            <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-4 bg-stone-900 rounded-full z-10" />

            {/* Phone Screen */}
            <div className="bg-[#0b141a] rounded-[2rem] overflow-hidden flex flex-col h-[540px] border border-stone-800 text-stone-100 font-sans">
              {/* WhatsApp Header */}
              <div className="bg-[#202c33] px-4 py-3 pt-6 flex items-center justify-between border-b border-[#222d34]">
                <div className="flex items-center gap-3">
                  <MundaAiLogo variant="icon" size="sm" iconClassName="w-10 h-10 rounded-xl" />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-stone-100 font-['Outfit',sans-serif]">mundaai Agronomist</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">OFFICIAL BOT</span>
                    </div>
                    <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      +1 (646) 589-4168 • Online
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-stone-400 text-xs">
                  <Phone className="w-4 h-4" />
                </div>
              </div>

              {/* Chat Messages Container */}
              <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-[#0b141a] text-xs">
                {/* Notice pill inside chat */}
                <div className="text-center my-1">
                  <span className="inline-block bg-[#182229] text-stone-400 px-3 py-1 rounded-md text-[10px] border border-stone-800">
                    🔒 Connected to mundaai WhatsApp Bot +1 (646) 589-4168 • Agritex Extension
                  </span>
                </div>

                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === "farmer" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-xl p-2.5 space-y-1.5 shadow-sm text-xs ${
                        msg.sender === "farmer"
                          ? "bg-[#005c4b] text-stone-100 rounded-tr-none"
                          : "bg-[#202c33] text-stone-200 rounded-tl-none border border-stone-700/40"
                      }`}
                    >
                      {msg.image && (
                        <div className="rounded-lg overflow-hidden border border-black/20 my-1">
                          <img
                            src={msg.image}
                            alt="Crop leaf"
                            className="w-full h-32 object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div className="bg-black/60 px-2 py-1 text-[10px] text-stone-300">
                            📷 Crop photograph attached by farmer
                          </div>
                        </div>
                      )}
                      <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                      <div className="flex items-center justify-end gap-1 text-[9px] text-stone-400 pt-0.5">
                        <span>{msg.time}</span>
                        {msg.sender === "farmer" && (
                          <CheckCheck className="w-3.5 h-3.5 text-sky-400" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-[#202c33] px-3 py-2 rounded-xl rounded-tl-none text-stone-400 text-xs flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce delay-100" />
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce delay-200" />
                      <span className="text-[10px] text-stone-300 ml-1">mundaai bot is answering...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Suggestion Chips inside WhatsApp */}
              <div className="bg-[#111b21] px-3 py-1.5 border-t border-[#202c33] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {samplePrompts[language].map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(prompt)}
                    className="whitespace-nowrap px-2.5 py-1 rounded-full bg-[#202c33] hover:bg-[#2a3942] text-[10px] text-emerald-300 border border-stone-700 transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Input Area */}
              <div className="bg-[#202c33] p-2 flex items-center gap-2 border-t border-stone-800">
                <button
                  onClick={handleAttachPhoto}
                  title="Attach a crop photograph"
                  className="p-2 rounded-full hover:bg-stone-700 text-stone-400 hover:text-emerald-400 transition-colors"
                >
                  <Camera className="w-5 h-5" />
                </button>

                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder={
                    language === "Shona"
                      ? "Nyora meseji ku WhatsApp Bot (+1 646 589-4168)..."
                      : language === "Ndebele"
                      ? "Bhala umlayezo ku WhatsApp Bot (+1 646 589-4168)..."
                      : "Type question for WhatsApp Bot (+1 646 589-4168)..."
                  }
                  className="flex-1 bg-[#2a3942] text-stone-100 px-3 py-1.5 rounded-lg text-xs outline-none placeholder:text-stone-400 border border-transparent focus:border-emerald-500"
                />

                {inputVal.trim() ? (
                  <button
                    onClick={() => handleSend()}
                    className="p-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleSend("Mhoroi mundaai, ndinoda rubatsiro rwekurima")}
                    title="Quick Greeting"
                    className="p-2 rounded-full hover:bg-stone-700 text-stone-400 hover:text-emerald-400 transition-colors"
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Vision & Real QR Access */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-stone-800/80 rounded-2xl p-6 border border-stone-700 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Official WhatsApp Contact
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                English • Shona • Ndebele
              </span>
            </div>

            <h3 className="text-lg font-bold text-white font-['Outfit',sans-serif]">
              Scan QR Code to Start WhatsApp Chat
            </h3>

            <p className="text-xs text-stone-300 leading-relaxed">
              Scan this real QR code with your phone camera or WhatsApp scanner to immediately open a conversation with our verified AI Agronomist on WhatsApp at <strong className="text-emerald-400">+1 (646) 589-4168</strong>.
            </p>

            {/* Real QR Code Card */}
            <div className="p-4 bg-white rounded-2xl flex flex-col sm:flex-row items-center gap-4 text-stone-950 shadow-lg">
              <a
                href="https://wa.me/16465894168?text=Hello%20mundaai%2C%20I%20need%20farming%20advice"
                target="_blank"
                rel="noopener noreferrer"
                title="Click to open WhatsApp directly"
                className="shrink-0 p-2 bg-stone-50 rounded-xl border border-stone-200 hover:scale-105 transition-transform"
              >
                <img
                  src="/images/whatsapp-qr.svg"
                  alt="Real WhatsApp QR Code for +1 (646) 589-4168"
                  className="w-28 h-28 object-contain"
                />
              </a>
              <div className="space-y-1 text-center sm:text-left flex-1">
                <div className="font-bold text-sm text-stone-900 font-['Outfit',sans-serif]">
                  mundaai WhatsApp Bot
                </div>
                <div className="text-sm text-emerald-700 font-mono font-bold">
                  +1 (646) 589-4168
                </div>
                <div className="text-[11px] text-stone-500">
                  Instant agricultural advisory & symptom scanner
                </div>
                <div className="pt-2">
                  <a
                    href="https://wa.me/16465894168?text=Hello%20mundaai%2C%20I%20need%20farming%20advice"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-stone-950 font-bold text-xs shadow-sm transition-colors"
                  >
                    <span>Chat on WhatsApp</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <button
                onClick={onOpenWebAgronomist}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs transition-colors"
              >
                <span>Open Web Agronomist</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Responsible AI Notice */}
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-xs text-stone-300 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" />
              Human Escalation Safety Net
            </div>
            <p className="text-[11px] text-stone-400">
              If the AI detects high-risk crop pest infestations (e.g. widespread Fall Armyworm outbreak) or severe nutrient depletion, the system automatically suggests connecting directly with the local Ward Agritex extension officer.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

