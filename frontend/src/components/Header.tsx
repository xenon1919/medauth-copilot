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
  Building2,
  User,
  Radio,
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
    <header className="sticky top-0 z-40 border-b border-slate-200/80 glass-nav shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)]">
      {/* Top micro-bar for enterprise context */}
      <div className="hidden md:flex items-center justify-between px-6 py-1 border-b border-slate-100 bg-slate-50/60 text-[11px] text-slate-500 font-medium">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-slate-700">
            <Building2 className="h-3.5 w-3.5 text-indigo-600" />
            <strong className="font-semibold text-slate-800">St. Jude Orthopedic Center</strong> · Clinic Station #04
          </span>
          <span className="text-slate-300">|</span>
          <span className="flex items-center gap-1.5 text-slate-600">
            <User className="h-3.5 w-3.5 text-slate-400" />
            Receptionist: <span className="text-slate-800 font-semibold">Rishi R.</span> ($15/hr Front-Desk Role)
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
            <Radio className="h-3 w-3 text-emerald-500 animate-pulse" />
            Zero-Hallucination Guard: Active
          </span>
          <span className="text-slate-400">Payer Gateway: Connected</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-2.5">
        {/* Brand & Project Info */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-200/50">
            <ShieldCheck className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-tight text-slate-900 font-sans">
                MedAuth<span className="text-indigo-600">.ai</span>
              </h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-indigo-50 to-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-indigo-700 border border-indigo-200/60 shadow-xs">
                <Sparkles className="h-2.5 w-2.5 text-indigo-500" />
                Track C1 Challenge
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-500">
              Prior Authorization & Denial Appeals Copilot
            </p>
          </div>
        </div>

        {/* Multi-Page Navigation Tabs */}
        <nav className="flex items-center gap-1 rounded-xl bg-slate-100/80 p-1 border border-slate-200 shadow-inner">
          <button
            type="button"
            onClick={() => onSelectTab("workstation")}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all duration-150 ${
              activeTab === "workstation"
                ? "bg-white text-indigo-700 shadow-sm ring-1 ring-slate-200/50"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
            }`}
          >
            <Stethoscope className="h-3.5 w-3.5" />
            Clinical Workstation
          </button>

          <button
            type="button"
            onClick={() => onSelectTab("queue")}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all duration-150 ${
              activeTab === "queue"
                ? "bg-white text-indigo-700 shadow-sm ring-1 ring-slate-200/50"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            Patient Queue
            <span className="ml-1 rounded-full bg-indigo-100 px-1.5 py-0.2 text-[10px] font-bold text-indigo-700">
              4
            </span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab("analytics")}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all duration-150 ${
              activeTab === "analytics"
                ? "bg-white text-indigo-700 shadow-sm ring-1 ring-slate-200/50"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5" />
            ROI & Evals
            <span className="ml-1 rounded-full bg-emerald-100 px-1.5 py-0.2 text-[10px] font-bold text-emerald-800">
              10/10
            </span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab("policies")}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all duration-150 ${
              activeTab === "policies"
                ? "bg-white text-indigo-700 shadow-sm ring-1 ring-slate-200/50"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            Payer Guidelines
          </button>
        </nav>

        {/* Active Case Summary & Mode Switch */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="hidden xl:flex items-center gap-2.5 rounded-xl bg-slate-50/80 px-3 py-1.5 border border-slate-200/80 shadow-xs">
            <span className="text-slate-400 font-medium">Patient:</span>
            <span className="font-bold text-slate-800">
              {data.patient_name}
            </span>
            <span className="rounded-md bg-indigo-50 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-700">
              {data.specialty || "Spine"}
            </span>
          </div>

          <div
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold border transition ${
              data.overall_status === "READY_FOR_APPEAL"
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-amber-50 text-amber-800 border-amber-200"
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            {data.overall_status === "READY_FOR_APPEAL" ? "Ready for Appeal" : "Action Required"}
          </div>

          {/* Mock Mode Switch */}
          <button
            type="button"
            onClick={onToggleMock}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-xs"
            title="Toggle between Mock Data and Live Gemini 3.8 Flash Backend"
          >
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                isMock ? "bg-amber-400 animate-pulse" : "bg-emerald-500"
              }`}
            />
            {isMock ? "Mock Simulator" : "Live Gemini 3.8"}
          </button>
        </div>
      </div>
    </header>
  );
};
