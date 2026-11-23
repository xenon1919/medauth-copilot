"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { IntakeDropzone } from "@/components/IntakeDropzone";
import { PDFViewer } from "@/components/PDFViewer";
import { CriteriaChecklist } from "@/components/CriteriaChecklist";
import { AppealLetterView } from "@/components/AppealLetterView";
import initialMockData from "@/mock/sample_audit.json";
import { AuditCaseData } from "@/types/audit";

export default function Home() {
  const [data, setData] = useState<AuditCaseData>(initialMockData as AuditCaseData);
  const [isMock, setIsMock] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeQuote, setActiveQuote] = useState<string | null>(
    "Patient completed 8 weeks of formal physical therapy (twice weekly) focusing on core stabilization without sustained functional improvement."
  );
  const [activePage, setActivePage] = useState<number | null>(2);

  const handleSelectQuote = (quote: string, page: number) => {
    setActiveQuote(quote);
    setActivePage(page);
  };

  const handleToggleVerify = (id: string) => {
    setData((prev) => ({
      ...prev,
      criteria_checklist: prev.criteria_checklist.map((item) =>
        item.id === id ? { ...item, verified: !item.verified } : item
      ),
    }));
  };

  const handleReAudit = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      alert("Audit re-run complete: 3 criteria satisfied, 1 documentation gap detected.");
    }, 1200);
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      {/* Top Application Header */}
      <Header
        data={data}
        isMock={isMock}
        onToggleMock={() => setIsMock(!isMock)}
      />

      {/* Main Three-Pane Clinical Workspace */}
      <main className="flex-1 p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 max-w-[1700px] mx-auto w-full">
        {/* Left Pane (Columns 1-4): Document Intake & PDF Viewer (Teammate 1) */}
        <div className="lg:col-span-4 flex flex-col gap-4 h-[calc(100vh-85px)]">
          <IntakeDropzone onAnalyze={handleReAudit} isAnalyzing={isAnalyzing} />
          <div className="flex-1 min-h-[350px]">
            <PDFViewer activeQuote={activeQuote} activePage={activePage} />
          </div>
        </div>

        {/* Center Pane (Columns 5-8): Deterministic Criteria Checklist (Teammate 2) */}
        <div className="lg:col-span-4 h-[calc(100vh-85px)]">
          <CriteriaChecklist
            criteria={data.criteria_checklist}
            onSelectQuote={handleSelectQuote}
            onToggleVerify={handleToggleVerify}
          />
        </div>

        {/* Right Pane (Columns 9-12): Appeal Packet Editor & Exporters (Teammate 2) */}
        <div className="lg:col-span-4 h-[calc(100vh-85px)]">
          <AppealLetterView appeal={data.appeal_letter} />
        </div>
      </main>
    </div>
  );
}
