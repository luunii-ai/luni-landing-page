/**
 * Demo na landing espelha o portal: mesmos textos enviados em `tipo_procedimento` (+ intensidade/sutil|moderado|dramatico).
 * Agrupamentos para UI (portal não envia categorias da API para cirurgias).
 */

export type DemoPracticeProfileLite = "clinic" | "surgeon";

/** Valores aceitos pelo agente alinhados a `enhanceApi.intensityPercentToApiLabel`. */
export const DEMO_INTENSITY_OPTIONS = [
  { value: "sutil" as const, label: "Sutil" },
  { value: "moderado" as const, label: "Moderado" },
  { value: "dramatico" as const, label: "Dramático" },
];

export type DemoIntensity = (typeof DEMO_INTENSITY_OPTIONS)[number]["value"];

export type DemoProcedureItem = {
  label: string;
  apiTipo: string;
  requiresSiliconeAck?: boolean;
};

export type DemoProcedureGroup = {
  categoryLabel: string;
  procedures: DemoProcedureItem[];
};

/** Clínica — mesmos tipos que `procedureIdToApiTipo` no portal (sem incluir cirurgias). */
export const DEMO_CLINIC_GROUPS: DemoProcedureGroup[] = [
  {
    categoryLabel: "Toxina botulínica",
    procedures: [{ label: "Botox", apiTipo: "Botox" }],
  },
  {
    categoryLabel: "Preenchimento e contorno facial",
    procedures: [
      { label: "Preenchimento labial", apiTipo: "Preenchimento Labial" },
      { label: "Contorno de mandíbula", apiTipo: "Contorno de Mandíbula" },
      { label: "Preenchimento malar", apiTipo: "Preenchimento Malar" },
      { label: "Bigode chinês", apiTipo: "Bigode chinês (sulco nasogeniano)" },
      { label: "Preenchimento de mento (queixo)", apiTipo: "Preenchimento de mento (queixo)" },
      { label: "Preenchimento de olheira", apiTipo: "Preenchimento de olheira" },
    ],
  },
  {
    categoryLabel: "Harmonização nasal",
    procedures: [{ label: "Rinomodelação", apiTipo: "Rinomodelação" }],
  },
];

/** Cirurgiões — igual a `plasticSurgeryProcedures` no portal. */
export const DEMO_SURGEON_GROUPS: DemoProcedureGroup[] = [
  {
    categoryLabel: "Corpo",
    procedures: [
      { label: "Lipo HD", apiTipo: "Lipo HD" },
      { label: "Papada", apiTipo: "Papada" },
      { label: "Lifting de braço", apiTipo: "Lifting de braço" },
    ],
  },
  {
    categoryLabel: "Face",
    procedures: [
      { label: "Rinoplastia", apiTipo: "Rinoplastia" },
      { label: "Otoplastia (orelha)", apiTipo: "Otoplastia (orelha)" },
    ],
  },
  {
    categoryLabel: "Mamas",
    procedures: [
      {
        label: "Mamoplastia",
        apiTipo: "Mamoplastia (prótese de silicone)",
        requiresSiliconeAck: true,
      },
    ],
  },
];

export function demoProcedureGroupsFor(profile: DemoPracticeProfileLite): DemoProcedureGroup[] {
  return profile === "surgeon" ? DEMO_SURGEON_GROUPS : DEMO_CLINIC_GROUPS;
}

export function flattenDemoProcedures(groups: DemoProcedureGroup[]): DemoProcedureItem[] {
  return groups.flatMap((g) => g.procedures);
}

export function firstDemoApiTipo(profile: DemoPracticeProfileLite): string {
  const flat = flattenDemoProcedures(demoProcedureGroupsFor(profile));
  return flat[0]?.apiTipo ?? "";
}
