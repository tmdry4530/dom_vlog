import { NextRequest, NextResponse } from "next/server";
import { improveContentStyle } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "제목과 내용이 필요합니다." },
        { status: 400 }
      );
    }

    const result = await improveContentStyle(title, content);

    if (!result) {
      return NextResponse.json(
        { error: "콘텐츠 개선에 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in improve-content API:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}