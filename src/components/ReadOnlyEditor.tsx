// components/ReadOnlyEditor.tsx
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

interface ReadOnlyEditorProps {
  content: any; // JSONContent from TipTap
}

export function ReadOnlyEditor({ content }: ReadOnlyEditorProps) {
  const editor = useEditor({
    editable: false,
    extensions: [StarterKit],
    content,
  });

  if (!editor) return null;

  return (
    <div className="prose prose-lg max-w-none">
      <EditorContent editor={editor} />
    </div>
  );
}
