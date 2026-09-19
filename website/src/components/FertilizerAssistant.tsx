import React, { useState } from "react";
import {
  Calculator,
  Sprout,
  Sparkles,
  Info,
  CheckCircle2,
  RefreshCw,
  HelpCircle,
  ShieldAlert,
} from "lucide-react";
import { FertilizerCalculation, Language, FarmerProfile } from "../types";

interface FertilizerAssistantProps {
  language: Language;
  farmer: FarmerProfile;
}

export const FertilizerAssistant: React.FC<FertilizerAssistantProps> = ({
  language,
  farmer,
}) => {
  const [calculationType, setCalculationType] = useState<"pfumvudza" | "hectare">("pfumvudza");
  const [pfumvudzaPlots, setPfumvudzaPlots] = useState<number>(3); // 3 plots standard for average household food security
  const [areaHectares, setAreaHectares] = useState<number>(2);
  const [crop, setCrop] = useState<string>("Maize");
  const [customCrop, setCustomCrop] = useState<string>("");
  const [soilType, setSoilType] = useState<string>("Sandy Loam");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    calculation: FertilizerCalculation;
    explanation: string;
  } | null>(null);

  const effectiveCrop = crop === "Custom" ? (customCrop.trim() || "Custom Crop") : crop;

  const runCalculation = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/fertilizer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          crop: effectiveCrop,
          areaHectares: calculationType === "hectare" ? areaHectares : 0,
          pfumvudzaPlots: calculationType === "pfumvudza" ? pfumvudzaPlots : 0,
          soilType,
          region: farmer.naturalRegion,
        }),
      });

      const data = await res.json();
      if (data.calculation) {
        setResult({
          calculation: data.calculation,
          explanation: data.explanation,
        });
      }
    } catch (err) {
      console.error("Fertilizer calculation error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Run on mount or when switching
  React.useEffect(() => {
    runCalculation();
  }, [calculationType, pfumvudzaPlots, areaHectares, crop, customCrop]);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
            <Calculator className="w-3.5 h-3.5" />
            <span>Agritex Standards & Conservation Agriculture (Pfumvudza)</span>
          </div>
          <h2 className="text-2xl font-extrabold text-stone-900 mt-2 font-['Outfit',sans-serif]">
            Fertilizer & Pfumvudza Calculator
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            Calculate exact Compound D basal and Ammonium Nitrate (AN) top dressing requirements without wasteful excess.
          </p>
        </div>

        {/* Mode switcher: Pfumvudza vs Commercial Hectare */}
        <div className="bg-stone-100 p-1 rounded-xl flex items-center border border-stone-200">
          <button
            onClick={() => setCalculationType("pfumvudza")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              calculationType === "pfumvudza"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            Pfumvudza / Intwasa Plots
          </button>
          <button
            onClick={() => setCalculationType("hectare")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              calculationType === "hectare"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            Commercial Field (Ha)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Inputs */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-stone-900 font-['Outfit',sans-serif]">
            Plot & Field Configuration
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-stone-700 block mb-1">Target Crop</label>
              <select
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 font-medium text-stone-900"
              >
                <option value="Maize">Maize (Chibage)</option>
                <option value="Tomatoes">Tomatoes (Madomasi)</option>
                <option value="Potatoes">Potatoes (Mbatata)</option>
                <option value="Sorghum">Sorghum (Mapfunde)</option>
                <option value="Soya Beans">Soya Beans</option>
                <option value="Groundnuts">Groundnuts (Nzungu)</option>
                <option value="Cotton">Cotton (Donje)</option>
                <option value="Tobacco">Tobacco</option>
                <option value="Sunflower">Sunflower</option>
                <option value="Vegetables">Horticulture / Leafy Greens</option>
                <option value="Custom">Custom / Other Crop...</option>
              </select>
            </div>

            {crop === "Custom" && (
              <div>
                <label className="font-semibold text-stone-700 block mb-1">
                  Specify Crop Name
                </label>
                <input
                  type="text"
                  value={customCrop}
                  onChange={(e) => setCustomCrop(e.target.value)}
                  placeholder="e.g. Sweet Potatoes, Garlic, Onions, Cassava..."
                  className="w-full bg-stone-50 border border-emerald-400 rounded-lg p-2.5 font-medium text-stone-900 placeholder:text-stone-400 outline-none ring-1 ring-emerald-500/20"
                />
              </div>
            )}

            {calculationType === "pfumvudza" ? (
              <div>
                <label className="font-semibold text-stone-700 block mb-1">
                  Number of Pfumvudza Plots (39m × 16m)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={pfumvudzaPlots}
                    onChange={(e) => setPfumvudzaPlots(Number(e.target.value) || 1)}
                    className="flex-1 bg-stone-50 border border-stone-300 rounded-lg p-2.5 font-bold text-stone-900"
                  />
                  <span className="text-xs text-stone-500 font-medium whitespace-nowrap">
                    = {(pfumvudzaPlots * 1456).toLocaleString()} planting basins
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 mt-1">
                  1 standard plot = 624m² (1,456 holes). Agritex recommends 3 plots per family for complete annual grain security.
                </p>
              </div>
            ) : (
              <div>
                <label className="font-semibold text-stone-700 block mb-1">
                  Cultivated Area (Hectares)
                </label>
                <input
                  type="number"
                  min={0.5}
                  max={500}
                  step={0.5}
                  value={areaHectares}
                  onChange={(e) => setAreaHectares(Number(e.target.value) || 1)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 font-bold text-stone-900"
                />
              </div>
            )}

            <div>
              <label className="font-semibold text-stone-700 block mb-1">Soil Texture</label>
              <select
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 font-medium text-stone-900"
              >
                <option value="Sandy Loam">Sandy Loam (Vulnerable to Leaching)</option>
                <option value="Red Clay">Red Clay / Fersiallitic (High retention)</option>
                <option value="Sandy Soil">Deep Kalahari Sand (Heavy Leaching)</option>
              </select>
            </div>
          </div>

          <button
            onClick={runCalculation}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            <span>Calculate Fertilizer Requirements</span>
          </button>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-7 space-y-4">
          {result && (
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                  {result.calculation.system}
                </span>
                <h3 className="text-xl font-black text-stone-900 font-['Outfit',sans-serif]">
                  Transparent Mathematical Breakdown
                </h3>
              </div>

              {/* Requirement Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Basal Compound D */}
                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2">
                  <div className="text-xs font-bold text-stone-500 uppercase">
                    BASAL FERTILIZER: COMPOUND D (7:14:7)
                  </div>
                  <div className="text-2xl font-black text-stone-900 font-['Outfit',sans-serif]">
                    {result.calculation.basalCompoundD_kg.toFixed(1)} kg
                  </div>
                  <div className="text-[11px] text-stone-600">
                    {calculationType === "pfumvudza"
                      ? "1 level beer bottle cap (approx 10g) placed in each basin before planting."
                      : `${(result.calculation.basalCompoundD_kg / 50).toFixed(1)} × 50kg bags (applied banded at planting).`}
                  </div>
                </div>

                {/* Top Dressing AN */}
                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2">
                  <div className="text-xs font-bold text-stone-500 uppercase">
                    TOP DRESSING: AMMONIUM NITRATE (AN 34.5% N)
                  </div>
                  <div className="text-2xl font-black text-emerald-700 font-['Outfit',sans-serif]">
                    {result.calculation.topDressingAN_kg.toFixed(1)} kg
                  </div>
                  <div className="text-[11px] text-stone-600">
                    {calculationType === "pfumvudza"
                      ? "1 level bottle cap per plant basin when maize reaches knee height into moist soil."
                      : `${(result.calculation.topDressingAN_kg / 50).toFixed(1)} × 50kg bags (split into 2 applications).`}
                  </div>
                </div>
              </div>

              {/* Agronomic Natural Language Explanation */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 font-bold text-xs text-emerald-900">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                  Agronomic Application & Timing Guidance
                </div>
                <p className="text-xs text-emerald-950 whitespace-pre-wrap leading-relaxed">
                  {result.explanation}
                </p>
              </div>

              {/* Responsible AI Disclaimer */}
              <div className="pt-2 border-t border-stone-100 flex items-start gap-2 text-[11px] text-stone-500">
                <ShieldAlert className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                <span>
                  This is an indicative calculation based on standard Zimbabwe Agritex guidelines. Validate recommendations against local agronomic soil-test results and manufacturer chemical labels.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
