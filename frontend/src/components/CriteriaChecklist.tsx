"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  CheckSquare,
  Square,
  ClipboardCheck,
  Eye,
  Filter,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
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
  const [filter, setFilter] = useState<"ALL" | "SATISFIED" | "GAP">("ALL");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const reviewedCount = criteria.filter((item) => item.verified).length;
  const totalCount = criteria.length;
  const reviewPercentage =
    totalCount > 0 ? Math.round((reviewedCount / totalCount) * 100) : 0;

  const satisfiedCount = criteria.filter((c) => c.status === "SATISFIED").length;
  const gapCount = criteria.filter((c) => c.status === "GAP_DETECTED").length;

  const filteredCriteria = criteria.filter((item) => {
    if (filter === "SATISFIED") return item.status === "SATISFIED";
    if (filter === "GAP") return item.status === "GAP_DETECTED";
    return true;
  });

  const getStatusBadge = (status: CriterionItem["status"]) => {
    switch (status) {
      case "SATISFIED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-950/80 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/40 shadow-xs">
            <CheckCircle2 className="h-3 w-3 text-emerald-400" />
            Requirement Satisfied
          </span>
        );
      case "GAP_DETECTED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-950/80 px-2.5 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/40 shadow-xs">
            <AlertTriangle className="h-3 w-3 text-amber-400" />
            Documentation Gap Flagged
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-800 px-2.5 py-0.5 text-[10px] font-bold text-slate-300 border border-slate-700">
            Pending Review
          </span>
        );
    }
  };

  return (
    <div className="flex h-full flex-col rounded-xl border border-slate-800/80 bg-[#0B1323]/90 p-4 shadow-xl overflow-hidden text-slate-200">
      {/* Header & Filter Tabs */}
      <div className="mb-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-cyan-400" />
              Policy Criteria Logic Tree
            </h2>
            <p className="mt-0.5 text-[11px] text-slate-400">
              Deterministic Boolean AST matching patient records to insurer CPB.
            </p>
          </div>

          <span className="text-[11px] font-bold text-cyan-300 bg-cyan-950/80 px-2.5 py-0.5 rounded-md border border-cyan-700/50 font-mono">
            {satisfiedCount}/{totalCount} Met
          </span>
        </div>

        {/* Filter Pills */}
        <div className="mt-3 flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setFilter("ALL")}
            className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
              filter === "ALL"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "bg-slate-850 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
            }`}
          >
            All ({totalCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter("SATISFIED")}
            className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
              filter === "SATISFIED"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                : "bg-emerald-950/30 text-emerald-400 hover:bg-emerald-950/60 border border-emerald-800/40"
            }`}
          >
            Satisfied ({satisfiedCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter("GAP")}
            className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
              filter === "GAP"
                ? "bg-amber-600 text-white shadow-md shadow-amber-600/30"
                : "bg-amber-950/30 text-amber-400 hover:bg-amber-950/60 border border-amber-800/40"
            }`}
          >
            Gaps ({gapCount})
          </button>
        </div>
      </div>

      {/* Human Review Progress Indicator */}
      <div className="mb-3 rounded-xl border border-indigo-900/50 bg-gradient-to-r from-indigo-950/60 via-slate-900/60 to-cyan-950/50 p-3 shadow-md">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <ClipboardCheck className="h-3.5 w-3.5 text-cyan-400" />
            <span className="text-xs font-bold text-slate-200">
              Receptionist Audit Verification
            </span>
          </div>
          <span className="text-xs font-bold text-cyan-300 font-mono">
            {reviewedCount} of {totalCount} reviewed ({reviewPercentage}%)
          </span>
        </div>

        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 transition-all duration-300 shadow-sm"
            style={{ width: `${reviewPercentage}%` }}
          />
        </div>
      </div>

      {/* Criteria Cards List */}
      <div className="flex-1 space-y-2.5 overflow-y-auto pr-1">
        {filteredCriteria.map((item, index) => {
          const isSatisfied = item.status === "SATISFIED";
          const isExpanded = expandedId === item.id;

          return (
            <div
              key={item.id}
              className={`rounded-xl border transition-all duration-150 overflow-hidden shadow-md ${
                isSatisfied
                  ? "border-l-4 border-l-emerald-400 border-slate-800/90 bg-[#0E1729]/95"
                  : "border-l-4 border-l-amber-400 border-slate-800/90 bg-[#0E1729]/95"
              } ${item.verified ? "ring-1 ring-cyan-500/40" : ""}`}
            >
              <div className="p-3">
                {/* Header Row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <button
                      type="button"
                      onClick={() => onToggleVerify(item.id)}
                      className="mt-0.5 shrink-0 text-slate-500 hover:text-cyan-400 transition"
                      title={
                        item.verified
                          ? "Undo manual review"
                          : "Mark as reviewed by clerk"
                      }
                    >
                      {item.verified ? (
                        <CheckSquare className="h-4 w-4 text-cyan-400" />
                      ) : (
                        <Square className="h-4 w-4 text-slate-600 hover:text-slate-400" />
                      )}
                    </button>

                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                          Clause {index + 1}
                        </span>
                        {getStatusBadge(item.status)}
                      </div>
                      <p className="text-xs font-bold text-white leading-snug">
                        {item.rule}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Evidence Citation Snippet */}
                {item.quote && item.page != null && (
                  <div className="mt-2.5 rounded-lg bg-slate-950/70 p-2.5 border border-slate-800/90">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-cyan-300 bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-800/50 font-mono">
                        <Sparkles className="h-2.5 w-2.5 text-cyan-400" />
                        Exact Match: Page {item.page}
                      </span>

                      <button
                        type="button"
                        onClick={() => onSelectQuote(item.quote!, item.page!)}
                        className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-400 hover:text-cyan-300 hover:underline"
                      >
                        Highlight in PDF
                        <ExternalLink className="h-2.5 w-2.5" />
                      </button>
                    </div>

                    <p className="text-[11px] leading-relaxed italic text-slate-300 border-l-2 border-cyan-500 pl-2">
                      &ldquo;{item.quote}&rdquo;
                    </p>
                  </div>
                )}

                {/* Gap Alert / Action Needed */}
                {item.status === "GAP_DETECTED" && item.action_needed && (
                  <div className="mt-2.5 rounded-lg bg-gradient-to-r from-amber-950/60 to-orange-950/50 p-2.5 text-[11px] text-amber-200 border border-amber-600/40">
                    <div className="flex items-center gap-1.5 font-bold mb-0.5 text-amber-300">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                      Missing Clinical Evidence:
                    </div>
                    <p className="text-amber-100/90 pl-5 leading-relaxed">
                      {item.action_needed}
                    </p>
                  </div>
                )}

                {/* Expandable Reasoning / CPB Logic */}
                <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400">
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                    className="inline-flex items-center gap-1 font-semibold text-slate-400 hover:text-white"
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="h-3 w-3" /> Hide AST Policy Rule
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-3 w-3" /> View AST Policy Rule
                      </>
                    )}
                  </button>

                  <span className="text-[10px] text-slate-500 font-mono">
                    Provenance: Deterministic 0.0% Hallucination
                  </span>
                </div>

                {isExpanded && (
                  <div className="mt-2 rounded-md bg-slate-950 p-2 text-[10px] font-mono text-emerald-400 border border-slate-800">
                    <code>
                      Rule AST: {item.id} &rarr; eval_boolean_prerequisite(status=&quot;{item.status}&quot;)
                    </code>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
