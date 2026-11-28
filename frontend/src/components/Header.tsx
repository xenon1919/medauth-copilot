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
    <header className="sticky top-0 z-40 border-b border-slate-800/80 glass-nav shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      {/* Top micro-bar for enterprise context */}
      <div className="hidden md:flex items-center justify-between px-6 py-1.5 border-b border-slate-800/60 bg-[#060A13]/90 text-[11px] text-slate-400 font-medium">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-slate-300">
            <Building2 className="h-3.5 w-3.5 text-indigo-400" />
            <strong className="font-semibold text-white">St. Jude Orthopedic Center</strong>
            <span className="text-slate-500">· Clinic Station #04</span>
          </span>
          <span className="text-slate-700">|</span>
          <span className="flex items-center gap-1.5 text-slate-300">
            <User className="h-3.5 w-3.5 text-cyan-400" />
            Receptionist: <span className="text-cyan-300 font-semibold">Rishi R.</span>
            <span className="rounded bg-indigo-950/80 border border-indigo-700/50 px-1.5 py-0.2 text-[10px] text-indigo-300 font-bold ml-1">
              $15/hr Front-Desk Role
            </span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-emerald-300 font-semibold bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
            <Radio className="h-3 w-3 text-emerald-400 animate-pulse" />
            Zero-Hallucination Guard: Active
          </span>
          <span className="text-slate-400 font-mono text-[10px]">Payer Gateway: Connected</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-2.5">
        {/* Brand & Project Info */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-500 text-white shadow-lg shadow-indigo-500/30">
            <ShieldCheck className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400 border-2 border-slate-900"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-tight text-white font-sans">
                MedAuth<span className="text-cyan-400">.ai</span>
              </h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-950/80 px-2.5 py-0.5 text-[10px] font-bold text-indigo-300 border border-indigo-700/60 shadow-xs">
                <Sparkles className="h-2.5 w-2.5 text-cyan-400" />
                Track C1 Challenge
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-400">
              Prior Authorization & Denial Appeals Copilot
            </p>
          </div>
        </div>

        {/* Multi-Page Navigation Tabs */}
        <nav className="flex items-center gap-1 rounded-xl bg-[#0F172A] p-1 border border-slate-800 shadow-inner">
          <button
            type="button"
            onClick={() => onSelectTab("workstation")}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all duration-150 ${
              activeTab === "workstation"
                ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-500/30"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
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
                ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-500/30"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            Patient Queue
            <span className="ml-1 rounded-full bg-cyan-950 px-1.5 py-0.2 text-[10px] font-bold text-cyan-300 border border-cyan-800/50">
              4
            </span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab("analytics")}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all duration-150 ${
              activeTab === "analytics"
                ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-500/30"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5" />
            ROI & Evals
            <span className="ml-1 rounded-full bg-emerald-950 px-1.5 py-0.2 text-[10px] font-bold text-emerald-300 border border-emerald-800/50">
              10/10
            </span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab("policies")}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all duration-150 ${
              activeTab === "policies"
                ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-500/30"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            Payer Guidelines
          </button>
        </nav>

        {/* Active Case Summary & Mode Switch */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="hidden xl:flex items-center gap-2.5 rounded-xl bg-slate-900/90 px-3 py-1.5 border border-slate-800 shadow-xs">
            <span className="text-slate-400 font-medium">Patient:</span>
            <span className="font-bold text-white">
              {data.patient_name}
            </span>
            <span className="rounded-md bg-indigo-950/80 px-1.5 py-0.5 text-[10px] font-semibold text-cyan-300 border border-indigo-700/50">
              {data.specialty || "Spine"}
            </span>
          </div>

          <div
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold border transition ${
              data.overall_status === "READY_FOR_APPEAL"
                ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/40"
                : "bg-amber-950/80 text-amber-300 border-amber-500/40"
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            {data.overall_status === "READY_FOR_APPEAL" ? "Ready for Appeal" : "Action Required"}
          </div>

          {/* Mock Mode Switch */}
          <button
            type="button"
            onClick={onToggleMock}
            className="flex items-center gap-2 rounded-xl border border-slate-800 bg-[#0F172A] px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition shadow-xs"
            title="Toggle between Mock Data and Live Gemini 3.8 Flash Backend"
          >
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                isMock ? "bg-amber-400 animate-pulse" : "bg-emerald-400"
              }`}
            />
            {isMock ? "Mock Simulator" : "Live Gemini 3.8"}
          </button>
        </div>
      </div>
    </header>
  );
};
