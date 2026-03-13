import type { Metadata, Viewport } from 'next'
import { Inter, Montserrat } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { AuthProvider } from '@/contexts/AuthContext'
import { CartProvider } from '@/contexts/CartContext'
import { SettingsProvider } from '@/contexts/SettingsContext'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
})

export const metadata: Metadata = {
  title: 'Printex Labels | Premium Digital Printing & Label Solutions',
  description: 'Elevate your brand with precision-engineered labels, custom stickers, and high-end digital printing. Industrial quality meets artistic micro-finishing.',
  keywords: 'custom stickers, barcode labels, premium printing, holographic labels, D2C packaging',
  authors: [{ name: 'Printex Labels Studio' }],
  openGraph: {
    title: 'Printex Labels | Art of Precision',
    description: 'Bespoke labeling solutions for modern brands.',
    url: 'https://printexlabels.com',
    siteName: 'Printex Labels',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=1200&h=630&fit=crop',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable} scroll-smooth`} suppressHydrationWarning>
      <body className="antialiased selection:bg-[#254441] selection:text-white bg-white text-black dark:bg-slate-950 dark:text-slate-50 transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <AuthProvider>
            <CartProvider>
              <SettingsProvider>
                {children}
              </SettingsProvider>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}