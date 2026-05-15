/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_STRIPE_PUBLISHABLE_KEY?: string;
  readonly VITE_APP_LOGIN_URL?: string;
  readonly VITE_STRIPE_PRICE_STARTER?: string;
  /** Price ID do Starter anual no Stripe (`interval: year`). */
  readonly VITE_STRIPE_PRICE_STARTER_ANNUAL?: string;
  readonly VITE_STRIPE_PRICE_PRO?: string;
  readonly VITE_TRIAL_PERIOD_DAYS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
