"use client";

import React from "react";
import {
  ShieldCheck,
  CheckCircle2,
  Stethoscope,
  Users,
  BarChart3,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { AuditCaseData } from "@/types/audit";

export type ActiveTab = "workstation" | "queue" | "analytics" | "policies";

interface HeaderProps {
  data: AuditCaseData;
  isMock: boolean;
  onToggleMock: () => void;
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
}

export const Header: React.FC<HeaderProps> = ({
  data,
  isMock,
  onToggleMock,
  activeTab,
  onSelectTab,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-2.5">
        {/* Brand & Project Info */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-700 to-blue-600 text-white shadow-md shadow-indigo-100">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-slate-900">
                MedAuth AI
              </h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-700 border border-indigo-200/60">
                <Sparkles className="h-3 w-3 text-indigo-500" />
                Track C1: The $15-an-Hour Expert
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Prior Authorization & Clinical Denial Appeals Copilot
            </p>
          </div>
        </div>

        {/* Multi-Page Navigation Tabs */}
        <nav className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 border border-slate-200">
          <button
            type="button"
            onClick={() => onSelectTab("workstation")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              activeTab === "workstation"
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Stethoscope className="h-3.5 w-3.5" />
            Clinical Workstation
          </button>

          <button
            type="button"
            onClick={() => onSelectTab("queue")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              activeTab === "queue"
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            Patient Queue
            <span className="ml-1 rounded-full bg-slate-200 px-1.5 py-0.2 text-[10px] text-slate-700">
              3
            </span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab("analytics")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              activeTab === "analytics"
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5" />
            ROI & Evals
          </button>

          <button
            type="button"
            onClick={() => onSelectTab("policies")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              activeTab === "policies"
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            Payer Guidelines
          </button>
        </nav>

        {/* Active Case Summary & Mode Switch */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="hidden xl:flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-1.5 border border-slate-200">
            <span className="text-slate-500 font-medium">Active:</span>
            <span className="font-semibold text-slate-800">
              {data.patient_name}
            </span>
            <span className="text-slate-400">({data.procedure.slice(0, 24)}...)</span>
          </div>

          <div
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border ${
              data.overall_status === "READY_FOR_APPEAL"
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-amber-50 text-amber-700 border-amber-200"
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            {data.overall_status.replace(/_/g, " ")}
          </div>

          {/* Mock Mode Switch */}
          <button
            type="button"
            onClick={onToggleMock}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition shadow-sm"
            title="Toggle between Mock Data and Live Gemini 3.8 Flash Backend"
          >
            <span
              className={`h-2 w-2 rounded-full ${
                isMock ? "bg-amber-500 animate-pulse" : "bg-emerald-500"
              }`}
            />
            {isMock ? "Mock Mode" : "Live Gemini 3.8"}
          </button>
        </div>
      </div>
    </header>
  );
};
