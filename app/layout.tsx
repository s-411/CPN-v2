import type { Metadata } from 'next'
import './globals.css'
import { AppProvider } from '@/lib/context'
import { ShareProvider } from '@/lib/share/ShareContext'
import Sidebar from '@/components/navigation/Sidebar'
import MobileNav from '@/components/navigation/MobileNav'
import ShareModalWrapper from '@/components/sharing/ShareModalWrapper'

export const metadata: Metadata = {
  title: 'CPN v2 - Cost Per Nut Calculator',
  description: 'Personal relationship metrics tracking application',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.png', type: 'image/png' },
    ],
    apple: '/favicon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-cpn-dark text-cpn-white min-h-screen" suppressHydrationWarning>
        <AppProvider>
          <ShareProvider>
            <div className="flex h-screen">
              <Sidebar />
              <main className="flex-1 overflow-auto pb-16 md:pb-0">
                {children}
              </main>
            </div>
            <MobileNav />
            <ShareModalWrapper />
          </ShareProvider>
        </AppProvider>
      </body>
    </html>
  )
}
