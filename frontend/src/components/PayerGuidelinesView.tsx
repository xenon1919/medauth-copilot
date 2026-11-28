"use client";

import React, { useState } from "react";
import {
  BookOpen,
  Search,
  ExternalLink,
  ShieldCheck,
  FileCheck,
  AlertCircle,
  Code2,
  ChevronDown,
  ChevronUp,
  Tag,
  CheckCircle2,
} from "lucide-react";

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
      {
        text: "Prerequisite 1: Supervised conservative therapy (physical therapy) for >= 6 weeks within past 12 months.",
        ast: "AND(time_range <= 12m, pt_sessions >= 12, documented_in == 'PT_NOTES')",
        type: "MANDATORY",
      },
      {
        text: "Prerequisite 2: High-resolution MRI or CT confirming Grade II+ spondylolisthesis or neural canal stenosis.",
        ast: "OR(spondylolisthesis_grade >= 2, canal_stenosis == 'SEVERE')",
        type: "MANDATORY",
      },
      {
        text: "Prerequisite 3: Dynamic weight-bearing flexion/extension plain radiographs within 90 days demonstrating segmental instability.",
        ast: "AND(imaging == 'XR_FLEX_EXT', age_days <= 90, translation_mm >= 4.0)",
        type: "MANDATORY",
      },
    ],
    denialCode: "D-0821 (Lack of documented conservative therapy or dynamic films)",
    appealStrategy: "Submit flexion/extension films verifying >= 4mm translatory slip at L4-L5 with signed physician attestation.",
  },
  {
    id: "POLICY-042",
    payer: "UnitedHealthcare",
    title: "Tumor Necrosis Factor (TNF) Inhibitors: Adalimumab (Humira)",
    cpt: "HCPCS J0135",
    category: "Rheumatology / Biologics",
    effective: "2026",
    status: "Active Policy",
    rules: [
      {
        text: "Prerequisite 1: Inadequate response, clinical failure, or contraindication to >= 3-month trial of conventional DMARD (Methotrexate >= 20mg/wk).",
        ast: "AND(dmard_drug == 'METHOTREXATE', duration_months >= 3, response == 'FAILED')",
        type: "MANDATORY",
      },
      {
        text: "Prerequisite 2: Negative latent tuberculosis screening (QuantiFERON-TB Gold or PPD) within previous 12 months.",
        ast: "AND(tb_test_result == 'NEGATIVE', test_age_months <= 12)",
        type: "MANDATORY",
      },
      {
        text: "Prerequisite 3: Attestation authored by or in direct consultation with a board-certified rheumatologist.",
        ast: "AND(author_specialty == 'RHEUMATOLOGY', npi_verified == True)",
        type: "MANDATORY",
      },
    ],
    denialCode: "PA-7704 (Failure to substantiate conventional DMARD failure)",
    appealStrategy: "Cite chart notes from month 4 demonstrating persistent synovitis and elevated ESR (>35) despite 20mg weekly MTX.",
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
      {
        text: "Prerequisite 1: Refractory CCS Class III/IV angina on guideline-directed dual antianginal medical therapy.",
        ast: "AND(angina_class >= 3, antianginal_drugs >= 2)",
        type: "MANDATORY",
      },
      {
        text: "Prerequisite 2: High-risk non-invasive stress test (SPECT/PET/Echo) proving objective ischemia involving >= 10% of myocardium.",
        ast: "AND(stress_modality in ['SPECT','PET','ECHO'], ischemic_myocardium_pct >= 10)",
        type: "MANDATORY",
      },
      {
        text: "Prerequisite 3: Serum renal function panel (eGFR >= 30 mL/min) within 30 days prior to radiocontrast administration.",
        ast: "AND(lab == 'EGFR', egfr_value >= 30, lab_age_days <= 30)",
        type: "MANDATORY",
      },
    ],
    denialCode: "CARD-019 (Non-invasive high-risk stress test missing)",
    appealStrategy: "Provide SPECT myocardial perfusion scan showing reversible apical defect with eGFR drawn within 30 days.",
  },
  {
    id: "NCD-150.3",
    payer: "Centers for Medicare & Medicaid Services (CMS)",
    title: "Bone Density Studies & DXA Imaging Coverage",
    cpt: "CPT 77080",
    category: "Preventive & Endocrinology",
    effective: "2026",
    status: "National Coverage",
    rules: [
      {
        text: "Prerequisite 1: Estrogen-deficient women at clinical risk for osteoporosis based on medical history.",
        ast: "AND(sex == 'F', estrogen_deficient == True, risk_score == 'HIGH')",
        type: "MANDATORY",
      },
      {
        text: "Prerequisite 2: Individuals with vertebral abnormalities on X-ray indicative of osteoporosis.",
        ast: "OR(prior_fracture == True, dexa_t_score <= -2.5)",
        type: "MANDATORY",
      },
      {
        text: "Prerequisite 3: Minimum 23-month monitoring interval between DXA scans unless on approved steroid therapy.",
        ast: "OR(interval_months >= 23, on_glucocorticoids == True)",
        type: "MANDATORY",
      },
    ],
    denialCode: "CMS-FREQ (Frequency limitation exceeded)",
    appealStrategy: "Supply documentation proving long-term systemic glucocorticoid therapy (Prednisone 10mg > 3 months).",
  },
];

export const PayerGuidelinesView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [expandedId, setExpandedId] = useState<string | null>("CPB-0016");

  const categories = [
    { key: "ALL", label: "All Policies (4)" },
    { key: "Orthopedic Surgery", label: "Orthopedics" },
    { key: "Rheumatology / Biologics", label: "Biologics" },
    { key: "Interventional Cardiology", label: "Cardiology" },
    { key: "Preventive & Endocrinology", label: "CMS NCDs" },
  ];

  const filtered = GUIDELINES.filter((g) => {
    const matchesSearch =
      g.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.payer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.cpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.category.toLowerCase().includes(searchTerm.toLowerCase());

    if (selectedCategory === "ALL") return matchesSearch;
    return matchesSearch && g.category.includes(selectedCategory);
  });

  return (
    <div className="space-y-6 text-slate-100">
      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-800/80 bg-[#0F172A]/90 backdrop-blur-xl p-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                <BookOpen className="h-5 w-5" />
              </span>
              <h2 className="text-xl font-black tracking-tight text-white">
                Payer Clinical Policy Bulletins (CPB) Library
              </h2>
            </div>
            <p className="mt-1 text-sm text-slate-400">
              Deterministic Boolean rule specifications deconstructed from published commercial insurer guidelines.
            </p>
          </div>

          <div className="relative w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search by payer, CPT, specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900/90 pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none shadow-inner"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="mt-4 flex flex-wrap items-center gap-2 pt-3 border-t border-slate-800">
          {categories.map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => setSelectedCategory(cat.key)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                selectedCategory === cat.key
                  ? "bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-md shadow-indigo-600/30"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Policy Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((item) => {
          return (
            <div
              key={item.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-800/90 bg-[#0F172A]/90 backdrop-blur-xl p-6 shadow-xl hover:border-cyan-500/40 transition"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-lg bg-indigo-950/80 px-2.5 py-0.5 text-[10px] font-bold text-cyan-300 border border-indigo-700/50 font-mono">
                        {item.id}
                      </span>
                      <span className="rounded-lg bg-slate-800 px-2.5 py-0.5 text-[10px] font-bold text-slate-300 border border-slate-700">
                        {item.payer}
                      </span>
                    </div>
                    <h3 className="mt-2 text-base font-bold text-white leading-snug">
                      {item.title}
                    </h3>
                    <p className="mt-0.5 text-xs text-slate-400">
                      Applicable Codes: <strong className="text-cyan-300 font-mono">{item.cpt}</strong>
                    </p>
                  </div>

                  <span className="shrink-0 rounded-full bg-emerald-950/80 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/40 font-mono">
                    {item.status}
                  </span>
                </div>

                {/* Prerequisite Criteria List */}
                <div className="mt-4 space-y-2.5">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                    Mandatory Policy Criteria (AST Boolean Tree):
                  </p>
                  {item.rules.map((rule, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-slate-800/80 bg-slate-950/70 p-3 text-xs"
                    >
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <p className="font-semibold text-slate-200 leading-snug">
                            {rule.text}
                          </p>
                          <p className="font-mono text-[10px] text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40 inline-block">
                            AST: {rule.ast}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Common Denial Triggers & Strategy */}
                <div className="mt-4 rounded-xl border border-amber-600/40 bg-amber-950/20 p-3 text-xs text-amber-200">
                  <div className="flex items-center gap-1.5 font-bold mb-1 text-amber-300">
                    <AlertCircle className="h-4 w-4 text-amber-400" />
                    Common Denial Code: {item.denialCode}
                  </div>
                  <p className="text-[11px] text-amber-100/90 leading-relaxed">
                    <strong>Appeal Strategy:</strong> {item.appealStrategy}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono text-[11px]">Effective: {item.effective}</span>
                <span className="font-semibold text-cyan-400 flex items-center gap-1">
                  Verified CPB Specification
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
