import { NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/session";
import { searchClinics } from "@/services/clinicService";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const q = url.searchParams.get("q") || "";
    if (!q) return NextResponse.json({ success: true, items: [] });

    const res = await searchClinics(q);
    if (!res.ok) {
      console.error("clinic search error", res.error);
      return NextResponse.json(
        { success: false, message: "Erro na busca" },
        { status: 500 },
      );
    }
    return NextResponse.json({ success: true, items: res.items });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Erro interno" },
      { status: 500 },
    );
  }
}
