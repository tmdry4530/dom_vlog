'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MDEditor from '@uiw/react-md-editor';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createPost } from '@/lib/db'; // We'll need to adjust this for client-side

// A simple client-side action to call the server function
async function createPostAction(postData: {
  title: string;
  content: string;
  status: 'DRAFT' | 'PUBLISHED';
}) {
  // This is a simplified example. In a real app, you'd get the user ID from auth.
  const authorId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479'; // Replace with actual user ID

  const result = await createPost({
    ...postData,
    authorId,
  });

  return result;
}

export default function NewPostPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('**여기에 마크다운을 작성하세요!**');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSave = async (status: 'DRAFT' | 'PUBLISHED') => {
    setIsSubmitting(true);
    const postData = { title, content, status };

    try {
      const newPost = await createPostAction(postData);
      if (newPost) {
        alert(`게시글이 성공적으로 ${status === 'DRAFT' ? '임시 저장' : '발행'}되었습니다!`);
        // Redirect to the new post's page or the dashboard
        router.push(`/posts/${newPost.slug}`);
      } else {
        throw new Error('게시글 생성에 실패했습니다.');
      }
    } catch (error) {
      console.error(error);
      alert('오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 bg-zinc-900 text-zinc-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">새 글 작성하기</h1>

        <div className="space-y-6">
          <Input
            type="text"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-zinc-800 border-zinc-700 text-2xl h-14 placeholder:text-zinc-500"
            disabled={isSubmitting}
          />

          <div data-color-mode="dark">
            <MDEditor
              value={content}
              onChange={(value) => setContent(value || '')}
              height={500}
              preview="live"
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => handleSave('DRAFT')}
              disabled={isSubmitting || !title || !content}
            >
              {isSubmitting ? '저장 중...' : '임시 저장'}
            </Button>
            <Button
              onClick={() => handleSave('PUBLISHED')}
              disabled={isSubmitting || !title || !content}
            >
              {isSubmitting ? '발행 중...' : '발행하기'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
