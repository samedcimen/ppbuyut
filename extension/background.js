// ppbüyüt browser extension: opens the profile you're looking at (or a profile
// link you right-click) in ppbüyüt, through the site's profile-path route
// (ppbuyut.com/<profile link>). It reads no page content and sends nothing
// anywhere; "activeTab" only lets the toolbar button see the current tab's URL.

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

const PATTERNS = HOSTS.flatMap((host) => [`*://${host}/*`, `*://*.${host}/*`]);

/** The site in the browser's language: Turkish at the root, English under /en. */
const base = () => (chrome.i18n.getUILanguage().toLowerCase().startsWith("tr") ? SITE : `${SITE}/en`);

const supported = (url) => {
  try {
    const host = new URL(url).hostname;
    return HOSTS.some((h) => host === h || host.endsWith(`.${h}`));
  } catch {
    return false;
  }
};

function open(url) {
  // Telegram Web keeps the open chat in the #fragment (…/k/#@username).
  const telegram = url.match(/^https:\/\/web\.telegram\.org\/.*#@([A-Za-z0-9_]{4,32})$/);
  const target = telegram
    ? `${base()}/telegram/${telegram[1]}`
    : // "?" is escaped so query-based links (profile.php?id=…) reach the site whole.
      `${base()}/${url.split("#")[0].replace(/\?/g, "%3F")}`;
  chrome.tabs.create({ url: target });
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
  const url = info.menuItemId === "link" ? info.linkUrl : (info.pageUrl ?? tab?.url);
  if (url) open(url);
});

// Toolbar button: the current page if it's a supported site, otherwise the search page.
chrome.action.onClicked.addListener((tab) => {
  if (tab.url && supported(tab.url)) open(tab.url);
  else chrome.tabs.create({ url: base() });
});
