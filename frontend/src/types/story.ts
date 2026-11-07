export type AgeGroup =
  | "Under 13"
  | "13–17"
  | "18–22"
  | "23–30"
  | "31–45"
  | "46–60"
  | "Above 60";

export interface StoryFormData {
  name: string;
  ageGroup: AgeGroup | "";
  occupation: string;
  customOccupation: string;
  currentChapter: string;
  customChapter: string;
  yearFeeling: string;
  customYearFeeling: string;
  proudOf: string;
  gratitude: string[];
  heartWish: string;
  customHeartWish: string;
  leaveBehind: string;
  customLeaveBehind: string;
  tone: string;
}

export interface DiwaliIdentity {
  title: string;
  description: string;
}

export interface StoryResponse {
  identity: DiwaliIdentity;
  diwali_letter: string;
  future_letter: string;
  blessing: string;
  personal_promise: string;
  tone: string;
  model_used?: string;
  is_fallback: boolean;
}

export interface StoryBackendPayload {
  name?: string | null;
  age_group: string;
  occupation: string;
  current_chapter: string;
  year_feeling: string;
  proud_of?: string | null;
  gratitude: string[];
  heart_wish: string;
  leave_behind?: string | null;
  tone: string;
}

export interface RefinePayload {
  original_request: StoryBackendPayload;
  current_story: StoryResponse;
  tone: string;
}

export type CardTemplate = 'traditional' | 'luxury' | 'minimal';
