import type { Metadata } from "next"
import { Noto_Sans_SC } from "next/font/google"
import "@/app/globals.css"

const notoSansSC = Noto_Sans_SC({
  subsets: ["latin"],
  variable: "--font-noto-sans-sc",
  display: "swap",
})

export const metadata: Metadata = {
  title: "蚕豆私服 | 海岛奇兵私服",
  description: "非官方的海岛奇兵私服，体验无限资源和独特玩法",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={`${notoSansSC.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
