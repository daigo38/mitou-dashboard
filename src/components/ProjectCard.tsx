import Link from "next/link";
import { Project } from "@/types/project";
import { getLinkMeta } from "@/utils/linkMeta";

const programLabel: Record<string, string> = {
  it: "未踏IT",
  advanced: "未踏アドバンスト",
};

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="group rounded-xl border border-gray-200/80 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-gray-300/80 sm:p-5">
      <Link href={`/projects/${project.id}`}>
        <div className="mb-2.5 flex items-center gap-1.5">
          <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
            {project.year}年度
          </span>
          <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
            {programLabel[project.programType]}
          </span>
          {project.isSuperCreator && (
            <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
              スーパークリエータ
            </span>
          )}
        </div>

        <h3 className="mb-2 text-base font-semibold leading-snug text-gray-900 group-hover:text-blue-700 transition-colors sm:text-lg">
          {project.title}
        </h3>

        <p className="mb-3 text-sm leading-relaxed text-gray-500 line-clamp-2">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
          <span>PM: {project.pm.name}</span>
          <span>
            クリエータ: {project.creators.map((c) => c.name).join("・")}
          </span>
        </div>

        {project.budget && (
          <div className="mt-2 text-xs text-gray-400">
            採択金額: {project.budget.toLocaleString()}円
          </div>
        )}
      </Link>

      {project.links.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-gray-100 pt-3">
          {project.links.map((url) => {
            const meta = getLinkMeta(url);
            return (
              <a
                key={url}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                title={meta.label}
                className={`inline-flex items-center gap-1 rounded-full p-1.5 text-xs font-medium transition ${meta.className}`}
              >
                {meta.icon()}
                {meta.showLabel && <span className="pr-1">{meta.label}</span>}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
