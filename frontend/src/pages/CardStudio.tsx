import React from 'react';
import { useStoryStore } from '../store/storyStore';
import { PageTransition } from '../components/common/PageTransition';
import { CardEditor } from '../components/greeting/CardEditor';
import { Button } from '../components/common/Button';

export const CardStudio: React.FC = () => {
  const { generatedStory, formData, selectedTemplate, setSelectedTemplate, setStep } =
    useStoryStore();

  if (!generatedStory) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <p className="text-lg text-[#F5E9D1] mb-4">No story available for card generation.</p>
        <Button variant="primary" onClick={() => setStep(1)}>
          Begin Journey
        </Button>
      </div>
    );
  }

  return (
    <PageTransition className="min-h-[85vh] py-6">
      <CardEditor
        story={generatedStory}
        name={formData.name}
        selectedTemplate={selectedTemplate}
        onTemplateChange={setSelectedTemplate}
        onBackToStory={() => setStep(7)}
      />
    </PageTransition>
  );
};
