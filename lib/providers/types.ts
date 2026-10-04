export interface AvatarResult {
  /** URL of the largest available version */
  url: string;
  width?: number;
  height?: number;
  source: "official" | "scrape" | "thirdparty";
}

export interface Provider {
  id: string;
  fetchAvatar(username: string): Promise<AvatarResult | null>;
}
