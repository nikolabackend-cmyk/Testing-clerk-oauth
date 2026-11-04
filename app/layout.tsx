import { ClerkProvider } from '@clerk/nextjs';
import type {Metadata} from 'next';
import Script from 'next/script';
import './globals.css'; // Global styles
import DashboardLayout from '@/components/DashboardLayout';
import { getClerkKeys } from '@/lib/clerk-config';

export const metadata: Metadata = {
  title: 'Reportli AI',
  description: 'An AI-powered SaaS for automated client report generation from multi-platform data, with customizable dashboards and visualization tools.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  const { publishableKey } = getClerkKeys();

  return (
    <ClerkProvider publishableKey={publishableKey}>
      <html lang="en">
        <head>
          <Script
            src="https://reportliai-sbs.reportliaihq.workers.dev/reportli.js"
            {...({ api_key: 'rpl_live_ASy3hbZ0zJYjkrvwbrun8g2PQW' } as Record<string, string>)}
            async
            strategy="afterInteractive"
          />
        </head>
        <body suppressHydrationWarning>
          <DashboardLayout>
            {children}
          </DashboardLayout>
        </body>
      </html>
    </ClerkProvider>
  );
}