import { landingPath, pagePath } from "@/lib/i18n/routes";
import { PLATFORM_LIST } from "@/lib/platforms";
import { site } from "@/lib/site";

// /llms.txt (llmstxt.org): a plain summary of the site for AI assistants and
// answer engines. Built from the platform list, so it never goes stale.
export const dynamic = "force-static";

export function GET() {
  const url = (path: string) => `${site.url}${path === "/" ? "/" : path}`;
  const names = PLATFORM_LIST.map((p) => p.name).join(", ");

  const text = `# ${site.name}

> Free web tool that shows public social media profile pictures at the largest size the platform serves, and downloads them. No ads, no account, no login.

${site.name} (${site.url.replace(/^https?:\/\//, "")}) takes a username or a profile link, recognizes the platform, and fetches the largest copy of the profile picture that the platform itself keeps, often the original upload. Photos are never upscaled artificially. It only shows public profile pictures and gives no access to private content (posts, stories) of private accounts.

Supported platforms (${PLATFORM_LIST.length}): ${names}.

Usage: paste a profile link or @username at ${url("/")}; or open ${site.url}/<platform>/<username> (for example ${site.url}/instagram/natgeo); or put the site address in front of any profile link (${site.url}/instagram.com/natgeo).

The site is in Turkish at the root and in English under /en.

## Main pages

- [Home (English)](${url(pagePath("home", "en"))}): the search box
- [Platforms](${url(pagePath("platforms", "en"))}): largest size, method and live service status for each platform
- [FAQ](${url(pagePath("faq", "en"))}): private accounts, photo sizes, privacy, usage rights
- [About](${url(pagePath("about", "en"))}): how it works and the principles behind it
- [Terms of use](${url(pagePath("terms", "en"))})

## Per-platform pages

${PLATFORM_LIST.map((p) => `- [${p.name} profile picture viewer](${url(landingPath(p.id, "en"))})`).join("\n")}

## Turkish

- [Ana sayfa](${url(pagePath("home", "tr"))}), [Platformlar](${url(pagePath("platforms", "tr"))}), [SSS](${url(pagePath("faq", "tr"))}), [Hakkında](${url(pagePath("about", "tr"))})
- Platform sayfaları ("pp büyütme"): ${site.url}/pp-buyutme/<platform>

## Optional

- [Changelog](${url(pagePath("changelog", "en"))})
- [Source code](https://github.com/${site.owner.github}/ppbuyut)
`;

  return new Response(text, {
    headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600" },
  });
}
