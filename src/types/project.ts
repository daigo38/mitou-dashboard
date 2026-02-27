export type ProgramType = "it" | "advanced";

export interface LabeledLink {
  url: string;
  label: string;
}

export type ProjectLink = string | LabeledLink;

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
    links?: string[];
  }[];
  budget?: number;
  links: ProjectLink[];
  start?: number;
  isSuperCreator?: boolean;
}
