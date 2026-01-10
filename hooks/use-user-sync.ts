import { syncCurrentUserToDb } from "@/app/actions/syncUser";
import { useQuery } from "@tanstack/react-query";

export default function useSyncUser() {
  return useQuery({
    queryKey: ["sync-user"],
    queryFn: async () => {
      return await syncCurrentUserToDb();
    },
    staleTime: Infinity,
    retry: false,
  });
}
