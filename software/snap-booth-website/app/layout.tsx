import "./globals.css";
import localFont from 'next/font/local'

const inkFont = localFont({
  src: './fonts/TabbeSans-DYR1m.otf',
  display: 'swap',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inkFont.className}>
        {children}
      </body>
    </html>
  );
}
