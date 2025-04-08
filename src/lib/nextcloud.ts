interface NextCloudConfig {
  baseUrl: string;
  username: string;
  password: string;
}

export class NextCloudClient {
  private config: NextCloudConfig;

  constructor() {
    this.config = {
      baseUrl: process.env.NEXT_PUBLIC_WEBDAV_URL || "",
      username: process.env.NEXT_PUBLIC_WEBDAV_USERNAME || "",
      password: process.env.NEXT_PUBLIC_WEBDAV_PASSWORD || "",
    };

    if (
      !this.config.baseUrl ||
      !this.config.username ||
      !this.config.password
    ) {
      throw new Error(
        "Configuration NextCloud manquante. Vérifiez les variables d'environnement."
      );
    }
  }

  async uploadFile(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Erreur lors de l'upload");
      }

      return data.url;
    } catch (error: unknown) {
      console.error("Erreur d'upload:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Erreur inconnue";
      throw new Error(`Erreur lors de l'upload: ${errorMessage}`);
    }
  }
}
