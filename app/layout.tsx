import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'FairPlay Football Team Manager',
  description: 'Manage your football team with ease',
  generator: 'FairPlay',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
