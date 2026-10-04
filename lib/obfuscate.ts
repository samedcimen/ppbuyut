// Keeps e-mail addresses out of the HTML/RSC payload so scrapers that look for
// "name@domain" don't find them. Not encryption — just enough to defeat harvesting bots.

const reverse = (s: string) => [...s].reverse().join("");

export function encodeEmail(email: string) {
  return btoa(reverse(email));
}

export function decodeEmail(encoded: string) {
  return reverse(atob(encoded));
}
