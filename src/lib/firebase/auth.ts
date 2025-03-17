import { app } from "./config";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Erreur lors de la connexion avec Google:", error);
    throw error;
  }
};

export const logOut = async () => {
  try {
    // Attendre que la déconnexion soit terminée avant de continuer
    await signOut(auth);
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error);
    throw error;
  }
};

export { auth };
