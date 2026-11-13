const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

export function isSameOriginRequest(request: Request): boolean {
  // Safe methods do not change application state.
  if (SAFE_METHODS.has(request.method.toUpperCase())) {
    return true;
  }

  const configuredOrigin = process.env.APP_ORIGIN;

  if (!configuredOrigin) {
    throw new Error("APP_ORIGIN is not configured.");
  }

  let expectedOrigin: string;

  try {
    expectedOrigin = new URL(configuredOrigin).origin;
  } catch {
    throw new Error("APP_ORIGIN is invalid.");
  }

  // Reject requests explicitly identified as cross-site.
  const fetchSite = request.headers.get("sec-fetch-site");

  if (fetchSite === "cross-site") {
    return false;
  }

  // Prefer Origin. Fall back to Referer if Origin is absent.
  const originHeader = request.headers.get("origin");
  const refererHeader = request.headers.get("referer");

  let requestOrigin: string;

  try {
    if (originHeader) {
      requestOrigin = new URL(originHeader).origin;
    } else if (refererHeader) {
      requestOrigin = new URL(refererHeader).origin;
    } else {
      // Reject state-changing requests without origin information.
      return false;
    }
  } catch {
    return false;
  }

  return requestOrigin === expectedOrigin;
}