from typing import List, Optional, Tuple
from pydantic import BaseModel, Field

class CriterionAuditItem(BaseModel):
    id: str = Field(..., description="Unique criterion identifier")
    rule: str = Field(..., description="Deterministic clinical rule extracted from policy")
    status: str = Field(..., description="SATISFIED, UNMET, or GAP_DETECTED")
    quote: Optional[str] = Field(None, description="Verbatim quote from clinical documents")
    page: Optional[int] = Field(None, description="Source page number")
    bounding_box: Optional[List[float]] = Field(None, description="[x0, y0, x1, y1] coordinates")
    action_needed: Optional[str] = Field(None, description="Recommended remediation if documentation is missing")
    verified: bool = Field(False, description="Whether verified by human sign-off")

class AppealLetterSchema(BaseModel):
    date: str
    recipient: str
    subject: str
    body_markdown: str

class AuditResponse(BaseModel):
    case_id: str
    patient_name: str
    patient_dob: str
    procedure: str
    cpt_code: str
    icd10_code: str
    insurer: str
    policy_id: str
    overall_status: str
    criteria_checklist: List[CriterionAuditItem]
    appeal_letter: AppealLetterSchema
