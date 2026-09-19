import React, { useState, useRef } from "react";
import {
  Camera,
  Upload,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  PhoneCall,
  RefreshCw,
  FileImage,
  ShieldAlert,
  ArrowRight,
  Info,
} from "lucide-react";
import { CropScanAssessment, Language, FarmerProfile } from "../types";
import { CROP_SAMPLES, CropSample } from "../data/cropSamples";
import { TRANSLATIONS } from "../data/translations";

interface CropScannerProps {
  language: Language;
  farmer: FarmerProfile;
  onOpenEscalation: (assessment?: CropScanAssessment) => void;
}

export const CropScanner: React.FC<CropScannerProps> = ({
  language,
  farmer,
  onOpenEscalation,
}) => {
  const t = TRANSLATIONS[language];

  const [selectedCrop, setSelectedCrop] = useState("Maize");
  const [customCropName, setCustomCropName] = useState("");
  const [selectedStage, setSelectedStage] = useState("Vegetative (V6)");
  const [farmerObservations, setFarmerObservations] = useState("");
  const [previewImage, setPreviewImage] = useState<string>("");
  const [activeSampleId, setActiveSampleId] = useState<string>("");
  const [analyzing, setAnalyzing] = useState(false);
  const [assessment, setAssessment] = useState<CropScanAssessment | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const effectiveCrop = selectedCrop === "Custom" ? (customCropName.trim() || "Custom Crop") : selectedCrop;

  const handleSelectSample = (sample: CropSample) => {
    setActiveSampleId(sample.id);
    setPreviewImage(sample.imageUri);
    setSelectedCrop(sample.crop);
    setSelectedStage(sample.growthStage);
    setFarmerObservations(sample.notes);
    setAssessment(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setPreviewImage(base64);
      setActiveSampleId("custom-upload");
      setAssessment(null);
    };
    reader.readAsDataURL(file);
  };

  const runAnalysis = async () => {
    if (!previewImage) return;
    setAnalyzing(true);
    setAssessment(null);

    try {
      const res = await fetch("/api/ai/crop-scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: previewImage,
          mimeType: previewImage.startsWith("data:image/png") ? "image/png" : "image/jpeg",
          crop: effectiveCrop,
          growthStage: selectedStage,
          observations: farmerObservations,
        }),
      });

      const data = await res.json();
      if (data.assessment) {
        setAssessment(data.assessment);
      }
    } catch (err: any) {
      console.error("Crop scan error:", err);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
            <Camera className="w-3.5 h-3.5" />
            <span>Multimodal Agronomic Vision</span>
          </div>
          <h2 className="text-2xl font-extrabold text-stone-900 mt-2 font-['Outfit',sans-serif]">
            Scan Your Crop
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            Upload or capture a leaf, fruit, or whorl photograph to evaluate visible symptoms, pest pressures, and nutrient stresses.
          </p>
        </div>

        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 max-w-xs">
          <div className="font-bold flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
            Responsible AI Protocol
          </div>
          <p className="text-[11px] text-amber-800 mt-0.5">
            mundaai communicates symptoms as likelihoods, never definitive diagnoses. Escalation to Agritex is provided for severe cases.
          </p>
        </div>
      </div>

      {/* 1-Click Curated Zimbabwean Crop Samples */}
      <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
            Real Field Test Samples (Click to load):
          </span>
          <span className="text-xs text-stone-500 font-medium">Authentic photographs of Zimbabwean crop pathology</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          {CROP_SAMPLES.map((sample) => {
            const isSelected = activeSampleId === sample.id;
            return (
              <button
                key={sample.id}
                onClick={() => handleSelectSample(sample)}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between group ${
                  isSelected
                    ? "border-emerald-600 bg-white ring-2 ring-emerald-500/20 shadow-md"
                    : "border-stone-200 bg-white hover:border-stone-400"
                }`}
              >
                <div className="space-y-2">
                  <div className="w-full h-24 rounded-lg overflow-hidden border border-stone-200 bg-stone-900 flex items-center justify-center">
                    <img
                      src={sample.imageUri}
                      alt={sample.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-stone-900 leading-tight">
                      {sample.name}
                    </h3>
                    <p className="text-[11px] text-stone-500 line-clamp-2 mt-0.5">
                      {sample.shortDescription}
                    </p>
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-stone-100 flex items-center justify-between text-[10px] font-semibold text-emerald-700">
                  <span className="truncate">{sample.crop}</span>
                  <span className="shrink-0">{isSelected ? "● Loaded" : "Click"}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Image Upload & Config Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Image Canvas & Inputs */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-stone-900 font-['Outfit',sans-serif]">
                Crop Photograph
              </h3>
              {previewImage && (
                <button
                  onClick={() => {
                    setPreviewImage("");
                    setActiveSampleId("");
                    setAssessment(null);
                  }}
                  className="text-xs text-red-600 hover:text-red-700 font-semibold"
                >
                  Clear Photo
                </button>
              )}
            </div>

            {/* Preview Frame */}
            <div
              onClick={() => !previewImage && fileInputRef.current?.click()}
              className={`relative rounded-xl overflow-hidden border-2 border-dashed ${
                previewImage ? "border-stone-300 bg-stone-900" : "border-emerald-300 bg-emerald-50/40 hover:bg-emerald-50/80 cursor-pointer"
              } aspect-video flex items-center justify-center group transition-colors`}
            >
              {previewImage ? (
                <>
                  <img
                    src={previewImage}
                    alt="Crop preview"
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                  {/* Upload trigger button inside frame */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-white text-stone-900 font-bold text-xs flex items-center gap-1.5 shadow"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Change Photo
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center p-6 text-stone-600 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-stone-800">
                      Upload or Take Crop Photograph
                    </p>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Click to browse or drop an image of affected leaves, fruit, or whorl
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Browse Photo
                  </button>
                </div>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />

            {/* Field Metadata Form */}
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Crop Type</label>
                  <select
                    value={selectedCrop}
                    onChange={(e) => setSelectedCrop(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs text-stone-900 font-medium"
                  >
                    <option value="Maize">Maize (Chibage)</option>
                    <option value="Tomatoes">Tomatoes (Madomasi)</option>
                    <option value="Potatoes">Potatoes (Mbatata)</option>
                    <option value="Soya Beans">Soya Beans</option>
                    <option value="Groundnuts">Groundnuts (Nzungu)</option>
                    <option value="Sorghum">Sorghum (Mapfunde)</option>
                    <option value="Cotton">Cotton (Donje)</option>
                    <option value="Tobacco">Flue-cured Tobacco</option>
                    <option value="Custom">Custom / Other Crop...</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Growth Stage</label>
                  <select
                    value={selectedStage}
                    onChange={(e) => setSelectedStage(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs text-stone-900 font-medium"
                  >
                    <option value="Emergence (VE)">Emergence (VE)</option>
                    <option value="Vegetative (V4-V6)">Early Vegetative (V4-V6)</option>
                    <option value="Knee-High (V7-V8)">Knee-High (V7-V8)</option>
                    <option value="Tasseling / Flowering">Tasseling / Flowering</option>
                    <option value="Fruiting / Grain Fill">Fruiting / Grain Fill</option>
                    <option value="Maturity / Drying">Maturity / Drying</option>
                  </select>
                </div>
              </div>

              {/* Custom Crop input if Custom is selected */}
              {selectedCrop === "Custom" && (
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">
                    Custom Crop Name
                  </label>
                  <input
                    type="text"
                    value={customCropName}
                    onChange={(e) => setCustomCropName(e.target.value)}
                    placeholder="e.g. Sweet Potatoes, Onions, Cabbage, Citrus, Banana..."
                    className="w-full bg-stone-50 border border-emerald-400 rounded-lg p-2 text-xs text-stone-900 font-medium placeholder:text-stone-400 outline-none ring-1 ring-emerald-500/20"
                  />
                </div>
              )}

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Field Observations</label>
                <textarea
                  rows={2}
                  value={farmerObservations}
                  onChange={(e) => setFarmerObservations(e.target.value)}
                  placeholder="e.g. Dark spots spreading on fruit and leaves after 3 days of rain; no insect holes seen."
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs text-stone-900 placeholder:text-stone-400 outline-none"
                />
              </div>
            </div>

            {/* Action button */}
            <button
              onClick={runAnalysis}
              disabled={analyzing || !previewImage}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-700/20 cursor-pointer disabled:cursor-not-allowed"
            >
              {analyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Analyzing Field Symptoms...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze Crop Symptoms</span>
                </>
              )}
            </button>

            {/* Direct WhatsApp link */}
            <div className="pt-2 border-t border-stone-100 text-center">
              <a
                href="https://wa.me/16465894168?text=Hello%20mundaai%2C%20I%20have%20a%20crop%20photo%20to%20diagnose"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold inline-flex items-center gap-1.5"
              >
                <span>Or send photo to WhatsApp Bot (+1 646 589-4168)</span>
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Structured AI Assessment Output */}
        <div className="lg:col-span-7">
          {analyzing ? (
            <div className="bg-white rounded-2xl p-10 border border-stone-200 text-center space-y-4 shadow-sm">
              <RefreshCw className="w-10 h-10 animate-spin text-emerald-600 mx-auto" />
              <div className="space-y-1">
                <h3 className="font-bold text-stone-900 text-base">
                  Analyzing Visible Symptoms...
                </h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Examining leaf chlorosis, necrotic margins, water-soaked rot, vein patterns, perforation, and contextual growth stage...
                </p>
              </div>
            </div>
          ) : assessment ? (
            <div className="space-y-4 animate-fadeIn">
              {/* Card 1: Diagnostic Assessment & Confidence */}
              <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                      CROP: {assessment.crop}
                    </span>
                    <h3 className="text-lg font-bold text-stone-900 font-['Outfit',sans-serif]">
                      Visible Symptom Assessment
                    </h3>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-stone-400 block font-semibold">CONFIDENCE</span>
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        assessment.confidence === "High"
                          ? "bg-emerald-100 text-emerald-800"
                          : assessment.confidence === "Medium"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-stone-200 text-stone-700"
                      }`}
                    >
                      {assessment.confidence} Confidence
                    </span>
                  </div>
                </div>

                {/* Possible issues */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-stone-700">Possible Causes:</span>
                  <div className="space-y-2">
                    {assessment.possibleIssues.map((issue, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-xs text-stone-900">
                            {issue.name}
                          </h4>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-stone-200 text-stone-800">
                            Likelihood: {issue.likelihood}
                          </span>
                        </div>
                        {issue.scientificName && (
                          <p className="text-[10px] italic text-stone-500">
                            {issue.scientificName}
                          </p>
                        )}
                        <p className="text-xs text-stone-600">{issue.summary}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Visible Symptoms */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-xs font-bold text-stone-700">What Mufarm Sees (Visible Symptoms):</span>
                  <ul className="space-y-1 text-xs text-stone-600">
                    {assessment.visibleSymptoms.map((sym, sIdx) => (
                      <li key={sIdx} className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>{sym}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Card 2: Field Verification & Practical Next Steps */}
              <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
                <div className="space-y-2">
                  <h4 className="font-bold text-xs text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
                    What to check next on the plant:
                  </h4>
                  <ul className="space-y-1 text-xs text-stone-600">
                    {assessment.whatToCheckNext.map((chk, cIdx) => (
                      <li key={cIdx} className="flex items-start gap-2 bg-blue-50/50 p-2 rounded-lg border border-blue-100">
                        <span className="text-blue-700 font-bold">✓</span>
                        <span>{chk}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* "WHAT SHOULD I DO NEXT?" Principle */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-950 space-y-2">
                  <div className="flex items-center gap-1.5 font-extrabold text-emerald-900 text-xs tracking-wide uppercase">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    {t.whatShouldIDoNext}
                  </div>
                  <ul className="space-y-1.5 text-xs text-emerald-950 font-medium">
                    {assessment.recommendedAction.map((act, aIdx) => (
                      <li key={aIdx} className="flex items-start gap-2">
                        <span className="text-emerald-700 font-bold">1.{aIdx + 1}</span>
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Escalation to Agritex Extension Officer */}
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-bold text-stone-900 flex items-center gap-1">
                      <PhoneCall className="w-3.5 h-3.5 text-amber-600" />
                      When to escalate to an extension officer:
                    </span>
                    <p className="text-[11px] text-stone-600 mt-0.5">
                      {assessment.escalation?.trigger || "Consult local Agritex officer if symptoms spread to more than 15% of your crop."}
                    </p>
                  </div>
                  <button
                    onClick={() => onOpenEscalation(assessment)}
                    className="px-3.5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs whitespace-nowrap shadow-sm"
                  >
                    Escalate to Agritex
                  </button>
                </div>

                {/* Limitation & Responsible AI notice */}
                <p className="text-[10px] text-stone-500 italic pt-1 border-t border-stone-100">
                  {assessment.disclaimer}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-stone-50 rounded-2xl p-10 border border-dashed border-stone-300 text-center space-y-3">
              <Sparkles className="w-8 h-8 text-emerald-600 mx-auto" />
              <h3 className="font-bold text-sm text-stone-800">
                Ready to Analyze Crop Symptoms
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Select one of the real field samples above or upload your own leaf photo, then click <strong>"Analyze Crop Symptoms"</strong>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
