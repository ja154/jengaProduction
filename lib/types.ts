export interface JengaPromptsInput {
  corePromptIdea: string;
  promptMode: 'Text' | 'Image' | 'Video' | 'Audio' | 'Code';
  modifiers: {
    contentTone?: string;
    outputFormat?: string;
    style?: string;
    aspectRatio?: string;
    lighting?: string;
    framing?: string;
    cameraAngle?: string;
    detailLevel?: string;
    audioType?: string;
    vibeMood?: string;
    language?: string;
    task?: string;
  };
  outputStructure: 'Descriptive Paragraph' | 'Simple JSON' | 'Detailed JSON';
}

export interface JengaPromptsOutput {
  primaryResult: string;
  structuredJSON?: Record<string, any>;
  errorMessage?: string;
}

export interface PromptHistory {
  id: string;
  input: JengaPromptsInput;
  output: JengaPromptsOutput;
  timestamp: Date;
  favorite?: boolean;
}

export const PROMPT_MODES = ['Text', 'Image', 'Video', 'Audio', 'Code'] as const;
export const OUTPUT_STRUCTURES = ['Descriptive Paragraph', 'Simple JSON', 'Detailed JSON'] as const;

export const MODIFIER_OPTIONS = {
  contentTone: ['Professional', 'Casual', 'Creative', 'Technical', 'Friendly', 'Formal'],
  outputFormat: ['Plain Text', 'Markdown', 'HTML', 'JSON', 'CSV'],
  style: ['Photorealistic', 'Artistic', 'Cartoon', 'Abstract', 'Minimalist', 'Vintage'],
  aspectRatio: ['1:1', '16:9', '4:3', '3:2', '9:16', '21:9'],
  lighting: ['Natural', 'Studio', 'Golden Hour', 'Blue Hour', 'Dramatic', 'Soft'],
  framing: ['Close-up', 'Medium Shot', 'Wide Shot', 'Extreme Close-up', 'Bird\'s Eye', 'Worm\'s Eye'],
  cameraAngle: ['Eye Level', 'High Angle', 'Low Angle', 'Dutch Angle', 'Over Shoulder'],
  detailLevel: ['High', 'Medium', 'Low', 'Ultra High', 'Minimal'],
  audioType: ['Music', 'Voice', 'Sound Effects', 'Ambient', 'Podcast', 'Audiobook'],
  vibeMood: ['Energetic', 'Calm', 'Dark', 'Uplifting', 'Mysterious', 'Romantic'],
  language: ['JavaScript', 'Python', 'TypeScript', 'Java', 'C++', 'Go', 'Rust', 'PHP'],
  task: ['Function', 'Class', 'Algorithm', 'API', 'Database Query', 'UI Component']
};