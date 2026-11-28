
"use client";

import React, { useEffect, useState } from "react";
import {
  Copy,
  Check,
  Download,
  FileText,
  Pencil,
  Eye,
  Sparkles,
  Printer,
  ShieldCheck,
  Stamp,
  Table,
} from "lucide-react";
import { AppealLetter } from "@/types/audit";

interface AppealLetterViewProps {
  appeal: AppealLetter;
  onGenerateDraft?: () => string;
}

export const AppealLetterView: React.FC<AppealLetterViewProps> = ({
  appeal,
  onGenerateDraft,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"LETTER" | "CITATIONS">(
    "LETTER"
  );
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [body, setBody] = useState(appeal.body_markdown);

  // Synchronize the editable draft whenever the selected appeal changes.
  useEffect(() => {
    setBody(appeal.body_markdown);
    setEditing(false);
    setCopied(false);
  }, [appeal.body_markdown]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(body);
      setCopied(true);

      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("Unable to copy. Please copy the text manually.");
    }
  };

  const handleDownload = () => {
    const letter = `DATE: ${appeal.date}
TO: ${appeal.recipient}
SUBJECT: ${appeal.subject}

${body}

Attending Physician Attestation:
Dr. Robert Vance, MD | Orthopedic Spine Surgery
NPI: 1982736412 | License: TX-M89124`;

    const blob = new Blob([letter], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `MedAuth_Appeal_${appeal.date.replace(/-/g, "")}.txt`;
    link.click();

    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleGenerate = () => {
    if (!onGenerateDraft) return;

    const generated = onGenerateDraft();

    if (generated.trim()) {
      setBody(generated);
      setEditing(true);
    }
  };

  return (
    <div className="flex h-full flex-col rounded-xl border border-slate-800/80 bg-[#0B1323]/90 p-4 shadow-xl overflow-hidden text-slate-200">
      {/* Header Toolbar */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-1.5">
            <h2 className="text-sm font-bold text-white tracking-tight">
              CMS Medical Necessity Packet
            </h2>

            <span className="rounded-full bg-emerald-950/80 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/40">
              CMS-10702 Format
            </span>
          </div>

          <p className="text-[11px] text-slate-400">
            Appeal draft based on available clinical documentation
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs font-semibold text-slate-200 hover:bg-slate-800 transition shadow-xs"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-emerald-400" />
            ) : (
              <Copy className="h-3.5 w-3.5 text-slate-400" />
            )}
            {copied ? "Copied" : "Copy"}
          </button>

          <button
            type="button"
            onClick={() => setEditing(!editing)}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs font-semibold text-slate-200 hover:bg-slate-800 transition shadow-xs"
          >
            {editing ? (
              <Eye className="h-3.5 w-3.5 text-cyan-400" />
            ) : (
              <Pencil className="h-3.5 w-3.5 text-cyan-400" />
            )}
            {editing ? "Preview" : "Edit"}
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-2.5 py-1 text-xs font-bold text-white hover:bg-indigo-500 transition shadow-md shadow-indigo-600/30"
          >
            <Download className="h-3.5 w-3.5" />
            Export
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition shadow-xs"
            title="Print Packet"
          >
            <Printer className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Sub-tab Switcher */}
      <div className="mb-3 flex items-center gap-1 rounded-lg bg-[#070D18] p-0.5 text-xs font-semibold border border-slate-800">
        <button
          type="button"
          onClick={() => setActiveSubTab("LETTER")}
          className={`flex-1 flex items-center justify-center gap-1.5 rounded-md py-1 transition ${
            activeSubTab === "LETTER"
              ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md font-bold"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <FileText className="h-3.5 w-3.5" />
          Formal Appeal Letter
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("CITATIONS")}
          className={`flex-1 flex items-center justify-center gap-1.5 rounded-md py-1 transition ${
            activeSubTab === "CITATIONS"
              ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md font-bold"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Table className="h-3.5 w-3.5" />
          Citations Table
        </button>
      </div>

      {/* Main Letter Canvas */}
      <div className="flex-1 overflow-y-auto rounded-xl border border-slate-800 bg-[#080E1C] shadow-inner p-5 font-sans text-slate-200">
        {activeSubTab === "LETTER" ? (
          <div>
            {/* Formal Stationery Header */}
            <div className="border-b-2 border-indigo-500/40 pb-4 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-white">
                    Memorial Hermann Health System
                  </h3>

                  <p className="text-[11px] text-cyan-300 font-medium">
                    Department of Orthopedic Surgery & Spinal Disorders
                  </p>

                  <p className="text-[10px] text-slate-400 font-mono">
                    6411 Fannin St, Houston, TX 77030 · Clinical Desk: (713) 704-4000
                  </p>
                </div>

                <div className="text-right">
                  <span className="inline-block rounded border border-rose-500/40 bg-rose-950/80 px-2 py-0.5 text-[10px] font-bold text-rose-300 shadow-xs">
                    EXPEDITED CLINICAL RE-REVIEW
                  </span>

                  <p className="text-[10px] text-slate-400 mt-1 font-mono">
                    Date: {appeal.date}
                  </p>
                </div>
              </div>
            </div>

            {/* Recipient & Subject */}
            <div className="mb-4 text-xs bg-slate-900/90 p-3 rounded-lg border border-slate-800 space-y-1">
              <div>
                <strong className="text-cyan-400 font-semibold">TO:</strong>{" "}
                {appeal.recipient}
              </div>

              <div>
                <strong className="text-cyan-400 font-semibold">RE:</strong>{" "}
                {appeal.subject}
              </div>
            </div>

            {/* Editable or Formatted Body */}
            {editing ? (
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="min-h-[420px] w-full resize-y rounded-lg border border-indigo-500/50 bg-slate-950 p-4 font-sans text-xs text-slate-100 leading-relaxed outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-900/50 font-mono"
                placeholder="Write or edit appeal letter..."
              />
            ) : (
              <div className="whitespace-pre-wrap font-sans text-xs text-slate-200 leading-relaxed space-y-2">
                {body}
              </div>
            )}

            {/* Physician Sign-off */}
            <div className="mt-8 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-400">
                    Respectfully submitted,
                  </p>

                  <p className="mt-2 text-xs font-bold text-white">
                    Robert Vance, M.D., FAAOS
                  </p>

                  <p className="text-[10px] text-slate-400">
                    Board-Certified Orthopedic Spine Surgeon
                  </p>

                  <p className="text-[10px] text-slate-500 font-mono">
                    NPI: 1982736412 · State License: TX-M89124
                  </p>
                </div>

                <div className="flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-950/60 p-2 text-emerald-300 text-[10px] font-semibold">
                  <Stamp className="h-5 w-5 text-emerald-400 shrink-0" />
                  <span>
                    Attestation Placeholder — Requires Physician Review
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Citations Table */
          <div className="text-xs space-y-3">
            <h4 className="font-bold text-white">
              Citation Evidentiary Provenance
            </h4>

            <p className="text-[11px] text-slate-400">
              Citation information should be verified against the original
              clinical records and payer policy before submission.
            </p>

            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
              <div className="flex items-start gap-2">
                <Sparkles className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />

                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Citation details for this appeal are not exposed through
                  the current AppealLetter component data. They must be
                  connected to the actual evidence source before this
                  table can display case-specific citation records.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Safety Notice */}
      <div className="mt-3 flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/60 p-2 text-[11px] text-slate-400">
        <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />

        <span>
          Appeal drafts require clinical review. Verify all claims against
          the original documentation before submission.
        </span>
      </div>
    </div>
  );
};
