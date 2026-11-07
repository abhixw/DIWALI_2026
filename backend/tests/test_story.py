import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "version" in data
    assert "groq_configured" in data
    assert "model" in data

def test_persona_1_engineering_student():
    payload = {
        "name": "Aarav",
        "age_group": "18–22",
        "occupation": "Engineering Student",
        "current_chapter": "Building my career",
        "year_feeling": "Uncertain but hopeful",
        "proud_of": "Secured my first internship interview and built a full project",
        "gratitude": ["Friends", "Personal growth"],
        "heart_wish": "Become an AI Engineer",
        "leave_behind": "Imposter syndrome and fear of rejection",
        "tone": "heartfelt"
    }
    response = client.post("/api/story/generate", json=payload)
    assert response.status_code == 200
    res = response.json()
    assert "identity" in res
    assert res["identity"]["title"]
    assert "diwali_letter" in res
    assert "ai engineer" in res["diwali_letter"].lower() or "engineering" in res["diwali_letter"].lower() or "student" in res["diwali_letter"].lower() or "project" in res["diwali_letter"].lower()
    assert "future_letter" in res
    assert "blessing" in res
    assert "personal_promise" in res

def test_persona_2_entrepreneur():
    payload = {
        "name": "Priya",
        "age_group": "23–30",
        "occupation": "Entrepreneur",
        "current_chapter": "Starting something new",
        "year_feeling": "Challenged but determined",
        "proud_of": "Launched my MVP and onboarded first 100 paying customers",
        "gratitude": ["Opportunities", "Family"],
        "heart_wish": "Build a successful and sustainable startup",
        "leave_behind": "Self-doubt and late-night anxiety",
        "tone": "motivational"
    }
    response = client.post("/api/story/generate", json=payload)
    assert response.status_code == 200
    res = response.json()
    assert "The Dream Builder" in res["identity"]["title"] or "Builder" in res["identity"]["title"] or "Architect" in res["identity"]["title"]
    assert "startup" in res["diwali_letter"].lower() or "entrepreneur" in res["diwali_letter"].lower()

def test_persona_3_homemaker():
    payload = {
        "name": "Sunita",
        "age_group": "31–45",
        "occupation": "Homemaker",
        "current_chapter": "Focusing on my family",
        "year_feeling": "I am grateful for what I have.",
        "proud_of": "Created a warm, loving space through challenging times",
        "gratitude": ["Family", "Health and happiness"],
        "heart_wish": "Spend more meaningful time with loved ones",
        "leave_behind": "Overthinking and self-criticism",
        "tone": "emotional"
    }
    response = client.post("/api/story/generate", json=payload)
    assert response.status_code == 200
    res = response.json()
    assert "family" in res["diwali_letter"].lower() or "homemaker" in res["diwali_letter"].lower()
    assert res["identity"]["title"]

def test_persona_4_school_student():
    payload = {
        "name": "Kabir",
        "age_group": "13–17",
        "occupation": "School Student",
        "current_chapter": "Learning and growing",
        "year_feeling": "Excited and nervous",
        "proud_of": "Scored well in board exams and learned coding basics",
        "gratitude": ["Family", "Friends"],
        "heart_wish": "Get into a good college",
        "leave_behind": "Exam fear",
        "tone": "heartfelt"
    }
    response = client.post("/api/story/generate", json=payload)
    assert response.status_code == 200
    res = response.json()
    assert "college" in res["diwali_letter"].lower() or "student" in res["diwali_letter"].lower() or "learning" in res["diwali_letter"].lower() or len(res["diwali_letter"]) > 50

def test_persona_5_retired():
    payload = {
        "name": "Ramesh",
        "age_group": "Above 60",
        "occupation": "Retired",
        "current_chapter": "Enjoying a peaceful chapter",
        "year_feeling": "I am grateful for what I have.",
        "proud_of": "Spent peaceful time tending to garden and reading",
        "gratitude": ["Health and happiness", "Family"],
        "heart_wish": "Enjoy life and support loved ones",
        "leave_behind": "Unnecessary worries",
        "tone": "poetic"
    }
    response = client.post("/api/story/generate", json=payload)
    assert response.status_code == 200
    res = response.json()
    assert "peace" in res["diwali_letter"].lower() or "retired" in res["diwali_letter"].lower()

def test_skipped_optional_fields():
    payload = {
        "name": None,
        "age_group": "23–30",
        "occupation": "Freelancer / Creative",
        "current_chapter": "Still figuring things out",
        "year_feeling": "I lost something but learned something.",
        "proud_of": None,
        "gratitude": [],
        "heart_wish": "Find happiness and peace",
        "leave_behind": None,
        "tone": "heartfelt"
    }
    response = client.post("/api/story/generate", json=payload)
    assert response.status_code == 200
    res = response.json()
    assert res["identity"]["title"]
    assert res["diwali_letter"]
    assert res["blessing"]

def test_refine_story():
    original_payload = {
        "name": "Dev",
        "age_group": "23–30",
        "occupation": "Software Engineer / Developer",
        "current_chapter": "Working towards a dream",
        "year_feeling": "I grew more than I expected.",
        "proud_of": "Built my first open-source project",
        "gratitude": ["Opportunities"],
        "heart_wish": "Become financially independent",
        "leave_behind": "Procrastination",
        "tone": "heartfelt"
    }
    gen_response = client.post("/api/story/generate", json=original_payload)
    assert gen_response.status_code == 200
    initial_story = gen_response.json()

    refine_payload = {
        "original_request": original_payload,
        "current_story": initial_story,
        "tone": "poetic"
    }
    refine_response = client.post("/api/story/refine", json=refine_payload)
    assert refine_response.status_code == 200
    refined_story = refine_response.json()
    assert refined_story["tone"] == "poetic"
