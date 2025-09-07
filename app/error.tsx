'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="text-center max-w-md">
        <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h2 className="text-heading text-white mb-2">Something went wrong!</h2>
        <p className="text-body text-white text-opacity-80 mb-6">
          We encountered an error while loading CampusConnect. Please try again.
        </p>
        <div className="space-y-2">
          <Button variant="primary" onClick={reset} className="w-full">
            Try Again
          </Button>
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/'} 
            className="w-full"
          >
            Go Home
          </Button>
        </div>
        {error.message && (
          <details className="mt-4 text-left">
            <summary className="text-caption cursor-pointer">Error Details</summary>
            <pre className="text-xs text-white text-opacity-60 mt-2 overflow-auto">
              {error.message}
            </pre>
          </details>
        )}
      </Card>
    </div>
  );
}
