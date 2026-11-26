import os
import sys
from fastapi.testclient import TestClient

# Ensure backend directory is in path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.main import app

client = TestClient(app)

def test_api_root():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "available_cases" in data
    print("GET / passed:", data["service"])

def test_list_cases():
    response = client.get("/api/audit/cases")
    assert response.status_code == 200
    cases = response.json()
    assert len(cases) == 3
    specialties = [c["specialty"] for c in cases]
    assert "Orthopedic Spine" in specialties
    assert "Rheumatology Biologics" in specialties
    assert "Interventional Cardiology" in specialties
    print("GET /api/audit/cases passed (3 specialties verified)")

def test_get_sample_cases_multi_specialty():
    # 1. Case 01: Lumbar Fusion (Sarah Jenkins)
    r1 = client.get("/api/audit/sample?case_id=case_01")
    assert r1.status_code == 200
    d1 = r1.json()
    assert d1["patient_name"] == "Sarah Jenkins"
    assert d1["procedure"] == "Lumbar Spinal Fusion"
    print("Sample Case 01 verified (Orthopedics)")

    # 2. Case 02: Humira Biologic (Marcus Vance)
    r2 = client.get("/api/audit/sample?case_id=case_02")
    assert r2.status_code == 200
    d2 = r2.json()
    assert d2["patient_name"] == "Marcus Vance"
    assert "Humira" in d2["procedure"]
    assert len(d2["criteria_checklist"]) == 3
    print("Sample Case 02 verified (Rheumatology)")

    # 3. Case 03: Cardiac Catheterization (David Chen)
    r3 = client.get("/api/audit/sample?case_id=case_03")
    assert r3.status_code == 200
    d3 = r3.json()
    assert d3["patient_name"] == "David Chen"
    assert "Catheterization" in d3["procedure"]
    print("Sample Case 03 verified (Cardiology)")

def test_stream_audit_progress():
    response = client.get("/api/audit/stream?case_id=case_01")
    assert response.status_code == 200
    text = response.text.lower()
    assert "stage" in text
    assert "intake" in text
    assert "appeal_compilation" in text
    print("GET /api/audit/stream passed (SSE streaming verified)")

def test_post_analyze():
    sample_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../datasets/sample_cases"))
    dr_path = os.path.join(sample_dir, "case_01_doctor_notes.pdf")
    mri_path = os.path.join(sample_dir, "case_01_mri_report.pdf")

    with open(dr_path, "rb") as f_dr, open(mri_path, "rb") as f_mri:
        files = [
            ("files", ("case_01_doctor_notes.pdf", f_dr, "application/pdf")),
            ("files", ("case_01_mri_report.pdf", f_mri, "application/pdf"))
        ]
        data = {
            "patient_name": "Sarah Jenkins",
            "procedure": "Lumbar Spinal Fusion",
            "insurer": "Aetna Commercial"
        }
        response = client.post("/api/audit/analyze", data=data, files=files)
        assert response.status_code == 200
        res_data = response.json()
        assert res_data["patient_name"] == "Sarah Jenkins"
        assert len(res_data["criteria_checklist"]) == 3
        print("POST /api/audit/analyze passed with multipart upload!")

if __name__ == "__main__":
    test_api_root()
    test_list_cases()
    test_get_sample_cases_multi_specialty()
    test_stream_audit_progress()
    test_post_analyze()
    print("\nALL API ENDPOINT TESTS PASSED!")
