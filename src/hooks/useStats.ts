import { useQuery } from '@tanstack/react-query';
import { statsApi } from '@/lib/api';

export function useStats() {
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['stats'],
    queryFn: statsApi.getStats,
  });

  const { data: topicStats, isLoading: isLoadingTopicStats } = useQuery({
    queryKey: ['topicStats'],
    queryFn: statsApi.getTopicStats,
  });

  const { data: recentActivity, isLoading: isLoadingRecentActivity } = useQuery(
    {
      queryKey: ['recentActivity'],
      queryFn: statsApi.getRecentActivity,
    }
  );

  return {
    stats,
    topicStats,
    recentActivity,
    isLoading: isLoadingStats || isLoadingTopicStats || isLoadingRecentActivity,
  };
}
