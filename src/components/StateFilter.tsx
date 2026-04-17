"use client";

import { BRAZIL_STATES, BRAZIL_REGIONS } from "@/lib/states";

interface StateFilterProps {
  value: string;
  onChange: (stateCode: string) => void;
}

export function StateFilter({ value, onChange }: StateFilterProps) {
  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor="state-filter"
        className="text-sm font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap flex-shrink-0"
      >
        📍 Estado:
      </label>
      <div className="relative flex-1 min-w-[160px] max-w-[220px]">
        <select
          id="state-filter"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-1 dark:focus:ring-offset-gray-900 shadow-sm cursor-pointer transition-colors hover:border-brand-300 dark:hover:border-brand-600"
        >
          <option value="">🇧🇷 Todo o Brasil</option>
          {BRAZIL_REGIONS.map((region) => (
            <optgroup key={region} label={`── ${region}`}>
              {BRAZIL_STATES.filter((s) => s.region === region).map((state) => (
                <option key={state.code} value={state.code}>
                  {state.name} ({state.code})
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        {/* Custom chevron */}
        <div className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center">
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}
