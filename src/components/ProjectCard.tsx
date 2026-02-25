import Link from "next/link";
import { Project } from "@/types/project";
import { getLinkMeta } from "@/utils/linkMeta";

const programLabel: Record<string, string> = {
  it: "未踏IT",
  advanced: "未踏アドバンスト",
};

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md hover:border-gray-300">
      <Link href={`/projects/${project.id}`}>
        <div className="mb-2 flex items-center gap-2">
          <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
            {project.year}年度
          </span>
          <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
            {programLabel[project.programType]}
          </span>
          {project.isSuperCreator && (
            <span className="rounded bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
              スーパークリエータ
            </span>
          )}
        </div>

        <h3 className="mb-2 text-lg font-semibold text-gray-900 leading-snug">
          {project.title}
        </h3>

        <p className="mb-3 text-sm text-gray-600 line-clamp-2">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
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
        <div className="mt-3 flex flex-wrap gap-2 border-t border-gray-100 pt-3">
          {project.links.map((url) => {
            const meta = getLinkMeta(url);
            return (
              <a
                key={url}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className={`inline-flex items-center gap-1 rounded px-2 py-1 text-xs transition ${meta.className}`}
              >
                {meta.label}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
