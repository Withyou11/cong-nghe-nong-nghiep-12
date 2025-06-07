import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { lessonsApi, Lesson } from '@/lib/api';
import { toast } from 'sonner';

export const useLessons = () => {
  const queryClient = useQueryClient();

  const { data: lessons, isLoading } = useQuery({
    queryKey: ['lessons'],
    queryFn: lessonsApi.getAll,
  });

  const createLesson = useMutation({
    mutationFn: lessonsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      toast.success('Tạo bài học thành công!');
    },
    onError: (error) => {
      toast.error('Có lỗi xảy ra khi tạo bài học!');
      console.error('Error creating lesson:', error);
    },
  });

  const updateLesson = useMutation({
    mutationFn: ({ id, lesson }: { id: string; lesson: Partial<Lesson> }) =>
      lessonsApi.update(id, lesson),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      toast.success('Cập nhật bài học thành công!');
    },
    onError: (error) => {
      toast.error('Có lỗi xảy ra khi cập nhật bài học!');
      console.error('Error updating lesson:', error);
    },
  });

  const deleteLesson = useMutation({
    mutationFn: lessonsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      toast.success('Xóa bài học thành công!');
    },
    onError: (error) => {
      toast.error('Có lỗi xảy ra khi xóa bài học!');
      console.error('Error deleting lesson:', error);
    },
  });

  return {
    lessons,
    isLoading,
    createLesson,
    updateLesson,
    deleteLesson,
  };
};
