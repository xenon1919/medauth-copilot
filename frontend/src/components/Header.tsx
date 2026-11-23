"use client";

import React from "react";
import { ShieldCheck, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { AuditCaseData } from "@/types/audit";

interface HeaderProps {
  data: AuditCaseData;
  isMock: boolean;
  onToggleMock: () => void;
}

export const Header: React.FC<HeaderProps> = ({ data, isMock, onToggleMock }) => {
  return (
    <header className="border-b border-slate-200 bg-white px-6 py-3 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Project Info */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-white shadow">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">MedAuth AI</h1>
              <span className="rounded bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 border border-indigo-200">
                Track C1: The $15-an-Hour Expert
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Prior Authorization & Clinical Denial Appeals Copilot
            </p>
          </div>
        </div>

        {/* Active Case Summary */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="rounded-md bg-slate-100 px-3 py-1.5 border border-slate-200">
            <span className="text-slate-500 font-medium">Patient:</span>{" "}
            <span className="font-semibold text-slate-800">{data.patient_name}</span>{" "}
            <span className="text-slate-400">({data.procedure})</span>
          </div>

          <div className="rounded-md bg-slate-100 px-3 py-1.5 border border-slate-200">
            <span className="text-slate-500 font-medium">Insurer:</span>{" "}
            <span className="font-semibold text-slate-800">{data.insurer}</span>
          </div>

          <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="h-3.5 w-3.5" />
            {data.overall_status.replace(/_/g, " ")}
          </div>

          {/* Mock Mode Switch */}
          <button
            onClick={onToggleMock}
            className="flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 transition"
            title="Click to toggle between Mock Data and Live Backend API"
          >
            <span className={`h-2 w-2 rounded-full ${isMock ? "bg-amber-500" : "bg-emerald-500"}`} />
            {isMock ? "Mock Mode (Active)" : "Live API"}
          </button>
        </div>
      </div>
    </header>
  );
};
