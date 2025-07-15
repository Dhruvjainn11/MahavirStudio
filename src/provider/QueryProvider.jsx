'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

// Create global client
let globalQueryClient;

export default function QueryProvider({ children }) {
  const [queryClient] = useState(() => {
    globalQueryClient = new QueryClient();
    return globalQueryClient;
  });

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

// Export the instance so others can use it
export { globalQueryClient as queryClient };
