import { type ReactElement, createElement } from "react";

interface LinkMeta {
  label: string;
  icon: (className?: string) => ReactElement;
  className: string;
  showLabel?: boolean;
}

function makeSvgIcon(d: string, fill?: boolean) {
  return (className?: string) =>
    createElement(
      "svg",
      {
        className: className ?? "h-4 w-4",
        viewBox: "0 0 24 24",
        fill: fill ? "currentColor" : "none",
        stroke: fill ? "none" : "currentColor",
        strokeWidth: fill ? undefined : 2,
        strokeLinecap: fill ? undefined : ("round" as const),
        strokeLinejoin: fill ? undefined : ("round" as const),
      },
      createElement("path", { d }),
    );
}

const icons = {
  ipa: makeSvgIcon(
    "M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3",
  ),
  youtube: makeSvgIcon(
    "M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 0 0 .5 6.19 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14c1.88.55 9.38.55 9.38.55s7.5 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.81zM9.75 15.02V8.98L15.5 12l-5.75 3.02z",
    true,
  ),
  github: makeSvgIcon(
    "M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z",
    true,
  ),
  x: makeSvgIcon(
    "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
    true,
  ),
  zenn: makeSvgIcon(
    "M.264 23.771h4.984c.264 0 .498-.147.645-.352L19.614.874c.176-.293-.029-.645-.381-.645h-4.72a.781.781 0 0 0-.645.352L.03 23.126c-.176.264.029.645.234.645zM17.445 23.419l6.479-10.408c.205-.323-.029-.733-.41-.733h-4.691a.804.804 0 0 0-.676.381l-6.479 10.408c-.205.323.029.733.41.733h4.691a.796.796 0 0 0 .676-.381z",
    true,
  ),
  qiita: makeSvgIcon(
    "M12 2a10 10 0 1 0 4.3 19.04l3.1 3.1a.75.75 0 0 0 1.06-1.06l-2.84-2.84A10 10 0 0 0 12 2zm0 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16z",
    true,
  ),
  pdf: makeSvgIcon(
    "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
  ),
  researchmap: makeSvgIcon(
    "M12 14l9-5-9-5-9 5 9 5z M12 14v7.5 M20 12v5.5a8.38 8.38 0 0 1-8 3 8.38 8.38 0 0 1-8-3V12",
  ),
  web: makeSvgIcon(
    "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3.6 9h16.8M3.6 15h16.8 M12 3a15.3 15.3 0 0 1 4 9 15.3 15.3 0 0 1-4 9 15.3 15.3 0 0 1-4-9 15.3 15.3 0 0 1 4-9z",
  ),
};

const rules: { test: (url: string) => boolean; meta: LinkMeta }[] = [
  {
    test: (url) => url.includes("ipa.go.jp"),
    meta: {
      label: "IPA",
      icon: icons.ipa,
      className: "text-gray-500 hover:text-gray-900",
      showLabel: true,
    },
  },
  {
    test: (url) => url.includes("youtube.com") || url.includes("youtu.be"),
    meta: {
      label: "YouTube",
      icon: icons.youtube,
      className: "text-red-500 hover:text-red-700",
    },
  },
  {
    test: (url) => url.includes("github.com"),
    meta: {
      label: "GitHub",
      icon: icons.github,
      className: "text-gray-700 hover:text-black",
    },
  },
  {
    test: (url) => url.includes("x.com") || url.includes("twitter.com"),
    meta: {
      label: "X",
      icon: icons.x,
      className: "text-gray-700 hover:text-black",
    },
  },
  {
    test: (url) => url.includes("zenn.dev"),
    meta: {
      label: "Zenn",
      icon: icons.zenn,
      className: "text-blue-500 hover:text-blue-700",
    },
  },
  {
    test: (url) => url.includes("qiita.com"),
    meta: {
      label: "Qiita",
      icon: icons.qiita,
      className: "text-green-500 hover:text-green-700",
    },
  },
  {
    test: (url) => url.includes("researchmap.jp"),
    meta: {
      label: "researchmap",
      icon: icons.researchmap,
      className: "text-blue-600 hover:text-blue-800",
    },
  },
  {
    test: (url) => url.endsWith(".pdf"),
    meta: {
      label: "PDF",
      icon: icons.pdf,
      className: "text-orange-500 hover:text-orange-700",
    },
  },
];

const defaultMeta: LinkMeta = {
  label: "Web",
  icon: icons.web,
  className: "text-blue-500 hover:text-blue-700",
};

export function getLinkMeta(url: string): LinkMeta {
  for (const rule of rules) {
    if (rule.test(url)) return rule.meta;
  }
  return defaultMeta;
}

export function isYouTubeUrl(url: string): boolean {
  return url.includes("youtube.com") || url.includes("youtu.be");
}
