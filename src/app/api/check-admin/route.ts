import { NextResponse } from "next/server";
import { isUserAdmin } from "@/lib/firebase/admin";

export async function POST(request: Request) {
  try {
    const { user } = await request.json();

    if (!user?.uid) {
      return NextResponse.json({ isAdmin: false }, { status: 400 });
    }

    const isAdmin = await isUserAdmin(user);
    return NextResponse.json({ isAdmin });
  } catch (error) {
    console.error("Error checking admin status:", error);
    return NextResponse.json({ isAdmin: false }, { status: 500 });
  }
}
