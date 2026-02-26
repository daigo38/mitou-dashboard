"use client";

import { ProgramType } from "@/types/project";

const allPrograms: ProgramType[] = ["it", "advanced"];

interface FilterBarProps {
  years: number[];
  selectedYears: number[];
  onYearsChange: (years: number[]) => void;
  selectedPrograms: ProgramType[];
  onProgramsChange: (programs: ProgramType[]) => void;
  pms: string[];
  selectedPm: string;
  onPmChange: (pm: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  resultCount: number;
}

export default function FilterBar({
  years,
  selectedYears,
  onYearsChange,
  selectedPrograms,
  onProgramsChange,
  pms,
  selectedPm,
  onPmChange,
  searchQuery,
  onSearchChange,
  resultCount,
}: FilterBarProps) {
  const allYearsSelected = selectedYears.length === years.length;

  const toggleAllYears = () => {
    onYearsChange(allYearsSelected ? [] : [...years]);
  };

  const toggleYear = (year: number) => {
    if (selectedYears.includes(year)) {
      onYearsChange(selectedYears.filter((y) => y !== year));
    } else {
      onYearsChange([...selectedYears, year]);
    }
  };

  const toggleProgram = (program: ProgramType) => {
    if (selectedPrograms.includes(program)) {
      onProgramsChange(selectedPrograms.filter((p) => p !== program));
    } else {
      onProgramsChange([...selectedPrograms, program]);
    }
  };

  return (
    <div className="mb-4 space-y-3 rounded-xl border border-gray-200/80 bg-white p-3 shadow-sm sm:mb-6 sm:space-y-4 sm:p-5">
      <div className="relative">
        <svg
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="タイトル・概要・名前を検索..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-3 text-sm transition-colors placeholder:text-gray-400 focus:border-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-400/20"
        />
      </div>

      <div className="space-y-3 sm:space-y-0 sm:flex sm:flex-wrap sm:items-start sm:gap-5">
        <div>
          <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400 sm:mb-1.5">
            年度
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={toggleAllYears}
              className={`mr-1 text-xs font-medium transition-colors ${
                allYearsSelected
                  ? "text-gray-900 underline underline-offset-2"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {allYearsSelected ? "解除" : "すべて"}
            </button>
            <span className="mr-0.5 text-gray-200">|</span>
            {years.map((year) => {
              const isSelected = selectedYears.includes(year);
              return (
                <button
                  key={year}
                  onClick={() => toggleYear(year)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                    isSelected
                      ? "border border-gray-900 bg-white text-gray-900 shadow-sm"
                      : "border border-transparent bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {year}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400 sm:mb-1.5">
            種別
          </span>
          <div className="flex gap-1.5">
            {(
              [
                { value: "it", label: "未踏IT" },
                { value: "advanced", label: "アドバンスト" },
              ] as const
            ).map(({ value, label }) => {
              const isSelected = selectedPrograms.includes(value);
              return (
                <button
                  key={value}
                  onClick={() => toggleProgram(value)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                    isSelected
                      ? "border border-gray-900 bg-white text-gray-900 shadow-sm"
                      : "border border-transparent bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="min-w-0">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400 sm:mb-1.5">
            PM
          </span>
          <div className="relative">
            <select
              value={selectedPm}
              onChange={(e) => onPmChange(e.target.value)}
              className="min-w-0 max-w-full appearance-none rounded-full border border-gray-200 bg-gray-50 py-1 pl-3 pr-8 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100 focus:border-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-400/20"
            >
              <option value="all">すべて</option>
              {pms.map((pm) => (
                <option key={pm} value={pm}>
                  {pm}
                </option>
              ))}
            </select>
            <svg
              className="pointer-events-none absolute right-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-gray-400">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-500" />
        {resultCount} 件のプロジェクト
      </div>
    </div>
  );
}
