"use client";

import React, { useState } from "react";
import {
  Users,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Filter,
  PlusCircle,
  FileText,
  Search,
  DollarSign,
  TrendingDown,
  ShieldCheck,
  ChevronRight,
  X,
  Sparkles,
} from "lucide-react";

interface PatientQueueProps {
  onSelectPatient: (caseKey: string) => void;
}

const QUEUE_ITEMS = [
  {
    key: "case_01",
    id: "AUTH-2026-9921",
    name: "Sarah Jenkins",
    initials: "SJ",
    dob: "1978-04-12 (Age 48)",
    specialty: "Orthopedic Spine",
    procedure: "Lumbar Spinal Fusion (CPT 22612)",
    insurer: "Aetna Commercial (CPB #0016)",
    status: "ACTION_REQUIRED",
    gap: "Missing 90-day dynamic flexion/extension X-Rays",
    turnaround: "42s",
    denialAmount: "$48,500",
    date: "2026-11-28",
    urgent: true,
  },
  {
    key: "case_02",
    id: "AUTH-2026-4491",
    name: "Marcus Vance",
    initials: "MV",
    dob: "1982-08-24 (Age 44)",
    specialty: "Rheumatology Biologics",
    procedure: "Humira (Adalimumab 40mg, HCPCS J0135)",
    insurer: "UnitedHealthcare (Policy #042)",
    status: "READY_FOR_APPEAL",
    gap: "None • 100% Prerequisites Met",
    turnaround: "38s",
    denialAmount: "$7,200 / mo",
    date: "2026-11-27",
    urgent: false,
  },
  {
    key: "case_03",
    id: "AUTH-2026-6102",
    name: "David Chen",
    initials: "DC",
    dob: "1965-11-03 (Age 61)",
    specialty: "Interventional Cardiology",
    procedure: "Left Heart Catheterization (CPT 93458)",
    insurer: "Cigna Healthcare (CPB #0189)",
    status: "ACTION_REQUIRED",
    gap: "Renal panel required within 30 days prior to radiocontrast",
    turnaround: "44s",
    denialAmount: "$14,800",
    date: "2026-11-26",
    urgent: true,
  },
  {
    key: "case_04",
    id: "AUTH-2026-8812",
    name: "Elena Rostova",
    initials: "ER",
    dob: "1972-03-19 (Age 54)",
    specialty: "Neurology",
    procedure: "Cranial MRI with Contrast (CPT 70553)",
    insurer: "BlueCross BlueShield",
    status: "IN_REVIEW",
    gap: "Cross-referencing neurological exam findings",
    turnaround: "Processing...",
    denialAmount: "$3,400",
    date: "2026-11-28",
    urgent: false,
  },
];

export const PatientQueueView: React.FC<PatientQueueProps> = ({
  onSelectPatient,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [showNewIntakeModal, setShowNewIntakeModal] = useState(false);
  const [newPatientName, setNewPatientName] = useState("");
  const [newProcedure, setNewProcedure] = useState("Lumbar Spinal Fusion");

  const filteredItems = QUEUE_ITEMS.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.procedure.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.insurer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === "ALL") return matchesSearch;
    return matchesSearch && item.status === statusFilter;
  });

  const handleCreateIntake = (e: React.FormEvent) => {
    e.preventDefault();
    setShowNewIntakeModal(false);
    onSelectPatient("case_01");
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700 shadow-xs">
              <Users className="h-5 w-5" />
            </span>
            <h2 className="text-xl font-black tracking-tight text-slate-900">
              Clinic Reception Prior Auth Queue
            </h2>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Real-time intake stream of denied or pending insurance authorizations managed by front-desk staff.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search claims, patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-56 rounded-xl border border-slate-300 pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none shadow-xs"
            />
          </div>

          <button
            type="button"
            onClick={() => setShowNewIntakeModal(true)}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 shadow-sm transition"
          >
            <PlusCircle className="h-4 w-4" />
            New Patient Intake
          </button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Value at Risk</span>
            <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-700 border border-red-100">
              Immediate Impact
            </span>
          </div>
          <p className="mt-2 text-2xl font-black tracking-tight text-slate-900">$73,900</p>
          <p className="mt-0.5 text-xs text-slate-400">Total denied claims in active queue</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Average Latency</span>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-100">
              -98.4%
            </span>
          </div>
          <p className="mt-2 text-2xl font-black tracking-tight text-slate-900">41.3s</p>
          <p className="mt-0.5 text-xs text-slate-400">AI audit turnaround vs 45m human</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Action Required</span>
            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-100">
              2 Cases
            </span>
          </div>
          <p className="mt-2 text-2xl font-black tracking-tight text-slate-900">2 Patients</p>
          <p className="mt-0.5 text-xs text-slate-400">Missing dynamic X-ray or renal panel</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Ready for Appeal</span>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-100">
              100% Grounded
            </span>
          </div>
          <p className="mt-2 text-2xl font-black tracking-tight text-emerald-700">1 Case ($7.2k)</p>
          <p className="mt-0.5 text-xs text-slate-400">Marcus Vance · Ready for CMS export</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setStatusFilter("ALL")}
          className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
            statusFilter === "ALL"
              ? "bg-slate-900 text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
          }`}
        >
          All Cases (4)
        </button>
        <button
          type="button"
          onClick={() => setStatusFilter("ACTION_REQUIRED")}
          className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
            statusFilter === "ACTION_REQUIRED"
              ? "bg-amber-600 text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
          }`}
        >
          Action Required (2)
        </button>
        <button
          type="button"
          onClick={() => setStatusFilter("READY_FOR_APPEAL")}
          className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
            statusFilter === "READY_FOR_APPEAL"
              ? "bg-emerald-600 text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
          }`}
        >
          Ready for Appeal (1)
        </button>
      </div>

      {/* Queue Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
          <thead className="bg-slate-50/75 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="px-5 py-3.5">Patient / Claim ID</th>
              <th className="px-5 py-3.5">Clinical Specialty & Procedure</th>
              <th className="px-5 py-3.5">Insurer & CPB Rule</th>
              <th className="px-5 py-3.5">Audit Status & Action</th>
              <th className="px-5 py-3.5">Value at Risk</th>
              <th className="px-5 py-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-sans">
            {filteredItems.map((item) => (
              <tr key={item.key} className="hover:bg-slate-50/70 transition">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-blue-500 text-white font-black text-xs shadow-xs">
                      {item.initials}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm leading-none">
                        {item.name}
                      </p>
                      <p className="mt-1 text-[11px] text-slate-400 font-mono">
                        {item.id} · {item.dob}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4">
                  <p className="font-semibold text-slate-800">{item.procedure}</p>
                  <p className="text-[11px] text-indigo-600 font-medium">{item.specialty}</p>
                </td>

                <td className="px-5 py-4">
                  <p className="font-medium text-slate-700">{item.insurer}</p>
                  <p className="text-[11px] text-slate-400">Received {item.date}</p>
                </td>

                <td className="px-5 py-4">
                  {item.status === "READY_FOR_APPEAL" ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      Ready for Appeal
                    </span>
                  ) : item.status === "ACTION_REQUIRED" ? (
                    <div>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800 border border-amber-200">
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                        Remediation Needed
                      </span>
                      <p className="mt-1 text-[11px] text-amber-900 font-medium max-w-xs">
                        {item.gap}
                      </p>
                    </div>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                      <Clock className="h-3.5 w-3.5 text-slate-500" />
                      In Review
                    </span>
                  )}
                </td>

                <td className="px-5 py-4">
                  <p className="font-bold text-slate-900">{item.denialAmount}</p>
                  <p className="text-[10px] text-slate-400">Latency: {item.turnaround}</p>
                </td>

                <td className="px-5 py-4 text-right">
                  <button
                    type="button"
                    onClick={() => onSelectPatient(item.key)}
                    className="inline-flex items-center gap-1 rounded-xl bg-slate-900 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-indigo-600 transition shadow-xs"
                  >
                    Open in Copilot
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* New Patient Intake Modal */}
      {showNewIntakeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                New Front-Desk Prior Auth Intake
              </h3>
              <button
                type="button"
                onClick={() => setShowNewIntakeModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateIntake} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700">Patient Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jonathan Morales"
                  value={newPatientName}
                  onChange={(e) => setNewPatientName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Specialty Procedure</label>
                <select
                  value={newProcedure}
                  onChange={(e) => setNewProcedure(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none"
                >
                  <option value="Lumbar Spinal Fusion">Lumbar Spinal Fusion (CPT 22612) - Orthopedic</option>
                  <option value="Humira Adalimumab">Humira Biologic (HCPCS J0135) - Rheumatology</option>
                  <option value="Heart Catheterization">Heart Catheterization (CPT 93458) - Cardiology</option>
                </select>
              </div>

              <div className="rounded-xl border border-dashed border-indigo-200 bg-indigo-50/50 p-4 text-center">
                <FileText className="mx-auto h-8 w-8 text-indigo-500 mb-1" />
                <p className="text-xs font-bold text-indigo-900">Upload Clinical Records or Denial Notice</p>
                <p className="text-[11px] text-slate-500">Attach PDF documents (up to 25MB)</p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewIntakeModal(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 shadow-sm"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Initiate AI Audit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
