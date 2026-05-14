import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import type { StripeEmbeddedCheckout } from "@stripe/stripe-js";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { apiBaseUrl, stripePublishableKey, trialPeriodDays } from "@/lib/env";
import { Loader2 } from "lucide-react";

const Checkout = () => {
  const [searchParams] = useSearchParams();
  const priceId = searchParams.get("priceId")?.trim() || "";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [clinic, setClinic] = useState("");
  const [promotionCode, setPromotionCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loginUrl, setLoginUrl] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const firstChargeDateLabel = new Date(
    new Date().setDate(new Date().getDate() + trialPeriodDays),
  ).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const mountRef = useRef<HTMLDivElement>(null);
  const checkoutRef = useRef<StripeEmbeddedCheckout | null>(null);

  const destroyCheckout = useCallback(() => {
    const c = checkoutRef.current;
    checkoutRef.current = null;
    if (c && typeof c.destroy === "function") {
      c.destroy();
    }
  }, []);

  useLayoutEffect(() => {
    if (!clientSecret || !stripePublishableKey || !mountRef.current) return;

    let cancelled = false;

    void (async () => {
      const stripe = await loadStripe(stripePublishableKey);
      if (!stripe || cancelled || !mountRef.current) return;

      destroyCheckout();
      const el = mountRef.current;
      el.innerHTML = "";

      const checkout = await stripe.createEmbeddedCheckoutPage({ clientSecret });
      if (cancelled || !mountRef.current) {
        checkout.destroy();
        return;
      }
      checkoutRef.current = checkout;
      checkout.mount(el);
    })();

    return () => {
      cancelled = true;
      destroyCheckout();
    };
  }, [clientSecret, destroyCheckout]);

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoginUrl(null);
    if (!stripePublishableKey) {
      setError("Configure VITE_STRIPE_PUBLISHABLE_KEY na landing.");
      return;
    }
    if (!priceId) {
      setError("Plano não selecionado.");
      return;
    }
    setLoading(true);
    setClientSecret(null);
    destroyCheckout();

    try {
      const res = await fetch(`${apiBaseUrl}/api/subscriptions/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          name: name.trim(),
          clinic: clinic.trim() || undefined,
          priceId,
          checkoutUi: "embedded",
          trialPeriodDays,
          promotionCode: promotionCode.trim() || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.message === "string" ? data.message : "Não foi possível iniciar o pagamento.");
        if (res.status === 409 && typeof data.loginUrl === "string" && data.loginUrl.trim()) {
          setLoginUrl(data.loginUrl.trim());
        }
        return;
      }
      const secret = data.clientSecret as string | undefined;
      if (!secret) {
        setError("Resposta da API sem clientSecret.");
        return;
      }
      setClientSecret(secret);
    } catch (err) {
      console.error(err);
      setError("Erro de rede ou servidor. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const showEmbed = Boolean(clientSecret);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-foreground mb-2">Assinatura</h1>
          <p className="text-muted-foreground mb-8">
            Preencha seus dados e continue para o pagamento seguro (Stripe).
          </p>

          {!priceId ? (
            <div className="rounded-xl border border-border bg-card/50 p-6 text-center">
              <p className="text-muted-foreground mb-4">Nenhum plano foi selecionado.</p>
              <Button asChild variant="outline">
                <Link to="/#planos">Escolher um plano</Link>
              </Button>
            </div>
          ) : (
            <>
              {!showEmbed && (
                <form onSubmit={handleContinue} className="space-y-6 max-w-md">
                  <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                    <p className="text-sm text-foreground">
                      Você terá <strong>{trialPeriodDays} dias de teste</strong>. A primeira cobrança está prevista para{" "}
                      <strong>{firstChargeDateLabel}</strong>.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="checkout-name">Nome completo</Label>
                    <Input
                      id="checkout-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      autoComplete="name"
                      placeholder="Seu nome"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="checkout-email">E-mail</Label>
                    <Input
                      id="checkout-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      placeholder="voce@email.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="checkout-clinic">Clínica (opcional)</Label>
                    <Input
                      id="checkout-clinic"
                      value={clinic}
                      onChange={(e) => setClinic(e.target.value)}
                      autoComplete="organization"
                      placeholder="Nome da clínica"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="checkout-coupon">Cupom de desconto (opcional)</Label>
                    <Input
                      id="checkout-coupon"
                      value={promotionCode}
                      onChange={(e) => setPromotionCode(e.target.value)}
                      autoComplete="off"
                      placeholder="Código promocional"
                    />
                    <p className="text-xs text-muted-foreground">
                      Se deixar em branco, você poderá informar um cupom na tela de pagamento
                    </p>
                  </div>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  {loginUrl && (
                    <p className="text-sm text-muted-foreground">
                      Já tem conta?{" "}
                      <a
                        href={loginUrl}
                        className="text-primary underline-offset-4 hover:underline"
                      >
                        Entrar para continuar
                      </a>
                      .
                    </p>
                  )}
                  <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Preparando checkout…
                      </>
                    ) : (
                      "Continuar para pagamento"
                    )}
                  </Button>
                </form>
              )}

              {showEmbed && (
                <p className="text-sm text-muted-foreground mb-4">
                  Cobrança prevista em <strong>{firstChargeDateLabel}</strong> após o período de teste de{" "}
                  {trialPeriodDays} dias.
                  <br />
                  <Link to="/#planos" className="text-primary underline-offset-4 hover:underline">
                    Voltar aos planos
                  </Link>
                </p>
              )}

              {showEmbed && (
                <div
                  ref={mountRef}
                  className="min-h-[480px] w-full rounded-xl border border-border bg-card/30 p-2"
                  aria-live="polite"
                />
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
