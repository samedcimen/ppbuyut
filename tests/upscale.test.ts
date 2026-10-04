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

  it("leaves other platforms alone", () => {
    const url = "https://i.pinimg.com/280x280_RS/a/b.jpg";
    expect(upscale("pinterest", url)).toBe(url);
  });
});
