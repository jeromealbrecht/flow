import { NextResponse } from "next/server";
import { createClient, WebDAVClient } from "webdav";

const client = createClient(process.env.WEBDAV_URL || "", {
  username: process.env.WEBDAV_USERNAME || "",
  password: process.env.WEBDAV_PASSWORD || "",
}) as WebDAVClient;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      throw new Error("Aucun fichier n'a été fourni");
    }

    const fileName = `audio/${Date.now()}-${file.name}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    try {
      // Upload vers NextCloud
      await client.putFileContents(fileName, buffer, {
        overwrite: true,
        contentLength: buffer.length,
      });
    } catch (error: unknown) {
      console.error("Erreur lors de l'upload WebDAV:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erreur inconnue lors de l'upload WebDAV";
      throw new Error(`Erreur WebDAV: ${errorMessage}`);
    }

    // Créer un lien de partage public
    const baseUrl = process.env.WEBDAV_URL?.split("/remote.php")[0];
    const shareUrl = `${baseUrl}/ocs/v2.php/apps/files_sharing/api/v1/shares`;

    const filePath = `/${fileName}`;
    console.log("Chemin du fichier pour le partage:", filePath);

    const shareResponse = await fetch(shareUrl, {
      method: "POST",
      headers: {
        "OCS-APIRequest": "true",
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          Buffer.from(
            `${process.env.WEBDAV_USERNAME}:${process.env.WEBDAV_PASSWORD}`
          ).toString("base64"),
      },
      body: new URLSearchParams({
        path: filePath,
        shareType: "3",
        permissions: "1",
        format: "json",
      }).toString(),
    });

    const shareResponseText = await shareResponse.text();

    if (!shareResponse.ok) {
      throw new Error(
        `Erreur lors de la création du partage: ${shareResponseText}`
      );
    }

    let shareData;
    try {
      shareData = JSON.parse(shareResponseText);
    } catch {
      console.error("Erreur lors du parsing de la réponse:", shareResponseText);
      throw new Error("Format de réponse invalide du serveur NextCloud");
    }

    const shareToken = shareData.ocs?.data?.token;
    if (!shareToken) {
      console.error("Réponse complète:", shareData);
      throw new Error("Token de partage non trouvé dans la réponse");
    }

    // Utiliser l'URL de téléchargement directe
    const downloadUrl = `${baseUrl}/index.php/s/${shareToken}/download`;

    const response = NextResponse.json({ success: true, url: downloadUrl });

    // Ajouter les headers CORS
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );

    return response;
  } catch (error: unknown) {
    console.error("Erreur détaillée:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Erreur inconnue lors de l'upload";
    const errorStack = error instanceof Error ? error.stack : undefined;

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        details:
          process.env.NODE_ENV === "development" ? errorStack : undefined,
      },
      { status: 500 }
    );
  }
}
