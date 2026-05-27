import { apiBaseUrl } from "./env";

export const DEMO_USED_STORAGE_KEY = "luni_demo_simulation_used";

import type { DemoIntensity } from "@/data/demoProcedures";

/** Escala demo alinhada às bandas ~0–32 / ~33–65 / ~66–100 do portal (valor representativo quando não há slider). */
const DEMO_SLIDER_REPRESENTATIVE_PCT: Record<DemoIntensity, number> = {
  sutil: 17,
  moderado: 50,
  dramatico: 83,
};

export type DemoPracticeProfile = "clinic" | "surgeon";

export interface RunDemoSimulationParams {
  imageFile: File;
  tipoProcedimento: string;
  practiceProfile: DemoPracticeProfile;
  intensidade: DemoIntensity;
  siliconeAck?: boolean;
  imageRightsAck?: boolean;
}

export interface DemoEnhanceSuccess {
  afterBase64: string;
  afterMime: string;
}

export class DemoApiError extends Error {
  code?: string;

  constructor(message: string, code?: string) {
    super(message);
    this.name = "DemoApiError";
    this.code = code;
  }
}

/** Indica que o navegador já consumiu o teste público neste dispositivo (espelho do limite principal no servidor por IP). */
export function hasDemoBeenUsedLocally(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(DEMO_USED_STORAGE_KEY) === "1";
}

export function markDemoUsedLocally(): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(DEMO_USED_STORAGE_KEY, "1");
}

export async function runDemoSimulation(params: RunDemoSimulationParams): Promise<DemoEnhanceSuccess> {
  const fd = new FormData();
  fd.append("image", params.imageFile);
  fd.append("tipo_procedimento", params.tipoProcedimento);
  fd.append("practice_profile", params.practiceProfile);
  fd.append("intensidade", params.intensidade);
  fd.append("intensidade_pct", String(DEMO_SLIDER_REPRESENTATIVE_PCT[params.intensidade]));
  if (params.siliconeAck) {
    fd.append("silicone_ack", "1");
  }
  if (params.imageRightsAck) {
    fd.append("image_rights_ack", "1");
  }

  let res: Response;
  try {
    res = await fetch(`${apiBaseUrl}/api/demo/enhance`, {
      method: "POST",
      body: fd,
    });
  } catch {
    throw new DemoApiError("Não foi possível conectar. Verifique sua internet e tente novamente.");
  }

  let data: Record<string, unknown> = {};
  try {
    data = (await res.json()) as Record<string, unknown>;
  } catch {
    /* ignore */
  }

  if (!res.ok) {
    const message =
      typeof data.message === "string" && data.message.trim()
        ? data.message.trim()
        : "Não foi possível gerar a demonstração.";
    const code = typeof data.code === "string" ? data.code : undefined;
    throw new DemoApiError(message, code);
  }

  const afterBase64 = data.afterBase64;
  const afterMime = typeof data.afterMime === "string" ? data.afterMime : "image/png";

  if (typeof afterBase64 !== "string" || !afterBase64.trim()) {
    throw new DemoApiError("Resposta inválida do servidor.", "INVALID_RESPONSE");
  }

  markDemoUsedLocally();
  return { afterBase64: afterBase64.trim(), afterMime };
}
