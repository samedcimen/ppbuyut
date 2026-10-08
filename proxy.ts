// Turns away the requests vulnerability scanners send to every site (WordPress
// installers, PHP admin tools, leaked config files) before they reach the
// profile-path page. The 404 is cacheable, so repeat scans are answered by the
// CDN. The matcher limits this to those paths: other requests never run it.

export function proxy() {
  return new Response("Not found", {
    status: 404,
    headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=86400" },
  });
}

export const config = {
  matcher: [
    "/wp-admin/:path*",
    "/wp-content/:path*",
    "/wp-includes/:path*",
    "/wordpress/:path*",
    "/phpmyadmin/:path*",
    "/cgi-bin/:path*",
    "/.git/:path*",
    "/:file(\\.env[^/]*)",
    // Single-segment script files (/xmlrpc.php, /wp-login.php, /admin.asp). Profile links
    // such as /www.facebook.com/profile.php?id=… have several segments and are left alone.
    "/:file([^/]+\\.(?:php|asp|aspx|jsp|cgi))",
  ],
};
