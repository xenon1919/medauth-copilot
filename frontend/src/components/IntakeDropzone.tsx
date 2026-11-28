
"use client";

import React, { useRef, useState } from "react";
import {
  UploadCloud,
  FileCheck,
  FileWarning,
  Loader2,
  FileText,
} from "lucide-react";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";

export type DocumentCategory =
  | "EHR_NOTE"
  | "LAB_IMAGING"
  | "POLICY_DENIAL";

export interface ExtractedPage {
  pageNumber: number;
  text: string;
}

export interface UploadedPDF {
  id: string;
  category: DocumentCategory;
  filename: string;
  size: string;
  file: File;
  extractedPages: ExtractedPage[];
  extractionStatus: "PROCESSING" | "COMPLETED" | "FAILED";
  extractionError?: string;
}

interface IntakeDropzoneProps {
  onAnalyze?: () => void;
  isAnalyzing?: boolean;
  onFilesAdded?: (documents: UploadedPDF[]) => void;
}

interface DocumentCard {
  id: string;
  title: string;
  filename: string;
  size: string;
  status: "UPLOADED" | "PROCESSING" | "PARSED" | "FAILED";
  pageCount?: number;
}

const MAX_FILE_SIZE = 25 * 1024 * 1024;

const categoryLabels: Record<DocumentCategory, string> = {
  EHR_NOTE: "Doctor Clinic Encounter Note",
  LAB_IMAGING: "Lab / Imaging Report",
  POLICY_DENIAL: "Insurance Policy / Denial",
};

const extractPDFText = async (
  file: File
): Promise<ExtractedPage[]> => {
  const arrayBuffer = await file.arrayBuffer();

  const pdf = await pdfjsLib.getDocument({
    data: new Uint8Array(arrayBuffer),
  }).promise;

  const pages: ExtractedPage[] = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
    const page = await pdf.getPage(pageNumber);
    const textContent = await page.getTextContent();

    const text = textContent.items
      .filter(
        (item): item is typeof item & { str: string } =>
          "str" in item
      )
      .map((item) => item.str)
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

    pages.push({
      pageNumber,
      text,
    });
  }

  return pages;
};

export const IntakeDropzone: React.FC<IntakeDropzoneProps> = ({
  onAnalyze,
  isAnalyzing = false,
  onFilesAdded,
}) => {
  const [docs, setDocs] = useState<DocumentCard[]>([
    {
      id: "doc-1",
      title: "Doctor Clinic Encounter Note",
      filename: "Clinic_Note_2026-10-20.pdf",
      size: "2.4 MB",
      status: "PARSED",
    },
    {
      id: "doc-2",
      title: "Lumbar Spine MRI Report",
      filename: "MRI_Report_2026-10-14.pdf",
      size: "4.1 MB",
      status: "PARSED",
    },
    {
      id: "doc-3",
      title: "Aetna CPB #0016 & Denial Notice",
      filename: "Aetna_CPB0016_Denial.pdf",
      size: "1.8 MB",
      status: "PARSED",
    },
  ]);

  const [category, setCategory] =
    useState<DocumentCategory>("EHR_NOTE");

  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) =>
    `${(bytes / (1024 * 1024)).toFixed(2)} MB`;

  const handleFiles = async (files: FileList | File[]) => {
    setError("");

    const accepted: File[] = [];
    const rejected: string[] = [];

    Array.from(files).forEach((file) => {
      const isPDF =
        file.type === "application/pdf" ||
        file.name.toLowerCase().endsWith(".pdf");

      if (!isPDF) {
        rejected.push(`${file.name}: Only PDF files are accepted.`);
        return;
      }

      if (file.size === 0) {
        rejected.push(`${file.name}: File is empty.`);
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        rejected.push(`${file.name}: File exceeds 25 MB.`);
        return;
      }

      accepted.push(file);
    });

    if (rejected.length > 0) {
      setError(rejected.join(" "));
    }

    for (const file of accepted) {
      const id = `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}-${file.name}`;

      const newDocument: UploadedPDF = {
        id,
        category,
        filename: file.name,
        size: formatFileSize(file.size),
        file,
        extractedPages: [],
        extractionStatus: "PROCESSING",
      };

      setDocs((previous) => [
        ...previous,
        {
          id,
          title: categoryLabels[category],
          filename: file.name,
          size: newDocument.size,
          status: "PROCESSING",
        },
      ]);

      try {
        const extractedPages = await extractPDFText(file);

        const completedDocument: UploadedPDF = {
          ...newDocument,
          extractedPages,
          extractionStatus: "COMPLETED",
        };

        onFilesAdded?.([completedDocument]);

        setDocs((previous) =>
          previous.map((doc) =>
            doc.id === id
              ? {
                  ...doc,
                  status: "PARSED",
                  pageCount: extractedPages.length,
                }
              : doc
          )
        );

        const hasText = extractedPages.some(
          (page) => page.text.length > 0
        );

        if (!hasText) {
          setError(
            `${file.name}: No selectable text was found. This may be a scanned PDF and will need OCR.`
          );
        }
      } catch (err) {
        console.error("PDF extraction failed:", err);

        const failedDocument: UploadedPDF = {
          ...newDocument,
          extractionStatus: "FAILED",
          extractionError: "Could not extract PDF text.",
        };

        onFilesAdded?.([failedDocument]);

        setDocs((previous) =>
          previous.map((doc) =>
            doc.id === id
              ? { ...doc, status: "FAILED" }
              : doc
          )
        );

        setError(
          `${file.name}: Unable to read this PDF. Please check that it is a valid PDF file.`
        );
      }
    }
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      void handleFiles(event.target.files);
    }

    event.target.value = "";
  };

  const handleDrop = (
    event: React.DragEvent<HTMLDivElement>
  ) => {
    event.preventDefault();
    setIsDragging(false);

    if (event.dataTransfer.files.length > 0) {
      void handleFiles(event.dataTransfer.files);
    }
  };

  return (
    <div className="rounded-xl border border-slate-800/80 bg-[#0B1323]/90 p-4 shadow-xl text-slate-200">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-white">
            Document Intake & Parsing
          </h2>
          <p className="text-xs text-slate-400">
            Upload records to audit against insurer guidelines
          </p>
        </div>

        <button
          onClick={onAnalyze}
          disabled={isAnalyzing}
          className="rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-500 disabled:opacity-50 transition"
        >
          {isAnalyzing ? "Auditing Records..." : "Re-Audit All"}
        </button>
      </div>

      <div className="mb-3">
        <label
          htmlFor="document-category"
          className="mb-1 block text-xs font-semibold text-slate-300"
        >
          Document type
        </label>

        <select
          id="document-category"
          value={category}
          onChange={(event) =>
            setCategory(event.target.value as DocumentCategory)
          }
          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white outline-none focus:border-cyan-400 font-mono"
        >
          <option value="EHR_NOTE">Doctor Visit Note</option>
          <option value="LAB_IMAGING">MRI / Lab Report</option>
          <option value="POLICY_DENIAL">Insurance Policy / Denial</option>
        </select>
      </div>

      <div className="space-y-2">
        {docs.map((doc) => (
          <div
            key={doc.id}
            className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/80 p-2.5 hover:border-cyan-500/40 transition"
          >
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-950/80 text-cyan-400 border border-indigo-700/50">
                {doc.status === "PROCESSING" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : doc.status === "FAILED" ? (
                  <FileWarning className="h-4 w-4 text-rose-400" />
                ) : (
                  <FileCheck className="h-4 w-4" />
                )}
              </div>

              <div className="min-w-0">
                <p className="text-xs font-semibold text-white">
                  {doc.title}
                </p>
                <p className="truncate text-[11px] text-slate-400 font-mono">
                  {doc.filename} &bull; {doc.size}
                  {doc.pageCount
                    ? ` • ${doc.pageCount} pages`
                    : ""}
                </p>
              </div>
            </div>

            <span
              className={`shrink-0 rounded border px-2 py-0.5 text-[10px] font-bold font-mono ${
                doc.status === "PARSED"
                  ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/40"
                  : doc.status === "FAILED"
                  ? "bg-rose-950/80 text-rose-300 border-rose-500/40"
                  : "bg-cyan-950/80 text-cyan-300 border-cyan-500/40"
              }`}
            >
              {doc.status}
            </span>
          </div>
        ))}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        multiple
        className="hidden"
        onChange={handleInputChange}
      />

      <div
        role="button"
        tabIndex={0}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`mt-3 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-4 transition ${
          isDragging
            ? "border-cyan-400 bg-cyan-950/30"
            : "border-slate-700 bg-slate-900/40 hover:border-cyan-500/60 hover:bg-slate-900/70"
        }`}
      >
        <UploadCloud className="h-6 w-6 text-cyan-400" />

        <p className="mt-1 text-xs font-medium text-slate-200">
          Drop additional clinical PDFs here
        </p>

        <p className="text-[10px] text-slate-400 font-mono">
          Or click to browse • Multiple PDFs • Up to 25 MB each
        </p>
      </div>

      {error && (
        <div className="mt-3 flex gap-2 rounded-lg border border-rose-500/40 bg-rose-950/40 p-2.5 text-rose-300">
          <FileWarning className="h-4 w-4 shrink-0 text-rose-400" />
          <p className="text-xs">{error}</p>
        </div>
      )}
    </div>
  );
};
