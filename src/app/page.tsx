"use client";

import { useState, useMemo, useEffect } from "react";
import { projects } from "@/data/projects";
import { ProgramType } from "@/types/project";
import ProjectCard from "@/components/ProjectCard";
import FilterBar from "@/components/FilterBar";

const STORAGE_KEY = "mitou-dashboard-filters";

const allYears = [...new Set(projects.map((p) => p.year))].sort(
  (a, b) => b - a,
);
const allPms = [...new Set(projects.map((p) => p.pm.name))].sort();
const allPrograms: ProgramType[] = ["it", "advanced"];

function loadFilters() {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function Home() {
  const [saved] = useState(loadFilters);

  const [selectedYears, setSelectedYears] = useState<number[]>(
    saved?.years ?? allYears,
  );
  const [selectedPrograms, setSelectedPrograms] = useState<ProgramType[]>(
    saved?.programs ?? allPrograms,
  );
  const [selectedPm, setSelectedPm] = useState(saved?.pm ?? "all");
  const [searchQuery, setSearchQuery] = useState(saved?.q ?? "");

  useEffect(() => {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        years: selectedYears,
        programs: selectedPrograms,
        pm: selectedPm,
        q: searchQuery,
      }),
    );
  }, [selectedYears, selectedPrograms, selectedPm, searchQuery]);

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      if (selectedYears.length > 0 && !selectedYears.includes(p.year))
        return false;
      if (
        selectedPrograms.length > 0 &&
        !selectedPrograms.includes(p.programType)
      )
        return false;
      if (selectedPm !== "all" && p.pm.name !== selectedPm) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const creatorNames = p.creators.map((c) => c.name).join(" ");
        if (
          !p.title.toLowerCase().includes(q) &&
          !p.description.toLowerCase().includes(q) &&
          !creatorNames.toLowerCase().includes(q) &&
          !p.pm.name.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [selectedYears, selectedPrograms, selectedPm, searchQuery]);

  return (
    <>
      <FilterBar
        years={allYears}
        selectedYears={selectedYears}
        onYearsChange={setSelectedYears}
        selectedPrograms={selectedPrograms}
        onProgramsChange={setSelectedPrograms}
        pms={allPms}
        selectedPm={selectedPm}
        onPmChange={setSelectedPm}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        resultCount={filtered.length}
      />

      <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-8 text-center text-gray-400">
          条件に一致するプロジェクトがありません
        </p>
      )}
    </>
  );
}
