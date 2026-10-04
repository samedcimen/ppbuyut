import "server-only";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// CHANGELOG.md is the single source of truth; the /surum-notlari page renders it.
// Only the subset of Markdown the changelog uses is understood:
//   ## [version] - date      release
//   ### Title                section
//   - item / "  - " child    list items (one level of nesting)
//   any other line under a release, before its first section, is the summary

export interface ChangelogItem {
  text: string;
  children: string[];
}

export interface ChangelogSection {
  title: string;
  items: ChangelogItem[];
}

export interface Release {
  version: string;
  date: string | null;
  summary: string | null;
  sections: ChangelogSection[];
}

export function getReleases(): Release[] {
  const md = readFileSync(join(process.cwd(), "CHANGELOG.md"), "utf8");
  const releases: Release[] = [];
  let release: Release | null = null;
  let section: ChangelogSection | null = null;

  for (const line of md.split(/\r?\n/)) {
    const head = line.match(/^## \[(.+?)\](?: - (\d{4}-\d{2}-\d{2}))?/);
    if (head) {
      release = { version: head[1], date: head[2] ?? null, summary: null, sections: [] };
      releases.push(release);
      section = null;
      continue;
    }
    if (!release) continue;

    const sub = line.match(/^### (.+)/);
    if (sub) {
      section = { title: sub[1].trim(), items: [] };
      release.sections.push(section);
      continue;
    }

    const child = line.match(/^ {2,}- (.+)/);
    if (child && section?.items.length) {
      section.items[section.items.length - 1].children.push(child[1]);
      continue;
    }

    const item = line.match(/^- (.+)/);
    if (item && section) {
      section.items.push({ text: item[1], children: [] });
      continue;
    }

    // Link reference definitions ("[0.1.0]: https://…") are not content.
    if (!section && line.trim() && !/^\[.+\]:/.test(line)) {
      release.summary = release.summary ? `${release.summary} ${line.trim()}` : line.trim();
    }
  }

  return releases;
}
