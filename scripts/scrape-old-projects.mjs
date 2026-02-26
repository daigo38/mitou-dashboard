import * as cheerio from "cheerio";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const BASE_URL = "https://www.ipa.go.jp";
const DELAY_MS = 500; // Be respectful to the server
const DATA_DIR = join(import.meta.dirname, "../src/data/projects");

// All index pages that contain project links
const INDEX_PAGES = {
  // IT program
  "2019-it": ["/jinzai/mitou/it/2019/index.html"],
  "2018-it": ["/jinzai/mitou/it/2018/index.html"],
  "2017-it": ["/jinzai/mitou/it/2017/index.html"],
  "2016-it": ["/jinzai/mitou/it/2016/index.html"],
  "2015-it": ["/jinzai/mitou/it/2015/index.html"],
  "2014-it": ["/jinzai/mitou/it/2014/index.html"],
  "2013-it": ["/jinzai/mitou/it/2013/index.html"],
  "2012-it": ["/jinzai/mitou/it/2012/index.html"],
  "2011-it": ["/jinzai/mitou/it/2011/index.html"],
  "2010-it": [
    "/jinzai/mitou/it/2010/youth/index.html",
    "/jinzai/mitou/it/2010/hontai/index.html",
  ],
  "2009-it": [
    "/jinzai/mitou/it/2009/2009-1-youth/index.html",
    "/jinzai/mitou/it/2009/2009-1-hontai/index.html",
    "/jinzai/mitou/it/2009/2009-2-youth/index.html",
    "/jinzai/mitou/it/2009/2009-2-hontai/index.html",
  ],
  "2008-it": [
    "/jinzai/mitou/it/2008/2008-1-youth/index.html",
    "/jinzai/mitou/it/2008/2008-1-hontai/index.html",
    "/jinzai/mitou/it/2008/2008-2-youth/index.html",
    "/jinzai/mitou/it/2008/2008-2-hontai/index.html",
  ],
  // Advanced program
  "2019-advanced": ["/jinzai/mitou/advanced/2019/index.html"],
  "2018-advanced": ["/jinzai/mitou/advanced/2018/index.html"],
  "2017-advanced": ["/jinzai/mitou/advanced/2017/index.html"],
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchPage(url) {
  const fullUrl = url.startsWith("http") ? url : BASE_URL + url;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(fullUrl);
      if (!res.ok) {
        console.error(`  HTTP ${res.status} for ${fullUrl}`);
        if (attempt < 2) await sleep(2000);
        continue;
      }
      return await res.text();
    } catch (e) {
      console.error(`  Fetch error for ${fullUrl}: ${e.message}`);
      if (attempt < 2) await sleep(2000);
    }
  }
  return null;
}

function discoverProjectUrls(html, indexUrl) {
  const $ = cheerio.load(html);
  const urls = [];
  // Get the base path from the index URL
  const basePath = indexUrl.replace(/index\.html$/, "");

  $("a[href]").each((_, el) => {
    const href = $(el).attr("href");
    if (!href) return;
    // Filter to project pages only (exclude seika, koubokekka, index pages, and non-project links)
    if (
      href.includes("seika") ||
      href.includes("koubokekka") ||
      href.includes("index.html") ||
      href.startsWith("#") ||
      href.includes("/common/") ||
      !href.endsWith(".html")
    )
      return;

    // Only include links that are in the same directory or subdirectory
    const fullHref = href.startsWith("/") ? href : basePath + href;
    if (
      fullHref.includes("/jinzai/mitou/") &&
      (fullHref.includes("gaiyou_") ||
        // For 2009-2012 style URLs like i-1.html, s-2.html, etc.
        /\/[a-z]+-\d+\.html$/.test(fullHref) ||
        // For 2008 hontai style URLs like 1.html, 2.html, etc.
        /\/\d+\.html$/.test(fullHref))
    ) {
      if (!urls.includes(fullHref)) {
        urls.push(fullHref);
      }
    }
  });

  return urls;
}

function parseNameAffiliation(text) {
  // Parse "Name（Affiliation）" or "Name(Affiliation)"
  const cleaned = text.trim().replace(/\s+/g, " ");
  // Try full-width parentheses first
  let match = cleaned.match(/^(.+?)（(.+?)）$/);
  if (match) return { name: match[1].trim(), affiliation: match[2].trim() };
  // Try half-width parentheses
  match = cleaned.match(/^(.+?)\((.+?)\)$/);
  if (match) return { name: match[1].trim(), affiliation: match[2].trim() };
  // No parentheses - just a name
  return { name: cleaned, affiliation: "" };
}

function parseBudget(text) {
  // Parse "2,304,000円" or similar
  const match = text.replace(/,/g, "").match(/(\d+)/);
  return match ? parseInt(match[1]) : undefined;
}

function parseProject(html, url, year, programType) {
  const $ = cheerio.load(html);
  const main = $(".container--col2__main");

  // Get sections by h2 header LABELS (not numbers, since numbering differs by year)
  const sectionsByLabel = {};
  let currentLabel = "";
  main.children().each((_, el) => {
    const $el = $(el);
    if ($el.is("h2")) {
      const text = $el.text().trim();
      // Map section by label keyword
      if (text.includes("担当プロジェクトマネージャー")) currentLabel = "pm";
      else if (text.includes("採択者氏名")) currentLabel = "creators";
      else if (text.includes("採択金額") || text.includes("契約金額")) currentLabel = "budget";
      else if (text.includes("テーマ名") || text.includes("プロジェクト名")) currentLabel = "title";
      else if (text.includes("関連Web")) currentLabel = "links";
      else if (text.includes("テーマ概要") || text.includes("プロジェクト概要")) currentLabel = "description";
      else if (text.includes("採択理由")) currentLabel = "reason";
      else currentLabel = ""; // Skip unknown sections (e.g., 管理組織, BA)
      if (currentLabel) sectionsByLabel[currentLabel] = [];
    } else if (currentLabel) {
      sectionsByLabel[currentLabel] = sectionsByLabel[currentLabel] || [];
      sectionsByLabel[currentLabel].push($el);
    }
  });
  const sections = sectionsByLabel;

  // PM
  let pmName = "";
  let pmAffiliation = "";
  if (sections["pm"]) {
    for (const $el of sections["pm"]) {
      const text =
        $el.find(".list__item__txt").first().text().trim() ||
        $el.find(".article-txt").first().text().trim() ||
        $el.text().trim();
      if (text) {
        const parsed = parseNameAffiliation(text);
        pmName = parsed.name;
        pmAffiliation = parsed.affiliation;
        break;
      }
    }
  }

  // Creators
  const creators = [];
  if (sections["creators"]) {
    for (const $el of sections["creators"]) {
      // Gather all text from this element
      const rawTexts = [];
      const listItems = $el.find(".list__item");
      if (listItems.length > 0) {
        listItems.each((_, li) => {
          const $li = $(li);
          const text =
            $li.find(".list__item__txt").text().trim() ||
            $li.find(".article-txt").text().trim() ||
            $li.text().trim();
          if (text) rawTexts.push(text);
        });
      } else {
        const text =
          $el.find(".article-txt").text().trim() || $el.text().trim();
        if (text) rawTexts.push(text);
      }

      for (const rawText of rawTexts) {
        const lines = rawText
          .split(/\n/)
          .map((l) => l.trim())
          .filter((l) => l);
        for (let line of lines) {
          // Handle "チーフクリエータ：Name（Affiliation）" format (same line)
          if (line.match(/^(チーフクリエータ|コクリエータ)[：:](.+)/)) {
            const afterColon = line.replace(/^(チーフクリエータ|コクリエータ)[：:]/, "").trim();
            if (afterColon && afterColon !== "なし") {
              const parsed = parseNameAffiliation(afterColon);
              if (parsed.name && parsed.name !== "なし") {
                creators.push(parsed);
              }
            }
            continue;
          }
          // Skip standalone labels
          if (
            line === "チーフクリエータ" ||
            line === "コクリエータ" ||
            line === "なし"
          )
            continue;
          const parsed = parseNameAffiliation(line);
          if (parsed.name && parsed.name !== "なし") {
            creators.push(parsed);
          }
        }
      }
    }
  }

  // Budget
  let budget;
  if (sections["budget"]) {
    for (const $el of sections["budget"]) {
      const text =
        $el.find(".list__item__txt").text().trim() || $el.text().trim();
      if (text) {
        budget = parseBudget(text);
        break;
      }
    }
  }

  // Title
  let title = "";
  if (sections["title"]) {
    for (const $el of sections["title"]) {
      const text =
        $el.find(".list__item__txt").text().trim() || $el.text().trim();
      if (text) {
        title = text.trim();
        break;
      }
    }
  }

  // Related websites
  const links = [BASE_URL + url]; // Always include the IPA page link
  if (sections["links"]) {
    for (const $el of sections["links"]) {
      $el.find("a[href]").each((_, a) => {
        const href = $(a).attr("href");
        if (
          href &&
          (href.startsWith("http://") || href.startsWith("https://"))
        ) {
          links.push(href);
        }
      });
      // Also check for plain text URLs
      const text =
        $el.find(".list__item__txt").text().trim() || $el.text().trim();
      if (text && text !== "なし") {
        const urlMatches = text.match(/https?:\/\/[^\s<>"]+/g);
        if (urlMatches) {
          for (const u of urlMatches) {
            if (!links.includes(u)) links.push(u);
          }
        }
      }
    }
  }

  // Description
  let description = "";
  if (sections["description"]) {
    for (const $el of sections["description"]) {
      const articleTxt = $el.find(".article-txt");
      const text = articleTxt.length
        ? articleTxt
            .html()
            .replace(/<br\s*\/?>/g, "\n")
            .replace(/<[^>]+>/g, "")
            .trim()
        : $el.text().trim();
      if (text) {
        description = text
          .replace(/&amp;/g, "&")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/\t/g, "")
          .replace(/\n{3,}/g, "\n\n")
          .trim();
        break;
      }
    }
  }

  // Adoption reason
  let adoptionReason = "";
  if (sections["reason"]) {
    for (const $el of sections["reason"]) {
      const articleTxt = $el.find(".article-txt");
      const text = articleTxt.length
        ? articleTxt
            .html()
            .replace(/<br\s*\/?>/g, "\n")
            .replace(/<[^>]+>/g, "")
            .trim()
        : $el.text().trim();
      if (text) {
        adoptionReason = text
          .replace(/&amp;/g, "&")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/\t/g, "")
          .replace(/\n{3,}/g, "\n\n")
          .trim();
        break;
      }
    }
  }

  // Generate ID from URL
  const urlParts = url.split("/");
  const filename = urlParts[urlParts.length - 1].replace(".html", "");
  const id = `${year}-${programType}-${filename.replace("gaiyou_", "")}`;

  return {
    id,
    title,
    description,
    adoptionReason,
    year,
    programType,
    pm: {
      name: pmName,
      affiliation: pmAffiliation,
    },
    creators: creators.map((c) => ({ name: c.name, affiliation: c.affiliation })),
    budget,
    links,
  };
}

async function processGroup(key, indexUrls) {
  const [yearStr, programType] = key.split("-");
  const year = parseInt(yearStr);
  console.log(`\n=== Processing ${key} ===`);

  // Discover all project URLs from index pages
  let projectUrls = [];
  for (const indexUrl of indexUrls) {
    console.log(`  Fetching index: ${indexUrl}`);
    const html = await fetchPage(indexUrl);
    if (!html) {
      console.error(`  Failed to fetch index: ${indexUrl}`);
      continue;
    }
    const urls = discoverProjectUrls(html, indexUrl);
    console.log(`  Found ${urls.length} project URLs`);
    projectUrls.push(...urls);
    await sleep(DELAY_MS);
  }

  if (projectUrls.length === 0) {
    console.error(`  No project URLs found for ${key}`);
    return [];
  }

  // Fetch and parse each project page
  const projects = [];
  for (let i = 0; i < projectUrls.length; i++) {
    const url = projectUrls[i];
    console.log(
      `  [${i + 1}/${projectUrls.length}] Fetching: ${url.split("/").pop()}`
    );
    const html = await fetchPage(url);
    if (!html) {
      console.error(`  Failed to fetch: ${url}`);
      continue;
    }

    try {
      const project = parseProject(html, url, year, programType);
      if (project.title) {
        projects.push(project);
      } else {
        console.error(`  No title found for: ${url}`);
      }
    } catch (e) {
      console.error(`  Parse error for ${url}: ${e.message}`);
    }

    await sleep(DELAY_MS);
  }

  return projects;
}

async function main() {
  // Allow filtering by command line args (e.g., node script.mjs 2008-it 2009-it)
  const filterKeys = process.argv.slice(2);
  const keysToProcess = filterKeys.length
    ? Object.entries(INDEX_PAGES).filter(([k]) => filterKeys.includes(k))
    : Object.entries(INDEX_PAGES);

  console.log("Starting IPA Mitou pre-2020 data scraper...\n");

  const allResults = {};

  for (const [key, indexUrls] of keysToProcess) {
    const projects = await processGroup(key, indexUrls);
    allResults[key] = projects;

    // Write JSON file
    const filename = `${key}.json`;
    const filepath = join(DATA_DIR, filename);
    writeFileSync(filepath, JSON.stringify(projects, null, 2) + "\n");
    console.log(`  Wrote ${projects.length} projects to ${filename}`);
  }

  // Summary
  console.log("\n\n=== Summary ===");
  let total = 0;
  for (const [key, projects] of Object.entries(allResults)) {
    console.log(`  ${key}: ${projects.length} projects`);
    total += projects.length;
  }
  console.log(`  Total: ${total} projects`);
}

main().catch(console.error);
