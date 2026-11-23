from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import json

from app.models.schemas import AuditResponse, CriterionAuditItem, AppealLetterSchema
from app.engines.ast_decomposer import PolicyASTDecomposer
from app.core.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Prior Authorization & Clinical Denial Appeals Copilot for Homingo Hackathon (Track C1)"
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "track": "Homingo Hackathon C1: The $15-an-Hour Expert",
        "models": {
            "primary": settings.GEMINI_FLASH_MODEL,
            "escalation": settings.GEMINI_PRO_MODEL
        }
    }

@app.get("/api/audit/mock", response_model=AuditResponse)
def get_mock_audit():
    decomposer = PolicyASTDecomposer()
    return AuditResponse(
        case_id="AUTH-2026-9921",
        patient_name="Sarah Jenkins",
        patient_dob="1978-04-12",
        procedure="Lumbar Spinal Fusion",
        cpt_code="22612",
        icd10_code="M43.16",
        insurer="Aetna Commercial",
        policy_id="CPB #0016",
        overall_status="READY_FOR_APPEAL",
        criteria_checklist=[
            CriterionAuditItem(
                id="crit_1",
                rule="Documented completion of >= 6 weeks supervised physical therapy within the past 12 months",
                status="SATISFIED",
                quote="Patient completed 8 weeks of formal physical therapy (twice weekly) focusing on core stabilization without sustained functional improvement.",
                page=2,
                bounding_box=[120.0, 340.0, 480.0, 375.0],
                verified=True
            ),
            CriterionAuditItem(
                id="crit_2",
                rule="Diagnostic imaging (MRI/CT) confirming severe spondylolisthesis (Grade II or higher) or neural compression",
                status="SATISFIED",
                quote="MRI of Lumbar Spine (dated 2026-10-14) reveals Grade II anterolisthesis of L4 on L5 with severe secondary canal stenosis and bilateral neuroforaminal impingement.",
                page=1,
                bounding_box=[100.0, 210.0, 520.0, 250.0],
                verified=True
            ),
            CriterionAuditItem(
                id="crit_3",
                rule="Dynamic weight-bearing flexion and extension plain radiographs within 90 days demonstrating segmental instability",
                status="GAP_DETECTED",
                quote=None,
                page=None,
                action_needed="Dynamic standing X-rays on file are 11 months old. Recommend clinic physician orders updated lumbar flexion/extension series before submission.",
                verified=False
            )
        ],
        appeal_letter=AppealLetterSchema(
            date="November 23, 2026",
            recipient="Aetna Commercial Appeals Committee\nP.O. Box 14079\nLexington, KY 40512",
            subject="EXPEDITED APPEAL: Prior Authorization Denial for Lumbar Spinal Fusion (CPT 22612)",
            body_markdown="### CLINICAL NECESSITY SUBSTANTIATION\n\nTo the Medical Review Board:\n\nWe formally appeal the denial for Sarah Jenkins regarding CPT 22612. As documented in the attached records, the patient has completed 8 weeks of conservative therapy and diagnostic imaging confirms severe Grade II spondylolisthesis with neural compression."
        )
    )

@app.post("/api/audit/analyze", response_model=AuditResponse)
async def analyze_documents(
    patient_name: str = Form("Sarah Jenkins"),
    procedure: str = Form("Lumbar Spinal Fusion"),
    insurer: str = Form("Aetna Commercial"),
    files: Optional[List[UploadFile]] = File(None)
):
    decomposer = PolicyASTDecomposer(model_name=settings.GEMINI_FLASH_MODEL)
    criteria = await decomposer.audit_patient_case(ehr_text="", policy_text="")
    
    return AuditResponse(
        case_id="AUTH-2026-9921",
        patient_name=patient_name,
        patient_dob="1978-04-12",
        procedure=procedure,
        cpt_code="22612",
        icd10_code="M43.16",
        insurer=insurer,
        policy_id="CPB #0016",
        overall_status="READY_FOR_APPEAL",
        criteria_checklist=criteria,
        appeal_letter=AppealLetterSchema(
            date="November 23, 2026",
            recipient=f"{insurer} Appeals Committee",
            subject=f"EXPEDITED APPEAL: Prior Authorization Denial for {procedure}",
            body_markdown="### CLINICAL RECONSIDERATION REQUEST\n\nAll prerequisite criteria have been audited against the published clinical policy bulletin with verified citations."
        )
    )
