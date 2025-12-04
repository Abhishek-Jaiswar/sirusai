"use client";
import { useQuery } from "@tanstack/react-query";

export default function InterviewSetup() {
  const { data } = useQuery({
    queryKey: ["ping"],
    queryFn: async () => "ok",
  });

  return <div>{data}</div>;
}
