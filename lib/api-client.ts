import { JengaPromptsInput, JengaPromptsOutput } from './types';
import { validatePromptInput } from './validation';

export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export class APIClient {
  private static readonly BASE_URL = '/api';
  private static readonly TIMEOUT = 30000; // 30 seconds

  static async enhancePrompt(input: JengaPromptsInput): Promise<JengaPromptsOutput> {
    // Validate input
    const validatedInput = validatePromptInput(input);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT);

    try {
      const response = await fetch(this.BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatedInput),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new APIError(
          errorData.details || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          errorData.code
        );
      }

      const data: JengaPromptsOutput = await response.json();
      
      if (!data.primaryResult) {
        throw new APIError('Invalid response: missing primary result');
      }

      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof APIError) {
        throw error;
      }
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new APIError('Request timeout - please try again');
        }
        throw new APIError(`Network error: ${error.message}`);
      }
      
      throw new APIError('An unexpected error occurred');
    }
  }
}