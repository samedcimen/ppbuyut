// ppbüyüt browser extension: opens the profile you're looking at (or a profile
// link you right-click) in ppbüyüt, through the site's profile-path route
// (ppbuyut.com/<profile link>). On pages that aren't a profile (a site's home
// page, search, a post) it says so instead. It reads no page content and sends
// nothing anywhere; "activeTab" + "scripting" only let it see the current tab's
// URL and show that message, after a click.

const SITE = "https://ppbuyut.com";

// Sites with profile pages ppbüyüt understands (lib/detect.ts). The context
// menu only appears on these. tests/extension.test.ts keeps the list in step.
// HOSTS-START
const HOSTS = [
  "instagram.com", "instagr.am", "facebook.com", "fb.com", "tiktok.com", "x.com", "twitter.com", "youtube.com",
  "threads.net", "threads.com", "bsky.app", "github.com", "gitlab.com", "dev.to", "twitch.tv", "kick.com",
  "roblox.com", "steamcommunity.com", "open.spotify.com", "soundcloud.com", "tumblr.com", "flickr.com", "vk.com",
  "vk.ru", "t.me", "telegram.me", "telegram.dog", "web.telegram.org", "snapchat.com", "pinterest.com",
  "pinterest.co.uk", "pinterest.de", "pinterest.fr", "pinterest.es", "pinterest.it", "pinterest.ca",
  "pinterest.com.au", "pinterest.jp", "pinterest.com.mx", "pinterest.com.tr",
  "mastodon.social", "mastodon.online", "mstdn.social", "mas.to", "fosstodon.org", "hachyderm.io",
  "infosec.exchange", "techhub.social", "mastodon.world", "mastodon.art", "universeodon.com", "social.vivaldi.net",
  "mstdn.party", "mastodon.green", "toot.community", "mastodon.cloud", "mastodon.uno", "mastodon.sdf.org",
];
// HOSTS-END

// "Is this page a profile": [host pattern, path + query pattern] per platform,
// generated from lib/bookmarklet.ts (BOOKMARKLET_RULES) by
// scripts/build-extension.mjs. Don't edit by hand.
// RULES-START
const RULES = [
  ["(^|\\.)(facebook\\.com|fb\\.com)$","^/(?:profile\\.php\\?(?:[^#]*&)?id=[A-Za-z0-9.]{1,50}(?:[&#]|$)|people/[^/?#]+/[A-Za-z0-9.]{1,50}(?:[/?#]|$)|(?!(?:groups|events|watch|marketplace|gaming|share|sharer|story\\.php|photo|photo\\.php|photos|videos|reel|posts|permalink\\.php|login|login\\.php|help|pages|hashtag|search|settings|notifications|messages|friends|bookmarks|privacy|policies|legal|profile\\.php|people)(?:[/?#]|$))[A-Za-z0-9.]{1,50}(?:[/?#]|$))"],
  ["(^|\\.)(instagram\\.com|instagr\\.am)$","^/(?!(?:p|reel|reels|tv|explore|stories|accounts|direct|about|legal|developer)(?:[/?#]|$))[A-Za-z0-9._]{1,30}(?:[/?#]|$)"],
  ["(^|\\.)(threads\\.net|threads\\.com)$","^/@[A-Za-z0-9._]{1,30}(?:[/?#]|$)"],
  ["(^|\\.)tiktok\\.com$","^/@[A-Za-z0-9._]{2,24}(?:[/?#]|$)"],
  ["(^|\\.)(x\\.com|twitter\\.com)$","^/(?!(?:home|explore|search|i|settings|messages|notifications|intent|hashtag|share|compose|login|signup|tos|privacy)(?:[/?#]|$))[A-Za-z0-9_]{1,15}(?:[/?#]|$)"],
  ["(^|\\.)youtube\\.com$","^/@[A-Za-z0-9._-]{3,30}(?:[/?#]|$)"],
  ["(^|\\.)bsky\\.app$","^/profile/(?!did:)[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*(?:[/?#]|$)"],
  ["^(?:mastodon\\.social|mastodon\\.online|mstdn\\.social|mas\\.to|fosstodon\\.org|hachyderm\\.io|infosec\\.exchange|techhub\\.social|mastodon\\.world|mastodon\\.art|universeodon\\.com|social\\.vivaldi\\.net|mstdn\\.party|mastodon\\.green|toot\\.community|mastodon\\.cloud|mastodon\\.uno|mastodon\\.sdf\\.org)$","^/@[A-Za-z0-9_]{1,30}(?:@[A-Za-z0-9.-]+)?(?:[/?#]|$)"],
  ["^github\\.com$","^/(?:orgs/[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})(?:[/?#]|$)|(?!(?:settings|explore|marketplace|topics|trending|login|join|features|sponsors|notifications|pulls|issues|about|pricing|apps|search|collections|enterprise|security|codespaces|new|orgs)(?:[/?#]|$))[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})(?:[/?#]|$))"],
  ["^gitlab\\.com$","^/(?!(?:explore|help|users|dashboard|projects|groups|search|admin|api|uploads|assets|-|snippets|profile|ide|jobs|pricing|topics|abuse_reports|public|sign_in|login)(?:[/?#]|$))[A-Za-z0-9][A-Za-z0-9_.-]{0,59}(?:[/?#]|$)"],
  ["^dev\\.to$","^/(?!(?:t|search|top|latest|enter|settings|dashboard|notifications|readinglist|listings|videos|podcasts|tags|about|contact|faq|sponsors|code-of-conduct|privacy|terms|new|signout_confirm|connect|api|badges|pod|community-moderation|feed|challenges|billboards)(?:[/?#]|$))[A-Za-z0-9_]{1,30}(?:[/?#]|$)"],
  ["(^|\\.)twitch\\.tv$","^/(?!(?:directory|videos|settings|p|search|downloads|jobs|turbo|subscriptions|inventory|wallet)(?:[/?#]|$))[A-Za-z0-9_]{3,25}(?:[/?#]|$)"],
  ["(^|\\.)kick\\.com$","^/(?!(?:categories|category|browse|following|video|videos|clips|clip|dashboard|search|terms-of-service|privacy-policy|community-guidelines|dmca-policy|cookies|about|contact|careers|subscriptions|settings|login|signup|register|popout|api|help|faq|press)(?:[/?#]|$))[A-Za-z0-9_-]{2,25}(?:[/?#]|$)"],
  ["(^|\\.)roblox\\.com$","^/(?:users/\\d{1,20}(?:[/?#]|$)|user\\.aspx\\?(?:[^#]*&)?id=\\d{1,20}(?:[&#]|$))"],
  ["^steamcommunity\\.com$","^/(?:id/[A-Za-z0-9_-]{2,32}|profiles/\\d{17})(?:[/?#]|$)"],
  ["^open\\.spotify\\.com$","^/(?:intl-[a-z-]+/)?(?:user/[A-Za-z0-9._-]{1,64}|artist/[A-Za-z0-9]{22})(?:[/?#]|$)"],
  ["^soundcloud\\.com$","^/(?!(?:discover|stream|upload|you|search|charts|pages|pro|terms-of-use|people|settings|notifications|messages|mobile|imprint|popular|jobs|press|creators|signin|logout|tags|feed|home|for-artists|artists|connect|apps|community-guidelines)(?:[/?#]|$))[A-Za-z0-9_-]{2,40}(?:[/?#]|$)"],
  ["^tumblr\\.com$","^/(?:(?:dashboard/)?blog/(?:view/)?|(?!(?:blog|dashboard|explore|tagged|search|settings|login|register|likes|following|inbox|new|docs|policy|help|about|privacy|live|communities|activity|reblog|post)(?:[/?#]|$)))[A-Za-z0-9-]{1,32}(?:[/?#]|$)"],
  ["^(?!(?:api|assets|media|static|help|www)\\.)[a-z0-9-]{1,32}\\.tumblr\\.com$","^/"],
  ["^flickr\\.com$","^/(?:people|photos)/(?!(?:tags|search|upload|organize|friends|explore)(?:[/?#]|$))[A-Za-z0-9_@.-]{1,64}(?:[/?#]|$)"],
  ["^(?:vk\\.com|vk\\.ru)$","^/(?!(?:feed|im|friends|groups|video|videos|audio|audios|music|settings|search|apps|market|login|join|about|support|terms|privacy|dev|blog|press|jobs|clips|docs|bookmarks|notifications|services|games|stickers|restore|help|discover|messenger)(?:[/?#]|$))[A-Za-z0-9_.]{2,32}(?:[/?#]|$)"],
  ["(^|\\.)(t\\.me|telegram\\.me|telegram\\.dog)$","^/(?:s/)?(?!(?:joinchat|addstickers|addemoji|share|proxy|socks|login|iv)(?:[/?#]|$))[A-Za-z0-9_]{4,32}(?:[/?#]|$)"],
  ["(^|\\.)pinterest\\.[a-z.]{2,6}$","^/(?!(?:pin|search|ideas|today|settings|business|_|login|resource)(?:[/?#]|$))[A-Za-z0-9_]{3,30}(?:[/?#]|$)"],
  ["(^|\\.)snapchat\\.com$","^/(?:add/|@)[A-Za-z0-9._-]{3,15}(?:[/?#]|$)"],
];
// RULES-END

const PATTERNS = HOSTS.flatMap((host) => [`*://${host}/*`, `*://*.${host}/*`]);

/** The site in the browser's language: Turkish at the root, English under /en. */
const base = () => (chrome.i18n.getUILanguage().toLowerCase().startsWith("tr") ? SITE : `${SITE}/en`);

/**
 * Where a URL leads: { open } with the ppbüyüt address for a profile page,
 * otherwise { message } with the reason, or {} for a site ppbüyüt doesn't know.
 */
function classify(href) {
  let url;
  try {
    url = new URL(href);
  } catch {
    return {};
  }
  const host = url.hostname.toLowerCase().replace(/^(www|m|mobile)\./, "");

  // Telegram Web keeps the open chat in the #fragment (…/k/#@username).
  if (host === "web.telegram.org") {
    const chat = url.hash.match(/^#@([A-Za-z0-9_]{4,32})$/);
    return chat ? { open: `${base()}/telegram/${chat[1]}` } : { message: chrome.i18n.getMessage("telegramNoUser") };
  }

  let known = HOSTS.some((h) => host === h || host.endsWith(`.${h}`));
  for (const [hostPattern, profilePattern] of RULES) {
    if (!new RegExp(hostPattern).test(host)) continue;
    known = true;
    if (new RegExp(profilePattern, "i").test(url.pathname + url.search)) {
      // "?" is escaped so query-based links (profile.php?id=…) reach the site whole.
      return { open: `${base()}/${href.split("#")[0].replace(/\?/g, "%3F")}` };
    }
  }
  return known ? { message: chrome.i18n.getMessage("notProfile") } : {};
}

/** Shows `message` on the page; on pages scripts can't reach, as a badge instead. */
async function tell(tabId, message) {
  try {
    await chrome.scripting.executeScript({ target: { tabId }, func: (text) => alert(text), args: [message] });
  } catch {
    chrome.action.setBadgeBackgroundColor({ tabId, color: "#71717a" });
    chrome.action.setBadgeText({ tabId, text: "!" });
    chrome.action.setTitle({ tabId, title: message });
  }
}

function handle(href, tab) {
  const { open, message } = classify(href);
  if (open) chrome.tabs.create({ url: open });
  else if (message && tab?.id !== undefined) tell(tab.id, message);
  // A site ppbüyüt doesn't know: the toolbar button opens the search page.
  else if (!message) chrome.tabs.create({ url: base() });
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: "page",
      title: chrome.i18n.getMessage("menuPage"),
      contexts: ["page"],
      documentUrlPatterns: PATTERNS,
    });
    chrome.contextMenus.create({
      id: "link",
      title: chrome.i18n.getMessage("menuLink"),
      contexts: ["link"],
      targetUrlPatterns: PATTERNS,
    });
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  const href = info.menuItemId === "link" ? info.linkUrl : (info.pageUrl ?? tab?.url);
  if (href) handle(href, tab);
});

chrome.action.onClicked.addListener((tab) => handle(tab.url ?? "", tab));
