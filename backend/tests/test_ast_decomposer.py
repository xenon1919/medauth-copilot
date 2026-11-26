import os
import sys
import asyncio

# Ensure backend directory is in path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.engines.ast_decomposer import PolicyASTDecomposer
from app.engines.pdf_parser import PDFParserEngine

async def run_test():
    sample_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../datasets/sample_cases"))
    dr_note_path = os.path.join(sample_dir, "case_01_doctor_notes.pdf")
    mri_path = os.path.join(sample_dir, "case_01_mri_report.pdf")
    policy_path = os.path.join(sample_dir, "case_01_aetna_cpb_0016.pdf")

    # Extract text from PDFs
    dr_pages = PDFParserEngine.extract_document(dr_note_path)
    mri_pages = PDFParserEngine.extract_document(mri_path)
    policy_pages = PDFParserEngine.extract_document(policy_path)

    ehr_text = PDFParserEngine.get_full_text(dr_pages) + "\n\n" + PDFParserEngine.get_full_text(mri_pages)
    policy_text = PDFParserEngine.get_full_text(policy_pages)

    decomposer = PolicyASTDecomposer()
    criteria = await decomposer.audit_patient_case(
        ehr_text=ehr_text,
        policy_text=policy_text,
        pdf_sources=[dr_note_path, mri_path]
    )

    assert len(criteria) == 3, f"Expected 3 criteria, got {len(criteria)}"

    # Validate Crit 1
    c1 = criteria[0]
    assert c1.status == "SATISFIED"
    assert c1.verified is True
    assert c1.page is not None
    assert c1.bounding_box is not None
    print(f"Criterion 1 Passed: Status={c1.status}, Page={c1.page}, BBox={c1.bounding_box}")

    # Validate Crit 2
    c2 = criteria[1]
    assert c2.status == "SATISFIED"
    assert c2.verified is True
    assert c2.page is not None
    assert c2.bounding_box is not None
    print(f"Criterion 2 Passed: Status={c2.status}, Page={c2.page}, BBox={c2.bounding_box}")

    # Validate Crit 3
    c3 = criteria[2]
    assert c3.status == "GAP_DETECTED"
    assert c3.action_needed is not None
    print(f"Criterion 3 Passed: Status={c3.status}, Action='{c3.action_needed}'")

    print("\nALL AST DECOMPOSER TESTS PASSED!")

if __name__ == "__main__":
    asyncio.run(run_test())
