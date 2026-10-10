"use client";

import { projectCategories } from "@/content/projects";

type CategoryId = (typeof projectCategories)[number]["id"];

export function ProjectFilter({
  active,
  counts,
  onChange,
}: {
  active: CategoryId;
  counts: Record<CategoryId, number>;
  onChange: (id: CategoryId) => void;
}) {
  return (
    <div className="-mx-4 overflow-x-auto px-4 no-scrollbar sm:mx-0 sm:px-0">
      <div role="group" aria-label="Filter projects by category" className="flex w-max gap-2 sm:w-auto sm:flex-wrap">
        {projectCategories.map((cat) => {
          const isActive = active === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => onChange(cat.id)}
              className={`inline-flex min-h-11 items-center gap-2 whitespace-nowrap rounded-full border px-4 text-[0.92rem] font-medium transition-colors ${
                isActive
                  ? "border-white bg-white text-midnight"
                  : "border-white/20 text-white/80 hover:border-white/50 hover:text-white"
              }`}
            >
              {cat.label}
              <span className={`text-xs tabular-nums ${isActive ? "text-royal" : "text-white/50"}`}>{counts[cat.id]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
