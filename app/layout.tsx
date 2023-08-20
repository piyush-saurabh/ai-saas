import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { ModalProvider } from '@/components/modal-provider'
import { ToasterProvider } from '@/components/toaster-provider'
import { CrispProvider } from '@/components/crisp-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Genius',
  description: 'AI Platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">

        {/* Chat Support */}
        <CrispProvider />
        
        <body className={inter.className}>
          {/* Modal for providing the upgrade to Pro plan */}
          <ModalProvider />

          {/* Show the error messages */}
          <ToasterProvider />

          {/* Actual dashboard content */}
          {children}
        </body>
    </html>
    </ClerkProvider>
    
  )
}
