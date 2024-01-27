import { Inter as FontSans } from "next/font/google"
import ThemeProvider from "components/layout/ThemeToggle/theme-provider"
import { AuthProvider } from "context/AuthContext"
import "styles/tailwind.css"
import { LeadProvider } from "context/LeadContext"
import { cn } from "lib/utils"
import { initializeFacebook } from "utils/facebookUtils"
import { useEffect } from "react"
import { Toaster } from "components/ui/sonner"

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <head>
        <meta charSet="utf-8" />
        <meta name="description" content="Raise Talk" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <title>Raise Talk</title>
      </head>
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <LeadProvider>{children}</LeadProvider>
          </AuthProvider>
        </ThemeProvider>
        <Toaster richColors />
      </body>
    </html>
  )
}
