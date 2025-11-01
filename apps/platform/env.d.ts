declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL?: string;
    SHADOW_DATABASE_URL?: string;
    OPENAI_API_KEY?: string;
    OPENAI_MODEL?: string;
    OPENPHONE_API_KEY?: string;
    OPENPHONE_API_BASE_URL?: string;
    GOOGLE_SERVICE_ACCOUNT?: string;
    GOOGLE_SERVICE_KEY?: string;
    GOOGLE_CALENDAR_ID?: string;
  }
}
