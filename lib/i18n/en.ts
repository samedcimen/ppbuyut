import type { Messages } from "./tr";

/** English UI copy; the type keeps it in step with the Turkish source. */
export const en: Messages = {
  lang: "en",
  ogLocale: "en_US",

  site: {
    title: "Profile Picture Viewer: See Instagram, TikTok & X PFPs Full Size | ppbüyüt",
    description:
      "View and download Instagram, TikTok, X, Facebook and YouTube profile pictures at the largest size the platform serves. Free PFP viewer: no ads, no sign-up, one click.",
    keywords: [
      "profile picture viewer",
      "instagram profile picture viewer",
      "instagram pfp full size",
      "view instagram profile picture",
      "instagram dp downloader",
      "tiktok profile picture viewer",
      "twitter profile picture full size",
      "pfp downloader",
      "download profile picture",
      "hd profile picture",
    ],
  },

  nav: {
    platforms: "Platforms",
    faq: "FAQ",
    about: "About",
    terms: "Terms",
    home: "Home",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    theme: "Toggle theme",
    language: "Language",
    otherLanguage: "Türkçe",
  },
  footer: { changelog: "Changelog" },

  hero: {
    eyebrow: (count) => `Free profile picture viewer · ${count} platforms · no ads`,
    line: "See any profile picture",
    highlight: "full size",
    after: "",
    subtitle: "Paste a username or profile link. We'll recognise the platform — you download the largest version.",
  },

  search: {
    label: "Profile link or @handle",
    examples: [
      "instagram.com/username",
      "@username",
      "tiktok.com/@username",
      "youtube.com/@channel",
      "x.com/username",
      "github.com/username",
    ],
    paste: "Paste",
    clear: "Clear",
    submit: "Search",
    platform: "Platform",
    empty: "Paste a link or type a username.",
    focusHint: "focus",
    submitHint: "search",
    linkDetected: (platform) => `${platform} link detected`,
    willSearch: (platform) => `Will search ${platform} — pick another platform below if needed.`,
    platformDown: (platform) => `${platform} isn't working right now; there may be no result.`,
    noPassword: "ppbüyüt never asks for your password and needs no login. Don't type a password here.",
  },

  detect: {
    unreadable: () => "This link couldn't be read.",
    unsupported: () => "This site isn't supported yet.",
    not_profile: (platform) => `This isn't a ${platform} profile link.`,
    bad_username: (platform) => `Invalid ${platform} username.`,
    bad_chars: () => "Usernames can only contain letters, numbers, dots, underscores and hyphens.",
    invalid_for: (platform) => `This username isn't valid on ${platform}.`,
  },

  result: {
    alt: (platform, username) => `${platform} profile picture of @${username}`,
    fullscreen: "View full screen",
    largest: "Largest",
    resolution: "Resolution",
    source: "Source",
    download: "Download",
    openProfile: (platform) => `Open ${platform} profile`,
    searching: (platform) => `searching ${platform}…`,
    sources: { official: "Official", scrape: "Public page", thirdparty: "Fallback source" },
  },

  notes: {
    small: "Instagram is only serving the small size right now; try again later for the large one.",
    mirror: "Fetched from a fallback source; it may differ from the current photo on Instagram.",
    bitmoji: "This account has no real profile photo; its Bitmoji is shown.",
    threads: "Threads uses the Instagram account's profile picture; it was fetched from Instagram.",
  },
  platformNotes: {
    instagram: "Without logging in, Instagram serves profile pictures at up to ~320 px.",
  },

  errors: {
    retry: "Try again",
    not_found: {
      title: "Profile not found",
      body: (p, u) => `We couldn't find an account called @${u} on ${p}. Check the username and try again.`,
    },
    hidden: {
      title: "Profile picture isn't visible",
      body: (p, u) => `${p} doesn't serve a public profile picture for @${u}. The account may be private, or may not exist.`,
    },
    rate_limited: {
      title: "Let's slow down a little",
      body: () => "Too many requests in a short time. Wait a minute and try again.",
    },
    blocked: {
      title: "The platform blocked the request",
      body: (p) => `${p} is restricting access right now. This is usually temporary — try again shortly.`,
    },
    unavailable: {
      title: "This platform is unavailable right now",
      body: (p) => `There's no working method for ${p} at the moment. You can follow its status on the Platforms page.`,
    },
    image_failed: {
      title: "The image couldn't be loaded",
      body: () => "The photo's address was found but the image didn't open. The link may have expired.",
    },
    unknown: {
      title: "Something went wrong",
      body: () => "An unexpected error occurred. Please try again.",
    },
  },

  lightbox: { download: "Download", close: "Close", footer: "Shown at actual size · Esc to close" },

  recent: {
    title: "Recent searches",
    local: "this device only",
    clear: "Clear",
    remove: (username) => `Remove @${username} from history`,
  },

  status: {
    labels: { up: "Working", degraded: "Limited", down: "Down" },
    hints: {
      up: "Working normally through the platform's own method.",
      degraded: "Working, but only the small size is available right now.",
      down: "No results right now. Try again shortly.",
    },
    checking: "Checking",
    loading: "Checking service status…",
    failed: "Service status unavailable",
    summary: (up, total) => `${up}/${total} platforms working`,
    count: (n, label) => `${n} ${label.toLowerCase()}`,
    checkedAgo: (minutes) => (minutes < 1 ? "checked just now" : `checked ${minutes} min ago`),
  },

  reliability: {
    labels: { stable: "Stable", beta: "Beta", experimental: "Experimental" },
    info: {
      stable: "Uses a public address or page that hasn't changed in a long time. Rarely breaks.",
      beta: "Reads data from the platform's public page. If the platform changes that page, there may be temporary issues.",
      experimental: "The platform actively restricts logged-out access. Results may sometimes be unavailable.",
    },
  },

  methods: {
    labels: {
      open_url: "Public URL",
      image_url: "Public image address",
      open_page: "Public page",
      page_data: "Page data",
      preview: "Link preview",
      internal: "Internal endpoint",
      public_api: "Public API",
      via_instagram: "Via Instagram",
    },
    info: {
      open_url: "The profile picture is reached through a permanent public address.",
      image_url: "Taken from the platform's public image address, no API key needed.",
      open_page: "Read from the profile's public preview page.",
      page_data: "The photo address is read from data embedded in the public profile page.",
      preview: "Read from the preview image shown when the profile link is shared.",
      internal: "Undocumented addresses used by the platform's own website.",
      public_api: "The platform's public, official API is used, with no key or login.",
      via_instagram: "Threads accounts use the same photo as their Instagram account; it's fetched from Instagram.",
    },
  },

  sizes: { original: "Original", max: "Max size" },

  howItWorks: {
    eyebrow: "How it works",
    title: "Three steps. No account, no ads.",
    description:
      "Platforms show profile pictures small, but keep a larger version on their servers. We find that version and bring it to you.",
    steps: [
      { title: "Paste", body: "Paste a profile link or @username. Pasting anywhere on the page works too." },
      { title: "Detect & enlarge", body: "We recognise the platform and turn the photo address into the largest size the platform allows." },
      { title: "Download", body: "Preview it, inspect it full screen, download it with a proper file name in one click." },
    ],
    exampleUser: "username",
    exampleFile: "instagram-username.jpg",
  },

  bookmarklet: {
    eyebrow: "Bookmarklet",
    title: "Enlarge in one click while browsing",
    body: "Drag the button to your bookmarks bar. On a profile on Instagram, TikTok or another supported platform, click it — ppbüyüt opens that profile in a new tab. It does nothing on other sites.",
    step1: "If the bookmarks bar is hidden, show it with",
    step1After: ".",
    step2: "Drag the button on the right to the bar.",
    step3: "On a profile, click the bookmark.",
    button: "Open in ppbüyüt",
    drag: "Drag to your bookmarks bar",
    hold: "Hold and drag",
    dragHint: "Drag it to the bookmarks bar instead of clicking",
    unsupported: (names) => `ppbüyüt does not work on this site.\\n\\nSupported sites: ${names}.`,
    telegramNoUser:
      "No username is visible in this chat.\\n\\nOn Telegram Web, open the chat of a person or channel that has a username and try again.",
    notProfile: "This page is not a profile.\\n\\nOpen an account's profile page and click the bookmark again.",
  },

  install: {
    eyebrow: "App",
    title: "Add to your phone",
    ios: "Open it with one tap from your home screen; it runs like an app, without the address bar.",
    iosStep1: ["In Safari, tap the", "Share button at the bottom."],
    iosStep2: "Choose “Add to Home Screen”.",
    android: ["Once installed, you can open a profile from apps like Instagram or TikTok with", "Share → ppbüyüt", "directly."],
    button: "Install the app",
    menu: ["From the browser menu (⋮) choose", "“Install app”", "or", "“Add to Home screen”", "."],
  },

  seoIntro: {
    eyebrow: "Profile picture viewer",
    title: "What is a profile picture viewer?",
    paragraphs: [
      "Apps show profile pictures small and cropped into a circle, and zooming into a screenshot gives a blurry result.",
      "A profile picture viewer finds the largest version of the photo stored on the platform's servers and shows it to you. ppbüyüt does this for free on Instagram, TikTok, X, Facebook, YouTube and more: paste a username or profile link, see the photo full size and download it in one click. Photos are never artificially upscaled.",
    ],
    listTitle: "Profile picture viewer by platform",
    linkLabel: (platform) => `${platform} profile picture viewer`,
  },

  cta: { title: "Try it now", body: "Paste a profile link and see the photo full size.", button: "Search a profile picture" },

  email: { show: "Show e-mail", copy: "Copy e-mail", copyShort: "Copy", send: "Send e-mail", hide: "Hide e-mail", hideShort: "Hide" },

  notFound: {
    title: "Page not found",
    tag: "404 · profile not found",
    heading: "We couldn't find this page.",
    body: "The page you're looking for may have moved or never existed. If you're looking for a profile picture, continue from the home page.",
    home: "Back to home",
    faq: "Frequently asked questions",
  },
};
