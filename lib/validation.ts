import { z } from 'zod';
import { PROMPT_MODES, OUTPUT_STRUCTURES } from './types';

export const promptInputSchema = z.object({
  corePromptIdea: z.string().min(1, 'Core prompt idea is required').max(1000, 'Core prompt idea must be less than 1000 characters'),
  promptMode: z.enum(PROMPT_MODES),
  modifiers: z.object({
    contentTone: z.string().optional(),
    outputFormat: z.string().optional(),
    style: z.string().optional(),
    aspectRatio: z.string().optional(),
    lighting: z.string().optional(),
    framing: z.string().optional(),
    cameraAngle: z.string().optional(),
    detailLevel: z.string().optional(),
    audioType: z.string().optional(),
    vibeMood: z.string().optional(),
    language: z.string().optional(),
    task: z.string().optional(),
  }),
  outputStructure: z.enum(OUTPUT_STRUCTURES),
});

export type ValidatedPromptInput = z.infer<typeof promptInputSchema>;

export function validatePromptInput(input: unknown): ValidatedPromptInput {
  return promptInputSchema.parse(input);
}