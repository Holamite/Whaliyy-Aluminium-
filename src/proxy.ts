import { NextResponse, type NextRequest } from "next/server";

/**
 * Watches for traffic to the image-optimization endpoint, which should be
 * empty now that images.unoptimized is set — any hits here are either a
 * stale cached page/search-index entry still pointing at an old
 * /_next/image URL, or a sign the optimizer got re-enabled somewhere. Logs
 * the path only (no query beyond what's already public: the image file and
 * requested width) so this stays safe to leave on.
 */
export function proxy(req: NextRequest) {
  console.log(`[image-request] ${req.nextUrl.pathname}${req.nextUrl.search}`);
  return NextResponse.next();
}

export const config = {
  matcher: "/_next/image",
};
