import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { examFilesApi, type ExamFileMeta } from '@/lib/api';

export function useExamFiles(topicId?: number | null) {
  const { data, isLoading } = useQuery<ExamFileMeta[]>({
    queryKey: ['exam-files', topicId || 'all'],
    queryFn: () => examFilesApi.list({ topicId: topicId || undefined }),
  });
  return { files: data || [], isLoading };
}

export function useUploadExamFile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: examFilesApi.upload,
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({
        queryKey: ['exam-files', variables.topicId || 'all'],
      });
      qc.invalidateQueries({ queryKey: ['exam-files', 'all'] });
    },
  });
}

export function useDeleteExamFile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: examFilesApi.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['exam-files'] });
    },
  });
}
