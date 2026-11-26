import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "sample_cases")
os.makedirs(OUTPUT_DIR, exist_ok=True)

styles = getSampleStyleSheet()
header_blue = ParagraphStyle('HeaderBlue', parent=styles['Heading1'], fontSize=15, leading=19, textColor=colors.HexColor("#1e3a8a"))
header_teal = ParagraphStyle('HeaderTeal', parent=styles['Heading1'], fontSize=15, leading=19, textColor=colors.HexColor("#0f766e"))
header_red = ParagraphStyle('HeaderRed', parent=styles['Heading1'], fontSize=15, leading=19, textColor=colors.HexColor("#991b1b"))
header_purple = ParagraphStyle('HeaderPurple', parent=styles['Heading1'], fontSize=15, leading=19, textColor=colors.HexColor("#581c87"))
subheader_style = ParagraphStyle('SubHeader', parent=styles['Heading3'], fontSize=10, leading=14, textColor=colors.HexColor("#334155"))
body_style = ParagraphStyle('Body', parent=styles['Normal'], fontSize=9.5, leading=14, textColor=colors.HexColor("#334155"))
bold_body = ParagraphStyle('BoldBody', parent=body_style, fontName="Helvetica-Bold")

# =========================================================================
# CASE 01: SARAH JENKINS (ORTHOPEDIC SPINE - LUMBAR FUSION)
# =========================================================================
def generate_case_01():
    # 1. Doctor Notes
    doc_path = os.path.join(OUTPUT_DIR, "case_01_doctor_notes.pdf")
    doc = SimpleDocTemplate(doc_path, pagesize=letter, leftMargin=40, rightMargin=40, topMargin=40, bottomMargin=40)
    elements = [
        Paragraph("VALLEY ORTHOPEDIC & SPINE SPECIALISTS", header_blue),
        Paragraph("4200 Health Park Blvd, Suite 300 | Phone: (555) 849-2000 | Fax: (555) 849-2001", subheader_style),
        HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#1e3a8a"), spaceAfter=12),
        Table([
            [Paragraph("<b>Patient Name:</b> Sarah Jenkins", body_style), Paragraph("<b>DOB:</b> 04/12/1978 (Age: 48)", body_style)],
            [Paragraph("<b>Encounter Date:</b> 10/20/2026", body_style), Paragraph("<b>MRN:</b> VOS-992144", body_style)],
            [Paragraph("<b>Provider:</b> Robert Vance, MD (Spine)", body_style), Paragraph("<b>Insurance:</b> Aetna Commercial", body_style)],
        ], colWidths=[260, 260], style=[
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f8fafc")),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#cbd5e1")),
            ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#e2e8f0")),
            ('TOPPADDING', (0,0), (-1,-1), 5), ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ]),
        Spacer(1, 10),
        Paragraph("CHIEF COMPLAINT", bold_body),
        Paragraph("Severe, intractable low back pain radiating bilaterally to the L5 dermatomal distribution into the buttocks and calves. Walking tolerance limited to under 50 yards.", body_style),
        Spacer(1, 10),
        Paragraph("HISTORY OF PRESENT ILLNESS & CONSERVATIVE THERAPY", bold_body),
        Paragraph(
            "Ms. Jenkins is a 48-year-old female presenting for surgical evaluation of persistent lumbar spondylolisthesis. "
            "Symptoms have been progressively refractory over the past 9 months. "
            "<b>Patient completed 8 weeks of formal physical therapy (twice weekly) focusing on core stabilization without sustained functional improvement.</b> "
            "In addition, she underwent two fluoroscopically guided lumbar epidural steroid injections (LESI at L4-L5) on 06/14/2026 and 08/22/2026, providing only transient relief (< 10 days each). "
            "Trial of scheduled NSAIDs (Meloxicam 15mg daily) and Gabapentin 300mg TID failed to restore functional mobility.",
            body_style
        ),
        Spacer(1, 10),
        Paragraph("PHYSICAL EXAMINATION", bold_body),
        Paragraph("Gait is antalgic with forward lumbar flexion antalgia. Palpable step-off at L4-L5 junction. Motor examination: 4+/5 right extensor hallucis longus (EHL). Reflexes: Patellar 2+ bilaterally, Achilles 1+ right, 2+ left.", body_style),
        Spacer(1, 10),
        Paragraph("ASSESSMENT & SURGICAL RECOMMENDATION", bold_body),
        Paragraph("1. Spondylolisthesis, lumbar region (ICD-10 M43.16) - Grade II anterolisthesis at L4-L5 with severe neural stenosis.", body_style),
        Paragraph("2. Failed conservative medical management (physical therapy, LESI injections, oral pharmacotherapy).", body_style),
        Spacer(1, 6),
        Paragraph("<b>Plan:</b> We recommend surgical intervention consisting of <b>Posterior Lumbar Interbody Fusion (PLIF) / Arthrodesis with pedicle screw fixation at L4-L5 (CPT 22612)</b> with decompression laminectomy (CPT 63047).", body_style),
        Spacer(1, 14),
        Paragraph("Electronically Signed by: Robert Vance, MD, FAAOS | Board Certified Orthopaedic Spine Surgeon", bold_body)
    ]
    doc.build(elements)

    # 2. MRI Report
    mri_path = os.path.join(OUTPUT_DIR, "case_01_mri_report.pdf")
    doc_mri = SimpleDocTemplate(mri_path, pagesize=letter, leftMargin=40, rightMargin=40, topMargin=40, bottomMargin=40)
    elements_mri = [
        Paragraph("APEX ADVANCED DIAGNOSTIC IMAGING CENTER", header_teal),
        Paragraph("DEPARTMENT OF RADIOLOGY & NEURORADIOLOGY | ACCREDITED ACR FACILITY", subheader_style),
        HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#0f766e"), spaceAfter=12),
        Table([
            [Paragraph("<b>Patient:</b> Sarah Jenkins", body_style), Paragraph("<b>DOB:</b> 04/12/1978", body_style)],
            [Paragraph("<b>Exam Date:</b> 10/14/2026", body_style), Paragraph("<b>Exam:</b> MRI Lumbar Spine W/O Contrast", body_style)],
            [Paragraph("<b>Accession:</b> RAD-2026-88190", body_style), Paragraph("<b>Ordering MD:</b> Robert Vance, MD", body_style)],
        ], colWidths=[260, 260], style=[
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f0fdfa")),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#99f6e4")),
            ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#ccfbf1")),
            ('TOPPADDING', (0,0), (-1,-1), 5), ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ]),
        Spacer(1, 12),
        Paragraph("FINDINGS BY SEGMENT", bold_body),
        Paragraph("<b>L4-L5:</b> Severe degenerative spondylosis. <b>MRI of Lumbar Spine (dated 2026-10-14) reveals Grade II anterolisthesis of L4 on L5 with severe secondary canal stenosis and bilateral neuroforaminal impingement.</b> Marked facet arthrosis and ligamentum flavum hypertrophy resulting in AP thecal sac compression of 6mm.", body_style),
        Spacer(1, 10),
        Paragraph("IMPRESSION", bold_body),
        Paragraph("1. Grade II anterolisthesis at L4 on L5 secondary to severe facet arthropathy and degenerative disc collapse.", body_style),
        Paragraph("2. Severe central spinal canal stenosis and bilateral exiting L4 and traversing L5 nerve root impingement at L4-L5.", body_style),
        Spacer(1, 14),
        Paragraph("Interpreted by: Elena Rostova, MD, Neuroradiology Section Chief", bold_body)
    ]
    doc_mri.build(elements_mri)

    # 3. Policy Bulletin
    pol_path = os.path.join(OUTPUT_DIR, "case_01_aetna_cpb_0016.pdf")
    doc_pol = SimpleDocTemplate(pol_path, pagesize=letter, leftMargin=40, rightMargin=40, topMargin=40, bottomMargin=40)
    elements_pol = [
        Paragraph("AETNA CLINICAL POLICY BULLETIN", header_red),
        Paragraph("POLICY NUMBER 0016: VERTEBRAL ARTHRODESIS (SPINAL FUSION)", bold_body),
        Paragraph("Effective Date: January 1, 2026 | Last Review: September 2026", body_style),
        HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#7c2d12"), spaceAfter=12),
        Paragraph("POLICY COVERAGE CRITERIA", bold_body),
        Paragraph("Aetna considers lumbar spinal fusion (CPT 22612) medically necessary when ALL of the following criteria (1 through 3) are satisfied:", body_style),
        Spacer(1, 8),
        Paragraph("<b>Criterion 1:</b> Documented completion of >= 6 weeks supervised physical therapy within the past 12 months with persistent functional impairment.", body_style),
        Spacer(1, 6),
        Paragraph("<b>Criterion 2:</b> Diagnostic neuroimaging (MRI/CT) confirming severe spondylolisthesis (Grade II or higher) or neural compression.", body_style),
        Spacer(1, 6),
        Paragraph("<b>Criterion 3:</b> Dynamic weight-bearing flexion and extension plain radiographs within 90 days demonstrating segmental instability.", body_style),
    ]
    doc_pol.build(elements_pol)
    print("Generated Case 01 PDFs.")

# =========================================================================
# CASE 02: MARCUS VANCE (RHEUMATOLOGY - HUMIRA / ADALIMUMAB BIOLOGIC)
# =========================================================================
def generate_case_02():
    # 1. Rheumatology Doctor Notes
    doc_path = os.path.join(OUTPUT_DIR, "case_02_rheumatology_notes.pdf")
    doc = SimpleDocTemplate(doc_path, pagesize=letter, leftMargin=40, rightMargin=40, topMargin=40, bottomMargin=40)
    elements = [
        Paragraph("PACIFIC ARTHRITIS & RHEUMATOLOGY INSTITUTE", header_purple),
        Paragraph("880 Medical Plaza Way, Suite 410 | Phone: (555) 723-9000 | Fax: (555) 723-9001", subheader_style),
        HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#581c87"), spaceAfter=12),
        Table([
            [Paragraph("<b>Patient Name:</b> Marcus Vance", body_style), Paragraph("<b>DOB:</b> 08/24/1982 (Age: 44)", body_style)],
            [Paragraph("<b>Encounter Date:</b> 10/18/2026", body_style), Paragraph("<b>MRN:</b> PARI-44912", body_style)],
            [Paragraph("<b>Provider:</b> Sarah Lin, MD, RhMSUS", body_style), Paragraph("<b>Insurance:</b> UnitedHealthcare Commercial", body_style)],
        ], colWidths=[260, 260], style=[
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#faf5ff")),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#d8b4fe")),
            ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#f3e8ff")),
            ('TOPPADDING', (0,0), (-1,-1), 5), ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ]),
        Spacer(1, 10),
        Paragraph("DIAGNOSIS & CLINICAL STATUS", bold_body),
        Paragraph("Seropositive Rheumatoid Arthritis (ICD-10 M05.79) with high disease activity. Disease Activity Score (DAS28-CRP) calculated at 5.8 today.", body_style),
        Spacer(1, 10),
        Paragraph("CONVENTIONAL DMARD TRIAL & TREATMENT FAILURE", bold_body),
        Paragraph(
            "Patient was diagnosed 14 months ago. "
            "<b>Documented trial and failure of Methotrexate 25mg weekly for 3 months due to persistent elevated CRP and severe joint erosion.</b> "
            "Patient experienced intractable gastrointestinal nausea, elevated ALT/AST hepatotoxicity, and worsening synovitis across bilateral MCP and PIP joints. "
            "Adjunctive Leflunomide 20mg daily was trialed for 8 weeks and discontinued due to severe hypertension.",
            body_style
        ),
        Spacer(1, 10),
        Paragraph("PHYSICAL EXAMINATION", bold_body),
        Paragraph("Synovial proliferation and active boggy synovitis noted in 10 swollen joints (bilateral MCP 2-4, bilateral wrists, bilateral knees). Tender joint count: 14. Grip strength reduced by 60%.", body_style),
        Spacer(1, 10),
        Paragraph("TREATMENT PLAN & PRESCRIPTION REQUEST", bold_body),
        Paragraph("Recommend immediate escalation to biologic anti-TNF agent: <b>Humira (Adalimumab) 40mg subcutaneous injection every 14 days (HCPCS J0135)</b>. Patient has completed baseline infectious screening.", body_style),
        Spacer(1, 14),
        Paragraph("Electronically Signed by: Sarah Lin, MD, FACR | Board Certified Rheumatologist", bold_body)
    ]
    doc.build(elements)

    # 2. TB Screening Lab Report
    lab_path = os.path.join(OUTPUT_DIR, "case_02_tb_quantiferon_lab.pdf")
    doc_lab = SimpleDocTemplate(lab_path, pagesize=letter, leftMargin=40, rightMargin=40, topMargin=40, bottomMargin=40)
    elements_lab = [
        Paragraph("METROPATH REFERENCE CLINICAL LABORATORIES", header_teal),
        Paragraph("MOLECULAR INFECTIOUS DISEASE TESTING DIVISION | CLIA ID: 05D2019482", subheader_style),
        HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#0f766e"), spaceAfter=12),
        Table([
            [Paragraph("<b>Patient:</b> Marcus Vance", body_style), Paragraph("<b>DOB:</b> 08/24/1982", body_style)],
            [Paragraph("<b>Collection Date:</b> 09/18/2026", body_style), Paragraph("<b>Specimen:</b> Whole Blood (Lithium Heparin)", body_style)],
            [Paragraph("<b>Ordering MD:</b> Sarah Lin, MD", body_style), Paragraph("<b>Test:</b> QuantiFERON-TB Gold Plus", body_style)],
        ], colWidths=[260, 260], style=[
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f0fdfa")),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#99f6e4")),
            ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#ccfbf1")),
            ('TOPPADDING', (0,0), (-1,-1), 5), ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ]),
        Spacer(1, 12),
        Paragraph("LABORATORY RESULT SUMMARY", bold_body),
        Paragraph(
            "<b>QuantiFERON-TB Gold Plus test performed on 09/18/2026 was negative for latent Mycobacterium tuberculosis infection.</b> "
            "Nil tube value: 0.05 IU/mL. TB1 minus Nil: 0.02 IU/mL. TB2 minus Nil: 0.01 IU/mL. Mitogen minus Nil: 8.40 IU/mL. "
            "Result interpretation: NEGATIVE. Patient cleared for biologic therapy initiation.",
            body_style
        ),
        Spacer(1, 14),
        Paragraph("Reported by: Marcus Thorne, MD, PhD | Director of Diagnostic Immunology", bold_body)
    ]
    doc_lab.build(elements_lab)

    # 3. UHC Policy Bulletin
    pol_path = os.path.join(OUTPUT_DIR, "case_02_uhc_cpb_humira.pdf")
    doc_pol = SimpleDocTemplate(pol_path, pagesize=letter, leftMargin=40, rightMargin=40, topMargin=40, bottomMargin=40)
    elements_pol = [
        Paragraph("UNITEDHEALTHCARE CLINICAL PHARMACY BULLETIN", header_red),
        Paragraph("POLICY NUMBER 042: TUMOR NECROSIS FACTOR (TNF) INHIBITORS (ADALIMUMAB / HUMIRA)", bold_body),
        Paragraph("Coverage Policy Bulletin | Effective: 2026", body_style),
        HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#7c2d12"), spaceAfter=12),
        Paragraph("CRITERIA FOR INITIAL AUTHORIZATION (RHEUMATOID ARTHRITIS)", bold_body),
        Paragraph("UnitedHealthcare approves Adalimumab (Humira, HCPCS J0135) for 12 months when ALL of the following criteria are met:", body_style),
        Spacer(1, 8),
        Paragraph("<b>Criterion 1 (Conventional DMARD Inadequacy):</b> Documented trial and failure or contraindication of at least 1 conventional DMARD (e.g. Methotrexate >= 20mg/wk) for a minimum of 3 consecutive months.", body_style),
        Spacer(1, 6),
        Paragraph("<b>Criterion 2 (Infection Pre-Screening):</b> Negative screening result for latent tuberculosis (e.g., QuantiFERON-TB Gold or PPD skin test) within the previous 12 months.", body_style),
        Spacer(1, 6),
        Paragraph("<b>Criterion 3 (Specialist Attestation):</b> Prescribed by or in direct consultation with a board-certified rheumatologist.", body_style),
    ]
    doc_pol.build(elements_pol)
    print("Generated Case 02 PDFs.")

# =========================================================================
# CASE 03: DAVID CHEN (CARDIOLOGY - HEART CATHETERIZATION)
# =========================================================================
def generate_case_03():
    # 1. Cardiology Encounter Notes
    doc_path = os.path.join(OUTPUT_DIR, "case_03_cardiology_notes.pdf")
    doc = SimpleDocTemplate(doc_path, pagesize=letter, leftMargin=40, rightMargin=40, topMargin=40, bottomMargin=40)
    elements = [
        Paragraph("SUMMIT HEART & VASCULAR INSTITUTE", header_blue),
        Paragraph("1200 Cardio Center Way, 2nd Floor | Phone: (555) 330-1000 | Fax: (555) 330-1001", subheader_style),
        HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#1e3a8a"), spaceAfter=12),
        Table([
            [Paragraph("<b>Patient Name:</b> David Chen", body_style), Paragraph("<b>DOB:</b> 11/03/1965 (Age: 61)", body_style)],
            [Paragraph("<b>Encounter Date:</b> 10/22/2026", body_style), Paragraph("<b>MRN:</b> SHVI-61029", body_style)],
            [Paragraph("<b>Provider:</b> Arthur Pendelton, MD, FACC", body_style), Paragraph("<b>Insurance:</b> Cigna Healthcare", body_style)],
        ], colWidths=[260, 260], style=[
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f8fafc")),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#cbd5e1")),
            ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#e2e8f0")),
            ('TOPPADDING', (0,0), (-1,-1), 5), ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ]),
        Spacer(1, 10),
        Paragraph("CARDIOLOGY CONSULTATION NOTE", bold_body),
        Paragraph("Patient presents with escalating angina on minimal exertion (Canadian Cardiovascular Society Class III). Symptoms occur when walking flat ground < 1 block or climbing 1 flight of stairs.", body_style),
        Spacer(1, 10),
        Paragraph("MAXIMAL MEDICAL THERAPY FAILURE", bold_body),
        Paragraph(
            "<b>Patient has refractory Canadian Cardiovascular Society Class III angina despite guideline-directed medical therapy including Metoprolol Succinate 100mg daily and Isosorbide Mononitrate 60mg daily.</b> "
            "Sublingual nitroglycerin requirement has escalated to 4-5 doses weekly. Rest ECG demonstrates resting T-wave inversions in leads V4-V6.",
            body_style
        ),
        Spacer(1, 10),
        Paragraph("RECOMMENDATION", bold_body),
        Paragraph("Recommend urgent outpatient <b>Left Heart Catheterization with Selective Coronary Angiography (CPT 93458)</b> for definitive anatomic delineation of high-risk ischemic myocardium.", body_style),
        Spacer(1, 14),
        Paragraph("Electronically Signed by: Arthur Pendelton, MD, FACC | Interventional Cardiologist", bold_body)
    ]
    doc.build(elements)

    # 2. SPECT Stress Test
    spect_path = os.path.join(OUTPUT_DIR, "case_03_stress_spect_report.pdf")
    doc_spect = SimpleDocTemplate(spect_path, pagesize=letter, leftMargin=40, rightMargin=40, topMargin=40, bottomMargin=40)
    elements_spect = [
        Paragraph("SUMMIT NUCLEAR CARDIOLOGY LABORATORIES", header_teal),
        Paragraph("ICANL ACCREDITED NUCLEAR CARDIOLOGY SERVICE", subheader_style),
        HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#0f766e"), spaceAfter=12),
        Table([
            [Paragraph("<b>Patient:</b> David Chen", body_style), Paragraph("<b>DOB:</b> 11/03/1965", body_style)],
            [Paragraph("<b>Exam Date:</b> 10/16/2026", body_style), Paragraph("<b>Exam:</b> Myocardial Perfusion SPECT Stress Test", body_style)],
            [Paragraph("<b>Ordering MD:</b> Arthur Pendelton, MD", body_style), Paragraph("<b>Tracer:</b> Tc-99m Sestamibi (Rest & Stress)", body_style)],
        ], colWidths=[260, 260], style=[
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f0fdfa")),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#99f6e4")),
            ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#ccfbf1")),
            ('TOPPADDING', (0,0), (-1,-1), 5), ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ]),
        Spacer(1, 12),
        Paragraph("IMAGING FINDINGS & QUANTIFICATION", bold_body),
        Paragraph(
            "<b>Myocardial perfusion SPECT imaging demonstrates a large, reversible defect in the anterior and apical left ventricular walls.</b> "
            "The reversible defect involves approximately 18% of the total left ventricular myocardium, consistent with severe, high-risk inducible ischemia in the LAD vascular territory.",
            body_style
        ),
        Spacer(1, 10),
        Paragraph("CONCLUSION", bold_body),
        Paragraph("1. High-risk abnormal nuclear stress test with 18% ischemia in LAD distribution.", body_style),
        Paragraph("2. LVEF drops from 55% at rest to 42% post-stress (transient ischemic dilation positive).", body_style),
        Spacer(1, 14),
        Paragraph("Interpreted by: Jonathan Ross, MD, FASNC | Nuclear Cardiologist", bold_body)
    ]
    doc_spect.build(elements_spect)

    # 3. Cigna Policy Bulletin
    pol_path = os.path.join(OUTPUT_DIR, "case_03_cigna_cpb_cath.pdf")
    doc_pol = SimpleDocTemplate(pol_path, pagesize=letter, leftMargin=40, rightMargin=40, topMargin=40, bottomMargin=40)
    elements_pol = [
        Paragraph("CIGNA HEALTHCARE CLINICAL POLICY BULLETIN", header_red),
        Paragraph("POLICY NUMBER 0189: DIAGNOSTIC CORONARY ANGIOGRAPHY & HEART CATHETERIZATION", bold_body),
        Paragraph("Coverage Policy | CPT 93458", body_style),
        HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#7c2d12"), spaceAfter=12),
        Paragraph("COVERAGE GUIDELINES", bold_body),
        Paragraph("Cigna considers diagnostic coronary angiography medically necessary when ANY of the following indications are substantiated:", body_style),
        Spacer(1, 8),
        Paragraph("<b>Criterion 1:</b> Refractory Canadian Cardiovascular Society Class III or IV angina despite guideline-directed dual antianginal therapy.", body_style),
        Spacer(1, 6),
        Paragraph("<b>Criterion 2:</b> High-risk non-invasive testing demonstrating objective inducible ischemia involving >= 10% of myocardium on SPECT, PET, or stress echo.", body_style),
        Spacer(1, 6),
        Paragraph("<b>Criterion 3:</b> Serum renal function panel (eGFR >= 30 mL/min or nephrology clearance) within 30 days prior to iodinated radiocontrast administration.", body_style),
    ]
    doc_pol.build(elements_pol)
    print("Generated Case 03 PDFs.")

if __name__ == "__main__":
    generate_case_01()
    generate_case_02()
    generate_case_03()
    print("All multi-specialty clinical PDFs generated successfully!")
