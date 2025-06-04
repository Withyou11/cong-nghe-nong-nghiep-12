// src/components/LessonForm.tsx
import { useState, useEffect } from 'react';
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

interface Topic {
  id: number;
  title: string;
}

interface LessonFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function LessonForm({ onSuccess, onCancel }: LessonFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState<any>(null);
  const [duration, setDuration] = useState('');
  const [topicId, setTopicId] = useState<string>('');
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadTopics() {
      try {
        const { data, error } = await supabase
          .from('topics')
          .select('id, title')
          .order('id');

        if (error) throw error;
        setTopics(data);
      } catch (error) {
        console.error('Error loading topics:', error);
        toast.error('Không thể tải danh sách chủ đề');
      }
    }

    loadTopics();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicId) {
      toast.error('Vui lòng chọn chủ đề');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('lessons')
        .insert({
          topic_id: parseInt(topicId),
          title,
          content,
          duration,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Tạo bài học thành công!');
      onSuccess();
    } catch (error) {
      console.error('Error creating lesson:', error);
      toast.error('Không thể tạo bài học');
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
