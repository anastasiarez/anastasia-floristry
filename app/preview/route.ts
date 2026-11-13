import { NextResponse, type NextRequest } from "next/server";
import { previewCookie } from "@/content/site";

/**
 * /preview        turns preview mode on and opens the full site.
 * /preview?exit   turns it off and goes back to the holding page.
 */
export function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/", request.url));
  if (request.nextUrl.searchParams.has("exit")) {
    response.cookies.delete(previewCookie);
  } else {
    response.cookies.set(previewCookie, "1", {
      path: "/",
      maxAge: 60 * 60 * 24 * 90,
      sameSite: "lax",
      httpOnly: true,
      secure: request.nextUrl.protocol === "https:",
    });
  }
  return response;
}
