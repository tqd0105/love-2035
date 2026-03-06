import type { Metadata } from "next"
import { Playfair_Display, Inter } from "next/font/google"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { QueryProvider } from "@/components/providers/query-provider"
import { SmoothScroll } from "@/components/providers/smooth-scroll"
import "./globals.css"

const serif = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
})

const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin", "vietnamese"],
})

export const metadata: Metadata = {
  title: "Love 2035",
  description: "Our journey, preserved forever.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi">
      <body
        className={`${serif.variable} ${sans.variable} min-h-screen bg-gradient-to-b from-rose-50/60 via-background to-background font-sans antialiased`}
      >
        <QueryProvider>
          <SmoothScroll />
          <Header />
          <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">
            {children}
          </main>
          <Footer />
        </QueryProvider>
      </body>
    </html>
  )
}
