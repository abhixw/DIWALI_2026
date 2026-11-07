import type { StoryBackendPayload, StoryResponse, RefinePayload } from '../types/story';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/health`);
    if (!res.ok) throw new Error(`Status: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn("Backend health check failed or offline:", err);
    return null;
  }
}

export async function generateStoryApi(payload: StoryBackendPayload): Promise<StoryResponse> {
  const response = await fetch(`${API_BASE_URL}/api/story/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let errorMessage = "We couldn't finish writing your story. Please try again.";
    try {
      const errorData = await response.json();
      if (errorData.detail) errorMessage = errorData.detail;
    } catch {
      // Use fallback error message
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

export async function refineStoryApi(payload: RefinePayload): Promise<StoryResponse> {
  const response = await fetch(`${API_BASE_URL}/api/story/refine`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let errorMessage = "Could not refine your story. Please try again.";
    try {
      const errorData = await response.json();
      if (errorData.detail) errorMessage = errorData.detail;
    } catch {
      // Use fallback
    }
    throw new Error(errorMessage);
  }

  return response.json();
}
