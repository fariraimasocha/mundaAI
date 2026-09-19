import React, { useState } from "react";
import {
  PhoneCall,
  X,
  CheckCircle2,
  AlertCircle,
  Users,
  MapPin,
  Send,
  ShieldCheck,
  FileText,
} from "lucide-react";
import { CropScanAssessment, FarmerProfile } from "../types";

interface HumanEscalationModalProps {
  isOpen: boolean;
  onClose: () => void;
  farmer: FarmerProfile;
  assessment?: CropScanAssessment | null;
}

export const HumanEscalationModal: React.FC<HumanEscalationModalProps> = ({
  isOpen,
  onClose,
  farmer,
  assessment,
}) => {
  if (!isOpen) return null;

  const [officerWard, setOfficerWard] = useState("Ward 5 — Chinhoyi Rural / Makonde District");
  const [urgency, setUrgency] = useState<"Normal" | "Urgent" | "Critical">("Urgent");
  const [notes, setNotes] = useState(
    assessment
      ? `Farmer noticed visible symptoms on Maize: ${assessment.visibleSymptoms.join(", ")}. Preliminary visual assessment flagged possible ${assessment.possibleIssues[0]?.name || "crop stress"}.`
      : "Suspected pest outbreak / abnormal leaf spotting requires Ward extension officer field verification."
  );
  const [dispatched, setDispatched] = useState(false);
  const [ticketId, setTicketId] = useState("");

  const handleDispatch = () => {
    const randomId = `AGRITEX-ZW-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setTicketId(randomId);
    setDispatched(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200 animate-fadeIn">
        {/* Modal Header */}
        <div className="bg-amber-950 text-amber-50 p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Agritex Extension Officer Network</h3>
              <p className="text-[11px] text-amber-300">Ministry of Lands, Agriculture, Fisheries, Water & Rural Development</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-amber-900 text-amber-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs text-stone-700">
          {dispatched ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-stone-900">
                  Escalation Dispatch Created!
                </h4>
                <p className="text-xs text-stone-500">
                  Ticket Reference: <strong className="text-emerald-700 font-mono text-sm">{ticketId}</strong>
                </p>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-left space-y-2">
                <div className="flex justify-between border-b border-stone-200 pb-2">
                  <span className="text-stone-500">Assigned Officer:</span>
                  <span className="font-bold text-stone-900">C. Murehwa (Agritex Ward 5)</span>
                </div>
                <div className="flex justify-between border-b border-stone-200 pb-2">
                  <span className="text-stone-500">Direct Phone:</span>
                  <span className="font-mono font-bold text-stone-900">+263 67 212 3456</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Dispatched Via:</span>
                  <span className="font-semibold text-emerald-700">Agritex Rural SMS Gateway</span>
                </div>
              </div>

              <p className="text-[11px] text-stone-500">
                The extension officer has received your location ({farmer.district}), crop telemetry, and the preliminary visual assessment.
              </p>

              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-stone-900 text-white font-bold text-xs"
              >
                Close Window
              </button>
            </div>
          ) : (
            <>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p className="text-[11px] text-amber-900 leading-relaxed">
                  <strong>Responsible AI Mandate:</strong> Artificial intelligence provides preliminary guidance, but certified agricultural extension officers make on-site agronomic assessments.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">
                    Farmer & Farm Location
                  </label>
                  <div className="p-2.5 rounded-lg bg-stone-100 font-medium text-stone-800">
                    {farmer.name} • {farmer.district}, {farmer.naturalRegion} ({farmer.areaHa}ha {farmer.primaryCrop})
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">
                    Select Agritex Ward Office
                  </label>
                  <select
                    value={officerWard}
                    onChange={(e) => setOfficerWard(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 font-medium text-stone-900"
                  >
                    <option value="Ward 5 — Chinhoyi Rural / Makonde District">
                      Ward 5 — Chinhoyi Rural / Makonde District (Officer C. Murehwa)
                    </option>
                    <option value="Ward 12 — Bindura South">
                      Ward 12 — Bindura South (Officer T. Moyo)
                    </option>
                    <option value="Harare North Horticultural Desk">
                      Harare North Horticultural Desk (Officer P. Dube)
                    </option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">
                    Urgency Level
                  </label>
                  <div className="flex gap-2">
                    {(["Normal", "Urgent", "Critical"] as const).map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setUrgency(lvl)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                          urgency === lvl
                            ? lvl === "Critical"
                              ? "bg-rose-600 text-white border-rose-600"
                              : "bg-amber-600 text-white border-amber-600"
                            : "bg-stone-50 text-stone-600 border-stone-300"
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">
                    Handover Summary (AI Diagnostic Transcript)
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-stone-900"
                  />
                </div>
              </div>

              <button
                onClick={handleDispatch}
                className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-600/20"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Transmit Escalation to Agritex Officer</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
