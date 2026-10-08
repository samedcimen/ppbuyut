import { RESERVED_PATHS } from "./detect";
import type { Messages } from "./i18n";
import { PLATFORM_LIST } from "./platforms";

// The bookmarklet runs on the other site's page, so it can't use lib/detect.ts
// directly. It carries the same decisions as regular expressions instead: one
// for the host and one for "is this page a profile" (path + query). The test
// in tests/bookmarklet.test.ts runs the real bookmarklet against detect() to
// keep the two in step.

const escape = (word: string) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
/** A whole path segment ends here. */
const END = "(?:[/?#]|$)";
/** Not one of these words as the segment. */
const not = (words: string[]) => `(?!(?:${words.map(escape).join("|")})${END})`;

const GITHUB_NAME = "[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})";
const BLUESKY_HANDLE = "[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*";

/** [host pattern, profile path pattern (tested case-insensitively against path + query)] */
export const BOOKMARKLET_RULES: [string, string][] = [
  [
    "(^|\\.)(facebook\\.com|fb\\.com)$",
    `^/(?:profile\\.php\\?(?:[^#]*&)?id=[A-Za-z0-9.]{1,50}(?:[&#]|$)|people/[^/?#]+/[A-Za-z0-9.]{1,50}${END}|${not([...RESERVED_PATHS.facebook, "profile.php", "people"])}[A-Za-z0-9.]{1,50}${END})`,
  ],
  ["(^|\\.)(instagram\\.com|instagr\\.am)$", `^/${not(RESERVED_PATHS.instagram)}[A-Za-z0-9._]{1,30}${END}`],
  ["(^|\\.)(threads\\.net|threads\\.com)$", `^/@[A-Za-z0-9._]{1,30}${END}`],
  ["(^|\\.)tiktok\\.com$", `^/@[A-Za-z0-9._]{2,24}${END}`],
  ["(^|\\.)(x\\.com|twitter\\.com)$", `^/${not(RESERVED_PATHS.x)}[A-Za-z0-9_]{1,15}${END}`],
  ["(^|\\.)youtube\\.com$", `^/@[A-Za-z0-9._-]{3,30}${END}`],
  ["(^|\\.)bsky\\.app$", `^/profile/(?!did:)${BLUESKY_HANDLE}${END}`],
  [
    `^(?:${RESERVED_PATHS.mastodonServers.map(escape).join("|")})$`,
    `^/@[A-Za-z0-9_]{1,30}(?:@[A-Za-z0-9.-]+)?${END}`,
  ],
  ["^github\\.com$", `^/(?:orgs/${GITHUB_NAME}${END}|${not([...RESERVED_PATHS.github, "orgs"])}${GITHUB_NAME}${END})`],
  ["(^|\\.)twitch\\.tv$", `^/${not(RESERVED_PATHS.twitch)}[A-Za-z0-9_]{3,25}${END}`],
  ["(^|\\.)kick\\.com$", `^/${not(RESERVED_PATHS.kick)}[A-Za-z0-9_-]{2,25}${END}`],
  ["^open\\.spotify\\.com$", `^/(?:intl-[a-z-]+/)?(?:user/[A-Za-z0-9._-]{1,64}|artist/[A-Za-z0-9]{22})${END}`],
  ["^soundcloud\\.com$", `^/${not(RESERVED_PATHS.soundcloud)}[A-Za-z0-9_-]{2,40}${END}`],
  ["^tumblr\\.com$", `^/(?:(?:dashboard/)?blog/(?:view/)?|${not(RESERVED_PATHS.tumblr)})[A-Za-z0-9-]{1,32}${END}`],
  // name.tumblr.com: every page belongs to that blog
  [`^(?!(?:${RESERVED_PATHS.tumblrHosts.join("|")})\\.)[a-z0-9-]{1,32}\\.tumblr\\.com$`, "^/"],
  ["^flickr\\.com$", `^/(?:people|photos)/${not(RESERVED_PATHS.flickr)}[A-Za-z0-9_@.-]{1,64}${END}`],
  ["(^|\\.)(t\\.me|telegram\\.me|telegram\\.dog)$", `^/(?:s/)?${not(RESERVED_PATHS.telegram)}[A-Za-z0-9_]{4,32}${END}`],
  ["(^|\\.)pinterest\\.[a-z.]{2,6}$", `^/${not(RESERVED_PATHS.pinterest)}[A-Za-z0-9_]{3,30}${END}`],
  ["(^|\\.)snapchat\\.com$", `^/(?:add/|@)[A-Za-z0-9._-]{3,15}${END}`],
];

/**
 * The bookmarklet: on a profile page it opens that profile in ppbüyüt via the
 * profile-path route (/<profile link>); elsewhere it explains why not. "?" is
 * escaped so query-based links (facebook.com/profile.php?id=…) survive; the
 * #fragment is dropped. The escape is built at run time: browsers
 * percent-decode javascript: URLs before running them, so a literal "%3F"
 * here would turn back into "?".
 */
export function bookmarkletFor(base: string, t: Messages["bookmarklet"]) {
  const names = PLATFORM_LIST.map((p) => p.name).join(", ");
  return (
    "javascript:(function(){" +
    "var h=location.hostname.toLowerCase().replace(/^(www|m|mobile)\\./,'');" +
    // Telegram Web keeps the open chat in the #fragment (…/k/#@username).
    "if(h==='web.telegram.org'){" +
    "var m=location.hash.match(/^#@([A-Za-z0-9_]{4,32})$/);" +
    `if(m){window.open('${base}/telegram/'+m[1],'_blank')}` +
    `else{alert('${t.telegramNoUser}')}` +
    "return}" +
    `var R=${JSON.stringify(BOOKMARKLET_RULES)},k=0,i;` +
    "for(i=0;i<R.length;i++){if(new RegExp(R[i][0]).test(h)){k=1;" +
    "if(new RegExp(R[i][1],'i').test(location.pathname+location.search)){" +
    `window.open('${base}/'+location.href.split('#')[0].replace(/\\?/g,encodeURIComponent('?')),'_blank');return}}}` +
    `alert(k?'${t.notProfile}':'${t.unsupported(names)}')` +
    "})()"
  );
}
