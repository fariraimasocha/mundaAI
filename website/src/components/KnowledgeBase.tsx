import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Search,
  Sparkles,
  Tag,
  ArrowRight,
  ShieldCheck,
  FileText,
} from "lucide-react";
import { KnowledgeDoc, Language } from "../types";

interface KnowledgeBaseProps {
  language: Language;
  onAskKnowledgeTopic: (topic: string) => void;
}

export const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({
  language,
  onAskKnowledgeTopic,
}) => {
  const [docs, setDocs] = useState<KnowledgeDoc[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch(`/api/knowledge?q=${encodeURIComponent(searchQuery)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.knowledge) setDocs(data.knowledge);
      })
      .catch((err) => console.error("Knowledge fetch error:", err));
  }, [searchQuery]);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Zimbabwe Agritex & Conservation Agriculture Repositories</span>
          </div>
          <h2 className="text-2xl font-extrabold text-stone-900 mt-2 font-['Outfit',sans-serif]">
            Agricultural Knowledge Grounding
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            Mufarm grounds AI responses in verified Zimbabwean agricultural literature rather than unconstrained model generation.
          </p>
        </div>

        <div className="w-full md:w-72 relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Agritex guides..."
            className="w-full bg-stone-50 border border-stone-300 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-900 outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Grounding architecture notice */}
      <div className="p-4 bg-emerald-950 text-stone-200 rounded-2xl border border-emerald-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <strong>Trusted Knowledge Grounding:</strong> AI answers cite official Zimbabwean agronomic recommendations.
          </div>
        </div>
        <span className="text-[10px] text-emerald-300 font-mono">
          RAG Pipeline Ready • Agritex Grounded
        </span>
      </div>

      {/* Docs List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {docs.map((doc, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                  {doc.category}
                </span>
                <span className="text-[10px] text-stone-400 font-mono">Agritex Tech Doc</span>
              </div>
              <h3 className="font-bold text-sm text-stone-900 leading-snug">
                {doc.title}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {doc.content}
              </p>
            </div>

            <button
              onClick={() => onAskKnowledgeTopic(`Explain Agritex recommendations for: ${doc.title}`)}
              className="mt-2 pt-2 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
            >
              <span>Ask AI Agronomist to explain this guide</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
