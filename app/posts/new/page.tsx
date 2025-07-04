"use client";

import { useState, useActionState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import MDEditor from "@uiw/react-md-editor";
import { createPostAction } from "./actions";
import { Sparkles, Wand2, Tags, FolderOpen, Loader2 } from "lucide-react";

const initialState = {
  message: "",
  postId: undefined,
};

export default function NewPostPage() {
  const [content, setContent] = useState("**Hello world!!!**");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [slug, setSlug] = useState("");
  const [state, formAction] = useActionState(createPostAction, initialState);
  
  // AI 상태 관리
  const [isImproving, setIsImproving] = useState(false);
  const [isGettingSuggestions, setIsGettingSuggestions] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<any>(null);
  const [improvements, setImprovements] = useState<string[]>([]);

  useEffect(() => {
    if (state.message === "성공" && state.postId) {
      window.location.href = `/posts/${state.postId}`;
    }
  }, [state]);

  // AI 콘텐츠 개선 함수
  const improveContent = async () => {
    if (!title || !content) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    setIsImproving(true);
    try {
      const response = await fetch("/api/ai/improve-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      
      const result = await response.json();
      if (result.improvedContent) {
        setContent(result.improvedContent);
        setImprovements(result.improvements || []);
      }
    } catch (error) {
      console.error("Error improving content:", error);
      alert("콘텐츠 개선 중 오류가 발생했습니다.");
    } finally {
      setIsImproving(false);
    }
  };

  // AI 제안 가져오기 함수
  const getSuggestions = async () => {
    if (!title || !content) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    setIsGettingSuggestions(true);
    try {
      const response = await fetch("/api/ai/get-suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          title, 
          content,
          existingTags: tags.split(",").map(t => t.trim()).filter(Boolean)
        }),
      });
      
      const result = await response.json();
      setAiSuggestions(result);
    } catch (error) {
      console.error("Error getting suggestions:", error);
      alert("AI 제안을 가져오는 중 오류가 발생했습니다.");
    } finally {
      setIsGettingSuggestions(false);
    }
  };

  // 슬러그 자동 생성
  const generateSlug = async () => {
    if (!title) {
      alert("제목을 입력해주세요.");
      return;
    }

    try {
      const response = await fetch("/api/ai/generate-slug", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      
      const result = await response.json();
      if (result.slug) {
        setSlug(result.slug);
      }
    } catch (error) {
      console.error("Error generating slug:", error);
    }
  };

  // 태그 적용 함수
  const applySuggestedTags = (suggestedTags: Array<{name: string, confidence: number}>) => {
    const tagNames = suggestedTags
      .filter(tag => tag.confidence > 0.7) // 높은 신뢰도만
      .slice(0, 5) // 최대 5개
      .map(tag => tag.name);
    setTags(tagNames.join(", "));
  };

  return (
    <main className="flex-1 p-8 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">새 글 작성</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 메인 작성 영역 */}
        <div className="lg:col-span-2">
          <form action={formAction}>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="title" className="block text-sm font-medium">
                    제목
                  </label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={generateSlug}
                    disabled={!title}
                  >
                    <Wand2 className="h-4 w-4 mr-1" />
                    슬러그 생성
                  </Button>
                </div>
                <Input
                  id="title"
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="글의 제목을 입력하세요"
                  className="bg-zinc-800 border-zinc-700"
                  required
                />
              </div>

              {slug && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    생성된 슬러그
                  </label>
                  <Input
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="bg-zinc-800 border-zinc-700"
                    placeholder="URL 슬러그"
                  />
                  <input type="hidden" name="slug" value={slug} />
                </div>
              )}
              <div>
                <label htmlFor="tags" className="block text-sm font-medium mb-2">
                  태그 (쉼표로 구분)
                </label>
                <Input
                  id="tags"
                  name="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="예: Next.js, Supabase, Tailwind"
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="content" className="block text-sm font-medium">
                    내용
                  </label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={improveContent}
                      disabled={isImproving || !title || !content}
                    >
                      {isImproving ? (
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      ) : (
                        <Sparkles className="h-4 w-4 mr-1" />
                      )}
                      글 다듬기
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={getSuggestions}
                      disabled={isGettingSuggestions || !title || !content}
                    >
                      {isGettingSuggestions ? (
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      ) : (
                        <Tags className="h-4 w-4 mr-1" />
                      )}
                      AI 제안
                    </Button>
                  </div>
                </div>
                <input type="hidden" name="content" value={content} />
                <div data-color-mode="dark">
                  <MDEditor
                    value={content}
                    onChange={(value) => setContent(value || "")}
                    height={500}
                  />
                </div>
              </div>

              {improvements.length > 0 && (
                <Card className="bg-zinc-800 border-zinc-700">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center">
                      <Sparkles className="h-4 w-4 mr-2" />
                      적용된 개선사항
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1 text-sm text-zinc-400">
                      {improvements.map((improvement, index) => (
                        <li key={index}>• {improvement}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              <div className="flex justify-end">
                <Button type="submit">발행하기</Button>
              </div>
              {state?.message && state.message !== "성공" && (
                <p className="text-red-500 mt-4">{state.message}</p>
              )}
            </div>
          </form>
        </div>

        {/* AI 제안 사이드바 */}
        <div className="lg:col-span-1">
          {aiSuggestions && (
            <div className="space-y-4">
              {/* 태그 제안 */}
              {aiSuggestions.suggestedTags && (
                <Card className="bg-zinc-800 border-zinc-700">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center">
                      <Tags className="h-4 w-4 mr-2" />
                      AI 태그 제안
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {aiSuggestions.suggestedTags.slice(0, 8).map((tag: any, index: number) => (
                        <div key={index} className="flex items-center justify-between">
                          <Badge 
                            variant="secondary" 
                            className="cursor-pointer hover:bg-zinc-600"
                            onClick={() => {
                              const currentTags = tags.split(",").map(t => t.trim()).filter(Boolean);
                              if (!currentTags.includes(tag.name)) {
                                setTags([...currentTags, tag.name].join(", "));
                              }
                            }}
                          >
                            {tag.name}
                          </Badge>
                          <span className="text-xs text-zinc-500">
                            {Math.round(tag.confidence * 100)}%
                          </span>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-full mt-2"
                        onClick={() => applySuggestedTags(aiSuggestions.suggestedTags)}
                      >
                        고신뢰도 태그 적용
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* 카테고리 제안 */}
              {aiSuggestions.suggestedCategories && (
                <Card className="bg-zinc-800 border-zinc-700">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center">
                      <FolderOpen className="h-4 w-4 mr-2" />
                      AI 카테고리 제안
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {aiSuggestions.suggestedCategories.slice(0, 3).map((category: any, index: number) => (
                        <div key={index} className="p-2 bg-zinc-700 rounded">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{category.name}</span>
                            <span className="text-xs text-zinc-400">
                              {Math.round(category.confidence * 100)}%
                            </span>
                          </div>
                          <p className="text-xs text-zinc-400 mt-1">{category.reason}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* SEO 키워드 */}
              {aiSuggestions.seoKeywords && (
                <Card className="bg-zinc-800 border-zinc-700">
                  <CardHeader>
                    <CardTitle className="text-sm">SEO 키워드</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1">
                      {aiSuggestions.seoKeywords.slice(0, 10).map((keyword: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* 가독성 점수 */}
              {aiSuggestions.readabilityScore && (
                <Card className="bg-zinc-800 border-zinc-700">
                  <CardHeader>
                    <CardTitle className="text-sm">가독성 분석</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">
                        {aiSuggestions.readabilityScore}/10
                      </div>
                      <p className="text-xs text-zinc-400">가독성 점수</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* 개선 제안 */}
              {aiSuggestions.contentGaps && aiSuggestions.contentGaps.length > 0 && (
                <Card className="bg-zinc-800 border-zinc-700">
                  <CardHeader>
                    <CardTitle className="text-sm">개선 제안</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-zinc-400">
                      {aiSuggestions.contentGaps.map((gap: string, index: number) => (
                        <li key={index}>• {gap}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}