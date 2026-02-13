import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { lessonsApi, lessonDiagramsApi, Lesson } from '@/lib/api';
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

  const uploadLessonDiagram = useMutation({
    mutationFn: ({ lessonId, file }: { lessonId: number; file: File }) =>
      lessonDiagramsApi.upload(lessonId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      toast.success('Đã cập nhật sơ đồ tổng hợp bài học!');
    },
    onError: (error: any) => {
      const errorMessage = error?.message || '';
      const isBucketNotFound = error?.statusCode === '404' || errorMessage.includes('Bucket not found');
      
      if (isBucketNotFound) {
        toast.error(
          'Bucket "lesson-diagrams" chưa được tạo! Vui lòng tạo bucket trong Supabase Dashboard: Storage → New bucket → tên "lesson-diagrams" → bật Public → Create.',
          { duration: 8000 }
        );
      } else {
        toast.error('Không thể tải lên sơ đồ. Vui lòng thử lại.');
      }
      console.error('Error uploading lesson diagram:', error);
    },
  });

  const removeLessonDiagram = useMutation({
    mutationFn: (lessonId: number) => lessonDiagramsApi.remove(lessonId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      toast.success('Đã xóa sơ đồ tổng hợp bài học.');
    },
    onError: (error) => {
      toast.error('Không thể xóa sơ đồ.');
      console.error('Error removing lesson diagram:', error);
    },
  });

  return {
    lessons,
    isLoading,
    createLesson,
    updateLesson,
    deleteLesson,
    uploadLessonDiagram,
    removeLessonDiagram,
  };
};
