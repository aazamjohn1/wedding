import type { Metadata } from "next"
import { Cormorant_Garamond, Playfair_Display } from "next/font/google"
import type React from "react"
import "./globals.css"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
})

export const metadata: Metadata = {
  title: "To'y marosimiga qo'shiling!",
  description:
    "Assalomu alaykum, sizni to'y marosimimizga taklif qilamiz. Bizning baxtli kunimizda ishtirok eting va unutilmas lahzalarning guvohi bo'ling. Ravshanbek va Madinaxon nikoh to'yi 2025-yil 21-dekabr kuni bo'lib o'tadi.",
  generator: "Copyright © 2025",
  openGraph: {
    title: "To'y marosimiga qo'shiling!",
    description:
      "Assalomu alaykum, sizni to'y marosimimizga taklif qilamiz. Bizning baxtli kunimizda ishtirok eting va unutilmas lahzalarning guvohi bo'ling. Ravshanbek va Madinaxon nikoh to'yi 2025-yil 21-dekabr kuni bo'lib o'tadi.",
  url: 'https://i.ibb.co/fVBj7hJy/360-F-515351836-w-W5-ECB6l-Z3r7ek-EJ6-H2-Tfv-CFEkhgwid9-1.jpg',
    siteName: 'Wedding Invitation',
    images: [
      {
   
        url: 'https://i.ibb.co/fVBj7hJy/360-F-515351836-w-W5-ECB6l-Z3r7ek-EJ6-H2-Tfv-CFEkhgwid9-1.jpg',
        width: 1200,
        height: 630,
        alt: 'Wedding Invitation Open Graph Image',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  icons: {
    icon: 'https://i.ibb.co/fVBj7hJy/360-F-515351836-w-W5-ECB6l-Z3r7ek-EJ6-H2-Tfv-CFEkhgwid9-1.jpg',
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="uz" className={`${playfair.variable} ${cormorant.variable}`}>
      <head>
        <link rel="shortcut icon" href="/public/favicon.ico" type="image/x-icon" />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  )
}
