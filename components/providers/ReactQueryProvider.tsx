"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export default function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // QueryClient manages caching and background updates globally
  // the “brain” of React Query, it holds the cache and fetch logic.
  const [queryClient] = useState(() => new QueryClient());

  return (
    //wraps your app so every component can use that brain
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
