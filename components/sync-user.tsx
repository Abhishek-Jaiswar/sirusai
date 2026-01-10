"use client";

import useSyncUser from "@/hooks/use-user-sync";

const SyncUser = () => {
  const { data, isLoading, error } = useSyncUser();

  if (isLoading) return null;
  if (error) return null;
  return null;
};

export default SyncUser;
