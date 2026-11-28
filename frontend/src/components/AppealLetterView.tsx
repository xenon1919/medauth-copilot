
"use client";

import React, { useState } from "react";
import {
  Copy,
  Check,
  Download,
  FileText,
  Pencil,
  Eye,
  Sparkles,
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
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [body, setBody] = useState(appeal.body_markdown);

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
    const letter = `DATE: ${appeal.date}\nTO: ${appeal.recipient}\nSUBJECT: ${appeal.subject}\n\n${body}`;

    const blob = new Blob([letter], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "MedAuth_Appeal_Draft.txt";
    link.click();

    URL.revokeObjectURL(url);
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
    <div className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm overflow-hidden">

      {/* Header */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900">
            Appeal Letter Draft
          </h2>
          <p className="text-xs text-slate-500">
            Evidence-assisted draft · Human review required
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">

          {/* Generate */}
          <button
            onClick={handleGenerate}
            disabled={!onGenerateDraft}
            className="inline-flex items-center gap-1 rounded-md bg-indigo-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 transition"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Generate Draft
          </button>

          {/* Edit / Preview */}
          <button
            onClick={() => setEditing(!editing)}
            className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            {editing ? (
              <Eye className="h-3.5 w-3.5" />
            ) : (
              <Pencil className="h-3.5 w-3.5" />
            )}
            {editing ? "Preview" : "Edit"}
          </button>

          {/* Copy */}
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-emerald-600" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
            {copied ? "Copied" : "Copy"}
          </button>

          {/* Download */}
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-1 rounded-md bg-slate-800 px-2.5 py-1 text-xs font-semibold text-white hover:bg-slate-900 transition"
          >
            <Download className="h-3.5 w-3.5" />
            Download
          </button>
        </div>
      </div>

      {/* Letter Content */}
      <div className="flex-1 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-4">

        {/* Metadata */}
        <div className="mb-4 border-b border-slate-200 pb-3 text-xs text-slate-500 space-y-2">
          <div>
            <strong className="text-slate-700">DATE:</strong>{" "}
            {appeal.date}
          </div>

          <div>
            <strong className="text-slate-700">TO:</strong>{" "}
            {appeal.recipient}
          </div>

          <div>
            <strong className="text-slate-700">SUBJECT:</strong>{" "}
            {appeal.subject}
          </div>
        </div>

        {/* Editable Letter */}
        {editing ? (
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="min-h-[400px] w-full resize-y rounded-lg border border-indigo-200 bg-white p-4 font-sans text-sm text-slate-800 leading-relaxed outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            placeholder="Write or edit your appeal letter..."
          />
        ) : (
          <div className="whitespace-pre-wrap font-sans text-sm text-slate-800 leading-relaxed">
            {body}
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="mt-3 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
        <FileText className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />

        <p className="text-xs leading-relaxed text-amber-800">
          Draft assembled from available case information and
          retrieved document excerpts. Verify every statement,
          citation and applicable policy requirement. Obtain
          authorized human review before submission. This tool
          does not determine medical necessity or coverage.
        </p>
      </div>
    </div>
  );
};
