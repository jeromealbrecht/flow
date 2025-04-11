import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json(
      { success: false, error: "Email requis" },
      { status: 400 }
    );
  }

  try {
    const springResponse = await fetch(
      `http://localhost:8081/api/users?email=${encodeURIComponent(email)}`,
      { method: "POST" }
    );

    if (!springResponse.ok) {
      const errorText = await springResponse.text();
      return NextResponse.json(
        { success: false, error: errorText },
        { status: 500 }
      );
    }

    const user = await springResponse.json();
    return NextResponse.json({ success: true, user });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erreur serveur",
      },
      { status: 500 }
    );
  }
}
