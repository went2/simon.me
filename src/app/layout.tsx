// types
import type { Metadata } from 'next'

// css
import '../styles/global.scss';

// components
import Script from 'next/script';

export const metadata: Metadata = {
  title: "Simon Fisher",
}

export default function RootLayout({
  children,
}: { children: React.ReactNode }) {

  return (
    <html lang='en'>
      <Script src="https://kit.fontawesome.com/db1b573488.js" crossOrigin="anonymous" />

      <body> { children } </body>
    </html>
  )
}