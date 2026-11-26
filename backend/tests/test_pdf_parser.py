import os
import sys

# Ensure backend directory is in path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.engines.pdf_parser import PDFParserEngine

def test_pdf_parsing_and_quote_locator():
    sample_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../datasets/sample_cases"))
    dr_note_path = os.path.join(sample_dir, "case_01_doctor_notes.pdf")
    mri_path = os.path.join(sample_dir, "case_01_mri_report.pdf")

    assert os.path.exists(dr_note_path), f"File not found: {dr_note_path}"
    assert os.path.exists(mri_path), f"File not found: {mri_path}"

    # 1. Test Text Extraction
    pages = PDFParserEngine.extract_document(dr_note_path)
    assert len(pages) >= 1
    assert "VALLEY ORTHOPEDIC" in pages[0].text
    print(f"Extracted {len(pages)} page(s) from Doctor Notes. Page 1 text length: {len(pages[0].text)}")

    # 2. Test Quote Locator on Doctor Notes
    pt_quote = "Patient completed 8 weeks of formal physical therapy (twice weekly) focusing on core stabilization without sustained functional improvement."
    coord_res = PDFParserEngine.find_quote_coordinates(dr_note_path, pt_quote)
    assert coord_res is not None, "Failed to find quote in doctor notes"
    assert coord_res["page"] == 1
    assert len(coord_res["bounding_box"]) == 4
    print(f"Successfully located PT quote on page {coord_res['page']} with bbox: {coord_res['bounding_box']}")

    # 3. Test Quote Locator on MRI Report
    mri_quote = "MRI of Lumbar Spine (dated 2026-10-14) reveals Grade II anterolisthesis of L4 on L5 with severe secondary canal stenosis and bilateral neuroforaminal impingement."
    mri_coord = PDFParserEngine.find_quote_coordinates(mri_path, mri_quote)
    assert mri_coord is not None, "Failed to find quote in MRI report"
    assert mri_coord["page"] == 1
    assert len(mri_coord["bounding_box"]) == 4
    print(f"Successfully located MRI quote on page {mri_coord['page']} with bbox: {mri_coord['bounding_box']}")

    print("\nALL PDF PARSER TESTS PASSED!")

if __name__ == "__main__":
    test_pdf_parsing_and_quote_locator()
