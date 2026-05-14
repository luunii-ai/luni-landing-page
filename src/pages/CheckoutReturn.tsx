import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { apiBaseUrl, appLoginUrl } from "@/lib/env";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

type PollingState = "pending" | "success" | "error" | "no-session";

const POLL_INTERVAL_MS = 3000;
const POLL_TIMEOUT_MS = 90_000;

type ProvisionedResponse = {
  provisioned?: boolean;
  phase?: string;
};

const CheckoutReturn = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [state, setState] = useState<PollingState>(
    sessionId ? "pending" : "no-session",
  );

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    const stop = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };

    const poll = async () => {
      try {
        const res = await fetch(
          `${apiBaseUrl}/api/subscriptions/checkout-session/provisioned?session_id=${encodeURIComponent(sessionId)}`,
        );
        if (res.status === 503) {
          stop();
          setState("error");
          return;
        }
        if (!res.ok) return;
        const data = (await res.json().catch(() => ({}))) as ProvisionedResponse;
        if (data.provisioned === true) {
          stop();
          setState("success");
          return;
        }
        if (data.phase === "invalid_session") {
          stop();
          setState("error");
        }
      } catch {
        // silently retry on network error
      }
    };

    intervalRef.current = setInterval(poll, POLL_INTERVAL_MS);

    timeoutRef.current = setTimeout(() => {
      stop();
      setState((current) => (current === "pending" ? "error" : current));
    }, POLL_TIMEOUT_MS);

    poll();

    return stop;
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16 px-6 flex items-center justify-center">
        <div className="max-w-lg text-center space-y-6">

          {state === "pending" && (
            <>
              <div className="flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
              </div>
              <h1 className="text-3xl font-medium tracking-tight text-foreground">
                Finalizando sua conta…
              </h1>
              <p className="text-muted-foreground leading-relaxed">
                Aguardando confirmação no sistema (criação da conta e assinatura). Isso costuma levar poucos segundos.
                {sessionId && (
                  <span className="block mt-3 text-xs font-mono text-muted-foreground/60 break-all">
                    Referência: {sessionId}
                  </span>
                )}
              </p>
            </>
          )}

          {state === "success" && (
            <>
              <div className="flex justify-center">
                <CheckCircle2 className="h-10 w-10 text-green-500" aria-hidden="true" />
              </div>
              <h1 className="text-3xl font-medium tracking-tight text-foreground">
                Assinatura confirmada!
              </h1>
              <p className="text-muted-foreground leading-relaxed">
                Sua conta foi criada. Verifique o e-mail e caixa de spam, se recebeu um e-mail com senha temporária para primeiro acesso.
              </p>
            </>
          )}

          {state === "error" && (
            <>
              <div className="flex justify-center">
                <AlertCircle className="h-8 w-8 text-destructive" aria-hidden="true" />
              </div>
              <h1 className="text-3xl font-medium tracking-tight text-foreground">
                Não foi possível concluir a ativação
              </h1>
              <p className="text-muted-foreground leading-relaxed">
                O pagamento pode ter sido aceito, mas não conseguimos confirmar a criação da conta no
                aplicativo a tempo. Verifique o e-mail cadastrado, tente acessar o login mais tarde ou entre em contato
                com o suporte.
                {sessionId && (
                  <span className="block mt-3 text-xs font-mono text-muted-foreground/60 break-all">
                    Referência: {sessionId}
                  </span>
                )}
              </p>
            </>
          )}

          {state === "no-session" && (
            <>
              <div className="flex justify-center">
                <AlertCircle className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
              </div>
              <h1 className="text-3xl font-medium tracking-tight text-foreground">
                Sessão não identificada
              </h1>
              <p className="text-muted-foreground leading-relaxed">
                Não foi possível identificar a sessão de pagamento neste link. Volte ao início ou use o link enviado após
                o checkout.
              </p>
            </>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild variant={state === "success" ? "default" : "outline"}>
              <a href={appLoginUrl}>Acessar o aplicativo</a>
            </Button>
            <Button asChild variant="outline">
              <Link to="/">Voltar ao início</Link>
            </Button>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutReturn;
