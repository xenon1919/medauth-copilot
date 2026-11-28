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
  X,
  CheckCircle2,
  Stethoscope,
  Printer,
  Calendar,
  Building,
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
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderSent, setOrderSent] = useState(false);

  // Switch patient case
  const handleSelectCase = (caseKey: string) => {
    setSelectedCaseKey(caseKey);
    const selected = SAMPLE_CASES[caseKey] || SAMPLE_CASES.case_01;
    setData(selected);
    setOrderSent(false);

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

    showToast(`Loaded ${selected.patient_name} (${selected.specialty || selected.procedure.slice(0, 20)})`);
  };

  // Switch to workstation with a specific case from queue
  const handleQueueSelect = (caseKey: string) => {
    handleSelectCase(caseKey);
    setActiveTab("workstation");
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 4000);
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
    showToast(`${documents.length} document(s) uploaded. Ready for AI audit.`);
  };

  // Quote selector
  const handleSelectQuote = (quote: string, page: number) => {
    setActiveQuote(quote);
    setActivePage(page);
    showToast(`Navigated to citation on Page ${page}`);
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

    showToast("AI Clinical Audit complete: All policy rules audited with 100% provenance.");
  };

  const handleSendPhysicianOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setShowOrderModal(false);
    setOrderSent(true);
    showToast("Order transmitted to Attending Physician Dr. Vance (EHR #ORD-9921-XRAY)");
  };

  // Check for any detected gaps in current case
  const detectedGap = data.criteria_checklist.find(
    (c) => c.status === "GAP_DETECTED"
  );

  return (
    <main className="min-h-screen subtle-mesh-bg flex flex-col font-sans text-slate-800 antialiased">
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
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">
                  Patient Cases:
                </span>

                <button
                  type="button"
                  onClick={() => handleSelectCase("case_01")}
                  className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition shadow-xs ${
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
                  className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition shadow-xs ${
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
                  className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition shadow-xs ${
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
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-100 hover:from-indigo-700 hover:to-blue-700 transition"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Run AI Criteria Audit
              </button>
            </div>

            {/* 2. CLINICAL ROI & DESKILLING IMPACT RIBBON */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-xs">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 shrink-0">
                  <Clock className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide leading-none">Turnaround Speed</p>
                  <p className="mt-1 text-sm font-black text-slate-900">42s <span className="text-[10px] text-emerald-600 font-bold">(-98.4%)</span></p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-xs">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
                  <DollarSign className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide leading-none">Cost per Claim</p>
                  <p className="mt-1 text-sm font-black text-slate-900">$0.35 <span className="text-[10px] text-emerald-600 font-bold">(was $65.00)</span></p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-xs">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 shrink-0">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide leading-none">Zero Hallucination</p>
                  <p className="mt-1 text-sm font-black text-slate-900">100% Grounded</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50/70 to-blue-50/70 p-3.5 shadow-xs">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shrink-0 shadow-xs">
                  <UserCheck className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-indigo-700 uppercase tracking-wide leading-none">C1 Deskilling Factor</p>
                  <p className="mt-1 text-sm font-black text-indigo-950">$85/hr &rarr; $15/hr</p>
                </div>
              </div>
            </div>

            {/* 3. PROACTIVE GAP REMEDIATION BANNER (If gap detected) */}
            {detectedGap && detectedGap.action_needed && (
              <div className="rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-white shrink-0 mt-0.5 shadow-xs">
                    <AlertTriangle className="h-5 w-5" />
                  </span>
                  <div>
                    <h4 className="text-xs font-black text-amber-950 uppercase tracking-wider">
                      Proactive Remediation Alert: Documentation Gap Flagged
                    </h4>
                    <p className="mt-0.5 text-xs text-amber-900">
                      <strong>Requirement:</strong> {detectedGap.rule}
                    </p>
                    <p className="mt-0.5 text-xs text-amber-800 font-medium">
                      &bull; {detectedGap.action_needed}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowOrderModal(true)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white hover:bg-amber-700 shadow-sm transition"
                  >
                    <Send className="h-3.5 w-3.5" />
                    {orderSent ? "Physician Order Dispatched" : "1-Click Draft Order to Dr. Vance"}
                  </button>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* 4. THREE-PANE CLINICAL WORKSPACE */}
            {/* ========================================================================= */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-270px)] min-h-[640px]">
              {/* PANE 1: LEFT (Columns 1-4) - Document Intake & Source PDF Viewer */}
              <div className="lg:col-span-4 flex flex-col gap-3 h-full">
                {/* Upload & Dropzone Modal Trigger */}
                <div className="rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-xs shrink-0">
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
                <div className="flex-1 rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-xs overflow-hidden flex flex-col min-h-0">
                  <div className="flex items-center justify-between mb-2 shrink-0">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Source Document Viewer
                    </h3>
                    {activePage && (
                      <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[11px] font-bold text-indigo-700 border border-indigo-100">
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
              <div className="lg:col-span-4 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs flex flex-col h-full overflow-hidden">
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
              <div className="lg:col-span-4 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs flex flex-col h-full overflow-hidden">
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

      {/* Interactive Physician Order Remediation Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
                  <Send className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Physician Remediation Order
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Front-Desk Order Dispatch to Attending Physician
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowOrderModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSendPhysicianOrder} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700">Attending Physician:</label>
                <input
                  type="text"
                  readOnly
                  value="Dr. Robert Vance, M.D. (Orthopedic Spine Surgery) - NPI: 1982736412"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">Patient:</label>
                <input
                  type="text"
                  readOnly
                  value={`${data.patient_name} (DOB: 1978-04-12)`}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">Diagnostic Order Requested:</label>
                <input
                  type="text"
                  readOnly
                  value="CPT 72040: Dynamic Weight-Bearing Flexion/Extension Plain Radiographs (Lumbar Spine)"
                  className="mt-1 w-full rounded-xl border border-amber-300 bg-amber-50/70 px-3 py-2 text-amber-950 font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">Clinical Justification for Payer CPB #0016:</label>
                <textarea
                  readOnly
                  rows={3}
                  value="Aetna Commercial Policy Bulletin #0016 requires dynamic plain radiographs demonstrating >= 4mm translatory slip or angular motion within 90 days prior to surgical fusion approval."
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700 resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <span className="text-[11px] text-slate-400">
                  Gateway: Direct EHR & e-Fax Dispatch
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowOrderModal(false)}
                    className="rounded-xl px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600 px-4 py-2 font-bold text-white hover:bg-amber-700 shadow-sm"
                  >
                    <Send className="h-3.5 w-3.5" />
                    Transmit Order
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Modern Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-2xl bg-slate-900 px-4 py-3 text-xs font-semibold text-white shadow-xl border border-slate-800 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="ml-2 text-slate-400 hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* AI Audit Progress Animated Modal */}
      <AuditProgressModal
        isOpen={showProgressModal}
        onComplete={handleAuditComplete}
      />
    </main>
  );
}
