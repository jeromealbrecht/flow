import { NextCloudClient } from "@/lib/nextcloud";

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 seconde

/**
 * Upload un fichier audio dans NextCloud
 * @param file - le fichier audio
 * @returns l'URL publique de l'audio
 */
export const uploadAudioFile = async (file: File): Promise<string> => {
  const nextcloud = new NextCloudClient();

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const fileUrl = await nextcloud.uploadFile(file);
      return fileUrl;
    } catch (error) {
      lastError = error as Error;
      console.warn(`Tentative ${attempt} échouée:`, error);

      if (attempt < MAX_RETRIES) {
        await new Promise((resolve) =>
          setTimeout(resolve, RETRY_DELAY * attempt)
        );
      }
    }
  }

  throw new Error(
    `Échec après ${MAX_RETRIES} tentatives: ${lastError?.message}`
  );
};
