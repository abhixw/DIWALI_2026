import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { StoryFormData, StoryResponse, CardTemplate, StoryBackendPayload, RefinePayload } from '../types/story';
import { generateStoryApi, refineStoryApi } from '../services/api';

const initialFormData: StoryFormData = {
  name: '',
  ageGroup: '',
  occupation: '',
  customOccupation: '',
  currentChapter: '',
  customChapter: '',
  yearFeeling: '',
  customYearFeeling: '',
  proudOf: '',
  gratitude: [],
  heartWish: '',
  customHeartWish: '',
  leaveBehind: '',
  customLeaveBehind: '',
  tone: 'heartfelt',
};

interface StoryStoreState {
  formData: StoryFormData;
  currentStep: number;
  isGenerating: boolean;
  error: string | null;
  generatedStory: StoryResponse | null;
  selectedTemplate: CardTemplate;
  isDiyaLit: boolean;

  // Actions
  updateFormData: (partial: Partial<StoryFormData>) => void;
  toggleGratitude: (item: string) => void;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setDiyaLit: (lit: boolean) => void;
  setSelectedTemplate: (tpl: CardTemplate) => void;
  generateStory: () => Promise<boolean>;
  refineTone: (tone: string) => Promise<boolean>;
  resetJourney: () => void;
}

export const useStoryStore = create<StoryStoreState>()(
  persist(
    (set, get) => ({
      formData: initialFormData,
      currentStep: 1,
      isGenerating: false,
      error: null,
      generatedStory: null,
      selectedTemplate: 'traditional',
      isDiyaLit: false,

      updateFormData: (partial) =>
        set((state) => ({
          formData: { ...state.formData, ...partial },
          error: null,
        })),

      toggleGratitude: (item: string) =>
        set((state) => {
          const exists = state.formData.gratitude.includes(item);
          const updated = exists
            ? state.formData.gratitude.filter((g) => g !== item)
            : [...state.formData.gratitude, item];
          return {
            formData: { ...state.formData, gratitude: updated },
          };
        }),

      setStep: (step: number) => set({ currentStep: step }),

      nextStep: () =>
        set((state) => ({
          currentStep: Math.min(state.currentStep + 1, 8),
        })),

      prevStep: () =>
        set((state) => ({
          currentStep: Math.max(state.currentStep - 1, 1),
        })),

      setDiyaLit: (lit: boolean) => set({ isDiyaLit: lit }),

      setSelectedTemplate: (selectedTemplate: CardTemplate) => set({ selectedTemplate }),

      generateStory: async () => {
        const { formData, isGenerating } = get();
        if (isGenerating) return false;

        set({ isGenerating: true, error: null });

        try {
          const finalOccupation =
            formData.occupation === 'Other' && formData.customOccupation.trim()
              ? formData.customOccupation.trim()
              : formData.occupation;

          const finalChapter =
            formData.currentChapter === 'Something else' && formData.customChapter.trim()
              ? formData.customChapter.trim()
              : formData.currentChapter;

          const finalYearFeeling =
            formData.yearFeeling === 'Something else' && formData.customYearFeeling.trim()
              ? formData.customYearFeeling.trim()
              : formData.yearFeeling;

          const finalHeartWish =
            formData.heartWish === 'Something else' && formData.customHeartWish.trim()
              ? formData.customHeartWish.trim()
              : formData.heartWish;

          const finalLeaveBehind =
            formData.leaveBehind === 'Something else' && formData.customLeaveBehind.trim()
              ? formData.customLeaveBehind.trim()
              : formData.leaveBehind;

          const payload: StoryBackendPayload = {
            name: formData.name.trim() || null,
            age_group: formData.ageGroup || '18–22',
            occupation: finalOccupation || 'Traveler',
            current_chapter: finalChapter || 'Living this chapter',
            year_feeling: finalYearFeeling || 'A year of learning',
            proud_of: formData.proudOf.trim() || null,
            gratitude: formData.gratitude,
            heart_wish: finalHeartWish || 'Peace and happiness',
            leave_behind: finalLeaveBehind.trim() || null,
            tone: formData.tone || 'heartfelt',
          };

          const story = await generateStoryApi(payload);
          set({
            generatedStory: story,
            isGenerating: false,
          });
          return true;
        } catch (err: any) {
          console.error("Story generation failed:", err);
          set({
            error: err.message || "We couldn't finish writing your story. Please try again.",
            isGenerating: false,
          });
          return false;
        }
      },

      refineTone: async (newTone: string) => {
        const { formData, generatedStory, isGenerating } = get();
        if (!generatedStory || isGenerating) return false;

        set({ isGenerating: true, error: null });

        try {
          const payload: RefinePayload = {
            original_request: {
              name: formData.name.trim() || null,
              age_group: formData.ageGroup || '18–22',
              occupation: formData.occupation || 'Traveler',
              current_chapter: formData.currentChapter || 'Living this chapter',
              year_feeling: formData.yearFeeling || 'A year of learning',
              proud_of: formData.proudOf.trim() || null,
              gratitude: formData.gratitude,
              heart_wish: formData.heartWish || 'Peace and happiness',
              leave_behind: formData.leaveBehind.trim() || null,
              tone: newTone,
            },
            current_story: generatedStory,
            tone: newTone,
          };

          const refined = await refineStoryApi(payload);
          set({
            generatedStory: refined,
            formData: { ...formData, tone: newTone },
            isGenerating: false,
          });
          return true;
        } catch (err: any) {
          console.error("Refine story failed:", err);
          set({
            error: err.message || "Failed to refine tone. Please try again.",
            isGenerating: false,
          });
          return false;
        }
      },

      resetJourney: () =>
        set({
          formData: initialFormData,
          currentStep: 1,
          isGenerating: false,
          error: null,
          generatedStory: null,
          selectedTemplate: 'traditional',
          isDiyaLit: false,
        }),
    }),
    {
      name: 'the-diwali-within-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
