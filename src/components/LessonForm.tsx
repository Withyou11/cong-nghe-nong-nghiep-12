// src/components/LessonForm.tsx
import { useState, useEffect, useRef } from 'react';
import { Editor } from './Editor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { ImagePlus, Loader2, Trash2 } from 'lucide-react';
import type { EditorContent } from '@/types/editor';
import type { JSONContent } from '@tiptap/core';
import type { Lesson } from '@/lib/api';
import { useLessons } from '@/hooks/useLessons';

interface Topic {
  id: number;
  title: string;
}

interface LessonFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  lesson?: Lesson;
}

export function LessonForm({ onSuccess, onCancel, lesson }: LessonFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState<EditorContent | null>(null);
  const [duration, setDuration] = useState('');
  const [topicId, setTopicId] = useState<string>('');
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadLessonDiagram, removeLessonDiagram } = useLessons();

  useEffect(() => {
    if (lesson && topics.length > 0) {
      setTitle(lesson.title);
      setDuration(lesson.duration);
      setTopicId(lesson.topic_id.toString());
      try {
        const contentData = JSON.parse(lesson.content);
        setContent(contentData);
      } catch (error) {
        console.error('Error parsing lesson content:', error);
        setContent(null);
      }
    }
  }, [lesson, topics]);

  useEffect(() => {
    async function loadTopics() {
      try {
        const { data, error } = await supabase
          .from('topics')
          .select('id, title')
          .order('id');

        if (error) throw error;
        setTopics(data || []);
      } catch (error) {
        console.error('Error loading topics:', error);
        toast.error('Không thể tải danh sách chủ đề');
      }
    }

    loadTopics();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!topicId) {
      toast.error('Vui lòng chọn chủ đề');
      return;
    }
    if (!title.trim()) {
      toast.error('Vui lòng nhập tiêu đề bài học');
      return;
    }
    if (!content) {
      toast.error('Vui lòng nhập nội dung bài học');
      return;
    }
    if (!duration.trim()) {
      toast.error('Vui lòng nhập thời lượng');
      return;
    }

    setLoading(true);

    try {
      // Convert content to JSON string for storage
      const contentJson = JSON.stringify(content);

      if (lesson) {
        // Update existing lesson
        const { data, error } = await supabase
          .from('lessons')
          .update({
            topic_id: parseInt(topicId),
            title: title.trim(),
            content: contentJson,
            duration: duration.trim(),
          })
          .eq('id', lesson.id)
          .select()
          .single();

        if (error) throw error;
        toast.success('Cập nhật bài học thành công!');
      } else {
        // Create new lesson
        const { data, error } = await supabase
          .from('lessons')
          .insert({
            topic_id: parseInt(topicId),
            title: title.trim(),
            content: contentJson,
            duration: duration.trim(),
          })
          .select()
          .single();

        if (error) throw error;
        toast.success('Tạo bài học thành công!');
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving lesson:', error);
      toast.error('Không thể lưu bài học. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="topic">Chủ đề</Label>
          <Select value={topicId} onValueChange={setTopicId}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn chủ đề" />
            </SelectTrigger>
            <SelectContent>
              {topics.map((topic) => (
                <SelectItem key={topic.id} value={topic.id.toString()}>
                  {topic.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="duration">Thời lượng</Label>
          <Input
            id="duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="Ví dụ: 45 phút"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="title">Tiêu đề bài học</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nhập tiêu đề bài học"
          required
        />
      </div>

      <div>
        <Label>Nội dung bài học</Label>
        <Editor content={content} onChange={setContent} />
      </div>

      {lesson && (
        <div className="space-y-2 rounded-lg border p-4 bg-muted/30">
          <Label>Sơ đồ tổng hợp bài học</Label>
          <p className="text-sm text-muted-foreground">
            Học sinh sẽ xem ảnh này tại trang chi tiết bài học.
          </p>
          {lesson.summary_diagram_url ? (
            <div className="space-y-2">
              <img
                src={lesson.summary_diagram_url}
                alt="Sơ đồ tổng hợp"
                className="max-h-48 rounded border object-contain bg-white"
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadLessonDiagram.isPending}
                >
                  {uploadLessonDiagram.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ImagePlus className="h-4 w-4" />
                  )}
                  Thay ảnh khác
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => removeLessonDiagram.mutate(lesson.id)}
                  disabled={removeLessonDiagram.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                  Xóa sơ đồ
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file && lesson.id) {
                    uploadLessonDiagram.mutate(
                      { lessonId: lesson.id, file }
                    );
                    e.target.value = '';
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadLessonDiagram.isPending}
              >
                {uploadLessonDiagram.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <ImagePlus className="h-4 w-4 mr-2" />
                )}
                Tải lên ảnh sơ đồ
              </Button>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Hủy
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Đang lưu...' : 'Lưu bài học'}
        </Button>
      </div>
    </form>
  );
}
