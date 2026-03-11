#!/usr/bin/env npx tsx
/**
 * translate-articles.ts
 * Translates French MDX articles into target locales using Claude API.
 *
 * Usage:
 *   npx tsx scripts/translate-articles.ts [locale] [--limit N] [--slug specific-slug]
 *
 * Examples:
 *   npx tsx scripts/translate-articles.ts es
 *   npx tsx scripts/translate-articles.ts de --limit 10
 *   npx tsx scripts/translate-articles.ts it --slug chien-gratte-oreilles
 *   npx tsx scripts/translate-articles.ts  # translates all locales
 */

import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

// Auto-load .env.local
const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match && !process.env[match[1].trim()]) {
      process.env[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, "");
    }
  }
}

// ─── Config ────────────────────────────────────────────────────────────────

const TARGET_LOCALES = ["es", "pt", "it", "de", "nl"] as const;
type TargetLocale = (typeof TARGET_LOCALES)[number];

const LOCALE_NAMES: Record<TargetLocale, string> = {
  es: "Spanish (Spain)",
  pt: "Portuguese (Portugal)",
  it: "Italian",
  de: "German",
  nl: "Dutch",
};

/** Amazon domains per locale for affiliate URL rewriting */
const AMAZON_DOMAINS: Record<TargetLocale, string> = {
  es: "amazon.es",
  pt: "amazon.es",   // no amazon.pt
  it: "amazon.it",
  de: "amazon.de",
  nl: "amazon.nl",
};

const AMAZON_TAGS: Record<TargetLocale, string> = {
  es: "pawmedic-es-21",
  pt: "pawmedic-es-21",
  it: "pawmedic-it-21",
  de: "pawmedic-de-21",
  nl: "pawmedic-nl-21",
};

const ARTICLES_DIR = path.join(process.cwd(), "src/content/articles");
const CONTENT_DIR = path.join(process.cwd(), "src/content");

// ─── CLI args ───────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const localeArg = args.find((a) => TARGET_LOCALES.includes(a as TargetLocale)) as TargetLocale | undefined;
const limitArg = args.indexOf("--limit");
const limit = limitArg !== -1 ? parseInt(args[limitArg + 1], 10) : Infinity;
const slugArg = args.indexOf("--slug");
const targetSlug = slugArg !== -1 ? args[slugArg + 1] : undefined;

const localesToProcess: TargetLocale[] = localeArg ? [localeArg] : [...TARGET_LOCALES];

// ─── Anthropic client ───────────────────────────────────────────────────────

const client = new Anthropic();

// ─── Helpers ────────────────────────────────────────────────────────────────

function getOutputDir(locale: TargetLocale): string {
  const dir = path.join(CONTENT_DIR, locale, "articles");
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

/** Rewrite Amazon URLs from amazon.fr to the target locale's Amazon domain */
function localizeAmazonUrl(url: string, locale: TargetLocale): string {
  if (!url || url.includes("amzn.to")) return url;
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("amazon.")) {
      parsed.hostname = `www.${AMAZON_DOMAINS[locale]}`;
      parsed.searchParams.set("tag", AMAZON_TAGS[locale]);
      return parsed.toString();
    }
  } catch {
    // not a valid URL
  }
  return url;
}

/** Serialize frontmatter back to YAML-compatible string */
function stringifyFrontmatter(data: Record<string, unknown>): string {
  const lines: string[] = ["---"];
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null) continue;
    if (typeof value === "string") {
      // Escape strings that need quoting
      const needsQuotes = value.includes(":") || value.includes('"') || value.includes("\n") || value.startsWith("#");
      lines.push(`${key}: ${needsQuotes ? JSON.stringify(value) : value}`);
    } else if (typeof value === "number" || typeof value === "boolean") {
      lines.push(`${key}: ${value}`);
    } else if (Array.isArray(value)) {
      if (value.length === 0) {
        lines.push(`${key}: []`);
      } else if (typeof value[0] === "string") {
        lines.push(`${key}:`);
        for (const item of value) {
          lines.push(`  - ${JSON.stringify(item)}`);
        }
      } else if (typeof value[0] === "object") {
        // Array of objects (affiliateProducts, faq, keyTakeaways)
        lines.push(`${key}:`);
        for (const obj of value) {
          const entries = Object.entries(obj as Record<string, unknown>);
          entries.forEach(([k, v], i) => {
            const prefix = i === 0 ? "  - " : "    ";
            if (typeof v === "string") {
              lines.push(`${prefix}${k}: ${JSON.stringify(v)}`);
            } else {
              lines.push(`${prefix}${k}: ${v}`);
            }
          });
        }
      }
    }
  }
  lines.push("---");
  return lines.join("\n");
}

// ─── Translation prompt ─────────────────────────────────────────────────────

interface ArticleFrontmatter {
  title: string;
  slug: string;
  category: string;
  species?: string;
  excerpt: string;
  readingTime: number;
  publishedAt: string;
  theme?: string;
  difficulty?: string;
  author?: string;
  lastUpdatedAt?: string;
  tags?: string[];
  keyTakeaways?: string[];
  faq?: { question: string; answer: string }[];
  affiliateProducts?: {
    name: string;
    description: string;
    price: string;
    url: string;
    merchant: string;
  }[];
}

interface TranslationResult {
  title: string;
  excerpt: string;
  keyTakeaways?: string[];
  faq?: { question: string; answer: string }[];
  affiliateProducts?: { name: string; description: string }[];
  content: string;
}

async function translateArticle(
  frontmatter: ArticleFrontmatter,
  content: string,
  locale: TargetLocale
): Promise<TranslationResult> {
  const langName = LOCALE_NAMES[locale];

  // Build structured translation request
  const prompt = `Translate the following pet health article from French to ${langName}.

IMPORTANT RULES:
- Translate naturally for ${langName} speakers — NOT word-for-word
- Keep all Markdown formatting (##, **, *, -, numbered lists, etc.)
- Keep proper nouns (brand names, scientific/Latin terms, drug names, breed names) in their original form
- Keep product names unchanged
- Adapt currency expressions: €19,99 stays as €19,99 (same price, just translate surrounding text)
- Do NOT add any explanation or commentary — output ONLY the JSON

OUTPUT FORMAT (strict JSON, no markdown fences):
{
  "title": "<translated title>",
  "excerpt": "<translated excerpt, 1-2 sentences>",
  "keyTakeaways": ["<point 1>", "<point 2>", ...],
  "faq": [{"question": "<q>", "answer": "<a>"}, ...],
  "affiliateProducts": [{"name": "<translated name>", "description": "<translated description>"}, ...],
  "content": "<full translated markdown body>"
}

If keyTakeaways is empty array in input, output empty array.
If faq is empty array in input, output empty array.
If affiliateProducts is empty array in input, output empty array.

---
TITLE: ${frontmatter.title}
EXCERPT: ${frontmatter.excerpt}
KEY_TAKEAWAYS: ${JSON.stringify(frontmatter.keyTakeaways ?? [])}
FAQ: ${JSON.stringify(frontmatter.faq ?? [])}
AFFILIATE_PRODUCTS: ${JSON.stringify((frontmatter.affiliateProducts ?? []).map((p) => ({ name: p.name, description: p.description })))}
CONTENT:
${content}`;

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 8192,
    messages: [{ role: "user", content: prompt }],
  });

  const responseText = (message.content[0] as { type: string; text: string }).text.trim();

  // Parse JSON response
  let parsed: TranslationResult;
  try {
    // Strip markdown fences if present
    const cleaned = responseText.replace(/^```json\n?/, "").replace(/\n?```$/, "").trim();
    parsed = JSON.parse(cleaned);
  } catch (e) {
    console.error("Failed to parse JSON response:", responseText.slice(0, 200));
    throw new Error(`JSON parse error: ${e}`);
  }

  return parsed;
}

// ─── Main ───────────────────────────────────────────────────────────────────

async function processLocale(locale: TargetLocale): Promise<void> {
  const outputDir = getOutputDir(locale);
  const allFiles = fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .filter((f) => !targetSlug || f === `${targetSlug}.mdx`);

  console.log(`\n🌍 Processing ${LOCALE_NAMES[locale]} (${locale}) — ${allFiles.length} articles`);

  let processed = 0;
  let skipped = 0;
  let errors = 0;

  for (const file of allFiles) {
    if (processed >= limit) break;

    const outputPath = path.join(outputDir, file);
    if (fs.existsSync(outputPath)) {
      skipped++;
      continue;
    }

    const inputPath = path.join(ARTICLES_DIR, file);
    const raw = fs.readFileSync(inputPath, "utf-8");
    const { data, content } = matter(raw);
    const frontmatter = data as ArticleFrontmatter;

    process.stdout.write(`  [${processed + 1}/${allFiles.length - skipped}] ${file} ... `);

    try {
      const translated = await translateArticle(frontmatter, content, locale);

      // Build translated frontmatter
      const translatedFrontmatter: Record<string, unknown> = {
        title: translated.title,
        slug: frontmatter.slug,
        category: frontmatter.category,
        ...(frontmatter.species && { species: frontmatter.species }),
        excerpt: translated.excerpt,
        readingTime: frontmatter.readingTime,
        publishedAt: frontmatter.publishedAt,
        ...(frontmatter.theme && { theme: frontmatter.theme }),
        ...(frontmatter.difficulty && { difficulty: frontmatter.difficulty }),
        ...(frontmatter.author && { author: frontmatter.author }),
        ...(frontmatter.lastUpdatedAt && { lastUpdatedAt: frontmatter.lastUpdatedAt }),
        ...(frontmatter.tags && frontmatter.tags.length > 0 && { tags: frontmatter.tags }),
      };

      // keyTakeaways
      if (translated.keyTakeaways && translated.keyTakeaways.length > 0) {
        translatedFrontmatter.keyTakeaways = translated.keyTakeaways;
      } else if (frontmatter.keyTakeaways && frontmatter.keyTakeaways.length > 0) {
        translatedFrontmatter.keyTakeaways = frontmatter.keyTakeaways;
      }

      // faq
      if (translated.faq && translated.faq.length > 0) {
        translatedFrontmatter.faq = translated.faq;
      } else if (frontmatter.faq && frontmatter.faq.length > 0) {
        translatedFrontmatter.faq = frontmatter.faq;
      }

      // affiliateProducts — keep original URLs but localize Amazon ones
      if (frontmatter.affiliateProducts && frontmatter.affiliateProducts.length > 0) {
        const translatedProducts = translated.affiliateProducts ?? [];
        translatedFrontmatter.affiliateProducts = frontmatter.affiliateProducts.map((p, i) => ({
          name: translatedProducts[i]?.name ?? p.name,
          description: translatedProducts[i]?.description ?? p.description,
          price: p.price,
          url: p.merchant === "amazon" ? localizeAmazonUrl(p.url, locale) : p.url,
          merchant: p.merchant,
        }));
      }

      const yamlHeader = stringifyFrontmatter(translatedFrontmatter);
      const output = `${yamlHeader}\n\n${translated.content}\n`;
      fs.writeFileSync(outputPath, output, "utf-8");

      console.log("✓");
      processed++;

      // Small delay to avoid rate limiting
      await new Promise((r) => setTimeout(r, 200));
    } catch (err) {
      console.log(`✗ ERROR: ${(err as Error).message}`);
      errors++;
    }
  }

  console.log(`  ✅ Done: ${processed} translated, ${skipped} skipped (already existed), ${errors} errors`);
}

async function main() {
  console.log("🐾 PAWMEDIC Article Translator");
  console.log(`📍 Locales: ${localesToProcess.join(", ")}`);
  if (targetSlug) console.log(`📄 Slug filter: ${targetSlug}`);
  if (limit !== Infinity) console.log(`🔢 Limit: ${limit} per locale`);
  console.log("");

  for (const locale of localesToProcess) {
    await processLocale(locale);
  }

  console.log("\n🎉 All done!");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
