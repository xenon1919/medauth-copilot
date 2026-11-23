"use client";

import React from "react";
import { CheckCircle2, AlertTriangle, ExternalLink, CheckSquare, Square } from "lucide-react";
import { CriterionItem } from "@/types/audit";

interface CriteriaChecklistProps {
  criteria: CriterionItem[];
  onSelectQuote: (quote: string, page: number) => void;
  onToggleVerify: (id: string) => void;
}

export const CriteriaChecklist: React.FC<CriteriaChecklistProps> = ({
  criteria,
  onSelectQuote,
  onToggleVerify,
}) => {
  return (
    <div className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm overflow-hidden">
      <div className="mb-3">
        <h2 className="text-sm font-bold text-slate-900">Deterministic Policy Criteria Audit</h2>
        <p className="text-xs text-slate-500">
          Deconstructed from Aetna CPB #0016 via Gemini 3.8 Flash
        </p>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto pr-1">
        {criteria.map((item) => (
          <div
            key={item.id}
            className={`rounded-lg border p-3 transition ${
              item.status === "SATISFIED"
                ? "border-emerald-200 bg-emerald-50/30"
                : "border-amber-200 bg-amber-50/40"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2">
                <button
                  onClick={() => onToggleVerify(item.id)}
                  className="mt-0.5 text-slate-400 hover:text-indigo-600 transition"
                  title="Human Verification Sign-off"
                >
                  {item.verified ? (
                    <CheckSquare className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <Square className="h-4 w-4" />
                  )}
                </button>
                <div>
                  <p className="text-xs font-semibold text-slate-800 leading-snug">{item.rule}</p>
                </div>
              </div>

              <span
                className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  item.status === "SATISFIED"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {item.status === "SATISFIED" ? (
                  <CheckCircle2 className="h-3 w-3" />
                ) : (
                  <AlertTriangle className="h-3 w-3" />
                )}
                {item.status}
              </span>
            </div>

            {/* Extracted Verbatim Quote / Citation */}
            {item.quote && item.page && (
              <div className="mt-2.5 rounded bg-white p-2 border border-slate-200 text-[11px] text-slate-600">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                    Evidence Citation (Page {item.page})
                  </span>
                  <button
                    onClick={() => onSelectQuote(item.quote!, item.page!)}
                    className="inline-flex items-center gap-1 text-[10px] font-semibold text-indigo-600 hover:underline"
                  >
                    <span>View in PDF</span>
                    <ExternalLink className="h-2.5 w-2.5" />
                  </button>
                </div>
                <p className="italic text-slate-700">&ldquo;{item.quote}&rdquo;</p>
              </div>
            )}

            {/* Gap Alert if Missing Documentation */}
            {item.status === "GAP_DETECTED" && item.action_needed && (
              <div className="mt-2 rounded bg-amber-100/70 p-2 text-[11px] text-amber-900 border border-amber-300">
                <span className="font-bold">Missing Documentation Action:</span> {item.action_needed}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
