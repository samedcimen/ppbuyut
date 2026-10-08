import { describe, expect, it } from "vitest";
import { upscale } from "@/lib/providers/upscale";

describe("upscale", () => {
  it("X: drops the size suffix for the original upload", () => {
    expect(upscale("x", "https://pbs.twimg.com/profile_images/1/abc_normal.jpg")).toBe(
      "https://pbs.twimg.com/profile_images/1/abc.jpg",
    );
    expect(upscale("x", "https://pbs.twimg.com/profile_images/1/abc_200x200.jpg")).toBe(
      "https://pbs.twimg.com/profile_images/1/abc.jpg",
    );
  });

  it("YouTube: asks for the original (=s0), never an upscaled size", () => {
    expect(upscale("youtube", "https://yt3.googleusercontent.com/abc=s900-c-k-c0x00ffffff-no-rj")).toBe(
      "https://yt3.googleusercontent.com/abc=s0",
    );
  });

  it("GitHub: requests 460 px", () => {
    expect(upscale("github", "https://avatars.githubusercontent.com/u/1?s=400&v=4")).toBe(
      "https://avatars.githubusercontent.com/u/1?s=460&v=4",
    );
  });

  it("Snapchat: removes the resize step", () => {
    expect(upscale("snapchat", "https://cf-st.sc-cdn.net/aps/bolt/abc._RS0,90_FMjpeg")).toBe(
      "https://cf-st.sc-cdn.net/aps/bolt/abc._FMjpeg",
    );
  });

  it("Bluesky: the full-size variant as JPEG", () => {
    const did = "did:plc:oky5czdrnfjpqslsw2a5iclo/bafkreihxtnc";
    expect(upscale("bluesky", `https://cdn.bsky.app/img/avatar/plain/${did}`)).toBe(
      `https://cdn.bsky.app/img/feed_fullsize/plain/${did}@jpeg`,
    );
    expect(upscale("bluesky", `https://cdn.bsky.app/img/avatar/plain/${did}@webp`)).toBe(
      `https://cdn.bsky.app/img/feed_fullsize/plain/${did}@jpeg`,
    );
  });

  it("Kick: the uploaded file instead of the 350 px conversion", () => {
    const base = "https://files.kick.com/images/user/676/profile_image";
    expect(upscale("kick", `${base}/conversion/931b4e8f-5445-427c-bd82-b473530390cc-fullsize.webp`)).toBe(
      `${base}/931b4e8f-5445-427c-bd82-b473530390cc`,
    );
  });

  it("Spotify: the 300 px version instead of the 64 px one", () => {
    expect(upscale("spotify", "https://i.scdn.co/image/ab67757000003b82613270822d31fd4502ead127")).toBe(
      "https://i.scdn.co/image/ab6775700000ee85613270822d31fd4502ead127",
    );
    expect(upscale("spotify", "https://i.scdn.co/image/ab6775700000ee85613270822d31fd4502ead127")).toBe(
      "https://i.scdn.co/image/ab6775700000ee85613270822d31fd4502ead127",
    );
  });

  it("leaves other platforms alone", () => {
    const url = "https://i.pinimg.com/280x280_RS/a/b.jpg";
    expect(upscale("pinterest", url)).toBe(url);
  });
});
