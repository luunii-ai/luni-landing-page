/** Base URL da API (sem barra final). */
export const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "http://localhost:3001").replace(/\/$/, "");

/** Chave publicável Stripe (pk_test_ / pk_live_). */
export const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "";

/** URL da landing com âncora de planos (assinatura). */
export const landingPlansUrl =
  (import.meta.env.VITE_LANDING_URL || "http://localhost:8081").replace(/\/$/, "") + "/#planos";

/** URL da tela de login do produto (após assinatura). */
export const appLoginUrl = import.meta.env.VITE_APP_LOGIN_URL || "http://localhost:8080/login";

/** Trial no front (fallback 5 dias para comunicação visual). */
export const trialPeriodDays = Math.max(
  0,
  Math.floor(Number(import.meta.env.VITE_TRIAL_PERIOD_DAYS || "5")),
);
