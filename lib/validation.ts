import { JengaPromptsInput, PROMPT_MODES, OUTPUT_STRUCTURES } from './types';

// Simple validation without Zod for now
export function validatePromptInput(input: unknown): JengaPromptsInput {
  if (!input || typeof input !== 'object') {
    throw new Error('Invalid input: must be an object');
  }

  const data = input as any;

  // Validate required fields
  if (!data.corePromptIdea || typeof data.corePromptIdea !== 'string') {
    throw new Error('Core prompt idea is required and must be a string');
  }

  if (data.corePromptIdea.length === 0) {
    throw new Error('Core prompt idea cannot be empty');
  }

  if (data.corePromptIdea.length > 1000) {
    throw new Error('Core prompt idea must be less than 1000 characters');
  }

  if (!data.promptMode || !PROMPT_MODES.includes(data.promptMode)) {
    throw new Error('Invalid prompt mode');
  }

  if (!data.outputStructure || !OUTPUT_STRUCTURES.includes(data.outputStructure)) {
    throw new Error('Invalid output structure');
  }

  // Validate modifiers object
  if (!data.modifiers || typeof data.modifiers !== 'object') {
    data.modifiers = {};
  }

  return {
    corePromptIdea: data.corePromptIdea.trim(),
    promptMode: data.promptMode,
    modifiers: data.modifiers,
    outputStructure: data.outputStructure,
  };
}

export type ValidatedPromptInput = JengaPromptsInput;