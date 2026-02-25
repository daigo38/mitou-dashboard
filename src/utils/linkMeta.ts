interface LinkMeta {
  label: string;
  className: string;
}

const rules: { test: (url: string) => boolean; meta: LinkMeta }[] = [
  {
    test: (url) => url.includes("ipa.go.jp"),
    meta: {
      label: "IPA",
      className:
        "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900",
    },
  },
  {
    test: (url) => url.includes("youtube.com") || url.includes("youtu.be"),
    meta: {
      label: "YouTube",
      className: "bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-800",
    },
  },
  {
    test: (url) => url.includes("github.com"),
    meta: {
      label: "GitHub",
      className: "bg-gray-800 text-white hover:bg-gray-900",
    },
  },
  {
    test: (url) => url.includes("x.com") || url.includes("twitter.com"),
    meta: {
      label: "X",
      className: "bg-gray-900 text-white hover:bg-black",
    },
  },
  {
    test: (url) => url.includes("zenn.dev"),
    meta: {
      label: "Zenn",
      className:
        "bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-800",
    },
  },
  {
    test: (url) => url.includes("qiita.com"),
    meta: {
      label: "Qiita",
      className:
        "bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-800",
    },
  },
  {
    test: (url) => url.endsWith(".pdf"),
    meta: {
      label: "PDF",
      className:
        "bg-orange-50 text-orange-600 hover:bg-orange-100 hover:text-orange-800",
    },
  },
];

const defaultMeta: LinkMeta = {
  label: "Web",
  className: "bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-800",
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
