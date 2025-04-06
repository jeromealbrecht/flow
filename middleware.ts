import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Récupérer le chemin de la requête
  const path = request.nextUrl.pathname;

  // Définir les chemins publics (accessibles sans authentification)
  const isPublicPath =
    path === "/" || path === "/login" || path === "/register";

  // Récupérer le token d'authentification des cookies
  const token = request.cookies.get("authToken")?.value;

  // Si l'utilisateur est sur un chemin public mais est déjà authentifié, rediriger vers le dashboard
  if (isPublicPath && token) {
    return NextResponse.redirect(
      new URL("/(with-sidebar)/studio/dashboard", request.url)
    );
  }

  // Si l'utilisateur n'est pas authentifié et tente d'accéder à un chemin protégé, rediriger vers la page de connexion
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Ajouter les en-têtes COOP et COEP à toutes les réponses
  const response = NextResponse.next();
  response.headers.set("Cross-Origin-Opener-Policy", "unsafe-none");
  response.headers.set("Cross-Origin-Embedder-Policy", "unsafe-none");

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
