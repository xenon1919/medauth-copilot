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
    print("GET / passed:", data["service"])

def test_get_mock_audit():
    response = client.get("/api/audit/mock")
    assert response.status_code == 200
    data = response.json()
    assert data["patient_name"] == "Sarah Jenkins"
    assert len(data["criteria_checklist"]) == 3
    print("GET /api/audit/mock passed")

def test_get_sample_audit():
    response = client.get("/api/audit/sample")
    assert response.status_code == 200
    data = response.json()
    assert data["case_id"] == "AUTH-2026-9921"
    assert data["patient_name"] == "Sarah Jenkins"
    assert len(data["criteria_checklist"]) == 3

    # Check that coordinates and verified quotes are populated
    c1 = data["criteria_checklist"][0]
    assert c1["status"] == "SATISFIED"
    assert c1["verified"] is True
    assert c1["bounding_box"] is not None
    assert c1["page"] == 1

    # Check that appeal letter is formatted
    assert "FORMAL NOTICE OF MEDICAL NECESSITY APPEAL" in data["appeal_letter"]["body_markdown"]
    print("GET /api/audit/sample passed with live coordinate anchoring!")

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
    test_get_mock_audit()
    test_get_sample_audit()
    test_post_analyze()
    print("\nALL API ENDPOINT TESTS PASSED!")
