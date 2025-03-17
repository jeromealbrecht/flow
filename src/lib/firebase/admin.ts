import { app } from "./config";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import { User } from "firebase/auth";

const db = getFirestore(app);

export interface UserRole {
  isAdmin: boolean;
  roles: string[];
  email: string;
  displayName: string | null;
  photoURL: string | null;
  lastLogin: Date;
  uid?: string;
}

export const getUserRoles = async (user: User): Promise<UserRole> => {
  if (!user) {
    throw new Error("Aucun utilisateur connecté");
  }

  try {
    const userDoc = await getDoc(doc(db, "users", user.uid));

    // Si le document existe, on le retourne
    if (userDoc.exists()) {
      const data = userDoc.data();
      return {
        isAdmin: data.isAdmin ?? false,
        roles: data.roles ?? [],
        email: data.email ?? user.email ?? "",
        displayName: data.displayName ?? user.displayName,
        photoURL: data.photoURL ?? user.photoURL,
        lastLogin: data.lastLogin ? data.lastLogin.toDate() : new Date(),
        uid: user.uid,
      };
    }

    // Si c'est le premier utilisateur admin, on crée son document
    if (user.uid === "mKElDoMiVoVuY4P8VEetkwqj5jB2") {
      const newUserData: UserRole = {
        isAdmin: true,
        roles: ["admin"],
        email: user.email || "",
        displayName: user.displayName,
        photoURL: user.photoURL,
        lastLogin: new Date(),
        uid: user.uid,
      };

      try {
        await setDoc(doc(db, "users", user.uid), {
          ...newUserData,
          lastLogin: new Date(), // Firestore Timestamp
        });
        return newUserData;
      } catch (error) {
        console.error("Erreur lors de la création du document admin:", error);
        throw new Error("Impossible de créer le document administrateur");
      }
    }

    // Pour les autres utilisateurs, on crée un document standard
    const newUserData: UserRole = {
      isAdmin: false,
      roles: [],
      email: user.email || "",
      displayName: user.displayName,
      photoURL: user.photoURL,
      lastLogin: new Date(),
      uid: user.uid,
    };

    try {
      await setDoc(doc(db, "users", user.uid), {
        ...newUserData,
        lastLogin: new Date(), // Firestore Timestamp
      });
      return newUserData;
    } catch (error) {
      console.error(
        "Erreur lors de la création du document utilisateur:",
        error
      );
      // En cas d'erreur de permission, on retourne un objet par défaut
      return newUserData;
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des rôles:", error);
    // En cas d'erreur, on retourne un objet par défaut avec les informations de base
    return {
      isAdmin: false,
      roles: [],
      email: user.email || "",
      displayName: user.displayName,
      photoURL: user.photoURL,
      lastLogin: new Date(),
      uid: user.uid,
    };
  }
};

export const isUserAdmin = async (user: User | null): Promise<boolean> => {
  if (!user) return false;
  try {
    const roles = await getUserRoles(user);
    return roles.isAdmin;
  } catch (error) {
    console.error("Erreur lors de la vérification du statut admin:", error);
    return false;
  }
};

export const getAllUsers = async (): Promise<UserRole[]> => {
  try {
    const usersSnapshot = await getDocs(collection(db, "users"));
    return usersSnapshot.docs.map((doc) => ({
      ...(doc.data() as UserRole),
      uid: doc.id,
      lastLogin: doc.data().lastLogin?.toDate() || new Date(),
    }));
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
    throw new Error("Impossible de récupérer la liste des utilisateurs");
  }
};

export const updateUserRole = async (
  userId: string,
  isAdmin: boolean,
  roles: string[] = []
) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      const userData = userDoc.data() as UserRole;
      await setDoc(doc(db, "users", userId), {
        ...userData,
        isAdmin,
        roles,
        lastUpdated: new Date(),
      });
      return true;
    }
    return false;
  } catch (error) {
    console.error("Erreur lors de la mise à jour des rôles:", error);
    throw new Error(
      "Vous n'avez pas les permissions nécessaires pour modifier les rôles"
    );
  }
};
