// 🔌 Import des fonctions de Firestore nécessaires aux opérations CRUD
import {
  getDocs,
  collection,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

// 🔧 Import de l'instance Firestore configurée de ton app
import { db } from "@/lib/firebase/config";

// 📦 Types de données
import { FirestoreUser } from "../types/firestoreUser";
import { ApiResponse, Audio } from "../types/audio";

/**
 * 📥 getUsers
 * Récupère tous les utilisateurs depuis la collection "couleurdeson"
 * @returns Un tableau de `FirestoreUser`
 */
export const getUsers = async (): Promise<FirestoreUser[]> => {
  const querySnapshot = await getDocs(collection(db, "couleurdeson"));
  return querySnapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      } as FirestoreUser)
  );
};

/**
 * 🔎 getAudio
 * Récupère un audio par son ID
 * @param id - ID du document audio
 * @returns Un objet `Audio` ou `null` s'il n'existe pas
 */
export const getAudio = async (id: string): Promise<Audio | null> => {
  const docRef = doc(collection(db, "audios"), id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return {
      id: docSnap.id,
      ...docSnap.data(),
    } as Audio;
  }

  return null;
};

/**
 * 📃 getAudios
 * Récupère tous les audios depuis la collection "audios"
 * @returns Un tableau de `Audio`
 */
export const getAudios = async (): Promise<Audio[]> => {
  const querySnapshot = await getDocs(collection(db, "audios"));
  return querySnapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      } as Audio)
  );
};

/**
 * ➕ createAudio
 * Crée un nouvel audio dans la collection "audios"
 * @param audio - Données du nouvel audio (sans ID)
 * @returns Un `ApiResponse` contenant l’audio créé
 */
export const createAudio = async (
  audio: Omit<Audio, "id">
): Promise<ApiResponse<Audio>> => {
  const audiosCollection = collection(db, "audios");
  const docRef = await addDoc(audiosCollection, audio);

  return {
    data: {
      ...audio,
      id: docRef.id,
    },
    success: true,
    message: "Audio créé avec succès",
  };
};

/**
 * ✏️ updateAudio
 * Met à jour un audio existant
 * @param id - ID de l’audio à mettre à jour
 * @param audio - Données complètes du nouvel audio
 * @returns Un `ApiResponse` avec audio mis à jour ou erreur
 */
export const updateAudio = async (
  id: string,
  audio: Audio
): Promise<ApiResponse<Audio | null>> => {
  const audiosCollection = collection(db, "audios");
  const docRef = doc(audiosCollection, id);

  const audioToUpdate = await getAudio(id);
  if (!audioToUpdate) {
    return {
      success: false,
      message: "Audio non trouvé",
      data: null,
    };
  }

  await updateDoc(docRef, { ...audio });

  return {
    data: {
      ...audio,
      id: docRef.id,
    },
    success: true,
    message: "Audio mis à jour avec succès",
  };
};

/**
 * ❌ deleteAudio
 * Supprime un audio existant de la collection "audios"
 * @param id - ID de l’audio à supprimer
 * @returns Un `ApiResponse` avec message de confirmation ou erreur
 */
export const deleteAudio = async (
  id: string
): Promise<ApiResponse<void | null>> => {
  const audiosCollection = collection(db, "audios");
  const docRef = doc(audiosCollection, id);

  const audioToDelete = await getAudio(id);
  if (!audioToDelete) {
    return {
      success: false,
      message: "Audio non trouvé",
      data: null,
    };
  }

  await deleteDoc(docRef);

  return {
    success: true,
    message: "Audio supprimé avec succès",
    data: null,
  };
};
