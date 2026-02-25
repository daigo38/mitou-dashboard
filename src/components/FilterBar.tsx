"use client";

import { ProgramType } from "@/types/project";

interface FilterBarProps {
  years: number[];
  selectedYears: number[];
  onYearsChange: (years: number[]) => void;
  selectedProgram: ProgramType | "all";
  onProgramChange: (program: ProgramType | "all") => void;
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
  selectedProgram,
  onProgramChange,
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

  return (
    <div className="mb-6 space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div>
        <input
          type="text"
          placeholder="タイトル・概要・名前を検索..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">年度:</span>
          <label className="flex items-center gap-1 text-sm font-medium">
            <input
              type="checkbox"
              checked={allYearsSelected}
              onChange={toggleAllYears}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            すべて
          </label>
          {years.map((year) => (
            <label key={year} className="flex items-center gap-1 text-sm">
              <input
                type="checkbox"
                checked={selectedYears.includes(year)}
                onChange={() => toggleYear(year)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              {year}
            </label>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">種別:</span>
          <select
            value={selectedProgram}
            onChange={(e) =>
              onProgramChange(e.target.value as ProgramType | "all")
            }
            className="rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">すべて</option>
            <option value="it">未踏IT</option>
            <option value="advanced">未踏アドバンスト</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">PM:</span>
          <select
            value={selectedPm}
            onChange={(e) => onPmChange(e.target.value)}
            className="rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">すべて</option>
            {pms.map((pm) => (
              <option key={pm} value={pm}>
                {pm}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="text-sm text-gray-500">
        {resultCount} 件のプロジェクト
      </div>
    </div>
  );
}
