import { NextResponse } from "next/server";
import { createClient, WebDAVClient } from "webdav";
import { adminAuth, adminDb } from "@/lib/firebase/admin-config";

interface Share {
  id: string;
  path: string;
  token: string;
}

const client = createClient(process.env.WEBDAV_URL || "", {
  username: process.env.WEBDAV_USERNAME || "",
  password: process.env.WEBDAV_PASSWORD || "",
}) as WebDAVClient;

export async function DELETE(request: Request) {
  try {
    // 1. Vérification de l'authentification
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, error: "Token d'authentification manquant" },
        { status: 401 }
      );
    }

    // 2. Vérification du token Firebase
    let decodedToken;
    try {
      const token = authHeader.split("Bearer ")[1];
      decodedToken = await adminAuth.verifyIdToken(token);
    } catch (error) {
      console.error("Erreur de vérification du token:", error);
      return NextResponse.json(
        { success: false, error: "Token invalide ou expiré" },
        { status: 401 }
      );
    }

    // 3. Vérification des droits admin
    try {
      const userDoc = await adminDb
        .collection("users")
        .doc(decodedToken.uid)
        .get();
      if (!userDoc.exists) {
        return NextResponse.json(
          { success: false, error: "Utilisateur non trouvé" },
          { status: 404 }
        );
      }

      const userData = userDoc.data();
      if (!userData?.isAdmin) {
        return NextResponse.json(
          { success: false, error: "Accès non autorisé" },
          { status: 403 }
        );
      }
    } catch (error) {
      console.error("Erreur de vérification des droits:", error);
      return NextResponse.json(
        { success: false, error: "Erreur lors de la vérification des droits" },
        { status: 500 }
      );
    }

    // 4. Validation de l'URL
    let url;
    try {
      const body = await request.json();
      url = body.url;
      console.log("URL reçue:", url);
      if (!url) {
        return NextResponse.json(
          { success: false, error: "URL du fichier manquante" },
          { status: 400 }
        );
      }
    } catch (error) {
      console.error("Erreur lors de la validation de l'URL:", error);
      return NextResponse.json(
        { success: false, error: "Format de requête invalide" },
        { status: 400 }
      );
    }

    // 5. Extraction du nom de fichier depuis l'URL de partage
    const baseUrl = process.env.WEBDAV_URL?.split("/remote.php")[0];
    const shareToken = url.split("/s/")[1]?.split("/")[0];

    if (!shareToken) {
      return NextResponse.json(
        { success: false, error: "URL de partage invalide" },
        { status: 400 }
      );
    }

    // Récupérer les informations du partage pour obtenir le vrai chemin du fichier
    const shareUrl = `${baseUrl}/ocs/v2.php/apps/files_sharing/api/v1/shares`;
    const auth = Buffer.from(
      `${process.env.WEBDAV_USERNAME}:${process.env.WEBDAV_PASSWORD}`
    ).toString("base64");

    const sharesResponse = await fetch(`${shareUrl}?format=json`, {
      headers: {
        "OCS-APIRequest": "true",
        Accept: "application/json",
        Authorization: `Basic ${auth}`,
      },
    });

    if (!sharesResponse.ok) {
      throw new Error(`Erreur HTTP: ${sharesResponse.status}`);
    }

    const sharesData = await sharesResponse.json();
    const share = sharesData.ocs?.data?.find(
      (s: Share) => s.token === shareToken
    );

    if (!share) {
      return NextResponse.json(
        { success: false, error: "Partage non trouvé" },
        { status: 404 }
      );
    }

    // Le chemin du fichier dans WebDAV
    const filePath = share.path.replace(/^\//, "");
    console.log("Chemin du fichier à supprimer:", filePath);

    // 6. Suppression du fichier WebDAV
    try {
      console.log("Vérification de l'existence du fichier:", filePath);
      const exists = await client.exists(filePath);
      console.log("Le fichier existe:", exists);
      if (!exists) {
        return NextResponse.json(
          { success: false, error: "Fichier non trouvé sur le serveur" },
          { status: 404 }
        );
      }

      await client.deleteFile(filePath);
      console.log(`Fichier supprimé: ${filePath}`);
    } catch (error) {
      console.error("Erreur lors de la suppression du fichier:", error);
      return NextResponse.json(
        { success: false, error: "Erreur lors de la suppression du fichier" },
        { status: 500 }
      );
    }

    // 7. Suppression du partage
    try {
      const deleteResponse = await fetch(`${shareUrl}/${share.id}`, {
        method: "DELETE",
        headers: {
          "OCS-APIRequest": "true",
          Accept: "application/json",
          Authorization: `Basic ${auth}`,
        },
      });

      if (!deleteResponse.ok) {
        console.error(
          "Erreur lors de la suppression du partage:",
          await deleteResponse.text()
        );
      }
    } catch (error) {
      console.error("Erreur lors de la gestion du partage:", error);
      // On continue même si la suppression du partage échoue
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur globale:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
        details: process.env.NODE_ENV === "development" ? error : undefined,
      },
      { status: 500 }
    );
  }
}
