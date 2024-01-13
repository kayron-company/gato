import "styles/tailwind.css"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <head>
        <title>Raise Talk</title>
      </head>
      <body>{children}</body>
    </html>
  )
}
