"use client";

import React, { useEffect, useState } from "react";
import {
  ZoomIn,
  ZoomOut,
  MapPin,
  FileText,
  FileWarning,
  Loader2,
  Eye,
} from "lucide-react";

import { UploadedPDF } from "@/components/IntakeDropzone";

interface PDFViewerProps {
  activeQuote?: string | null;
  activePage?: number | null;
  uploadedPDFs: UploadedPDF[];
  selectedPDFId: string | null;
  onSelectPDF: (id: string | null) => void;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({
  activeQuote,
  activePage = 1,
  uploadedPDFs,
  selectedPDFId,
  onSelectPDF,
}) => {
  const [currentTab, setCurrentTab] = useState<
    "clinic" | "mri" | "policy"
  >("clinic");

  const [zoom, setZoom] = useState(100);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  const [viewerMode, setViewerMode] = useState<
    "preview" | "text"
  >("preview");

  const selectedDocument = uploadedPDFs.find(
    (document) => document.id === selectedPDFId
  );

  useEffect(() => {
    if (selectedPDFId) {
      setViewerMode("preview");
    }
  }, [selectedPDFId]);

  useEffect(() => {
    if (!selectedDocument) {
      setObjectUrl(null);
      return;
    }

    const url = URL.createObjectURL(selectedDocument.file);
    setObjectUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [selectedDocument]);

  const selectDemoTab = (
    tab: "clinic" | "mri" | "policy"
  ) => {
    setCurrentTab(tab);
    onSelectPDF(null);
    setZoom(100);
    setViewerMode("preview");
  };

  const selectUploadedDocument = (id: string) => {
    onSelectPDF(id || null);
    setZoom(100);
    setViewerMode("preview");
  };

  const isUploadedDocument = Boolean(selectedDocument);

  return (
    <div className="flex h-full flex-col rounded-xl border border-slate-800/90 bg-[#0B1323]/90 shadow-xl overflow-hidden text-slate-200">
      {/* Document Toolbar */}
      <div className="flex flex-col gap-2 border-b border-slate-800 bg-[#090F1C] px-3 py-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex gap-1.5 overflow-x-auto">
            <button
              onClick={() => selectDemoTab("clinic")}
              className={`shrink-0 rounded-md px-2.5 py-1 text-xs font-semibold transition ${
                !selectedPDFId && currentTab === "clinic"
                  ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Doctor Note
            </button>

            <button
              onClick={() => selectDemoTab("mri")}
              className={`shrink-0 rounded-md px-2.5 py-1 text-xs font-semibold transition ${
                !selectedPDFId && currentTab === "mri"
                  ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              MRI Report
            </button>

            <button
              onClick={() => selectDemoTab("policy")}
              className={`shrink-0 rounded-md px-2.5 py-1 text-xs font-semibold transition ${
                !selectedPDFId && currentTab === "policy"
                  ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Aetna Policy
            </button>
          </div>

          <div className="flex shrink-0 items-center gap-1 text-slate-400">
            <button
              onClick={() => setZoom((value) => Math.min(value + 10, 150))}
              title="Zoom in"
              className="rounded p-1 hover:bg-slate-800 hover:text-white"
            >
              <ZoomIn className="h-4 w-4" />
            </button>

            <span className="text-[10px] font-mono font-medium text-cyan-300">
              {zoom}%
            </span>

            <button
              onClick={() => setZoom((value) => Math.max(value - 10, 70))}
              title="Zoom out"
              className="rounded p-1 hover:bg-slate-800 hover:text-white"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Uploaded Document Selector */}
        {uploadedPDFs.length > 0 && (
          <select
            value={selectedPDFId ?? ""}
            onChange={(event) =>
              selectUploadedDocument(event.target.value)
            }
            className="w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1.5 text-xs text-white outline-none focus:border-cyan-400 font-mono"
          >
            <option value="">View demo documents</option>
            {uploadedPDFs.map((document) => (
              <option key={document.id} value={document.id}>
                {document.filename}
              </option>
            ))}
          </select>
        )}

        {/* Preview / Extracted Text Switch */}
        {isUploadedDocument && (
          <div className="flex rounded-lg bg-slate-900 p-1 gap-1 border border-slate-800">
            <button
              onClick={() => setViewerMode("preview")}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-semibold transition ${
                viewerMode === "preview"
                  ? "bg-indigo-600 text-white shadow-sm font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Eye className="h-3.5 w-3.5" />
              PDF Preview
            </button>

            <button
              onClick={() => setViewerMode("text")}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-semibold transition ${
                viewerMode === "text"
                  ? "bg-indigo-600 text-white shadow-sm font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              Extracted Text
            </button>
          </div>
        )}
      </div>

      {/* Uploaded Document Viewer */}
      {selectedDocument ? (
        <div className="flex min-h-0 flex-1 flex-col bg-slate-950">
          <div className="border-b border-slate-800 bg-[#0A101E] px-3 py-2">
            <p className="truncate text-xs font-semibold text-white">
              {selectedDocument.filename}
            </p>

            <p className="text-[10px] text-slate-400 font-mono">
              {selectedDocument.extractionStatus === "COMPLETED"
                ? `${selectedDocument.extractedPages.length} pages processed`
                : selectedDocument.extractionStatus === "PROCESSING"
                ? "Extracting document text..."
                : "Document extraction failed"}
            </p>
          </div>

          {/* Actual PDF Preview */}
          {viewerMode === "preview" && (
            <div className="min-h-0 flex-1 overflow-auto p-2">
              {objectUrl ? (
                <iframe
                  key={`${selectedDocument.id}-${activePage ?? 1}`}
                  src={`${objectUrl}#page=${activePage ?? 1}`}
                  title={`PDF viewer: ${selectedDocument.filename}`}
                  className="h-full min-h-[450px] w-full rounded border border-slate-700 bg-white"
                  style={{ zoom: `${zoom}%` }}
                />
              ) : (
                <div className="flex h-full min-h-[300px] items-center justify-center text-sm text-slate-400">
                  Loading PDF preview...
                </div>
              )}
            </div>
          )}

          {/* Extracted Text Viewer */}
          {viewerMode === "text" && (
            <div className="min-h-0 flex-1 overflow-y-auto p-3">
              {selectedDocument.extractionStatus === "PROCESSING" && (
                <div className="flex flex-col items-center justify-center gap-3 py-12 text-slate-400">
                  <Loader2 className="h-7 w-7 animate-spin text-cyan-400" />
                  <p className="text-sm font-medium">
                    Extracting text from your PDF...
                  </p>
                </div>
              )}

              {selectedDocument.extractionStatus === "FAILED" && (
                <div className="rounded-lg border border-red-500/40 bg-red-950/40 p-4 text-red-300">
                  <FileWarning className="mb-2 h-6 w-6" />
                  <p className="text-sm font-semibold">
                    Text extraction failed
                  </p>
                  <p className="mt-1 text-xs">
                    {selectedDocument.extractionError ||
                      "Unable to extract text from this document."}
                  </p>
                </div>
              )}

              {selectedDocument.extractionStatus === "COMPLETED" && (
                <>
                  {selectedDocument.extractedPages.length === 0 ? (
                    <div className="rounded-lg border border-amber-500/40 bg-amber-950/40 p-4 text-amber-300">
                      <FileWarning className="mb-2 h-6 w-6" />
                      <p className="text-sm font-semibold">
                        No selectable text found
                      </p>
                      <p className="mt-1 text-xs">
                        This PDF may contain scanned images. OCR is not implemented yet.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="mb-3 flex items-center justify-between">
                        <p className="text-xs font-semibold text-slate-300">
                          Extracted document content
                        </p>
                        <span className="rounded-full bg-emerald-950/80 px-2 py-1 text-[10px] font-semibold text-emerald-300 border border-emerald-500/40 font-mono">
                          TEXT AVAILABLE
                        </span>
                      </div>

                      {selectedDocument.extractedPages.map((page) => (
                        <div
                          key={page.pageNumber}
                          className={`rounded-lg border bg-slate-900/90 p-3 shadow-md ${
                            activePage === page.pageNumber
                              ? "border-cyan-400 ring-1 ring-cyan-400/40"
                              : "border-slate-800"
                          }`}
                        >
                          <div className="mb-2 flex items-center justify-between border-b border-slate-800 pb-2">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-cyan-400" />
                              <span className="text-xs font-bold text-white font-mono">
                                Page {page.pageNumber}
                              </span>
                            </div>

                            {activePage === page.pageNumber && (
                              <span className="rounded-full bg-cyan-950/80 px-2 py-0.5 text-[9px] font-semibold text-cyan-300 border border-cyan-700/50 font-mono">
                                REFERENCED PAGE
                              </span>
                            )}
                          </div>

                          <p
                            className="whitespace-pre-wrap break-words text-slate-300 leading-relaxed font-mono"
                            style={{ fontSize: `${Math.max(10, zoom * 0.12)}px` }}
                          >
                            {page.text || "No selectable text on this page."}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Demo Document Viewer */
        <div className="relative flex-1 overflow-y-auto bg-[#070D18] p-4">
          <div
            className="mx-auto max-w-xl rounded-xl border border-slate-700/80 bg-[#0B1222] p-6 shadow-2xl font-sans text-xs text-slate-200 leading-relaxed min-h-[480px] origin-top"
            style={{ zoom: `${zoom}%` }}
          >
            <div className="border-b border-slate-800 pb-3 mb-4 text-slate-400 text-[11px] flex justify-between font-mono">
              <span className="text-cyan-400">
                {currentTab === "clinic"
                  ? "MEMORIAL ORTHOPEDIC CENTER • VISIT DATE: 2026-10-20"
                  : currentTab === "mri"
                  ? "LUMBAR SPINE MRI REPORT"
                  : "AETNA COMMERCIAL POLICY CPB #0016"}
              </span>

              <span className="font-bold text-white">
                PAGE {activePage ?? 1}
              </span>
            </div>

            {currentTab === "clinic" ? (
              <>
                <h3 className="font-bold text-sm text-white mb-2">
                  PHYSICAL EXAMINATION & THERAPY REVIEW
                </h3>

                <p className="mb-3 text-slate-300">
                  Patient Sarah Jenkins returns for surgical consultation
                  regarding persistent low back pain radiating into the
                  right lower extremity.
                </p>

                <div
                  className={`my-3 rounded-lg border-2 p-3 transition-all ${
                    activeQuote &&
                    activeQuote.toLowerCase().includes("physical therapy")
                      ? "border-emerald-400 bg-emerald-950/60 shadow-lg shadow-emerald-950/50 ring-2 ring-emerald-400/40"
                      : "border-slate-800 bg-slate-900/60"
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-300 mb-1 font-mono">
                    <MapPin className="h-3 w-3" />
                    <span>
                      CITATION ANCHOR • Clinic Note • Page 2
                    </span>
                  </div>

                  <p className="text-emerald-100 font-medium text-xs">
                    “Patient completed 8 weeks of formal physical
                    therapy (twice weekly) focusing on core stabilization
                    without sustained functional improvement.”
                  </p>
                </div>

                <p className="mb-3 text-slate-300">
                  Gait is antalgic favoring the right leg. Straight leg
                  raise positive on the right at 35 degrees.
                </p>

                <p className="mb-3 text-slate-300">
                  <strong>Prior Interventions:</strong> Trial of
                  conservative medication and guided injections provided
                  only transient relief.
                </p>
              </>
            ) : currentTab === "mri" ? (
              <>
                <h3 className="font-bold text-sm text-white mb-2">
                  LUMBAR SPINE MRI FINDINGS
                </h3>

                <p className="mb-3 text-slate-300">
                  This is a demonstration document view. Select an
                  uploaded PDF above to inspect its actual contents.
                </p>
              </>
            ) : (
              <>
                <h3 className="font-bold text-sm text-white mb-2">
                  INSURANCE POLICY
                </h3>

                <p className="mb-3 text-slate-300">
                  This is a demonstration policy view. Select an
                  uploaded PDF above to inspect its actual contents.
                </p>
              </>
            )}

            <div className="mt-8 border-t border-slate-800 pt-3 text-[10px] text-slate-500 font-mono">
              Demonstration content • Not an actual patient record
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
