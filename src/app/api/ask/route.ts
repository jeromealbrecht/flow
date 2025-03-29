import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { question } = await request.json();

    const response = await fetch("http://localhost:8081/api/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        // Si besoin d'autres headers pour votre API
      },
      body: JSON.stringify({ question }),
      // Pour éviter les erreurs CORS côté serveur
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Erreur API");
    }

    const data = await response.json();

    // Extraction du contenu du message
    const messageContent = data.choices[0].message.content;

    return NextResponse.json({
      response: messageContent, // On renvoie uniquement le contenu du message
    });
  } catch (error) {
    console.error("Erreur:", error);
    return NextResponse.json(
      { error: "Une erreur s'est produite" },
      { status: 500 }
    );
  }
}
