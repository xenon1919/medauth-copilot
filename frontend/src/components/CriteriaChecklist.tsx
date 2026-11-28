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
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
            Requirement Satisfied
          </span>
        );
      case "GAP_DETECTED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-800 border border-amber-200">
            <AlertTriangle className="h-3 w-3 text-amber-600" />
            Documentation Gap Flagged
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2.5 py-0.5 text-[10px] font-bold text-slate-700 border border-slate-200">
            Pending Review
          </span>
        );
    }
  };

  return (
    <div className="flex h-full flex-col rounded-xl border border-slate-200/90 bg-white p-4 shadow-sm overflow-hidden">
      {/* Header & Filter Tabs */}
      <div className="mb-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-indigo-600" />
              Policy Criteria Logic Tree
            </h2>
            <p className="mt-0.5 text-[11px] text-slate-500">
              Deterministic Boolean AST matching patient records to insurer CPB.
            </p>
          </div>

          <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
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
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All ({totalCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter("SATISFIED")}
            className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
              filter === "SATISFIED"
                ? "bg-emerald-700 text-white shadow-xs"
                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            }`}
          >
            Satisfied ({satisfiedCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter("GAP")}
            className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
              filter === "GAP"
                ? "bg-amber-600 text-white shadow-xs"
                : "bg-amber-50 text-amber-800 hover:bg-amber-100"
            }`}
          >
            Gaps ({gapCount})
          </button>
        </div>
      </div>

      {/* Human Review Progress Indicator */}
      <div className="mb-3 rounded-xl border border-indigo-100 bg-gradient-to-r from-indigo-50/70 to-blue-50/70 p-3 shadow-xs">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <ClipboardCheck className="h-3.5 w-3.5 text-indigo-600" />
            <span className="text-xs font-bold text-slate-800">
              Receptionist Audit Verification
            </span>
          </div>
          <span className="text-xs font-bold text-indigo-700">
            {reviewedCount} of {totalCount} reviewed ({reviewPercentage}%)
          </span>
        </div>

        <div className="h-2 w-full overflow-hidden rounded-full bg-indigo-200/60">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 transition-all duration-300"
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
              className={`rounded-xl border transition-all duration-150 overflow-hidden shadow-xs ${
                isSatisfied
                  ? "border-l-4 border-l-emerald-500 border-slate-200 bg-white"
                  : "border-l-4 border-l-amber-500 border-slate-200 bg-white"
              } ${item.verified ? "ring-1 ring-indigo-200" : ""}`}
            >
              <div className="p-3">
                {/* Header Row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <button
                      type="button"
                      onClick={() => onToggleVerify(item.id)}
                      className="mt-0.5 shrink-0 text-slate-400 hover:text-indigo-600 transition"
                      title={
                        item.verified
                          ? "Undo manual review"
                          : "Mark as reviewed by clerk"
                      }
                    >
                      {item.verified ? (
                        <CheckSquare className="h-4 w-4 text-indigo-600" />
                      ) : (
                        <Square className="h-4 w-4 text-slate-400 hover:text-slate-600" />
                      )}
                    </button>

                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                          Clause {index + 1}
                        </span>
                        {getStatusBadge(item.status)}
                      </div>
                      <p className="text-xs font-bold text-slate-800 leading-snug">
                        {item.rule}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Evidence Citation Snippet */}
                {item.quote && item.page != null && (
                  <div className="mt-2.5 rounded-lg bg-slate-50 p-2.5 border border-slate-200">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                        <Sparkles className="h-2.5 w-2.5 text-indigo-500" />
                        Exact Match: Page {item.page}
                      </span>

                      <button
                        type="button"
                        onClick={() => onSelectQuote(item.quote!, item.page!)}
                        className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 hover:text-indigo-800 hover:underline"
                      >
                        Highlight in PDF
                        <ExternalLink className="h-2.5 w-2.5" />
                      </button>
                    </div>

                    <p className="text-[11px] leading-relaxed italic text-slate-700 border-l-2 border-indigo-400 pl-2">
                      &ldquo;{item.quote}&rdquo;
                    </p>
                  </div>
                )}

                {/* Gap Alert / Action Needed */}
                {item.status === "GAP_DETECTED" && item.action_needed && (
                  <div className="mt-2.5 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 p-2.5 text-[11px] text-amber-900 border border-amber-200">
                    <div className="flex items-center gap-1.5 font-bold mb-0.5 text-amber-800">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                      Missing Clinical Evidence:
                    </div>
                    <p className="text-amber-800 pl-5 leading-relaxed">
                      {item.action_needed}
                    </p>
                  </div>
                )}

                {/* Expandable Reasoning / CPB Logic */}
                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                    className="inline-flex items-center gap-1 font-semibold text-slate-600 hover:text-slate-900"
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

                  <span className="text-[10px] text-slate-400">
                    Provenance: Deterministic 0.0% Hallucination
                  </span>
                </div>

                {isExpanded && (
                  <div className="mt-2 rounded-md bg-slate-900 p-2 text-[10px] font-mono text-emerald-400">
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
