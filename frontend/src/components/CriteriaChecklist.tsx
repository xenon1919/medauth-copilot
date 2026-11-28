
"use client";

import React from "react";
import {
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  CheckSquare,
  Square,
  ClipboardCheck,
  Eye,
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
  const reviewedCount = criteria.filter(
    (item) => item.verified
  ).length;

  const totalCount = criteria.length;

  const reviewPercentage =
    totalCount > 0
      ? Math.round((reviewedCount / totalCount) * 100)
      : 0;

  const getStatusLabel = (status: CriterionItem["status"]) => {
    switch (status) {
      case "SATISFIED":
        return "Potentially supported";
      case "UNMET":
        return "Not marked as met";
      case "GAP_DETECTED":
        return "Documentation gap flagged";
      default:
        return "Needs review";
    }
  };

  const getStatusStyle = (status: CriterionItem["status"]) => {
    switch (status) {
      case "SATISFIED":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "UNMET":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "GAP_DETECTED":
        return "bg-orange-50 text-orange-700 border-orange-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-sm font-bold text-slate-900">
          Policy Criteria Review
        </h2>

        <p className="mt-1 text-xs text-slate-500">
          Review documentation associated with each policy criterion.
        </p>
      </div>

      {/* Review Progress */}
      <div className="mb-4 rounded-lg border border-indigo-100 bg-indigo-50/50 p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4 text-indigo-600" />

            <span className="text-xs font-semibold text-slate-800">
              Human review progress
            </span>
          </div>

          <span className="text-xs font-bold text-indigo-700">
            {reviewedCount}/{totalCount}
          </span>
        </div>

        <div className="h-2 w-full overflow-hidden rounded-full bg-indigo-100">
          <div
            className="h-full rounded-full bg-indigo-600 transition-all duration-300"
            style={{ width: `${reviewPercentage}%` }}
          />
        </div>

        <p className="mt-2 text-[11px] text-slate-600">
          {reviewedCount === totalCount && totalCount > 0
            ? "All criteria have been manually marked as reviewed."
            : `${totalCount - reviewedCount} criteria remaining for human review.`}
        </p>
      </div>

      {/* Safety Context */}
      <div className="mb-3 rounded-lg border border-slate-200 bg-slate-50 p-2.5">
        <p className="text-[11px] leading-relaxed text-slate-600">
          Evidence indicators are preliminary. A manual review
          checkbox records that a reviewer inspected the criterion;
          it does not confirm medical necessity or coverage.
        </p>
      </div>

      {/* Criteria Cards */}
      <div className="flex-1 space-y-3 overflow-y-auto pr-1">
        {criteria.map((item) => (
          <div
            key={item.id}
            className={`rounded-lg border p-3 transition ${
              item.verified
                ? "border-indigo-200 bg-indigo-50/30"
                : "border-slate-200 bg-white"
            }`}
          >
            {/* Criterion Heading */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2 min-w-0">
                <button
                  onClick={() => onToggleVerify(item.id)}
                  className="mt-0.5 shrink-0 text-slate-400 hover:text-indigo-600 transition"
                  title={
                    item.verified
                      ? "Undo manual review"
                      : "Mark as manually reviewed"
                  }
                >
                  {item.verified ? (
                    <CheckSquare className="h-4 w-4 text-indigo-600" />
                  ) : (
                    <Square className="h-4 w-4" />
                  )}
                </button>

                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-800 leading-snug">
                    {item.rule}
                  </p>
                </div>
              </div>
            </div>

            {/* Preliminary Status */}
            <div className="mt-3 flex flex-wrap gap-2">
              <span
                className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-bold ${getStatusStyle(
                  item.status
                )}`}
              >
                <AlertTriangle className="h-3 w-3" />
                {getStatusLabel(item.status)}
              </span>

              {/* Human Review Status */}
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold ${
                  item.verified
                    ? "bg-indigo-100 text-indigo-700"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {item.verified ? (
                  <CheckCircle2 className="h-3 w-3" />
                ) : (
                  <Eye className="h-3 w-3" />
                )}

                {item.verified
                  ? "Human review recorded"
                  : "Pending human review"}
              </span>
            </div>

            {/* Evidence Citation */}
            {item.quote && item.page != null && (
              <div className="mt-3 rounded-lg bg-white p-3 border border-slate-200">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                    Source excerpt · Page {item.page}
                  </span>

                  <button
                    onClick={() =>
                      onSelectQuote(item.quote!, item.page!)
                    }
                    className="inline-flex items-center gap-1 text-[10px] font-semibold text-indigo-600 hover:underline"
                  >
                    View in PDF
                    <ExternalLink className="h-2.5 w-2.5" />
                  </button>
                </div>

                <p className="text-[11px] leading-relaxed italic text-slate-700">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>
            )}

            {/* No Citation Warning */}
            {!item.quote && (
              <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-2.5">
                <p className="text-[11px] text-slate-600">
                  No citation is currently attached to this criterion
                  in the checklist.
                </p>
              </div>
            )}

            {/* Gap Alert */}
            {item.status === "GAP_DETECTED" &&
              item.action_needed && (
                <div className="mt-3 rounded-lg bg-amber-50 p-3 text-[11px] text-amber-900 border border-amber-200">
                  <span className="font-bold">
                    Documentation review prompt:
                  </span>{" "}
                  {item.action_needed}
                </div>
              )}

            {/* Human Review Action */}
            <button
              onClick={() => onToggleVerify(item.id)}
              className={`mt-3 flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                item.verified
                  ? "border border-indigo-200 bg-white text-indigo-700 hover:bg-indigo-50"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              {item.verified ? (
                <>
                  <CheckSquare className="h-3.5 w-3.5" />
                  Undo review
                </>
              ) : (
                <>
                  <ClipboardCheck className="h-3.5 w-3.5" />
                  Mark as reviewed
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
