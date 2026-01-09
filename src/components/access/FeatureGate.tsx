import { ReactNode } from 'react';
import { useCanAccess } from '@/hooks/useFeatureAccess';
import { Skeleton } from '@/components/ui/skeleton';

interface FeatureGateProps {
  featureKey: string;
  children: ReactNode;
  fallback?: ReactNode;
  showLoading?: boolean;
  loadingComponent?: ReactNode;
}

export function FeatureGate({
  featureKey,
  children,
  fallback = null,
  showLoading = true,
  loadingComponent,
}: FeatureGateProps) {
  const { canAccess, isLoading } = useCanAccess(featureKey);

  if (isLoading && showLoading) {
    return loadingComponent || <Skeleton className="h-12 w-full rounded-xl" />;
  }

  if (!canAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
