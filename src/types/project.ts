export type ProgramType = "it" | "advanced";

export interface Project {
  id: string;
  title: string;
  description: string;
  adoptionReason: string;
  year: number;
  programType: ProgramType;
  period?: "first" | "second";
  pm: {
    name: string;
    affiliation: string;
  };
  creators: {
    name: string;
    affiliation: string;
  }[];
  budget?: number;
  links: {
    ipa?: string;
    github?: string;
    website?: string;
    demoVideo?: string;
    portfolio?: string;
    reportPdf?: string;
    proposalPdf?: string;
  };
  isSuperCreator?: boolean;
}
