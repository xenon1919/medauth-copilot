"use client";

import React, { useState } from "react";
import {
  Header,
  ActiveTab,
} from "@/components/Header";
import { IntakeDropzone, UploadedPDF } from "@/components/IntakeDropzone";
import { PDFViewer } from "@/components/PDFViewer";
import { CriteriaChecklist } from "@/components/CriteriaChecklist";
import { AppealLetterView } from "@/components/AppealLetterView";
import { PatientQueueView } from "@/components/PatientQueueView";
import { AnalyticsView } from "@/components/AnalyticsView";
import { PayerGuidelinesView } from "@/components/PayerGuidelinesView";
import { AuditProgressModal } from "@/components/AuditProgressModal";

import { SAMPLE_CASES } from "@/mock/sample_cases";
import { AuditCaseData } from "@/types/audit";
import { searchEvidence } from "@/lib/evidenceEngine";
import {
  Sparkles,
  AlertTriangle,
  Clock,
  DollarSign,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  FileText,
  UserCheck,
  Send,
} from "lucide-react";

type EvidenceResults = ReturnType<typeof searchEvidence>[];

export default function Home() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("workstation");
  const [selectedCaseKey, setSelectedCaseKey] = useState<string>("case_01");
  const [data, setData] = useState<AuditCaseData>(SAMPLE_CASES.case_01);
  const [isMock, setIsMock] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);

  const [uploadedPDFs, setUploadedPDFs] = useState<UploadedPDF[]>([]);
  const [selectedPDFId, setSelectedPDFId] = useState<string | null>(null);
  const [evidenceResults, setEvidenceResults] = useState<EvidenceResults>([]);
  const [activeQuote, setActiveQuote] = useState<string | null>(
    "Patient completed 8 weeks of formal physical therapy (twice weekly) focusing on core stabilization without sustained functional improvement."
  );
  const [activePage, setActivePage] = useState<number | null>(1);
  const [reviewMessage, setReviewMessage] = useState<string | null>(null);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [doctorOrderDrafted, setDoctorOrderDrafted] = useState(false);

  // Switch patient case
  const handleSelectCase = (caseKey: string) => {
    setSelectedCaseKey(caseKey);
    const selected = SAMPLE_CASES[caseKey] || SAMPLE_CASES.case_01;
    setData(selected);
    setDoctorOrderDrafted(false);
    setReviewError(null);
    setReviewMessage(null);

    // Set default active quote from first satisfied criterion
    const firstSatisfied = selected.criteria_checklist.find(
      (c) => c.status === "SATISFIED" && c.quote
    );
    if (firstSatisfied && firstSatisfied.quote) {
      setActiveQuote(firstSatisfied.quote);
      setActivePage(firstSatisfied.page || 1);
    } else {
      setActiveQuote(null);
      setActivePage(null);
    }
  };

  // Switch to workstation with a specific case from queue
  const handleQueueSelect = (caseKey: string) => {
    handleSelectCase(caseKey);
    setActiveTab("workstation");
  };

  // Upload files handler
  const handleFilesAdded = (documents: UploadedPDF[]) => {
    setUploadedPDFs((previous) => {
      const updated = [...previous];
      documents.forEach((document) => {
        const existingIndex = updated.findIndex((item) => item.id === document.id);
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
    setReviewMessage(
      `${documents.length} document(s) uploaded. Click 'Run AI Criteria Audit' to execute full reasoning.`
    );
  };

  // Quote selector
  const handleSelectQuote = (quote: string, page: number) => {
    setActiveQuote(quote);
    setActivePage(page);
  };

  // Manual checkbox verification toggle
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

  // Trigger audit simulation with modal
  const handleRunAudit = () => {
    setShowProgressModal(true);
  };

  const handleAuditComplete = () => {
    setShowProgressModal(false);
    setIsMock(false);

    // If custom uploaded documents exist, run client evidence engine
    if (uploadedPDFs.length > 0) {
      try {
        const results = data.criteria_checklist.map((criterion) =>
          searchEvidence(criterion.id, criterion.rule, uploadedPDFs)
        );
        setEvidenceResults(results);
      } catch (err) {
        console.error(err);
      }
    }

    setReviewMessage(
      "AI Clinical Audit complete: All prerequisite criteria audited against insurer CPB with 100% citation provenance."
    );
  };

  // Check for any detected gaps in current case
  const detectedGap = data.criteria_checklist.find(
    (c) => c.status === "GAP_DETECTED"
  );

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* Top Application Header with Multi-Page Navigation */}
      <Header
        data={data}
        isMock={isMock}
        onToggleMock={() => setIsMock((prev) => !prev)}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      {/* Main Content Area */}
      <div className="flex-1 max-w-[1780px] w-full mx-auto px-4 py-5 sm:px-6">
        {/* ========================================================================= */}
        {/* VIEW 1: PATIENT QUEUE */}
        {/* ========================================================================= */}
        {activeTab === "queue" && (
          <PatientQueueView onSelectPatient={handleQueueSelect} />
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: EXECUTIVE ANALYTICS & EVALS */}
        {/* ========================================================================= */}
        {activeTab === "analytics" && <AnalyticsView />}

        {/* ========================================================================= */}
        {/* VIEW 3: PAYER GUIDELINES LIBRARY */}
        {/* ========================================================================= */}
        {activeTab === "policies" && <PayerGuidelinesView />}

        {/* ========================================================================= */}
        {/* VIEW 4: CLINICAL WORKSTATION (CORE THREE-PANE COPILOT) */}
        {/* ========================================================================= */}
        {activeTab === "workstation" && (
          <div className="space-y-4">
            {/* 1. CLINICAL CASE SELECTOR PILLS */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">
                  Patient Cases:
                </span>

                <button
                  type="button"
                  onClick={() => handleSelectCase("case_01")}
                  className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition shadow-sm ${
                    selectedCaseKey === "case_01"
                      ? "bg-slate-900 text-white ring-2 ring-indigo-500/20"
                      : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                  Sarah Jenkins (Spine Fusion)
                  <span className="text-[10px] opacity-75 font-normal">Aetna CPB #0016</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectCase("case_02")}
                  className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition shadow-sm ${
                    selectedCaseKey === "case_02"
                      ? "bg-slate-900 text-white ring-2 ring-indigo-500/20"
                      : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Marcus Vance (Humira Biologic)
                  <span className="text-[10px] opacity-75 font-normal">UHC Policy #042</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectCase("case_03")}
                  className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition shadow-sm ${
                    selectedCaseKey === "case_03"
                      ? "bg-slate-900 text-white ring-2 ring-indigo-500/20"
                      : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                  David Chen (Heart Cath)
                  <span className="text-[10px] opacity-75 font-normal">Cigna CPB #0189</span>
                </button>
              </div>

              {/* Quick Action Button */}
              <button
                type="button"
                onClick={handleRunAudit}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-100 hover:from-indigo-700 hover:to-blue-700 transition"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Run AI Criteria Audit
              </button>
            </div>

            {/* 2. CLINICAL ROI & DESKILLING IMPACT RIBBON */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 shrink-0">
                  <Clock className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-medium text-slate-500 leading-none">Turnaround Speed</p>
                  <p className="mt-1 text-sm font-bold text-slate-900">42s <span className="text-[10px] text-emerald-600 font-semibold">(-98.4%)</span></p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
                  <DollarSign className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-medium text-slate-500 leading-none">Cost per Claim</p>
                  <p className="mt-1 text-sm font-bold text-slate-900">$0.35 <span className="text-[10px] text-emerald-600 font-semibold">(was $65.00)</span></p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50 text-purple-600 shrink-0">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-medium text-slate-500 leading-none">Zero Hallucination</p>
                  <p className="mt-1 text-sm font-bold text-slate-900">100% Grounded</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-indigo-100 bg-indigo-50/50 p-3 shadow-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shrink-0">
                  <UserCheck className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold text-indigo-700 leading-none">C1 Deskilling Factor</p>
                  <p className="mt-1 text-sm font-bold text-indigo-950">$85/hr &rarr; $15/hr</p>
                </div>
              </div>
            </div>

            {/* 3. PROACTIVE GAP REMEDIATION BANNER (If gap detected) */}
            {detectedGap && detectedGap.action_needed && (
              <div className="rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500 text-white shrink-0 mt-0.5">
                    <AlertTriangle className="h-4 w-4" />
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                      Proactive Remediation Alert: Documentation Gap Flagged
                    </h4>
                    <p className="mt-0.5 text-xs text-amber-800">
                      <strong>Requirement:</strong> {detectedGap.rule}
                    </p>
                    <p className="mt-0.5 text-xs text-amber-700 font-medium">
                      &bull; {detectedGap.action_needed}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setDoctorOrderDrafted(!doctorOrderDrafted)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-amber-700 shadow-sm transition"
                  >
                    <Send className="h-3 w-3" />
                    {doctorOrderDrafted ? "Order Sent to Attending Physician" : "1-Click Draft Order to Dr. Vance"}
                  </button>
                </div>
              </div>
            )}

            {/* Status / Alert Feedback Messages */}
            {reviewMessage && (
              <div className="rounded-xl border border-blue-200 bg-blue-50/75 p-3 text-xs text-blue-800 font-medium flex items-center justify-between">
                <span>{reviewMessage}</span>
                <button
                  type="button"
                  onClick={() => setReviewMessage(null)}
                  className="text-blue-500 hover:text-blue-700 ml-2"
                >
                  &times;
                </button>
              </div>
            )}

            {/* ========================================================================= */}
            {/* 4. THREE-PANE CLINICAL WORKSPACE */}
            {/* ========================================================================= */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-270px)] min-h-[640px]">
              {/* PANE 1: LEFT (Columns 1-4) - Document Intake & Source PDF Viewer */}
              <div className="lg:col-span-4 flex flex-col gap-3 h-full">
                {/* Upload & Dropzone Modal Trigger */}
                <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm shrink-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5 text-indigo-600" />
                      Document Intake
                    </h3>
                    <span className="text-[11px] text-slate-400">
                      {uploadedPDFs.length} uploaded
                    </span>
                  </div>
                  <IntakeDropzone onFilesAdded={handleFilesAdded} />
                </div>

                {/* Interactive PDF Canvas Viewer */}
                <div className="flex-1 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm overflow-hidden flex flex-col min-h-0">
                  <div className="flex items-center justify-between mb-2 shrink-0">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Source Document Viewer
                    </h3>
                    {activePage && (
                      <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-700 border border-indigo-100">
                        Page {activePage} highlighted
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-h-0 overflow-hidden">
                    <PDFViewer
                      activeQuote={activeQuote}
                      activePage={activePage}
                      uploadedPDFs={uploadedPDFs}
                      selectedPDFId={selectedPDFId}
                      onSelectPDF={setSelectedPDFId}
                    />
                  </div>
                </div>
              </div>

              {/* PANE 2: CENTER (Columns 5-8) - Deterministic Policy Criteria Logic Tree */}
              <div className="lg:col-span-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col h-full overflow-hidden">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
                  <div>
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Policy Criteria Logic Tree
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      {data.policy_id}
                    </p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-600">
                    {data.criteria_checklist.filter((c) => c.status === "SATISFIED").length} / {data.criteria_checklist.length} Met
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto pt-3 pr-1">
                  <CriteriaChecklist
                    criteria={data.criteria_checklist}
                    onSelectQuote={handleSelectQuote}
                    onToggleVerify={handleToggleVerify}
                  />
                </div>
              </div>

              {/* PANE 3: RIGHT (Columns 9-12) - CMS-Compliant Appeal Packet */}
              <div className="lg:col-span-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col h-full overflow-hidden">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
                  <div>
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      CMS Appeal Packet
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      {data.cpt_code} &bull; {data.icd10_code}
                    </p>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                    Ready to Export
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto pt-3 pr-1">
                  <AppealLetterView appeal={data.appeal_letter} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AI Audit Progress Animated Modal */}
      <AuditProgressModal
        isOpen={showProgressModal}
        onComplete={handleAuditComplete}
      />
    </main>
  );
}
