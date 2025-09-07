'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PrivyProvider } from '@privy-io/react-auth';
import { WagmiProvider } from '@privy-io/wagmi';
import { MiniKitProvider } from '@coinbase/onchainkit/minikit';
import { base } from 'viem/chains';
import { http } from 'viem';
import { createConfig } from 'wagmi';
import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { type ReactNode } from 'react';

// Wagmi configuration for Base chain
const wagmiConfig = createConfig({
  chains: [base],
  transports: {
    [base.id]: http(),
  },
});

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 3,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      },
    },
  }));

  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        loginMethods: ['wallet', 'email', 'sms'],
        appearance: {
          theme: 'dark',
          accentColor: '#3B82F6',
          logo: '/logo.png',
        },
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
          requireUserPasswordOnCreate: false,
        },
        mfa: {
          noPromptOnMfaRequired: false,
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>
          <MiniKitProvider
            chain={base}
            apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY || 'cdp_demo_key'}
          >
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'hsl(220 10% 15%)',
                  color: 'hsl(220 10% 95%)',
                  border: '1px solid hsl(220 10% 25%)',
                },
                success: {
                  iconTheme: {
                    primary: 'hsl(160 80% 50%)',
                    secondary: 'hsl(220 10% 15%)',
                  },
                },
                error: {
                  iconTheme: {
                    primary: 'hsl(0 80% 60%)',
                    secondary: 'hsl(220 10% 15%)',
                  },
                },
              }}
            />
          </MiniKitProvider>
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}
