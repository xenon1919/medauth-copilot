"use client";

import React, { useState } from "react";
import { Copy, Check, Download, Send, FileText } from "lucide-react";
import { AppealLetter } from "@/types/audit";

interface AppealLetterViewProps {
  appeal: AppealLetter;
}

export const AppealLetterView: React.FC<AppealLetterViewProps> = ({ appeal }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(appeal.body_markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm overflow-hidden">
      {/* Top Header & Actions */}
      <div className="mb-3 flex items-center justify-between border-b border-slate-200 pb-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900">CMS-Compliant Appeal Packet</h2>
          <p className="text-xs text-slate-500">Auto-synthesized with line-item citations</p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-sm"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? "Copied" : "Copy Text"}</span>
          </button>

          <button
            onClick={() => alert("Downloading signed clinical appeal packet PDF...")}
            className="inline-flex items-center gap-1 rounded-md bg-indigo-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-indigo-700 transition shadow-sm"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Appeal Letter Body */}
      <div className="flex-1 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-4 font-mono text-xs text-slate-800 leading-relaxed space-y-3">
        <div className="border-b border-slate-200 pb-2 text-[11px] text-slate-500 space-y-1">
          <div><strong className="text-slate-700">DATE:</strong> {appeal.date}</div>
          <div><strong className="text-slate-700">TO:</strong> {appeal.recipient.split("\n")[0]}</div>
          <div><strong className="text-slate-700">SUBJECT:</strong> {appeal.subject}</div>
        </div>

        <div className="whitespace-pre-wrap font-sans text-xs text-slate-800 leading-relaxed">
          {appeal.body_markdown}
        </div>
      </div>
    </div>
  );
};
