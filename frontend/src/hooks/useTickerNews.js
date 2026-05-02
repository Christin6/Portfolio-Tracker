import { useQuery } from "@tanstack/react-query";
import newsService from "../services/news";

export const useTickerNews = (ticker) => {
  return useQuery({
    queryKey: ["news", ticker],
    queryFn: () => newsService.getTickerNews(ticker),
    enabled: Boolean(ticker),
    staleTime: 5 * 60 * 1000, // 5 min — news doesn't need real-time refresh
  });
}

