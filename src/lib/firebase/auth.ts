import { auth } from "./config";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  browserPopupRedirectResolver,
} from "firebase/auth";

// Fonction pour l'authentification avec popup
export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();

    // Ajouter des scopes si nécessaire
    provider.addScope("profile");
    provider.addScope("email");

    // Utiliser browserPopupRedirectResolver pour une meilleure compatibilité
    const result = await signInWithPopup(
      auth,
      provider,
      browserPopupRedirectResolver
    );

    // Retourner les informations de l'utilisateur
    return {
      user: result.user,
      success: true,
    };
  } catch (error: unknown) {
    console.error("Erreur d'authentification Google:", error);

    // Si l'erreur est liée à la politique COOP, essayer avec la redirection
    if (
      error instanceof Error &&
      (error.message === "auth/popup-closed-by-user" ||
        error.message === "auth/popup-blocked" ||
        error.message.includes("Cross-Origin-Opener-Policy"))
    ) {
      try {
        // Fallback à la méthode de redirection
        const provider = new GoogleAuthProvider();
        await signInWithRedirect(auth, provider);

        // Cette partie ne sera exécutée qu'après la redirection de retour
        return {
          success: true,
          redirected: true,
        };
      } catch (redirectError: unknown) {
        console.error("Erreur de redirection:", redirectError);
        return {
          success: false,
          error: redirectError,
        };
      }
    }

    return {
      success: false,
      error: error,
    };
  }
};

// Fonction pour récupérer le résultat après une redirection
export const getGoogleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      return {
        user: result.user,
        success: true,
      };
    }
    return {
      success: false,
      error: "No redirect result",
    };
  } catch (error) {
    console.error(
      "Erreur lors de la récupération du résultat de redirection:",
      error
    );
    return {
      success: false,
      error,
    };
  }
};

// Fonction pour se déconnecter
export const signOut = async () => {
  try {
    await auth.signOut();
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error);
    return {
      success: false,
      error,
    };
  }
};

export { auth };
