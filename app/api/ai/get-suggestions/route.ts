import { NextRequest, NextResponse } from "next/server";
import { getSmartSuggestions } from "@/lib/ai";
import { getAllCategories } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, existingTags = [] } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "제목과 내용이 필요합니다." },
        { status: 400 }
      );
    }

    // 사용 가능한 카테고리 목록 가져오기
    const categories = await getAllCategories();
    const availableCategories = categories.map(cat => cat.name);

    const result = await getSmartSuggestions(
      title, 
      content, 
      existingTags,
      availableCategories
    );

    if (!result) {
      return NextResponse.json(
        { error: "AI 제안을 가져오는데 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in get-suggestions API:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}