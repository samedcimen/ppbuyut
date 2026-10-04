import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// Makes the site installable ("Add to Home screen") and, on Android, puts
// ppbüyüt in the system Share menu: shared links arrive at /paylas.
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: site.name,
    short_name: site.name,
    description: site.description,
    lang: "tr",
    dir: "ltr",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#08080a",
    theme_color: "#08080a",
    categories: ["photo", "utilities"],
    icons: [
      { src: "/icons/icon-192.png", type: "image/png", sizes: "192x192", purpose: "any" },
      { src: "/icons/icon-512.png", type: "image/png", sizes: "512x512", purpose: "any" },
      { src: "/icons/maskable-512.png", type: "image/png", sizes: "512x512", purpose: "maskable" },
      { src: "/icon.svg", type: "image/svg+xml", sizes: "any" },
    ],
    share_target: {
      action: "/paylas",
      method: "GET",
      params: { title: "title", text: "text", url: "url" },
    },
  };
}
