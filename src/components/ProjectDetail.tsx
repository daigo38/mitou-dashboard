import Link from "next/link";
import { Project } from "@/types/project";
import { getLinkMeta, isYouTubeUrl } from "@/utils/linkMeta";

const programLabel: Record<string, string> = {
  it: "未踏IT",
  advanced: "未踏アドバンスト",
};

function YouTubeEmbed({ url }: { url: string }) {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtube\.com\/live\/|youtu\.be\/)([^&?]+)/,
  );
  if (!match) return null;
  const videoId = match[1];
  return (
    <div className="mb-6">
      <h2 className="mb-2 text-sm font-semibold text-gray-500">
        成果報告会（Demo Day）
      </h2>
      <div
        className="relative w-full overflow-hidden rounded-lg"
        style={{ paddingBottom: "56.25%" }}
      >
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="MITOU Demo Day"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}

function MultiParagraph({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((paragraph, i) => (
        <p key={i} className={i > 0 ? "mt-3" : ""}>
          {paragraph}
        </p>
      ))}
    </>
  );
}

export default function ProjectDetail({ project }: { project: Project }) {
  const youtubeUrl = project.links.find(isYouTubeUrl);
  const otherLinks = project.links.filter((url) => !isYouTubeUrl(url));

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        一覧に戻る
      </Link>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center gap-2">
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

        <h1 className="mb-4 text-2xl font-bold text-gray-900">
          {project.title}
        </h1>

        <div className="mb-6 leading-relaxed text-gray-700">
          <h2 className="mb-2 text-sm font-semibold text-gray-500">
            プロジェクト概要
          </h2>
          <MultiParagraph text={project.description} />
        </div>

        <div className="mb-6 leading-relaxed text-gray-700">
          <h2 className="mb-2 text-sm font-semibold text-gray-500">採択理由</h2>
          <MultiParagraph text={project.adoptionReason} />
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-md bg-gray-50 p-4">
            <h2 className="mb-2 text-sm font-semibold text-gray-500">PM</h2>
            <p className="font-medium text-gray-900">{project.pm.name}</p>
            {project.pm.affiliation && (
              <p className="text-sm text-gray-600">{project.pm.affiliation}</p>
            )}
          </div>

          <div className="rounded-md bg-gray-50 p-4">
            <h2 className="mb-2 text-sm font-semibold text-gray-500">
              クリエータ
            </h2>
            {project.creators.map((creator, i) => (
              <div key={i} className={i > 0 ? "mt-1" : ""}>
                <p className="font-medium text-gray-900">{creator.name}</p>
                {creator.affiliation && (
                  <p className="text-sm text-gray-600">{creator.affiliation}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {project.budget && (
          <div className="mb-6">
            <h2 className="mb-1 text-sm font-semibold text-gray-500">
              採択金額
            </h2>
            <p className="text-lg font-medium text-gray-900">
              {project.budget.toLocaleString()}円
            </p>
          </div>
        )}

        {youtubeUrl && <YouTubeEmbed url={youtubeUrl} />}

        <div>
          <h2 className="mb-2 text-sm font-semibold text-gray-500">
            関連リンク
          </h2>
          {otherLinks.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {otherLinks.map((url) => {
                const meta = getLinkMeta(url);
                return (
                  <a
                    key={url}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-3 py-1.5 text-sm text-blue-700 transition hover:bg-gray-200"
                  >
                    {meta.label}
                    <svg
                      className="h-3.5 w-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-400">情報なし</p>
          )}
        </div>
      </div>
    </div>
  );
}
