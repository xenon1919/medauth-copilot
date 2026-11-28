export interface CitationAnchor {
  page: number;
  boundingBox: [number, number, number, number]; // [x0, y0, x1, y1]
  quote: string;
}

export interface CriterionItem {
  id: string;
  rule: string;
  status: "SATISFIED" | "UNMET" | "GAP_DETECTED";
  quote: string | null;
  page: number | null;
  boundingBox?: [number, number, number, number];
  action_needed?: string;
  verified?: boolean;
}

export interface AppealLetter {
  date: string;
  recipient: string;
  subject: string;
  body_markdown: string;
}

export interface AuditCaseData {
  case_id: string;
  patient_name: string;
  patient_dob: string;
  procedure: string;
  specialty?: string;
  cpt_code: string;
  icd10_code: string;
  insurer: string;
  policy_id: string;
  overall_status: "READY_FOR_APPEAL" | "ACTION_REQUIRED" | "IN_REVIEW";
  criteria_checklist: CriterionItem[];
  appeal_letter: AppealLetter;
}
