import type {Metadata} from 'next';
import Script from 'next/script';
import './globals.css'; // Global styles
import DashboardLayout from '@/components/DashboardLayout';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'Reportli AI',
  description: 'An AI-powered SaaS for automated client report generation from multi-platform data, with customizable dashboards and visualization tools.',
};

export default async function RootLayout({children}: {children: React.ReactNode}) {
  let user = null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch (error) {
    console.error('Supabase initialization failed:', error);
  }

  return (
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
        <DashboardLayout user={user}>
          {children}
        </DashboardLayout>
      </body>
    </html>
  );
}
