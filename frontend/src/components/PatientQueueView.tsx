"use client";

import React from "react";
import {
  Users,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Filter,
  PlusCircle,
  FileText,
} from "lucide-react";

interface PatientQueueProps {
  onSelectPatient: (caseKey: string) => void;
}

const QUEUE_ITEMS = [
  {
    key: "case_01",
    id: "AUTH-2026-9921",
    name: "Sarah Jenkins",
    dob: "1978-04-12 (Age 48)",
    specialty: "Orthopedic Spine",
    procedure: "Lumbar Spinal Fusion (CPT 22612)",
    insurer: "Aetna Commercial (CPB #0016)",
    status: "ACTION_REQUIRED",
    gap: "Missing 90-day dynamic flexion/extension X-Rays",
    turnaround: "42s",
    denialAmount: "$48,500",
    date: "2026-11-28",
  },
  {
    key: "case_02",
    id: "AUTH-2026-4491",
    name: "Marcus Vance",
    dob: "1982-08-24 (Age 44)",
    specialty: "Rheumatology Biologics",
    procedure: "Humira (Adalimumab 40mg, HCPCS J0135)",
    insurer: "UnitedHealthcare (Policy #042)",
    status: "READY_FOR_APPEAL",
    gap: "None • 100% Prerequisites Met",
    turnaround: "38s",
    denialAmount: "$7,200 / mo",
    date: "2026-11-27",
  },
  {
    key: "case_03",
    id: "AUTH-2026-6102",
    name: "David Chen",
    dob: "1965-11-03 (Age 61)",
    specialty: "Interventional Cardiology",
    procedure: "Left Heart Catheterization (CPT 93458)",
    insurer: "Cigna Healthcare (CPB #0189)",
    status: "ACTION_REQUIRED",
    gap: "Renal panel required within 30 days prior to radiocontrast",
    turnaround: "44s",
    denialAmount: "$14,800",
    date: "2026-11-26",
  },
  {
    key: "case_04",
    id: "AUTH-2026-8812",
    name: "Elena Rostova",
    dob: "1972-03-19 (Age 54)",
    specialty: "Neurology",
    procedure: "Cranial MRI with Contrast (CPT 70553)",
    insurer: "BlueCross BlueShield",
    status: "IN_REVIEW",
    gap: "Cross-referencing neurological exam findings",
    turnaround: "Processing...",
    denialAmount: "$3,400",
    date: "2026-11-28",
  },
];

export const PatientQueueView: React.FC<PatientQueueProps> = ({
  onSelectPatient,
}) => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700">
              <Users className="h-4 w-4" />
            </span>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Clinic Reception Prior Auth Queue
            </h2>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Real-time intake stream of denied or pending insurance authorizations managed by front-desk staff.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm"
          >
            <Filter className="h-3.5 w-3.5 text-slate-500" />
            Filter by Payer
          </button>
          <button
            type="button"
            onClick={() => onSelectPatient("case_01")}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 shadow-sm"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            New Patient Intake
          </button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Total Cases in Queue</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">4 Active</p>
          <p className="mt-1 text-xs text-indigo-600">3 Audited with Gemini 3.8 Flash</p>
        </div>

        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-sm">
          <p className="text-xs font-medium text-emerald-700">Ready for Immediate Appeal</p>
          <p className="mt-1 text-2xl font-bold text-emerald-800">1 Case</p>
          <p className="mt-1 text-xs text-emerald-600">100% criteria substantiated</p>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 shadow-sm">
          <p className="text-xs font-medium text-amber-700">Action Required (Gaps Flagged)</p>
          <p className="mt-1 text-2xl font-bold text-amber-800">2 Cases</p>
          <p className="mt-1 text-xs text-amber-600">Remedial orders drafted</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Total Claims Value at Risk</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">$73,900</p>
          <p className="mt-1 text-xs text-slate-400">Preventing permanent financial denial</p>
        </div>
      </div>

      {/* Queue Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50/75 text-xs font-semibold text-slate-600">
            <tr>
              <th scope="col" className="px-5 py-3.5">Patient & Auth ID</th>
              <th scope="col" className="px-5 py-3.5">Specialty & Procedure</th>
              <th scope="col" className="px-5 py-3.5">Payer Policy</th>
              <th scope="col" className="px-5 py-3.5">Copilot Audit Status</th>
              <th scope="col" className="px-5 py-3.5">Turnaround</th>
              <th scope="col" className="px-5 py-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {QUEUE_ITEMS.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/75 transition">
                <td className="px-5 py-4">
                  <div className="font-semibold text-slate-900">{item.name}</div>
                  <div className="text-xs text-slate-400 font-mono">{item.id} &bull; {item.dob}</div>
                </td>
                <td className="px-5 py-4">
                  <div className="font-medium text-slate-800">{item.procedure}</div>
                  <div className="text-xs text-indigo-600 font-medium">{item.specialty}</div>
                </td>
                <td className="px-5 py-4">
                  <div className="font-medium text-slate-800">{item.insurer}</div>
                  <div className="text-xs text-slate-400 font-medium">Claim Value: {item.denialAmount}</div>
                </td>
                <td className="px-5 py-4">
                  {item.status === "READY_FOR_APPEAL" ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="h-3 w-3" />
                      Ready for Appeal
                    </span>
                  ) : item.status === "ACTION_REQUIRED" ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 border border-amber-200">
                      <AlertTriangle className="h-3 w-3" />
                      Gap Flagged
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 border border-blue-200">
                      <Clock className="h-3 w-3" />
                      In Triage
                    </span>
                  )}
                  <div className="mt-1 text-[11px] text-slate-500 max-w-[220px] truncate" title={item.gap}>
                    {item.gap}
                  </div>
                </td>
                <td className="px-5 py-4 font-mono text-xs text-slate-500">
                  {item.turnaround}
                </td>
                <td className="px-5 py-4 text-right">
                  <button
                    type="button"
                    onClick={() => onSelectPatient(item.key)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-600 hover:text-white transition shadow-sm"
                  >
                    Open in Copilot
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
