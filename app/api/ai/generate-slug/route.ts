import { NextRequest, NextResponse } from "next/server";
import { generateSlugFromTitle } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title } = body;

    if (!title) {
      return NextResponse.json(
        { error: "제목이 필요합니다." },
        { status: 400 }
      );
    }

    const slug = await generateSlugFromTitle(title);

    return NextResponse.json({ slug });
  } catch (error) {
    console.error("Error in generate-slug API:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}