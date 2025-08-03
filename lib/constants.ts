export const APP_CONFIG = {
  name: 'JengaPrompts Pro',
  version: '1.0.0',
  description: 'AI-powered prompt enhancement tool for creators and developers',
  author: 'JengaPrompts Team',
  url: 'https://jengaprompts.com',
  maxPromptLength: 2000,
  maxHistoryItems: 100,
  apiTimeout: 45000,
  retryAttempts: 3,
  supportedModes: ['Text', 'Image', 'Video', 'Audio', 'Code'] as const,
  outputFormats: ['Descriptive Paragraph', 'Simple JSON', 'Detailed JSON'] as const,
};

export const STORAGE_KEYS = {
  history: 'jenga-prompts-history',
  favorites: 'jenga-prompts-favorites',
  settings: 'jenga-prompts-settings',
  analytics: 'jenga-prompts-analytics',
} as const;

export const API_ENDPOINTS = {
  enhance: '/api/enhance',
  analytics: '/api/analytics',
  feedback: '/api/feedback',
} as const;

export const ERROR_MESSAGES = {
  networkError: 'Network error. Please check your connection and try again.',
  apiError: 'Service temporarily unavailable. Please try again later.',
  validationError: 'Please check your input and try again.',
  rateLimitError: 'Too many requests. Please wait a moment before trying again.',
  genericError: 'Something went wrong. Please try again.',
} as const;