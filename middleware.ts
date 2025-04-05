import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Ajouter les en-têtes COOP et COEP à toutes les réponses
  const response = NextResponse.next();

  response.headers.set(
    "Cross-Origin-Opener-Policy",
    "same-origin-allow-popups"
  );
  response.headers.set("Cross-Origin-Embedder-Policy", "credentialless");

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
