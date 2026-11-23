"use client";

import React, { useState } from "react";
import { UploadCloud, FileCheck, FileWarning, PlusCircle } from "lucide-react";

interface UploadedDoc {
  id: string;
  category: "EHR_NOTE" | "LAB_IMAGING" | "POLICY_DENIAL";
  title: string;
  filename: string;
  size: string;
  status: "UPLOADED" | "PARSED";
}

interface IntakeDropzoneProps {
  onAnalyze?: () => void;
  isAnalyzing?: boolean;
}

export const IntakeDropzone: React.FC<IntakeDropzoneProps> = ({
  onAnalyze,
  isAnalyzing = false,
}) => {
  const [docs, setDocs] = useState<UploadedDoc[]>([
    {
      id: "doc-1",
      category: "EHR_NOTE",
      title: "Doctor Clinic Encounter Note",
      filename: "Clinic_Note_2026-10-20.pdf",
      size: "2.4 MB",
      status: "PARSED",
    },
    {
      id: "doc-2",
      category: "LAB_IMAGING",
      title: "Lumbar Spine MRI Report",
      filename: "MRI_Report_2026-10-14.pdf",
      size: "4.1 MB",
      status: "PARSED",
    },
    {
      id: "doc-3",
      category: "POLICY_DENIAL",
      title: "Aetna CPB #0016 & Denial Notice",
      filename: "Aetna_CPB0016_Denial.pdf",
      size: "1.8 MB",
      status: "PARSED",
    },
  ]);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Document Intake & Parsing</h2>
          <p className="text-xs text-slate-500">Upload records to audit against insurer guidelines</p>
        </div>
        <button
          onClick={onAnalyze}
          disabled={isAnalyzing}
          className="rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50 transition"
        >
          {isAnalyzing ? "Auditing Records..." : "Re-Audit All"}
        </button>
      </div>

      {/* Uploaded Document Cards */}
      <div className="space-y-2">
        {docs.map((doc) => (
          <div
            key={doc.id}
            className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-2.5 hover:bg-white hover:border-indigo-300 transition"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-indigo-100 text-indigo-700">
                <FileCheck className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-800">{doc.title}</p>
                <p className="text-[11px] text-slate-500">
                  {doc.filename} &bull; {doc.size}
                </p>
              </div>
            </div>
            <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
              {doc.status}
            </span>
          </div>
        ))}
      </div>

      {/* Drop Target Box */}
      <div className="mt-3 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50/50 p-4 hover:border-indigo-400 hover:bg-indigo-50/20 transition">
        <UploadCloud className="h-6 w-6 text-slate-400" />
        <p className="mt-1 text-xs font-medium text-slate-700">
          Drop additional clinical PDFs or faxes here
        </p>
        <p className="text-[10px] text-slate-400">PDF, TIFF, PNG up to 25MB</p>
      </div>
    </div>
  );
};
