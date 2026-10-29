/**
 * Public origin of the app for the current request, e.g. "http://localhost:3000"
 * or "https://invoice-generator-phi-one.vercel.app".
 *
 * Derived from the request so the same build works locally and on Vercel
 * without hard-coded URLs in env vars.
 */
export function getAppOrigin(req: Request): string {
  const url = new URL(req.url);
  // Behind Vercel's proxy the real host/proto arrive in forwarded headers.
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  const proto =
    req.headers.get("x-forwarded-proto")?.split(",")[0].trim() ??
    url.protocol.replace(":", "");
  return host ? `${proto}://${host}` : url.origin;
}

export function getGoogleRedirectUri(req: Request): string {
  return `${getAppOrigin(req)}/api/auth/google/callback`;
}
