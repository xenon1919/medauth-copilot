"use client";

import React, { useState } from "react";
import { FileText, ZoomIn, ZoomOut, Bookmark, MapPin } from "lucide-react";

interface PDFViewerProps {
  activeQuote?: string | null;
  activePage?: number | null;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({ activeQuote, activePage = 2 }) => {
  const [currentTab, setCurrentTab] = useState<"clinic" | "mri" | "policy">("clinic");

  return (
    <div className="flex h-full flex-col rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Top Document Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-3 py-2">
        <div className="flex gap-1.5">
          <button
            onClick={() => setCurrentTab("clinic")}
            className={`rounded-md px-3 py-1 text-xs font-semibold transition ${
              currentTab === "clinic"
                ? "bg-white text-indigo-700 shadow-sm border border-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Doctor Note (p. 2)
          </button>
          <button
            onClick={() => setCurrentTab("mri")}
            className={`rounded-md px-3 py-1 text-xs font-semibold transition ${
              currentTab === "mri"
                ? "bg-white text-indigo-700 shadow-sm border border-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            MRI Report (p. 1)
          </button>
          <button
            onClick={() => setCurrentTab("policy")}
            className={`rounded-md px-3 py-1 text-xs font-semibold transition ${
              currentTab === "policy"
                ? "bg-white text-indigo-700 shadow-sm border border-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Aetna Policy CPB #0016
          </button>
        </div>

        <div className="flex items-center gap-1 text-slate-400">
          <button className="p-1 hover:text-slate-600">
            <ZoomIn className="h-4 w-4" />
          </button>
          <button className="p-1 hover:text-slate-600">
            <ZoomOut className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Simulated Document Canvas with Citation Anchors */}
      <div className="relative flex-1 overflow-y-auto bg-slate-100 p-4">
        <div className="mx-auto max-w-xl rounded-lg border border-slate-300 bg-white p-6 shadow-sm font-serif text-xs text-slate-800 leading-relaxed min-h-[480px]">
          <div className="border-b border-slate-200 pb-3 mb-4 font-sans text-slate-500 text-[11px] flex justify-between">
            <span>MEMORIAL ORTHOPEDIC CENTER &bull; VISIT DATE: 2026-10-20</span>
            <span className="font-semibold text-slate-700">PAGE 2 OF 4</span>
          </div>

          <h3 className="font-sans font-bold text-sm text-slate-900 mb-2">
            PHYSICAL EXAMINATION & THERAPY REVIEW
          </h3>
          <p className="mb-3">
            Patient Sarah Jenkins (48 yo female) returns for surgical consultation regarding persistent,
            debilitating low back pain radiating into the right lower extremity in an L5 distribution.
          </p>

          {/* Interactive Bounding Box Quote Highlight */}
          <div
            className={`my-3 rounded border-2 p-2.5 transition-all ${
              activeQuote && activeQuote.includes("physical therapy")
                ? "border-emerald-500 bg-emerald-50/80 shadow-md ring-2 ring-emerald-300 ring-offset-1"
                : "border-slate-200 bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-1.5 text-[10px] font-sans font-bold text-emerald-800 mb-1">
              <MapPin className="h-3 w-3" />
              <span>CITATION ANCHOR [Doc: Clinic_Note.pdf &bull; Page 2 &bull; Para 3]</span>
            </div>
            <p className="text-slate-900 font-sans font-medium text-xs">
              &ldquo;Patient completed 8 weeks of formal physical therapy (twice weekly) focusing on core
              stabilization without sustained functional improvement.&rdquo;
            </p>
          </div>

          <p className="mb-3">
            Gait is antalgic favor of the right leg. Straight leg raise positive on the right at 35 degrees.
            Sensory deficit noted along the lateral calf. Deep tendon reflexes: Patellar 2+ bilaterally, Achilles
            trace on right.
          </p>

          <p className="mb-3">
            <strong>Prior Interventions</strong>: Trial of Meloxicam 15mg daily and 2 fluoroscopically-guided
            transforaminal epidural steroid injections provided only transient relief (&lt;10 days each).
          </p>

          <div className="mt-8 border-t border-slate-100 pt-3 text-[10px] text-slate-400 font-sans">
            Digitally signed by Robert Vance, MD &bull; License #MD9821049 &bull; NPI: 1982736451
          </div>
        </div>
      </div>
    </div>
  );
};
