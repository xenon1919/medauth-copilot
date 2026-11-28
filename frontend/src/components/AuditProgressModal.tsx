"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, Loader2, Sparkles, ShieldCheck } from "lucide-react";

interface AuditProgressModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

const STEPS = [
  {
    title: "Document Ingestion & OCR Coordinate Mapping",
    detail: "PyMuPDF mapping word-level bounding boxes [x0, y0, x1, y1] across all uploaded pages...",
    duration: 600,
  },
  {
    title: "Gemini 3.8 Flash Policy AST Deconstruction",
    detail: "Decomposing insurer Clinical Policy Bulletin into deterministic Boolean criteria rules...",
    duration: 800,
  },
  {
    title: "Zero-Hallucination Quote Verifier Gatekeeper",
    detail: "Cross-referencing extracted clinical quotes verbatim against raw source text...",
    duration: 700,
  },
  {
    title: "CMS-Compliant Appeal Letter Compilation",
    detail: "Drafting formal medical necessity substantiation packet with exact page & line anchors...",
    duration: 500,
  },
];

export const AuditProgressModal: React.FC<AuditProgressModalProps> = ({
  isOpen,
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      return;
    }

    let accumulatedTime = 0;
    const timers: NodeJS.Timeout[] = [];

    STEPS.forEach((step, index) => {
      accumulatedTime += step.duration;
      const t = setTimeout(() => {
        setCurrentStep(index + 1);
        if (index === STEPS.length - 1) {
          setTimeout(() => {
            onComplete();
          }, 400);
        }
      }, accumulatedTime);
      timers.push(t);
    });

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [isOpen, onComplete]);

  if (!isOpen) return null;

  const progressPercent = Math.min(100, Math.round((currentStep / STEPS.length) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-lg rounded-2xl bg-[#0F172A] p-6 shadow-2xl border border-slate-700 animate-in fade-in zoom-in-95 duration-200 text-slate-100">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-lg shadow-indigo-600/30">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              Running Gemini 3.8 Flash Clinical Audit
            </h3>
            <p className="text-xs text-slate-400">
              Zero-Hallucination Verification in Progress
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-5">
          <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5 font-mono">
            <span>Audit Progress</span>
            <span className="text-cyan-400 font-bold">{progressPercent}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 transition-all duration-300 shadow-sm"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Step List */}
        <div className="mt-6 space-y-3">
          {STEPS.map((step, idx) => {
            const isFinished = currentStep > idx;
            const isCurrent = currentStep === idx;

            return (
              <div
                key={idx}
                className={`flex items-start gap-3 rounded-xl p-3 border transition ${
                  isFinished
                    ? "border-emerald-500/40 bg-emerald-950/40 text-emerald-200"
                    : isCurrent
                    ? "border-cyan-500/50 bg-cyan-950/40 text-white ring-2 ring-cyan-500/20"
                    : "border-slate-800 bg-slate-900/50 text-slate-500 opacity-60"
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isFinished ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  ) : isCurrent ? (
                    <Loader2 className="h-5 w-5 animate-spin text-cyan-400" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-500 font-mono">
                      {idx + 1}
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold leading-tight">
                    {step.title}
                  </p>
                  <p className="mt-0.5 text-[11px] leading-snug opacity-80 text-slate-400">
                    {step.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
