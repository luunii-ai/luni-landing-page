import { useCallback, useEffect, useRef, useState } from "react";
import { Building2, Stethoscope, Loader2, ImagePlus, Sparkles } from "lucide-react";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import { Button } from "@/components/ui/button";
import demoSampleSrc from "@/assets/demo-sample.jpg";
import { appLoginUrl } from "@/lib/env";
import {
  DemoApiError,
  hasDemoBeenUsedLocally,
  runDemoSimulation,
  type DemoPracticeProfile,
} from "@/lib/demoApi";
import {
  DEMO_INTENSITY_OPTIONS,
  demoProcedureGroupsFor,
  flattenDemoProcedures,
  firstDemoApiTipo,
  type DemoIntensity,
  type DemoProcedureItem,
} from "@/data/demoProcedures";
import { cn } from "@/lib/utils";

const MiniSimulator = () => {
  const [localLimit, setLocalLimit] = useState(() =>
    typeof window !== "undefined" ? hasDemoBeenUsedLocally() : false,
  );
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [profile, setProfile] = useState<DemoPracticeProfile | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [beforeDataUrl, setBeforeDataUrl] = useState<string | null>(null);
  const [procedureApiTipo, setProcedureApiTipo] = useState<string>("");
  const [siliconeAck, setSiliconeAck] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [afterDataUrl, setAfterDataUrl] = useState<string | null>(null);
  const [intensidade, setIntensidade] = useState<DemoIntensity>("moderado");
  const photoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!imageFile) {
      setBeforeDataUrl(null);
      return;
    }
    const url = URL.createObjectURL(imageFile);
    setBeforeDataUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const loadSampleFile = useCallback(async () => {
    const r = await fetch(demoSampleSrc);
    const blob = await r.blob();
    const file = new File([blob], "demo-sample.jpg", { type: blob.type || "image/jpeg" });
    setImageFile(file);
    setError(null);
  }, []);

  const resetFlow = () => {
    setStep(1);
    setProfile(null);
    setImageFile(null);
    setProcedureApiTipo("");
    setSiliconeAck(false);
    setIntensidade("moderado");
    setAfterDataUrl(null);
    setError(null);
    setLoading(false);
  };

  const onPickProfile = (p: DemoPracticeProfile) => {
    setProfile(p);
    setProcedureApiTipo(firstDemoApiTipo(p));
    setSiliconeAck(false);
    setIntensidade("moderado");
    setError(null);
    setStep(2);
  };

  const flatProcedures: DemoProcedureItem[] = profile
    ? flattenDemoProcedures(demoProcedureGroupsFor(profile))
    : [];
  const procedureGroups = profile ? demoProcedureGroupsFor(profile) : [];

  const selectedProcedure = flatProcedures.find((pr) => pr.apiTipo === procedureApiTipo);

  const generate = async () => {
    setError(null);
    if (!profile || !imageFile) {
      setError("Escolha uma foto para continuar.");
      return;
    }
    const proc = selectedProcedure;
    if (!proc) {
      setError("Selecione um procedimento válido.");
      return;
    }
    if (proc.requiresSiliconeAck && !siliconeAck) {
      setError(
        "Para mamoplastia, confirme o reconhecimento de prótese de silicone (como na plataforma completa).",
      );
      return;
    }

    setLoading(true);
    try {
      const { afterBase64, afterMime } = await runDemoSimulation({
        imageFile,
        tipoProcedimento: proc.apiTipo,
        practiceProfile: profile,
        intensidade,
        siliconeAck: proc.requiresSiliconeAck ? true : undefined,
      });
      setAfterDataUrl(`data:${afterMime};base64,${afterBase64}`);
      setLocalLimit(true);
      setStep(3);
    } catch (e) {
      if (e instanceof DemoApiError) {
        setError(e.message);
        if (e.code === "DEMO_RATE_LIMIT") {
          setLocalLimit(true);
        }
      } else {
        setError("Algo deu errado. Tente novamente em instantes.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (localLimit && step !== 3) {
    return (
      <div className="flex h-full min-h-[220px] flex-col items-center justify-center gap-4 p-6 text-center">
        <p className="text-sm font-medium text-foreground">
          Você já usou a demonstração gratuita neste navegador (ou limite por IP foi atingido).
        </p>
        <p className="text-xs text-muted-foreground max-w-xs">
          Crie sua conta para simular quantas vezes precisar, com todas as ferramentas do portal.
        </p>
        <Button asChild size="sm" className="rounded-full">
          <a href={appLoginUrl} target="_blank" rel="noopener noreferrer">
            Ir para cadastro / login
          </a>
        </Button>
      </div>
    );
  }

  if (step === 3 && beforeDataUrl && afterDataUrl) {
    return (
      <div className="flex h-full flex-col gap-3 p-3">
        <div className="min-h-0 flex-1 rounded-lg overflow-hidden">
          <BeforeAfterSlider beforeImage={beforeDataUrl} afterImage={afterDataUrl} />
        </div>
        <p className="text-center text-[10px] text-muted-foreground px-2">
          Resultado ilustrativo gerado por IA. Demonstração limitada ao público —{" "}
          <a className="text-primary underline-offset-4 hover:underline font-medium" href={appLoginUrl}>
            criar conta
          </a>
        </p>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="flex h-full min-h-[300px] flex-col p-5 sm:p-6">
        {/* CTA — mesmo tom do hero (pulse + tipografia) */}
        <div className="shrink-0 text-center space-y-3">
          <div className="inline-flex items-center justify-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" aria-hidden />
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
              Simulação gratuita
            </span>
            <Sparkles className="h-3.5 w-3.5 text-primary/80 shrink-0" strokeWidth={2} aria-hidden />
          </div>
          <h2 className="text-base sm:text-lg font-medium tracking-tight text-foreground px-1 leading-snug">
            Teste a IA em segundos —{" "}
            <span className="font-serif italic text-primary">sem cadastro</span>
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-[22rem] mx-auto">
            Envie uma foto ou use a de exemplo, escolha o procedimento e veja o antes e depois. Uma demonstração
            por visitante.
          </p>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground/80 font-medium pt-1">
            Comece escolhendo seu perfil abaixo
          </p>
        </div>

        <div className="flex flex-1 flex-col justify-center items-center min-h-0 py-4">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full max-w-sm mx-auto">
            <button
              type="button"
              onClick={() => onPickProfile("clinic")}
              className={cn(
                "group glass-card gradient-border rounded-2xl p-4 sm:p-5 text-center transition-all duration-300",
                "hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/15",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
                "border-border/50 bg-background/90 backdrop-blur-sm",
              )}
            >
              <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 shadow-inner ring-1 ring-primary/15 transition-colors group-hover:bg-primary/15">
                <Building2 className="h-5 w-5 text-primary stroke-[1.75]" />
              </div>
              <span className="block text-sm font-semibold text-foreground">Clínica estética</span>
              <span className="mt-1 block text-[11px] text-muted-foreground leading-snug">
                Harmonização e injetáveis
              </span>
              <span className="mt-3 inline-flex items-center justify-center text-[10px] font-semibold uppercase tracking-wide text-primary opacity-0 transition-opacity group-hover:opacity-100">
                Continuar →
              </span>
            </button>
            <button
              type="button"
              onClick={() => onPickProfile("surgeon")}
              className={cn(
                "group glass-card gradient-border rounded-2xl p-4 sm:p-5 text-center transition-all duration-300",
                "hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/15",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
                "border-border/50 bg-background/90 backdrop-blur-sm",
              )}
            >
              <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 shadow-inner ring-1 ring-primary/15 transition-colors group-hover:bg-primary/15">
                <Stethoscope className="h-5 w-5 text-primary stroke-[1.75]" />
              </div>
              <span className="block text-sm font-semibold text-foreground">Cirurgião plástico</span>
              <span className="mt-1 block text-[11px] text-muted-foreground leading-snug">
                Cirurgias e contornos
              </span>
              <span className="mt-3 inline-flex items-center justify-center text-[10px] font-semibold uppercase tracking-wide text-primary opacity-0 transition-opacity group-hover:opacity-100">
                Continuar →
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const procList = procedureGroups;

  return (
    <div className="flex h-full flex-col gap-3 p-4 min-h-0 max-h-[520px] overflow-y-auto overscroll-contain">
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => {
            resetFlow();
            setLocalLimit(hasDemoBeenUsedLocally());
          }}
          className="text-[11px] text-muted-foreground hover:text-primary underline-offset-4 hover:underline"
        >
          Voltar
        </button>
        <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
          {profile === "surgeon" ? "Cirurgião" : "Clínica"}
        </span>
      </div>

      {error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-[11px] text-destructive">
          {error}
        </div>
      ) : null}

      <div className="space-y-2">
        <label className="text-xs font-medium text-foreground block" htmlFor="mini-sim-procedure">
          Procedimento
        </label>
        <select
          id="mini-sim-procedure"
          className="w-full rounded-md border border-input bg-background px-2 py-2 text-sm"
          value={procedureApiTipo}
          onChange={(e) => {
            setProcedureApiTipo(e.target.value);
            setSiliconeAck(false);
            setError(null);
          }}
        >
          {procList.map((group) => (
            <optgroup key={group.categoryLabel} label={group.categoryLabel}>
              {group.procedures.map((p) => (
                <option key={p.apiTipo} value={p.apiTipo}>
                  {p.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium text-foreground block" htmlFor="mini-sim-intensity">
          Intensidade
        </label>
        <select
          id="mini-sim-intensity"
          className="w-full rounded-md border border-input bg-background px-2 py-2 text-sm"
          value={intensidade}
          onChange={(e) => {
            setIntensidade(e.target.value as DemoIntensity);
            setError(null);
          }}
        >
          {DEMO_INTENSITY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {selectedProcedure?.requiresSiliconeAck ? (
        <label className="flex items-start gap-2 text-[11px] text-muted-foreground cursor-pointer leading-relaxed">
          <input
            type="checkbox"
            checked={siliconeAck}
            onChange={(e) => setSiliconeAck(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-input"
          />
          <span>Confirmo o reconhecimento de prótese de silicone para esta simulação de mamoplastia.</span>
        </label>
      ) : null}

      <div className="space-y-2 flex-1 min-h-0">
        <span className="text-xs font-medium text-foreground block">Foto</span>
        <div className="flex flex-wrap gap-2">
          <input
            ref={photoInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            aria-hidden="true"
            tabIndex={-1}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) {
                setImageFile(f);
                setError(null);
              }
              e.target.value = "";
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="cursor-pointer"
            onClick={() => photoInputRef.current?.click()}
          >
            <ImagePlus className="w-4 h-4 mr-1" />
            Escolher arquivo
          </Button>
          <Button type="button" variant="secondary" size="sm" onClick={() => void loadSampleFile()}>
            Foto de exemplo
          </Button>
        </div>
        {imageFile ? (
          <p className="text-[11px] text-muted-foreground truncate" title={imageFile.name}>
            {imageFile.name}
          </p>
        ) : (
          <p className="text-[11px] text-muted-foreground">Formatos: JPG, PNG ou WebP · máx. 15 MB.</p>
        )}
      </div>

      <Button
        type="button"
        className="w-full rounded-full"
        disabled={loading || !imageFile}
        onClick={() => void generate()}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Gerando…
          </>
        ) : (
          "Gerar simulação"
        )}
      </Button>

      <p className="text-[10px] text-center text-muted-foreground leading-snug px-1">
        Uma simulação pública gratuita por dispositivo (também limitada por IP no servidor).
      </p>
    </div>
  );
};

export default MiniSimulator;
