import type { Metadata } from 'next'
import './globals.css'
import { AppProvider } from '@/lib/context'
import Sidebar from '@/components/navigation/Sidebar'
import MobileNav from '@/components/navigation/MobileNav'

export const metadata: Metadata = {
  title: 'CPN v2 - Cost Per Nut Calculator',
  description: 'Personal relationship metrics tracking application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-cpn-dark text-cpn-white min-h-screen">
        <AppProvider>
          <div className="flex h-screen">
            <Sidebar />
            <main className="flex-1 overflow-auto pb-16 md:pb-0">
              {children}
            </main>
          </div>
          <MobileNav />
        </AppProvider>
      </body>
    </html>
  )
}
