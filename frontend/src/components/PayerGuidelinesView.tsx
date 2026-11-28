"use client";

import React, { useState } from "react";
import { BookOpen, Search, ExternalLink, ShieldCheck, FileCheck, AlertCircle } from "lucide-react";

const GUIDELINES = [
  {
    id: "CPB-0016",
    payer: "Aetna Commercial",
    title: "Vertebral Arthrodesis (Lumbar Spinal Fusion)",
    cpt: "CPT 22612, 63047",
    category: "Orthopedic Surgery",
    effective: "2026-01-01",
    status: "Active Policy",
    rules: [
      "Prerequisite 1: Supervised conservative therapy (physical therapy) for >= 6 weeks within past 12 months.",
      "Prerequisite 2: High-resolution MRI or CT confirming Grade II+ spondylolisthesis or neural canal stenosis.",
      "Prerequisite 3: Dynamic weight-bearing flexion/extension plain radiographs within 90 days demonstrating segmental instability.",
    ],
    denialCode: "D-0821 (Lack of documented conservative therapy or dynamic films)",
  },
  {
    id: "POLICY-042",
    payer: "UnitedHealthcare",
    title: "Tumor Necrosis Factor (TNF) Inhibitors: Adalimumab (Humira)",
    cpt: "HCPCS J0135",
    category: "Rheumatology / Specialty Biologics",
    effective: "2026",
    status: "Active Policy",
    rules: [
      "Prerequisite 1: Inadequate response, clinical failure, or contraindication to >= 3-month trial of conventional DMARD (Methotrexate >= 20mg/wk).",
      "Prerequisite 2: Negative latent tuberculosis screening (QuantiFERON-TB Gold or PPD) within previous 12 months.",
      "Prerequisite 3: Attestation authored by or in direct consultation with a board-certified rheumatologist.",
    ],
    denialCode: "PA-7704 (Failure to substantiate conventional DMARD failure)",
  },
  {
    id: "CPB-0189",
    payer: "Cigna Healthcare",
    title: "Diagnostic Coronary Angiography & Left Heart Catheterization",
    cpt: "CPT 93458",
    category: "Interventional Cardiology",
    effective: "2026",
    status: "Active Policy",
    rules: [
      "Prerequisite 1: Refractory CCS Class III/IV angina on guideline-directed dual antianginal medical therapy.",
      "Prerequisite 2: High-risk non-invasive stress test (SPECT/PET/Echo) proving objective ischemia involving >= 10% of myocardium.",
      "Prerequisite 3: Serum renal function panel (eGFR >= 30 mL/min) within 30 days prior to radiocontrast administration.",
    ],
    denialCode: "CARD-019 (Non-invasive high-risk stress test missing)",
  },
  {
    id: "NCD-150.3",
    payer: "Centers for Medicare & Medicaid Services (CMS)",
    title: "Bone Density Studies & DXA Imaging Coverage",
    cpt: "CPT 77080",
    category: "Endocrinology / Preventive",
    effective: "2026",
    status: "National Coverage",
    rules: [
      "Prerequisite 1: Estrogen-deficient women at clinical risk for osteoporosis based on medical history.",
      "Prerequisite 2: Individuals with vertebral abnormalities on X-ray indicative of osteoporosis.",
      "Prerequisite 3: Minimum 23-month monitoring interval between DXA scans unless on approved steroid therapy.",
    ],
    denialCode: "CMS-FREQ (Frequency limitation exceeded)",
  },
];

export const PayerGuidelinesView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = GUIDELINES.filter(
    (g) =>
      g.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.payer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.cpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-700">
                <BookOpen className="h-4 w-4" />
              </span>
              <h2 className="text-xl font-bold tracking-tight text-slate-900">
                Payer Clinical Policy Bulletins (CPB) Library
              </h2>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Deterministic Boolean rule specifications deconstructed from published commercial insurer guidelines.
            </p>
          </div>

          <div className="relative w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by payer, CPT, specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-300 pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Policy Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-indigo-200 transition"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-bold text-indigo-700">
                    {item.payer}
                  </span>
                  <h3 className="mt-2 text-base font-bold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    {item.id} &bull; {item.cpt} &bull; {item.category}
                  </p>
                </div>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
                  {item.status}
                </span>
              </div>

              {/* Criteria List */}
              <div className="mt-4 space-y-2">
                <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Mandatory Medical Necessity Criteria:
                </p>
                {item.rules.map((rule, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100"
                  >
                    <FileCheck className="h-3.5 w-3.5 text-indigo-600 shrink-0 mt-0.5" />
                    <span>{rule}</span>
                  </div>
                ))}
              </div>

              {/* Denial Code Warning */}
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-amber-50 p-2.5 text-xs text-amber-800 border border-amber-200/60">
                <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
                <span>
                  <strong>Common Denial Reason:</strong> {item.denialCode}
                </span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Effective: {item.effective}</span>
              <span className="font-semibold text-indigo-600 flex items-center gap-1 hover:underline cursor-pointer">
                View Policy Source <ExternalLink className="h-3 w-3" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
