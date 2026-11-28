"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { IntakeDropzone } from "@/components/IntakeDropzone";
import { PDFViewer } from "@/components/PDFViewer";
import { CriteriaChecklist } from "@/components/CriteriaChecklist";
import { AppealLetterView } from "@/components/AppealLetterView";
import initialMockData from "@/mock/sample_audit.json";
import { AuditCaseData } from "@/types/audit";
import { UploadedPDF } from "@/components/IntakeDropzone";
import { searchEvidence } from "@/lib/evidenceEngine";

type EvidenceResults = ReturnType<typeof searchEvidence>[];

export default function Home() {
  const [data, setData] = useState<AuditCaseData>(
    initialMockData as AuditCaseData
  );
  const [isMock, setIsMock] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [reviewMessage, setReviewMessage] = useState<string | null>(null);
  const [uploadedPDFs, setUploadedPDFs] = useState<UploadedPDF[]>([]);
  const [selectedPDFId, setSelectedPDFId] = useState<string | null>(null);
  const [evidenceResults, setEvidenceResults] =
    useState<EvidenceResults>([]);
  const [activeQuote, setActiveQuote] = useState<string | null>(null);
  const [activePage, setActivePage] = useState<number | null>(null);

  // Upload documents and clear results from previous uploads.
  const handleFilesAdded = (documents: UploadedPDF[]) => {
    setUploadedPDFs((previous) => {
      const updated = [...previous];

      documents.forEach((document) => {
        const existingIndex = updated.findIndex(
          (item) => item.id === document.id
        );

        if (existingIndex >= 0) {
          updated[existingIndex] = document;
        } else {
          updated.push(document);
        }
      });

      return updated;
    });

    if (documents.length > 0) {
      setSelectedPDFId(documents[documents.length - 1].id);
    }

    setEvidenceResults([]);
    setReviewError(null);
    setReviewMessage(
      documents.length > 0
        ? "New documents added. Run evidence review again to refresh the results."
        : null
    );
    setActiveQuote(null);
    setActivePage(null);
  };

  // Verify that a checklist quote exists in the extracted source text.
  const handleSelectQuote = (quote: string, page: number) => {
    const normalize = (value: string) =>
      value.toLowerCase().replace(/\s+/g, " ").trim();

    const normalizedQuote = normalize(quote);

    const matchingDocument = uploadedPDFs.find((document) =>
      document.extractedPages.some(
        (extractedPage) =>
          extractedPage.pageNumber === page &&
          normalize(extractedPage.text).includes(normalizedQuote)
      )
    );

    if (!matchingDocument) {
      setReviewError(
        `Could not verify this exact evidence quote on page ${page} of the uploaded PDFs. Please check the source document.`
      );
      return;
    }

    setReviewError(null);
    setReviewMessage(null);
    setSelectedPDFId(matchingDocument.id);
    setActiveQuote(quote);
    setActivePage(page);
  };

  // Safely navigate to a source match.
  const handleViewEvidence = (
    documentId: string,
    quote: string,
    page: number
  ) => {
    const documentExists = uploadedPDFs.some(
      (document) => document.id === documentId
    );

    if (!documentExists) {
      setReviewError(
        "The source document is no longer available. Please upload it again and rerun evidence review."
      );
      return;
    }

    setReviewError(null);
    setReviewMessage(null);
    setSelectedPDFId(documentId);
    setActiveQuote(quote);
    setActivePage(page);
  };

  // Toggle manual verification of checklist criteria.
  const handleToggleVerify = (id: string) => {
    setData((previous) => ({
      ...previous,
      criteria_checklist: previous.criteria_checklist.map((criterion) =>
        criterion.id === id
          ? { ...criterion, verified: !criterion.verified }
          : criterion
      ),
    }));
  };

  // Run evidence review against all uploaded documents.
  const handleReAudit = () => {
    setReviewError(null);
    setReviewMessage(null);
    setEvidenceResults([]);

    if (uploadedPDFs.length === 0) {
      setReviewError(
        "Please upload at least one document before running evidence review."
      );
      return;
    }

    const usableDocuments = uploadedPDFs.filter(
      (document) =>
        Array.isArray(document.extractedPages) &&
        document.extractedPages.some(
          (page) => typeof page.text === "string" && page.text.trim().length > 0
        )
    );

    if (usableDocuments.length === 0) {
      setReviewError(
        "No readable text was found in the uploaded documents. Please upload readable PDFs and try again."
      );
      return;
    }

    setIsAnalyzing(true);

    try {
      const results = data.criteria_checklist.map((criterion) =>
        searchEvidence(criterion.id, criterion.rule, usableDocuments)
      );

      setEvidenceResults(results);
      setIsMock(false);

      const matchCount = results.reduce(
        (total, result) => total + result.matches.length,
        0
      );

      if (matchCount === 0) {
        setReviewMessage(
          "Evidence review completed, but no matching evidence was found. Review the documents and checklist manually."
        );
      } else {
        setReviewMessage(
          `Evidence review completed. ${matchCount} potential evidence match(es) found across the checklist. Please verify each source manually.`
        );
      }
    } catch (error) {
      console.error("Evidence review error:", error);
      setEvidenceResults([]);
      setReviewError(
        "Evidence review could not be completed. Please check your uploaded documents and try again."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Remove a document and reset stale evidence references.
  const handleRemoveDocument = (documentId: string) => {
    setUploadedPDFs((previous) =>
      previous.filter((document) => document.id !== documentId)
    );

    if (selectedPDFId === documentId) {
      setSelectedPDFId(null);
      setActiveQuote(null);
      setActivePage(null);
    }

    setEvidenceResults([]);
    setReviewError(null);
    setReviewMessage(
      "A document was removed. Run evidence review again to refresh results."
    );
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <Header
  data={data}
  isMock={isMock}
  onToggleMock={() => setIsMock((previous) => !previous)}
/>

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        {/* Page heading */}
        <section className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            MedAuth AI
          </h1>

          <p className="max-w-3xl text-sm leading-6 text-slate-600">
            Review medical documentation, identify supporting evidence and
            prepare appeal drafts with traceable source references.
          </p>

          <p className="text-xs text-slate-500">
            Evidence matches are review aids, not coverage or clinical
            determinations.
          </p>
        </section>

        {/* Document upload */}
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Document Intake
          </h2>

          <IntakeDropzone onFilesAdded={handleFilesAdded} />
        </section>

        {/* Error and status messages */}
        {reviewError && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {reviewError}
          </div>
        )}

        {reviewMessage && (
          <div
            role="status"
            className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800"
          >
            {reviewMessage}
          </div>
        )}

        {/* Uploaded documents */}
        {uploadedPDFs.length > 0 && (
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-slate-900">
                Uploaded Documents
              </h2>

              <span className="text-sm text-slate-500">
                {uploadedPDFs.length} document(s)
              </span>
            </div>

            <div className="space-y-3">
              {uploadedPDFs.map((document) => (
                <div
                  key={document.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 p-3"
                >
                  <div className="min-w-0">
                    <p className="break-all text-sm font-medium text-slate-800">
                      {document.file.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {document.extractedPages?.length ?? 0} extracted page(s)
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveDocument(document.id)}
                    className="rounded-md border border-red-200 px-3 py-1.5 text-sm text-red-600 transition hover:bg-red-50"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleReAudit}
              disabled={isAnalyzing}
              className="mt-5 w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isAnalyzing
                ? "Reviewing Evidence..."
                : "Run Evidence Review"}
            </button>
          </section>
        )}

        {/* Main review workspace */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {/* PDF Viewer */}
          <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">
              Source Document Viewer
            </h2>

            <PDFViewer
              activeQuote={activeQuote}
              activePage={activePage}
              uploadedPDFs={uploadedPDFs}
              selectedPDFId={selectedPDFId}
              onSelectPDF={setSelectedPDFId}
            />
          </section>

          {/* Checklist */}
          <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">
              Criteria Checklist
            </h2>

            <CriteriaChecklist
              criteria={data.criteria_checklist}
              onSelectQuote={handleSelectQuote}
              onToggleVerify={handleToggleVerify}
            />
          </section>
        </div>

        {/* Evidence review results */}
        {evidenceResults.length > 0 && (
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-5 text-lg font-semibold text-slate-900">
              Evidence Review Results
            </h2>

            <div className="space-y-5">
              {evidenceResults.map((result, index) => (
                <div
                  key={`${result.criterionId}-${index}`}
                  className="rounded-lg border border-slate-200 p-4"
                >
                  <h3 className="font-medium text-slate-900">
                    {result.criterion}
                  </h3>

                  {result.matches.length === 0 ? (
                    <p className="mt-3 text-sm text-slate-500">
                      No potential evidence matches found. This does not
                      establish that the requirement is unmet.
                    </p>
                  ) : (
                    <div className="mt-4 space-y-3">
                      {result.matches.map((match, matchIndex) => (
                        <div
                          key={`${match.documentId}-${match.page}-${matchIndex}`}
                          className="rounded-md bg-slate-50 p-3"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="break-all text-sm font-medium text-slate-700">
                              {match.filename}
                            </p>

                            <span className="text-xs text-slate-500">
                              Page {match.page}
                            </span>
                          </div>

                          <blockquote className="mt-2 border-l-2 border-slate-300 pl-3 text-sm leading-6 text-slate-600">
                            {match.quote}
                          </blockquote>

                          <p className="mt-2 text-xs text-slate-500">
                            Relevance score:{" "}
                            {typeof match.relevanceScore === "number"
                              ? match.relevanceScore
                              : "N/A"}
                          </p>

                          <button
                            type="button"
                            onClick={() =>
                              handleViewEvidence(
                                match.documentId,
                                match.quote,
                                match.page
                              )
                            }
                            className="mt-3 rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-white"
                          >
                            View Source
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Appeal letter */}
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Appeal Letter
          </h2>

          <AppealLetterView appeal={data.appeal_letter} />
        </section>

        {/* Disclaimer */}
        <footer className="border-t border-slate-200 py-5">
          <p className="text-xs leading-5 text-slate-500">
            MedAuth AI is a documentation assistance tool. Evidence matches,
            checklist results and generated appeal content require human
            verification. Do not use this tool as a substitute for clinical
            judgment or payer policy interpretation.
          </p>
        </footer>
      </div>
    </main>
  );
}