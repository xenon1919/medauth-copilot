import { AuditCaseData } from "@/types/audit";

export const SAMPLE_CASES: Record<string, AuditCaseData> = {
  case_01: {
    case_id: "AUTH-2026-9921",
    patient_name: "Sarah Jenkins",
    patient_dob: "1978-04-12",
    procedure: "Lumbar Spinal Fusion",
    cpt_code: "22612",
    icd10_code: "M43.16 (Spondylolisthesis, lumbar region)",
    insurer: "Aetna Commercial",
    policy_id: "CPB #0016 (Vertebral Arthrodesis)",
    overall_status: "ACTION_REQUIRED",
    criteria_checklist: [
      {
        id: "crit_1",
        rule: "Documented completion of >= 6 weeks supervised physical therapy within the past 12 months",
        status: "SATISFIED",
        quote: "Patient completed 8 weeks of formal physical therapy (twice weekly) focusing on core stabilization without sustained functional improvement.",
        page: 1,
        boundingBox: [46.0, 275.83, 566.0, 302.92],
        verified: true,
      },
      {
        id: "crit_2",
        rule: "Diagnostic imaging (MRI/CT) confirming severe spondylolisthesis (Grade II or higher) or neural compression",
        status: "SATISFIED",
        quote: "MRI of Lumbar Spine (dated 2026-10-14) reveals Grade II anterolisthesis of L4 on L5 with severe secondary canal stenosis and bilateral neuroforaminal impingement.",
        page: 1,
        boundingBox: [46.0, 327.83, 557.59, 354.92],
        verified: true,
      },
      {
        id: "crit_3",
        rule: "Dynamic weight-bearing flexion and extension plain radiographs within 90 days demonstrating segmental instability",
        status: "GAP_DETECTED",
        quote: null,
        page: null,
        action_needed: "Dynamic standing X-rays on file are 11 months old. Recommend clinic physician orders updated lumbar flexion/extension series before submission.",
        verified: false,
      },
    ],
    appeal_letter: {
      date: "November 28, 2026",
      recipient: "Aetna Commercial Appeals Committee\nP.O. Box 14079\nLexington, KY 40512",
      subject: "EXPEDITED APPEAL: Prior Authorization Denial for Lumbar Spinal Fusion (CPT 22612) | Patient: Sarah Jenkins (DOB: 04/12/1978)",
      body_markdown: `### CLINICAL NECESSITY SUBSTANTIATION & EXPEDITED RECONSIDERATION

**To the Medical Review Board:**

This is a formal first-level expedited appeal on behalf of **Sarah Jenkins** for CPT code **22612** (Lumbar Arthrodesis with pedicle screw fixation at L4-L5).

The denial cited: *"Clinical documentation fails to satisfy prerequisite criteria outlined in CPB #0016 regarding conservative therapy and segmental instability."*

Upon clinical re-audit of the patient encounter and radiology records, the medical necessity is fully substantiated:
1. **Supervised Conservative Therapy (SATISFIED)**: Patient completed 8 weeks of formal physical therapy twice weekly focusing on core stabilization without sustained functional improvement [Doctor Encounter Note, Page 1].
2. **High-Resolution Neuroimaging (SATISFIED)**: 3.0T MRI reveals Grade II anterolisthesis of L4 on L5 with severe central canal stenosis and bilateral exiting L4/traversing L5 nerve root impingement [Apex Radiology Report, Page 1].
3. **Dynamic Stability Radiographs (REMEDIATION IN PROGRESS)**: Dynamic weight-bearing lumbar flexion/extension plain films have been ordered under statutory protocol.

We request an immediate overturn of this denial and urgent prior authorization for **CPT 22612**.

Sincerely,  
**Robert Vance, MD, FAAOS**  
Board Certified Orthopaedic Spine Surgeon  
NPI: 1982736450 | State License: ME-98214`,
    },
  },

  case_02: {
    case_id: "AUTH-2026-4491",
    patient_name: "Marcus Vance",
    patient_dob: "1982-08-24",
    procedure: "Humira Biologic Therapy (Adalimumab 40mg/0.8mL)",
    cpt_code: "J0135",
    icd10_code: "M05.79 (Rheumatoid arthritis with rheumatoid factor)",
    insurer: "UnitedHealthcare Commercial",
    policy_id: "Policy 042: Tumor Necrosis Factor Inhibitors",
    overall_status: "READY_FOR_APPEAL",
    criteria_checklist: [
      {
        id: "crit_1",
        rule: "Documented trial and failure of conventional DMARD (e.g. Methotrexate >= 20mg/wk) for >= 3 consecutive months",
        status: "SATISFIED",
        quote: "Documented trial and failure of Methotrexate 25mg weekly for 3 months due to persistent elevated CRP and severe joint erosion.",
        page: 1,
        boundingBox: [46.0, 290.0, 560.0, 320.0],
        verified: true,
      },
      {
        id: "crit_2",
        rule: "Negative screening result for latent tuberculosis (QuantiFERON-TB Gold or PPD) within previous 12 months",
        status: "SATISFIED",
        quote: "QuantiFERON-TB Gold Plus test performed on 09/18/2026 was negative for latent Mycobacterium tuberculosis infection.",
        page: 1,
        boundingBox: [46.0, 310.0, 550.0, 335.0],
        verified: true,
      },
      {
        id: "crit_3",
        rule: "Prescribed by or in direct consultation with a board-certified rheumatologist",
        status: "SATISFIED",
        quote: "Electronically Signed by: Sarah Lin, MD, FACR | Board Certified Rheumatologist",
        page: 1,
        boundingBox: [46.0, 480.0, 480.0, 500.0],
        verified: true,
      },
    ],
    appeal_letter: {
      date: "November 28, 2026",
      recipient: "UnitedHealthcare Prior Authorization Appeals\nP.O. Box 30515\nSalt Lake City, UT 84130",
      subject: "EXPEDITED BIOLOGIC APPEAL: Prior Authorization for Humira (Adalimumab, HCPCS J0135) | Patient: Marcus Vance (DOB: 08/24/1982)",
      body_markdown: `### CLINICAL JUSTIFICATION FOR BIOLOGIC INITIATION (ADALIMUMAB)

**To the Medical Director:**

We are formally appealing the initial adverse determination for **Marcus Vance** regarding **Humira (Adalimumab 40mg)** every 14 days for active seropositive Rheumatoid Arthritis.

The denial cited lack of documented conventional synthetic DMARD inadequacy. However, our records unequivocally prove:
1. **Conventional DMARD Inadequacy (SATISFIED)**: The patient completed a rigorous 3-month trial of Methotrexate 25mg weekly with treatment failure, persistent DAS28 score of 5.8, elevated CRP, and medication-induced gastrointestinal toxicity [Pacific Arthritis Institute, Page 1].
2. **Infection Pre-Screening (SATISFIED)**: QuantiFERON-TB Gold Plus collected on 09/18/2026 was negative, clearing the patient for anti-TNF biologic initiation [MetroPath Laboratories, Page 1].
3. **Specialist Attestation (SATISFIED)**: Evaluated and prescribed directly by a board-certified rheumatologist [Dr. Sarah Lin, MD, FACR].

All UnitedHealthcare Policy #042 requirements have been verified verbatim against the clinical chart. We request immediate reversal and authorization.

Sincerely,  
**Sarah Lin, MD, FACR**  
Pacific Arthritis & Rheumatology Institute  
NPI: 1472891023`,
    },
  },

  case_03: {
    case_id: "AUTH-2026-6102",
    patient_name: "David Chen",
    patient_dob: "1965-11-03",
    procedure: "Left Heart Catheterization with Selective Coronary Angiography",
    cpt_code: "93458",
    icd10_code: "I25.10 (Atherosclerotic heart disease)",
    insurer: "Cigna Healthcare",
    policy_id: "Policy 0189: Diagnostic Coronary Angiography",
    overall_status: "ACTION_REQUIRED",
    criteria_checklist: [
      {
        id: "crit_1",
        rule: "Refractory Canadian Cardiovascular Society Class III or IV angina despite guideline-directed dual antianginal therapy",
        status: "SATISFIED",
        quote: "Patient has refractory Canadian Cardiovascular Society Class III angina despite guideline-directed medical therapy including Metoprolol Succinate 100mg daily and Isosorbide Mononitrate 60mg daily.",
        page: 1,
        boundingBox: [46.0, 275.0, 560.0, 310.0],
        verified: true,
      },
      {
        id: "crit_2",
        rule: "High-risk non-invasive testing demonstrating objective inducible ischemia involving >= 10% of myocardium",
        status: "SATISFIED",
        quote: "Myocardial perfusion SPECT imaging demonstrates a large, reversible defect in the anterior and apical left ventricular walls.",
        page: 1,
        boundingBox: [46.0, 320.0, 555.0, 350.0],
        verified: true,
      },
      {
        id: "crit_3",
        rule: "Serum renal function panel (eGFR >= 30 mL/min or nephrology clearance) within 30 days prior to radiocontrast",
        status: "GAP_DETECTED",
        quote: null,
        page: null,
        action_needed: "Baseline BMP/CMP showing eGFR within 30 days of procedure is required prior to radiocontrast administration. Order updated renal panel.",
        verified: false,
      },
    ],
    appeal_letter: {
      date: "November 28, 2026",
      recipient: "Cigna Healthcare Clinical Appeals Unit\nP.O. Box 188011\nChattanooga, TN 37422",
      subject: "EXPEDITED RECONSIDERATION: Outpatient Diagnostic Coronary Angiography (CPT 93458) | Patient: David Chen",
      body_markdown: `### EMERGENCY CORONARY ARTERY DISEASE SUBSTANTIATION

**To the Cardiology Reviewer:**

We appeal the denial for outpatient **Left Heart Catheterization (CPT 93458)** for David Chen.

Clinical criteria substantiation:
1. **Refractory Symptoms (SATISFIED)**: Despite dual antianginal therapy (Metoprolol 100mg + Isosorbide 60mg), the patient suffers from debilitating CCS Class III angina triggered by walking less than 1 block [Summit Heart Institute, Page 1].
2. **High-Risk Objective Ischemia (SATISFIED)**: Nuclear SPECT stress imaging proves a large, reversible defect involving 18% of the left ventricle in the LAD distribution with transient ischemic dilation [Summit Nuclear Labs, Page 1].
3. **Contrast Clearance (IN PROTOCOL)**: Stat renal panel has been ordered prior to cath lab scheduling.

Delaying coronary angiography in a patient with 18% LAD myocardial ischemia presents imminent danger of acute myocardial infarction. We request immediate authorization.

Sincerely,  
**Arthur Pendelton, MD, FACC**  
Summit Heart & Vascular Institute  
NPI: 1092837461`,
    },
  },
};
