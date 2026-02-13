// components/ReadOnlyEditor.tsx
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { useEffect } from 'react';
import type { JSONContent } from '@tiptap/core';

interface ReadOnlyEditorProps {
  content: JSONContent | null;
}

export function ReadOnlyEditor({ content }: ReadOnlyEditorProps) {
  const editor = useEditor({
    editable: false,
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: true,
        HTMLAttributes: {
          class: 'text-blue-600 underline',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded',
        },
      }),
    ],
    content: content || undefined,
  });

  // Cập nhật content khi prop thay đổi
  useEffect(() => {
    if (editor && content) {
      // Chỉ update nếu content thực sự thay đổi để tránh re-render không cần thiết
      const currentContent = editor.getJSON();
      if (JSON.stringify(currentContent) !== JSON.stringify(content)) {
        editor.commands.setContent(content);
      }
    }
  }, [editor, content]);

  // Hiển thị loading state khi editor chưa sẵn sàng
  if (!editor) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-500">Đang tải nội dung...</div>
      </div>
    );
  }

  // Kiểm tra nếu không có content hợp lệ
  if (!content || (typeof content === 'object' && Object.keys(content).length === 0)) {
    return (
      <div className="text-gray-500 italic">
        Bài học này chưa có nội dung.
      </div>
    );
  }

  return (
    <div className="prose prose-lg max-w-none prose-headings:font-bold prose-p:my-4 prose-ul:my-4 prose-ol:my-4 prose-li:my-2">
      <EditorContent editor={editor} />
    </div>
  );
}
