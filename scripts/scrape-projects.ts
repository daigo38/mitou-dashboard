import * as cheerio from "cheerio";
import type { AnyNode } from "domhandler";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// --- Types ---

interface Creator {
  name: string;
  affiliation: string;
}

interface PM {
  name: string;
  affiliation: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  adoptionReason: string;
  year: number;
  programType: string;
  pm: PM;
  creators: Creator[];
  budget: number;
  links: string[];
}

// --- CLI Argument Parsing ---

function parseArgs() {
  const args = process.argv.slice(2);
  const parsed: Record<string, string> = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith("--")) {
      const key = args[i].slice(2);
      parsed[key] = args[i + 1] ?? "";
      i++;
    }
  }
  return parsed;
}

// --- Utilities ---

const BASE_URL = "https://www.ipa.go.jp";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchPage(url: string): Promise<string | null> {
  try {
    console.log(`  Fetching: ${url}`);
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`  ❌ HTTP ${res.status} for ${url}`);
      return null;
    }
    return await res.text();
  } catch (e) {
    console.error(`  ❌ Network error for ${url}: ${e}`);
    return null;
  }
}

function parseNameAffiliation(text: string): {
  name: string;
  affiliation: string;
} {
  // Format: "名前（所属）" or "名前(所属)"
  const match = text.match(/^(.+?)[（(](.+?)[）)]$/);
  if (match) {
    return { name: match[1].trim(), affiliation: match[2].trim() };
  }
  return { name: text.trim(), affiliation: "" };
}

function buildListPageUrl(
  program: string,
  year: number,
  period?: string,
): string {
  if (program === "it") {
    return `${BASE_URL}/jinzai/mitou/it/${year}/koubokekka.html`;
  }
  if (program === "advanced") {
    const suffix = period ? period : "";
    return `${BASE_URL}/jinzai/mitou/advanced/${year}${suffix}/koubokekka.html`;
  }
  throw new Error(`Unknown program: ${program}`);
}

function generateId(year: number, program: string, href: string): string {
  // Extract code from URL path: gaiyou-ig-1.html or gaiyou_ig-1.html → ig-1
  const match = href.match(/gaiyou[-_]([a-z]+-\d+)\.html/);
  if (match) {
    return `${year}-${program}-${match[1]}`;
  }
  // Fallback
  const filename = href.split("/").pop()?.replace(".html", "") ?? "unknown";
  return `${year}-${program}-${filename}`;
}

// --- Phase 1: Parse list page ---

interface ListEntry {
  pmName: string;
  title: string;
  href: string;
  creatorNames: string[];
}

function parseListPage(html: string): ListEntry[] {
  const $ = cheerio.load(html);
  const entries: ListEntry[] = [];

  // Strategy: collect all ul elements between h4 headings.
  // Project link uls and creator name uls alternate in pairs.
  $("h4").each((_, h4El) => {
    const h4Text = $(h4El).text().trim();
    const pmMatch = h4Text.match(
      /^(.+?)(?:PM|プロジェクトマネージャー)担当プロジェクト/,
    );
    if (!pmMatch) return;
    const pmName = pmMatch[1];

    // Collect all sibling ul elements until the next h4/h3/h2
    const uls: cheerio.Cheerio<AnyNode>[] = [];
    let current = $(h4El).next();
    while (current.length && !current.is("h4,h3,h2")) {
      if (current.is("ul")) {
        uls.push(current);
      }
      current = current.next();
    }

    // ULs come in pairs: [project-link-ul, creator-names-ul, project-link-ul, creator-names-ul, ...]
    for (let i = 0; i < uls.length; i++) {
      const ul = uls[i];
      const link = ul.find("a[href*='gaiyou']");
      if (!link.length) continue;

      const title = link.first().text().trim();
      const href = link.first().attr("href") ?? "";

      // Next ul should be creator names (no gaiyou links)
      const creatorNames: string[] = [];
      const nextUl = uls[i + 1];
      if (nextUl && !nextUl.find("a[href*='gaiyou']").length) {
        nextUl.find("li").each((_, li) => {
          const name = $(li).text().trim();
          if (name) creatorNames.push(name);
        });
        i++; // skip the creator ul
      }

      entries.push({ pmName, title, href, creatorNames });
    }
  });

  return entries;
}

// --- Phase 2: Parse detail page ---

interface DetailData {
  pm: PM;
  creators: Creator[];
  budget: number;
  title: string;
  website?: string;
  description: string;
  adoptionReason: string;
}

function parseDetailPage(html: string): DetailData {
  const $ = cheerio.load(html);

  const data: DetailData = {
    pm: { name: "", affiliation: "" },
    creators: [],
    budget: 0,
    title: "",
    description: "",
    adoptionReason: "",
  };

  // Find numbered section headers: h2.ttl with "1．", "2．" etc.
  const sections = new Map<number, cheerio.Cheerio<AnyNode>>();
  $("h2").each((_, el) => {
    const text = $(el).text().trim();
    const numMatch = text.match(/^(\d+)[．.]/);
    if (numMatch) {
      sections.set(parseInt(numMatch[1]), $(el));
    }
  });

  // Helper: get the first ul after a section header
  function getNextUl(section: cheerio.Cheerio<AnyNode>) {
    let current = section.next();
    while (current.length && !current.is("h2")) {
      if (current.is("ul")) return current;
      current = current.next();
    }
    return null;
  }

  // 1. 担当PM
  const pmSection = sections.get(1);
  if (pmSection) {
    const ul = getNextUl(pmSection);
    if (ul) {
      data.pm = parseNameAffiliation(ul.find("li").first().text().trim());
    }
  }

  // 2. 採択者氏名
  const creatorsSection = sections.get(2);
  if (creatorsSection) {
    const ul = getNextUl(creatorsSection);
    if (ul) {
      ul.find("li").each((_, li) => {
        const parsed = parseNameAffiliation($(li).text().trim());
        if (parsed.name) data.creators.push(parsed);
      });
    }
  }

  // 3. 採択金額
  const budgetSection = sections.get(3);
  if (budgetSection) {
    const ul = getNextUl(budgetSection);
    if (ul) {
      const budgetText = ul.find("li").first().text().trim();
      const cleaned = budgetText.replace(/[,，円]/g, "");
      data.budget = parseInt(cleaned) || 0;
    }
  }

  // 4. プロジェクト名
  const titleSection = sections.get(4);
  if (titleSection) {
    const ul = getNextUl(titleSection);
    if (ul) {
      data.title = ul.find("li").first().text().trim();
    }
  }

  // 5. 関連Webサイト
  const websiteSection = sections.get(5);
  if (websiteSection) {
    const ul = getNextUl(websiteSection);
    if (ul) {
      const link = ul.find("a[href]");
      if (link.length) {
        const href = link.first().attr("href") ?? "";
        if (href && !href.includes("なし")) {
          data.website = href;
        }
      } else {
        const text = ul.text().trim();
        if (text !== "なし" && text.startsWith("http")) {
          data.website = text;
        }
      }
    }
  }

  // 6. 申請プロジェクト概要
  const descSection = sections.get(6);
  const reasonSection = sections.get(7);
  if (descSection) {
    data.description = extractTextBetweenH2($, descSection);
  }

  // 7. 採択理由
  if (reasonSection) {
    data.adoptionReason = extractTextBetweenH2($, reasonSection);
  }

  return data;
}

function extractTextBetweenH2(
  $: cheerio.CheerioAPI,
  startH2: cheerio.Cheerio<AnyNode>,
): string {
  const parts: string[] = [];
  let current = startH2.next();

  while (current.length) {
    if (current.is("h2")) break;

    if (current.is("p")) {
      // Clean up <br> tags to spaces, then extract text
      const text = current.text().trim();
      if (text) parts.push(text);
    }

    current = current.next();
  }

  return parts.join("\n");
}

// --- Main ---

async function main() {
  const args = parseArgs();

  // Demo Day mode
  if (args["demo-day"]) {
    const year = parseInt(args["year"] ?? "2025");
    const program = args["program"] ?? "it";
    const period = args["period"];
    await handleDemoDay(args["demo-day"], year, program, period);
    return;
  }

  const year = parseInt(args["year"]);
  const program = args["program"];
  const period = args["period"];

  if (!year || !program) {
    console.error("Usage:");
    console.error(
      "  npx tsx scripts/scrape-projects.ts --year 2025 --program it",
    );
    console.error(
      "  npx tsx scripts/scrape-projects.ts --year 2025 --program advanced --period first",
    );
    console.error(
      "  npx tsx scripts/scrape-projects.ts --year 2025 --demo-day <url>",
    );
    process.exit(1);
  }

  console.log(
    `\n📋 Scraping ${program} projects for ${year}${period ? ` (${period})` : ""}...\n`,
  );

  // Phase 1: Fetch and parse list page
  const listUrl = buildListPageUrl(program, year, period);
  console.log("Phase 1: Fetching project list...");
  const listHtml = await fetchPage(listUrl);
  if (!listHtml) {
    console.error("Failed to fetch list page. Aborting.");
    process.exit(1);
  }

  const listEntries = parseListPage(listHtml);
  console.log(`  Found ${listEntries.length} projects\n`);

  if (listEntries.length === 0) {
    console.error(
      "No projects found on the list page. Check the URL and HTML structure.",
    );
    process.exit(1);
  }

  // Phase 2: Fetch detail pages
  console.log("Phase 2: Fetching detail pages...");
  const projects: Project[] = [];

  for (const entry of listEntries) {
    const fullUrl = entry.href.startsWith("http")
      ? entry.href
      : `${BASE_URL}${entry.href}`;

    await delay(500);
    const detailHtml = await fetchPage(fullUrl);

    if (!detailHtml) {
      console.warn(`  ⚠️ Skipping: ${entry.title}`);
      continue;
    }

    const detail = parseDetailPage(detailHtml);
    const id = generateId(year, program, entry.href);

    const project: Project = {
      id,
      title: detail.title || entry.title,
      description: detail.description,
      adoptionReason: detail.adoptionReason,
      year,
      programType: program,
      pm: detail.pm.name ? detail.pm : { name: entry.pmName, affiliation: "" },
      creators:
        detail.creators.length > 0
          ? detail.creators
          : entry.creatorNames.map((n) => ({ name: n, affiliation: "" })),
      budget: detail.budget,
      links: [fullUrl, ...(detail.website ? [detail.website] : [])],
    };

    projects.push(project);
    console.log(`  ✅ ${project.id}: ${project.title}`);
  }

  console.log(`\nCollected ${projects.length} projects.`);

  // Write output
  const suffix =
    program === "advanced" && period ? `${program}-${period}` : program;
  const outputPath = resolve(
    __dirname,
    `../src/data/projects/${year}-${suffix}.json`,
  );
  writeOutput(outputPath, projects);

  console.log(`\n✅ Written to ${outputPath}`);
  console.log(`   Total entries in file: ${readJson(outputPath).length}`);
}

function readJson(path: string): Project[] {
  if (!existsSync(path)) return [];
  try {
    return JSON.parse(readFileSync(path, "utf-8"));
  } catch {
    return [];
  }
}

function writeOutput(outputPath: string, newProjects: Project[]) {
  writeFileSync(
    outputPath,
    JSON.stringify(newProjects, null, 2) + "\n",
    "utf-8",
  );
}

async function handleDemoDay(
  demoDayUrl: string,
  year: number,
  program: string,
  period?: string,
) {
  console.log(`\n🎬 Scraping Demo Day: ${demoDayUrl}\n`);

  const html = await fetchPage(demoDayUrl);
  if (!html) {
    console.error("Failed to fetch Demo Day page.");
    process.exit(1);
  }

  const $ = cheerio.load(html);

  // Find all YouTube links on the page
  const youtubeLinks: { text: string; url: string }[] = [];
  $("a[href*='youtube.com'], a[href*='youtu.be']").each((_, el) => {
    const href = $(el).attr("href") ?? "";
    const text =
      $(el).text().trim() || $(el).closest("td, li, p, div").text().trim();
    if (href) {
      youtubeLinks.push({ text, url: href });
    }
  });

  console.log(`  Found ${youtubeLinks.length} YouTube links`);

  if (youtubeLinks.length === 0) {
    console.log("  No YouTube links found on the page.");
    return;
  }

  // Load existing JSON
  const suffix =
    program === "advanced" && period ? `${program}-${period}` : program;
  const outputPath = resolve(
    __dirname,
    `../src/data/projects/${year}-${suffix}.json`,
  );
  const projects = readJson(outputPath);

  if (projects.length === 0) {
    console.error(`  No existing projects in ${outputPath}. Run scrape first.`);
    return;
  }

  // Try to match YouTube links to projects
  let matched = 0;
  for (const project of projects) {
    for (const yt of youtubeLinks) {
      // Match by project title appearing in the surrounding text
      if (
        yt.text.includes(project.title.slice(0, 15)) ||
        project.title.includes(yt.text.slice(0, 15))
      ) {
        if (!project.links.includes(yt.url)) {
          project.links.push(yt.url);
        }
        matched++;
        console.log(`  ✅ Matched: ${project.id} → ${yt.url}`);
        break;
      }
    }
  }

  // If only one YouTube link and it's a live stream, assign to all
  if (matched === 0 && youtubeLinks.length <= 2) {
    console.log("  No exact matches. Assigning stream URL to all projects...");
    for (const project of projects) {
      const url = youtubeLinks[0].url;
      if (!project.links.includes(url)) {
        project.links.push(url);
      }
    }
    matched = projects.length;
  }

  writeFileSync(outputPath, JSON.stringify(projects, null, 2) + "\n", "utf-8");
  console.log(`\n✅ Patched ${matched} projects with Demo Day links.`);
}

main().catch((e) => {
  console.error("Fatal error:", e);
  process.exit(1);
});
