// src/components/AppRouterProvider.tsx
'use client';
import { Suspense } from 'react';
import { useAppRouter } from '@/hooks/useAppRouter';

interface AppRouterProviderProps {
  children: (router: ReturnType<typeof useAppRouter>) => React.ReactNode;
}

function AppRouterContent({ children }: AppRouterProviderProps) {
  const router = useAppRouter();
  return <>{children(router)}</>;
}

export function AppRouterProvider({ children }: AppRouterProviderProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AppRouterContent>{children}</AppRouterContent>
    </Suspense>
  );
}