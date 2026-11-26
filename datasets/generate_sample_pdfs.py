import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "sample_cases")
os.makedirs(OUTPUT_DIR, exist_ok=True)

def generate_doctor_notes():
    pdf_path = os.path.join(OUTPUT_DIR, "case_01_doctor_notes.pdf")
    doc = SimpleDocTemplate(pdf_path, pagesize=letter, leftMargin=40, rightMargin=40, topMargin=40, bottomMargin=40)
    styles = getSampleStyleSheet()

    header_style = ParagraphStyle('HeaderStyle', parent=styles['Heading1'], fontSize=16, leading=20, textColor=colors.HexColor("#1e3a8a"))
    subheader_style = ParagraphStyle('SubHeaderStyle', parent=styles['Heading3'], fontSize=11, leading=15, textColor=colors.HexColor("#1e293b"))
    body_style = ParagraphStyle('Body', parent=styles['Normal'], fontSize=9.5, leading=14, textColor=colors.HexColor("#334155"))
    bold_body = ParagraphStyle('BoldBody', parent=body_style, fontName="Helvetica-Bold")

    elements = []

    # Clinic Header
    elements.append(Paragraph("VALLEY ORTHOPEDIC & SPINE SPECIALISTS", header_style))
    elements.append(Paragraph("4200 Health Park Blvd, Suite 300 | Phone: (555) 849-2000 | Fax: (555) 849-2001", subheader_style))
    elements.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#1e3a8a"), spaceAfter=12))

    # Patient Details Table
    patient_data = [
        [Paragraph("<b>Patient Name:</b> Sarah Jenkins", body_style), Paragraph("<b>DOB:</b> 04/12/1978 (Age: 48)", body_style)],
        [Paragraph("<b>Encounter Date:</b> 10/20/2026", body_style), Paragraph("<b>MRN:</b> VOS-992144", body_style)],
        [Paragraph("<b>Provider:</b> Robert Vance, MD (Spine)", body_style), Paragraph("<b>Insurance:</b> Aetna Commercial", body_style)],
    ]
    t = Table(patient_data, colWidths=[260, 260])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f8fafc")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#cbd5e1")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#e2e8f0")),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ]))
    elements.append(t)
    elements.append(Spacer(1, 12))

    # Chief Complaint
    elements.append(Paragraph("CHIEF COMPLAINT", bold_body))
    elements.append(Paragraph("Severe, intractable low back pain radiating bilaterally to the L5 dermatomal distribution into the buttocks and calves. Walking tolerance limited to under 50 yards.", body_style))
    elements.append(Spacer(1, 10))

    # History of Present Illness (HPI)
    elements.append(Paragraph("HISTORY OF PRESENT ILLNESS & CONSERVATIVE THERAPY", bold_body))
    elements.append(Paragraph(
        "Ms. Jenkins is a 48-year-old female presenting for surgical evaluation of persistent lumbar spondylolisthesis. "
        "Symptoms have been progressively refractory over the past 9 months. "
        "<b>Patient completed 8 weeks of formal physical therapy (twice weekly) focusing on core stabilization without sustained functional improvement.</b> "
        "In addition, she underwent two fluoroscopically guided lumbar epidural steroid injections (LESI at L4-L5) on 06/14/2026 and 08/22/2026, providing only transient relief (< 10 days each). "
        "Trial of scheduled NSAIDs (Meloxicam 15mg daily) and Gabapentin 300mg TID failed to restore functional mobility.",
        body_style
    ))
    elements.append(Spacer(1, 10))

    # Physical Examination
    elements.append(Paragraph("PHYSICAL EXAMINATION", bold_body))
    elements.append(Paragraph(
        "Gait is antalgic with forward lumbar flexion antalgia. Lumbar range of motion is severely restricted in extension due to mechanical pain. "
        "Palpation reveals a palpable step-off at the L4-L5 junction. Motor examination demonstrates 4+/5 weakness in right extensor hallucis longus (EHL). "
        "Deep tendon reflexes: Patellar 2+ bilaterally, Achilles 1+ right, 2+ left. Sensation decreased to light touch over right lateral calf.",
        body_style
    ))
    elements.append(Spacer(1, 10))

    # Assessment & Surgical Plan
    elements.append(Paragraph("ASSESSMENT & SURGICAL RECOMMENDATION", bold_body))
    elements.append(Paragraph("1. Spondylolisthesis, lumbar region (ICD-10 M43.16) - Grade II anterolisthesis at L4-L5 with severe neural stenosis.", body_style))
    elements.append(Paragraph("2. Failed conservative medical management (physical therapy, LESI injections, oral pharmacotherapy).", body_style))
    elements.append(Spacer(1, 6))
    elements.append(Paragraph(
        "<b>Plan:</b> We recommend surgical intervention consisting of <b>Posterior Lumbar Interbody Fusion (PLIF) / Arthrodesis with pedicle screw fixation at L4-L5 (CPT 22612)</b> with decompression laminectomy (CPT 63047). "
        "All conservative modalities have been exhausted and neurologic deficit is progressing.",
        body_style
    ))
    elements.append(Spacer(1, 16))
    elements.append(Paragraph("Electronically Signed by: Robert Vance, MD, FAAOS | Board Certified Orthopaedic Spine Surgeon", bold_body))

    doc.build(elements)
    print(f"Generated: {pdf_path}")

def generate_mri_report():
    pdf_path = os.path.join(OUTPUT_DIR, "case_01_mri_report.pdf")
    doc = SimpleDocTemplate(pdf_path, pagesize=letter, leftMargin=40, rightMargin=40, topMargin=40, bottomMargin=40)
    styles = getSampleStyleSheet()

    header_style = ParagraphStyle('HeaderStyle', parent=styles['Heading1'], fontSize=15, leading=19, textColor=colors.HexColor("#0f766e"))
    subheader_style = ParagraphStyle('SubHeaderStyle', parent=styles['Heading3'], fontSize=10, leading=14, textColor=colors.HexColor("#1e293b"))
    body_style = ParagraphStyle('Body', parent=styles['Normal'], fontSize=9.5, leading=14, textColor=colors.HexColor("#334155"))
    bold_body = ParagraphStyle('BoldBody', parent=body_style, fontName="Helvetica-Bold")

    elements = []

    # Facility Header
    elements.append(Paragraph("APEX ADVANCED DIAGNOSTIC IMAGING CENTER", header_style))
    elements.append(Paragraph("DEPARTMENT OF RADIOLOGY & NEURORADIOLOGY | ACCREDITED ACR FACILITY", subheader_style))
    elements.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#0f766e"), spaceAfter=12))

    # Patient Header Table
    patient_data = [
        [Paragraph("<b>Patient:</b> Sarah Jenkins", body_style), Paragraph("<b>DOB:</b> 04/12/1978", body_style)],
        [Paragraph("<b>Exam Date:</b> 10/14/2026", body_style), Paragraph("<b>Exam:</b> MRI Lumbar Spine W/O Contrast", body_style)],
        [Paragraph("<b>Accession:</b> RAD-2026-88190", body_style), Paragraph("<b>Ordering MD:</b> Robert Vance, MD", body_style)],
    ]
    t = Table(patient_data, colWidths=[260, 260])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f0fdfa")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#99f6e4")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#ccfbf1")),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ]))
    elements.append(t)
    elements.append(Spacer(1, 14))

    elements.append(Paragraph("CLINICAL INDICATION", bold_body))
    elements.append(Paragraph("48-year-old female with intractable low back pain, radiculopathy, and suspected lumbar instability.", body_style))
    elements.append(Spacer(1, 10))

    elements.append(Paragraph("TECHNIQUE", bold_body))
    elements.append(Paragraph("Multiplanar, multisequence magnetic resonance imaging of the lumbar spine was performed without intravenous contrast on a 3.0 Tesla Siemens Skyra system.", body_style))
    elements.append(Spacer(1, 10))

    elements.append(Paragraph("FINDINGS BY SEGMENT", bold_body))
    elements.append(Paragraph("<b>L1-L2 & L2-L3:</b> Normal disc height and signal. No canal or foraminal narrowing.", body_style))
    elements.append(Paragraph("<b>L3-L4:</b> Mild broad-based disc bulge without significant central spinal stenosis.", body_style))
    elements.append(Paragraph("<b>L4-L5:</b> Severe degenerative spondylosis. <b>MRI of Lumbar Spine (dated 2026-10-14) reveals Grade II anterolisthesis of L4 on L5 with severe secondary canal stenosis and bilateral neuroforaminal impingement.</b> There is marked facet arthrosis and ligamentum flavum hypertrophy resulting in AP thecal sac compression of 6mm.", body_style))
    elements.append(Paragraph("<b>L5-S1:</b> Mild desiccative disc changes. Neural foramina remain patent.", body_style))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph("IMPRESSION", bold_body))
    elements.append(Paragraph("1. Grade II anterolisthesis at L4 on L5 secondary to severe facet arthropathy and degenerative disc collapse.", body_style))
    elements.append(Paragraph("2. Severe central spinal canal stenosis and bilateral exiting L4 and traversing L5 nerve root impingement at L4-L5.", body_style))
    elements.append(Spacer(1, 16))
    elements.append(Paragraph("Interpreted by: Elena Rostova, MD, Neuroradiology Section Chief", bold_body))

    doc.build(elements)
    print(f"Generated: {pdf_path}")

def generate_policy_bulletin():
    pdf_path = os.path.join(OUTPUT_DIR, "case_01_aetna_cpb_0016.pdf")
    doc = SimpleDocTemplate(pdf_path, pagesize=letter, leftMargin=40, rightMargin=40, topMargin=40, bottomMargin=40)
    styles = getSampleStyleSheet()

    header_style = ParagraphStyle('HeaderStyle', parent=styles['Heading1'], fontSize=15, leading=19, textColor=colors.HexColor("#7c2d12"))
    body_style = ParagraphStyle('Body', parent=styles['Normal'], fontSize=9.5, leading=14, textColor=colors.HexColor("#334155"))
    bold_body = ParagraphStyle('BoldBody', parent=body_style, fontName="Helvetica-Bold")

    elements = []

    elements.append(Paragraph("AETNA CLINICAL POLICY BULLETIN", header_style))
    elements.append(Paragraph("POLICY NUMBER 0016: VERTEBRAL ARTHRODESIS (SPINAL FUSION)", bold_body))
    elements.append(Paragraph("Effective Date: January 1, 2026 | Last Review: September 2026", body_style))
    elements.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#7c2d12"), spaceAfter=12))

    elements.append(Paragraph("POLICY COVERAGE CRITERIA", bold_body))
    elements.append(Paragraph(
        "Aetna considers lumbar spinal fusion (CPT 22612) medically necessary for adult members with degenerative spondylolisthesis when ALL of the following criteria (1 through 3) are satisfied:",
        body_style
    ))
    elements.append(Spacer(1, 10))

    elements.append(Paragraph(
        "<b>Criterion 1 (Conservative Care Requirement):</b><br/>"
        "Documented completion of >= 6 weeks supervised physical therapy within the past 12 months with persistent disabling functional impairment, unless immediate neurologic compromise is present.",
        body_style
    ))
    elements.append(Spacer(1, 8))

    elements.append(Paragraph(
        "<b>Criterion 2 (Neuroimaging Requirement):</b><br/>"
        "Diagnostic neuroimaging (MRI or CT myelogram) confirming severe spondylolisthesis (Grade II or higher) or neural compression corresponding to radicular neurological findings on physical exam.",
        body_style
    ))
    elements.append(Spacer(1, 8))

    elements.append(Paragraph(
        "<b>Criterion 3 (Dynamic Stability Imaging Requirement):</b><br/>"
        "Dynamic weight-bearing flexion and extension plain radiographs within 90 days demonstrating segmental instability (>= 4mm translation or >= 10 degrees angular motion).",
        body_style
    ))
    elements.append(Spacer(1, 14))

    elements.append(Paragraph("DENIAL REASON CODE D-0821 EXPLANATION", bold_body))
    elements.append(Paragraph(
        "Claims or authorizations lacking current dynamic flexion/extension radiographs within 90 days will be systematically denied under code D-0821 until supplementary radiographic evidence is furnished.",
        body_style
    ))

    doc.build(elements)
    print(f"Generated: {pdf_path}")

if __name__ == "__main__":
    generate_doctor_notes()
    generate_mri_report()
    generate_policy_bulletin()
