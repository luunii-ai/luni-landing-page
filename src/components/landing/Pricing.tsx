import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Check, Loader2 } from "lucide-react";
import { apiBaseUrl, trialPeriodDays } from "@/lib/env";

type StripePlanDto = {
  id: string;
  productName: string;
  unitAmount: number | null;
  currency: string;
  interval: string | null;
  intervalCount: number;
};

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function matchesAny(value: string, terms: string[]): boolean {
  const normalized = normalizeText(value);
  return terms.some((term) => normalized.includes(normalizeText(term)));
}

const staticFeatures = {
  starter: [
    "Simulador de preços",
    "40 simulações com IA/mês",
    "Gestão de Pacientes",
    "1 profissional"
  ],
  pro: [
    "Todas as funcionalidades Starter",
    "100 simulações com IA/mês",
    "Até 3 profissionais",
    "IA avançada de simulação",
    "IA para automações de marketing",
  ],
  enterprise: [
    "Todas as funcionalidades Profissional",
    "Profissionais ilimitados",
    "Limite de simulações personalizado",
  ],
};

function formatMoney(cents: number | null, currency: string): string {
  if (cents == null) return "—";
  try {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: currency.toUpperCase() === "BRL" ? "BRL" : currency.toUpperCase(),
      minimumFractionDigits: 0,
    }).format(cents / 100);
  } catch {
    return String(cents / 100);
  }
}

const Pricing = () => {
  const [stripePlans, setStripePlans] = useState<StripePlanDto[] | null>(null);
  const [plansError, setPlansError] = useState(false);

  const fallbackStarter = import.meta.env.VITE_STRIPE_PRICE_STARTER?.trim() || "";
  const fallbackPro = import.meta.env.VITE_STRIPE_PRICE_PRO?.trim() || "";

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/api/subscriptions/plans`);
        if (!res.ok) throw new Error("plans");
        const data = (await res.json()) as unknown;
        if (!cancelled && Array.isArray(data)) {
          setStripePlans(data as StripePlanDto[]);
        }
      } catch {
        if (!cancelled) {
          setPlansError(true);
          setStripePlans([]);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const starter = useMemo(() => {
    if (!stripePlans || stripePlans.length === 0) return undefined;
    const byId = fallbackStarter ? stripePlans.find((p) => p.id === fallbackStarter) : undefined;
    if (byId) return byId;
    return stripePlans.find((p) => matchesAny(p.productName, ["starter", "basico", "básico"]));
  }, [stripePlans, fallbackStarter]);

  const pro = useMemo(() => {
    if (!stripePlans || stripePlans.length === 0) return undefined;
    const byId = fallbackPro ? stripePlans.find((p) => p.id === fallbackPro) : undefined;
    if (byId) return byId;
    return stripePlans.find((p) => matchesAny(p.productName, ["pro", "profissional"]));
  }, [stripePlans, fallbackPro]);

  const starterPriceId = starter?.id || fallbackStarter;

  const starterLabel = starter ? formatMoney(starter.unitAmount, starter.currency) : "197";
  const proLabel = pro ? formatMoney(pro.unitAmount, pro.currency) : "497";

  /** Profissional e Enterprise: bloqueados na landing até definição final dos planos. */
  const comingSoonCardClass =
    "rounded-xl p-8 flex flex-col relative border border-border bg-gradient-to-b from-muted/60 to-muted/30 text-muted-foreground shadow-none cursor-not-allowed select-none hover:translate-y-0";
  const comingSoonBadgeClass =
    "absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 bg-muted text-muted-foreground border border-border text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full shadow-sm";

  const plansLoading = stripePlans === null;

  return (
    <section id="planos" className="relative py-24 bg-gradient-to-b from-background to-accent/30">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-bold tracking-widest uppercase text-primary mb-4 block">
            Planos
          </span>
          <h2 className="text-4xl md:text-5xl font-medium tracking-tighter text-foreground mb-4">
            Escolha o plano{" "}
            <span className="font-serif italic text-primary">ideal para você</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Todos os planos incluem {trialPeriodDays} dias de teste grátis. Cancele quando quiser.
          </p>
          {plansError && (
            <p className="text-sm text-muted-foreground mt-3">
              Não foi possível carregar preços ao vivo. Os valores exibidos são indicativos; configure a API e os Price IDs
              no Stripe.
            </p>
          )}
        </motion.div>

        {plansLoading && (
          <div className="flex justify-center py-12 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin" aria-hidden />
          </div>
        )}

        {!plansLoading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {/* Starter */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.6, delay: 0 }}
            className="rounded-xl p-8 flex flex-col transition-all duration-300 hover:-translate-y-1 glass-card gradient-border"
          >
            <div className="mb-6">
              <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold tracking-wide text-primary mb-3">
                {trialPeriodDays} DIAS GRÁTIS
              </span>
              <h3 className="text-lg font-semibold mb-1 text-foreground">Starter</h3>
              <p className="text-sm mb-4 text-muted-foreground">
                Ideal para clínicas que estão começando com simulações.
              </p>
              <div className="flex items-baseline gap-1 flex-wrap">
                {starter ? (
                  <>
                    <span className="text-4xl font-medium tracking-tight text-foreground">{starterLabel}</span>
                    <span className="text-sm text-muted-foreground">/mês</span>
                  </>
                ) : (
                  <>
                    <span className="text-sm text-muted-foreground">R$</span>
                    <span className="text-4xl font-medium tracking-tight text-foreground">{starterLabel}</span>
                    <span className="text-sm text-muted-foreground">/mês</span>
                  </>
                )}
              </div>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              {staticFeatures.starter.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm">
                  <Check className="w-4 h-4 shrink-0 text-primary" strokeWidth={1.5} />
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
            {starterPriceId ? (
              <Link
                to={`/checkout?priceId=${encodeURIComponent(starterPriceId)}`}
                className="inline-flex items-center justify-center rounded-full py-3 px-6 text-sm font-medium transition-all duration-300 hover:scale-105 button-glow button-glow--cta text-primary-foreground relative z-10 text-center"
              >
                <span className="relative z-10">Começar Agora</span>
              </Link>
            ) : (
              <span className="text-center text-sm text-muted-foreground">
                Configure STRIPE_PRICE_IDS ou VITE_STRIPE_PRICE_STARTER
              </span>
            )}
          </motion.div>

          {/* Profissional — em breve (não clicável) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={comingSoonCardClass}
            aria-disabled="true"
          >
            <div className={comingSoonBadgeClass}>Em breve</div>
            <div className="mb-6 pt-2">
              <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-semibold tracking-wide text-muted-foreground mb-3 border border-border">
                {trialPeriodDays} DIAS GRÁTIS
              </span>
              <h3 className="text-lg font-semibold mb-1 text-foreground/80">Profissional</h3>
              <p className="text-sm mb-4 text-muted-foreground">
                Para clínicas que querem maximizar conversões.
              </p>
              <div className="flex items-baseline gap-1 flex-wrap">
                {pro ? (
                  <>
                    <span className="text-4xl font-medium tracking-tight text-foreground/70">{proLabel}</span>
                    <span className="text-sm text-muted-foreground">/mês</span>
                  </>
                ) : (
                  <>
                    <span className="text-sm text-muted-foreground">R$</span>
                    <span className="text-4xl font-medium tracking-tight text-foreground/70">{proLabel}</span>
                    <span className="text-sm text-muted-foreground">/mês</span>
                  </>
                )}
              </div>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              {staticFeatures.pro.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm">
                  <Check className="w-4 h-4 shrink-0 text-muted-foreground/80" strokeWidth={1.5} />
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
            <span className="inline-flex items-center justify-center rounded-full py-3 px-6 text-sm font-medium bg-muted/80 text-muted-foreground border border-border text-center">
              Em breve
            </span>
          </motion.div>

          {/* Enterprise — em breve (não clicável) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={comingSoonCardClass}
            aria-disabled="true"
          >
            <div className={comingSoonBadgeClass}>Em breve</div>
            <div className="mb-6 pt-2">
              <h3 className="text-lg font-semibold mb-1 text-foreground/80">Enterprise</h3>
              <p className="text-sm mb-4 text-muted-foreground">Para redes de clínicas e grandes operações.</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-medium tracking-tight text-foreground/70">Sob consulta</span>
              </div>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              {staticFeatures.enterprise.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm">
                  <Check className="w-4 h-4 shrink-0 text-muted-foreground/80" strokeWidth={1.5} />
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
            <span className="inline-flex items-center justify-center rounded-full py-3 px-6 text-sm font-medium bg-muted/80 text-muted-foreground border border-border text-center">
              Em breve
            </span>
          </motion.div>
        </div>
        )}
      </div>
    </section>
  );
};

export default Pricing;
