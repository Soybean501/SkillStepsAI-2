export const AI_CONFIG = {
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY || '',
  OPENROUTER_BASE_URL: 'https://openrouter.ai/api/v1',
  DEFAULT_MODEL: 'mistralai/mistral-7b-instruct',
  MAX_TOKENS: 1000,
  TEMPERATURE: 0.7,
  TOP_P: 0.9,
  FREQUENCY_PENALTY: 0.5,
  PRESENCE_PENALTY: 0.5,
} 